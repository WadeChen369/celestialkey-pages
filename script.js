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
function calcFlowDay(d){
  const s=d.toISOString().slice(0,10).replace(/\D/g,'').split('').map(Number).reduce((a,b)=>a+b,0);
  return (s%9)||9;
}

/* ----------- 產生 today-2 ~ today+6 ----------- */
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

/* ----------- 三顆快捷鈕：昨天(-1) 今天(0) 明天(1) ----------- */
function pick(delta){
  const sel=document.getElementById('batchDate');
  sel.selectedIndex = delta + 2;   // today-2 起算
  submitBirthday();
}

/* ----------- 單日查詢 ----------- */
async function submitBirthday(){
  const birthday=document.getElementById('birthday').value;
  const result=document.getElementById('result');
  const debug=document.getElementById('debug');
  if(!/^\d{4}-\d{2}-\d{2}$/.test(birthday)){
    result.textContent='請輸入正確生日 (YYYY-MM-DD)';
    return;
  }
  const lp=calcLifePath(birthday);
  const birthDate=new Date(birthday);
  const zodiac=getZodiac(birthDate.getMonth()+1, birthDate.getDate());

  const batchDate=document.getElementById('batchDate').value;
  const flow=calcFlowDay(new Date(batchDate));
  const file=`${batchDate}_flowday_${flow}_lifepath_${lp}.json`;
  const url=`daily/${batchDate}/${file}`;

  debug.innerHTML=
    `<strong>批次日期：</strong>${batchDate}<br>`+
    `<strong>生命路徑數：</strong>${lp}<br>`+
    `<strong>星座：</strong>${zodiac}<br>`+
    `<strong>流日：</strong>${flow}<br>`+
    `<strong>檔案：</strong>${url}`;

  try{
    const resp=await fetch(url);
    if(!resp.ok) throw new Error('找不到檔案');
    const arr=await resp.json();
    const hit=arr.find(o=>o.sign.startsWith(zodiac));
    if(!hit) throw new Error('星座段落缺失');
    result.innerHTML=hit.message.replace(/\n/g,'<br>');
  }catch(e){
    result.textContent='讀取資料失敗：'+e.message;
  }
}

window.addEventListener('DOMContentLoaded',buildBatchList);