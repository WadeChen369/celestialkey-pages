
// ===== 小工具：計算函式 =====
function calcLifePath(bdayStr){
  const digits=bdayStr.replace(/-/g,'').split('').map(Number);
  let sum=digits.reduce((a,b)=>a+b,0);
  const master=[11,22,33];
  if(master.includes(sum)) return sum;
  while(sum>=10) sum=sum.toString().split('').reduce((a,b)=>a+Number(b),0);
  return sum;
}
function getZodiac(month,day){
  const signs=['摩羯','水瓶','雙魚','牡羊','金牛','雙子','巨蟹','獅子','處女','天秤','天蠍','射手'];
  const edge =[20 ,19 ,20 ,20 ,21 ,22 ,23 ,23 ,23 ,23 ,22 ,22];
  return (day<edge[month-1]?signs[(month+10)%12]:signs[month-1]);
}
function calcFlowDay(dateObj){
  const n=dateObj.getFullYear()+dateObj.getMonth()+1+dateObj.getDate();
  return n%9||9;
}

// ===== 主查詢函式 =====
async function submitBirthday(){
  const bday=document.getElementById('birthday').value;
  const resultEl=document.getElementById('result');
  if(!/^\d{4}-\d{2}-\d{2}$/.test(bday)){
    resultEl.textContent='請輸入正確的生日格式 (YYYY-MM-DD)';
    return;
  }

  // (1) 計算三參數
  const lp=calcLifePath(bday);
  const bd=new Date(bday);
  const zodiac=getZodiac(bd.getMonth()+1, bd.getDate());
  // **Demo 固定批次日期 & flowday=1**
  const batchDate='2025-05-03';
  const flow=1;

  // (2) 組檔名與路徑
  const file=`${batchDate}_flowday_${flow}_lifepath_${lp}.json`;
  const url=`daily/${batchDate}/${file}`;

  try{
    const resp=await fetch(url);
    if(!resp.ok) throw new Error('data not found');
    const arr=await resp.json();
    const hit=arr.find(o=>o.sign.startsWith(zodiac));
    if(!hit) throw new Error('zodiac not found');
    resultEl.innerHTML=hit.message.replace(/\n/g,'<br>');
  }catch(err){
    console.error(err);
    resultEl.textContent='目前找不到對應資料（只收錄 '+batchDate+' & flowday1）。';
  }
}

// ===== Console 小工具 (debug) =====
function debugPath(birthdayStr){
  const lp=calcLifePath(birthdayStr);
  const flow=1; // demo
  const batchDate='2025-05-03';
  const file=`${batchDate}_flowday_${flow}_lifepath_${lp}.json`;
  return `daily/${batchDate}/${file}`;
}
console.log('%c[CelestialKey] 已載入 demo script，呼叫 debugPath("YYYY-MM-DD") 可查看將抓取的檔案路徑。','color:#6a4fc4;font-weight:bold');
