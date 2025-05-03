<script>
/* ========= 通用計算 ========= */
function calcLifePath(b){
  const d=b.replace(/\D/g,'').split('').map(Number);
  let sum=d.reduce((a,b)=>a+b,0);
  const master=[11,22,33];
  if(master.includes(sum)) return sum;
  while(sum>=10) sum=sum.toString().split('').reduce((a,b)=>a+Number(b),0);
  return sum;
}
function getZodiac(m,d){
  if((m==1 && d>=20)||(m==2 && d<=18)) return '水瓶';
  if((m==2 && d>=19)||(m==3 && d<=20)) return '雙魚';
  if((m==3 && d>=21)||(m==4 && d<=19)) return '牡羊';
  if((m==4 && d>=20)||(m==5 && d<=20)) return '金牛';
  if((m==5 && d>=21)||(m==6 && d<=20)) return '雙子';
  if((m==6 && d>=21)||(m==7 && d<=22)) return '巨蟹';
  if((m==7 && d>=23)||(m==8 && d<=22)) return '獅子';
  if((m==8 && d>=23)||(m==9 && d<=22)) return '處女';
  if((m==9 && d>=23)||(m==10&& d<=22)) return '天秤';
  if((m==10&& d>=23)||(m==11&& d<=21)) return '天蠍';
  if((m==11&& d>=22)||(m==12&& d<=21)) return '射手';
  return '摩羯'; // 12‑22~1‑19
}
function calcFlowDay(dateObj){
  const digits=dateObj.toISOString().slice(0,10).replace(/\D/g,'').split('').map(Number);
  let sum=digits.reduce((a,b)=>a+b,0);
  return (sum%9)||9;      // 餘 0 視為 9
}

/* ========= 主要流程 ========= */
async function submitBirthday(){
  const bday=document.getElementById('birthday').value;
  const resultEl=document.getElementById('result');
  if(!/^\d{4}-\d{2}-\d{2}$/.test(bday)){resultEl.textContent='請輸入正確生日';return;}

  const lp = calcLifePath(bday);
  const batchDate = '2025-05-03';              // ← 目前固定測試批次
  const flow = calcFlowDay(new Date(batchDate)); // ← 自動算 = 8
  const file = `${batchDate}_flowday_${flow}_lifepath_${lp}.json`;
  const url  = `daily/${batchDate}/${file}`;

  try{
    const resp = await fetch(url);
    if(!resp.ok) throw new Error('找不到檔案');
    const raw  = await resp.json();
    const arr  = Array.isArray(raw) ? raw : JSON.parse(raw.file); // 兼容兩種格式

    const bd   = new Date(bday);
    const zodiac = getZodiac(bd.getMonth()+1, bd.getDate());
    const hit  = arr.find(o=>o.sign.startsWith(zodiac));
    if(!hit) throw new Error('星座資料缺失');
    resultEl.innerHTML = hit.message.replace(/\n/g,'<br>');
  }catch(e){
    console.error(e);
    resultEl.textContent='讀取資料失敗，請檢查檔案或路徑';
  }
}

/* ========= Console 小工具 ========= */
function debugPath(b){
  const lp=calcLifePath(b);
  const batch='2025-05-03';
  const flow=calcFlowDay(new Date(batch));
  console.log(`daily/${batch}/${batch}_flowday_${flow}_lifepath_${lp}.json`);
}
</script>
