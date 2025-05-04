/* ------------ 計算函式 ------------ */
function calcLifePath(b){
  const digits=b.replace(/\D/g,'').split('').map(Number);
  let s=digits.reduce((a,b)=>a+b,0);
  if([11,22,33].includes(s)) return s;
  while(s>=10) s=s.toString().split('').reduce((a,b)=>a+Number(b),0);
  return s;
}
function getZodiac(m,d){
  if((m==1&&d>=20)||(m==2&&d<=18))  return '水瓶';
  if((m==2&&d>=19)||(m==3&&d<=20))  return '雙魚';
  if((m==3&&d>=21)||(m==4&&d<=19))  return '牡羊';
  if((m==4&&d>=20)||(m==5&&d<=20))  return '金牛';
  if((m==5&&d>=21)||(m==6&&d<=20))  return '雙子';
  if((m==6&&d>=21)||(m==7&&d<=22))  return '巨蟹';
  if((m==7&&d>=23)||(m==8&&d<=22))  return '獅子';
  if((m==8&&d>=23)||(m==9&&d<=22))  return '處女';
  if((m==9&&d>=23)||(m==10&&d<=22)) return '天秤';
  if((m==10&&d>=23)||(m==11&&d<=21))return '天蠍';
  if((m==11&&d>=22)||(m==12&&d<=21))return '射手';
  return '摩羯';
}
function calcFlowDay(dateObj){
  const str=dateObj.toISOString().slice(0,10).replace(/\D/g,'');
  const sum=str.split('').map(Number).reduce((a,b)=>a+b,0);
  return (sum%9)||9;
}

/* ------------ 初始：產生 today-2 ~ today+6 下拉選單 ------------ */
function buildBatchList(){
  const sel=document.getElementById('batchDate');
  const today=new Date();
  for(let i=-2;i<=6;i++){
    const d=new Date(today);
    d.setDate(d.getDate()+i);
    const opt=document.createElement('option');
    opt.value=opt.textContent=d.toISOString().slice(0,10);
    if(i===0) opt.selected=true;
    sel.appendChild(opt);
  }
}

/* ------------ 三顆快捷鈕 ------------ */
function pick(delta){
  const sel = document.getElementById('batchDate');
  sel.selectedIndex = delta + 2; // today 位於索引 2
  submitBirthday();
}else{
    submitBirthday();
  }
}

/* ------------ 主流程 (單日) ------------ */
async function submitBirthday(){
  const bday=document.getElementById('birthday').value;
  const resEl=document.getElementById('result');
  const debugEl=document.getElementById('debug');
  if(!/^\d{4}-\d{2}-\d{2}$/.test(bday)){
    resEl.textContent='請輸入正確生日 (YYYY-MM-DD)';
    return;
  }
  const lp=calcLifePath(bday);
  const bd=new Date(bday);
  const zodiac=getZodiac(bd.getMonth()+1, bd.getDate());

  const batchDate=document.getElementById('batchDate').value;
  const flow=calcFlowDay(new Date(batchDate));

  const file=`${batchDate}_flowday_${flow}_lifepath_${lp}.json`;
  const url=`daily/${batchDate}/${file}`;

  debugEl.innerHTML=
    `<strong>批次日期：</strong>${batchDate}<br>`+
    `<strong>生命路徑數：</strong>${lp}<br>`+
    `<strong>星座：</strong>${zodiac}<br>`+
    `<strong>流日：</strong>${flow}<br>`+
    `<strong>檔案路徑：</strong>${url}<br>`;

  try{
    const resp=await fetch(url);
    if(!resp.ok) throw new Error('找不到檔案');
    const raw=await resp.json();
    const arr=Array.isArray(raw)?raw:JSON.parse(raw.file);
    const hit=arr.find(o=>o.sign.startsWith(zodiac));
    if(!hit) throw new Error('星座段落缺失');
    resEl.innerHTML=hit.message.replace(/\n/g,'<br>');
  }catch(e){
    resEl.textContent='讀取資料失敗：'+e.message;
  }
}

/* ------------ 後天三天運勢 ------------ */
async function queryRange(from,to){
  const base=new Date();
  const originalBatch=document.getElementById('batchDate').value;
  let html='';
  for(let i=from;i<=to;i++){
    const d=new Date(base); d.setDate(d.getDate()+i);
    const str=d.toISOString().slice(0,10);
    document.getElementById('batchDate').value=str;
    await submitBirthday();
    html+=`<h3>${str}</h3>`+document.getElementById('result').innerHTML+'<hr>';
  }
  document.getElementById('batchDate').value=originalBatch;
  document.getElementById('result').innerHTML=html.slice(0,-4);
}

/* ------------ onload ------------ */
window.addEventListener('DOMContentLoaded', () => {
  buildBatchList();
  const bEl = document.getElementById('birthday');
  bEl.value = '1970-01-01';
  bEl.max = new Date().toISOString().slice(0, 10);
});