/* === 基本工具 === */
function calcLifePath(b) {
  const d=b.replace(/\D/g,'').split('').map(Number);
  let s=d.reduce((a,b)=>a+b,0);
  const master=[11,22,33];
  while(!master.includes(s) && s>=10)
    s=s.toString().split('').reduce((a,b)=>a+Number(b),0);
  return s;
}
function getZodiac(m,d){
  const z=['摩羯','水瓶','雙魚','牡羊','金牛','雙子','巨蟹','獅子','處女','天秤','天蠍','射手'];
  const e=[20,19,20,20,21,22,23,23,23,23,22,22];
  return d<e[m-1] ? z[(m+10)%12] : z[m-1];
}

async function submitBirthday(){
  const bday=document.getElementById('birthday').value;
  const resEl=document.getElementById('result');
  if(!/^\d{4}-\d{2}-\d{2}$/.test(bday)){
    resEl.textContent='請輸入正確生日'; return;
  }

  const lp = calcLifePath(bday);
  const todayBatch = '2025-05-03';            // 目前固定批次
  const flow = 1;                             // 目前只有 flowday 1
  const file = `${todayBatch}_flowday_${flow}_lifepath_${lp}.json`;
  const url  = `daily/${todayBatch}/${file}`;

  try{
    const resp = await fetch(url);
    if(!resp.ok) throw new Error('檔案不存在');
    const raw  = await resp.json();
    const arr  = Array.isArray(raw) ? raw
               : Array.isArray(raw.file) ? raw.file
               : JSON.parse(raw.file);       // ← 你的格式

    const d = new Date(bday);
    const zodiac = getZodiac(d.getMonth()+1, d.getDate());
    const hit = arr.find(o=>o.sign.startsWith(zodiac));
    if(!hit) throw new Error('星座資料缺失');

    resEl.innerHTML = hit.message.replace(/\n/g,'<br>');
  }catch(err){
    console.error(err);
    resEl.textContent='讀取資料失敗，請檢查檔案或路徑';
  }
}

/* 小工具：在 Console 輸入 debugPath('YYYY-MM-DD') 可快速看路徑 */
function debugPath(birthday){
  const lp = calcLifePath(birthday);
  console.log(`daily/2025-05-03/2025-05-03_flowday_1_lifepath_${lp}.json`);
}
