
// Celestial Key demo script (handles wrapped 'file' field)
function calcLifePath(b){const d=b.replace(/\D/g,'').split('').map(Number);let s=d.reduce((a,b)=>a+b,0);const m=[11,22,33];while(!m.includes(s)&&s>=10)s=s.toString().split('').reduce((a,b)=>a+Number(b),0);return s;}
function getZodiac(mon,day){const z=['摩羯','水瓶','雙魚','牡羊','金牛','雙子','巨蟹','獅子','處女','天秤','天蠍','射手'];const e=[20,19,20,20,21,22,23,23,23,23,22,22];return day<e[mon-1]?z[(mon+10)%12]:z[mon-1];}
const batchDate='2025-05-03'; // 固定批次日期
async function submitBirthday(){
  const b=document.getElementById('birthday').value;
  const res=document.getElementById('result');
  if(!/^\d{4}-\d{2}-\d{2}$/.test(b)){res.textContent='日期格式錯誤';return;}
  const lp=calcLifePath(b);
  const flow=1; // 你目前只有 flowday 1
  const file=`${batchDate}_flowday_${flow}_lifepath_${lp}.json`;
  const url=`daily/${batchDate}/${file}`;
  try{
    const r=await fetch(url);
    if(!r.ok) throw new Error('找不到檔案');
    const raw=await r.json();
    const arr=Array.isArray(raw)?raw:JSON.parse(raw.file);
    const d=new Date(b);const sign=getZodiac(d.getMonth()+1,d.getDate());
    const hit=arr.find(o=>o.sign.startsWith(sign));
    if(!hit){res.textContent=`今天${sign}座資料不存在`;return;}
    res.innerHTML=hit.message.replace(/\n/g,'<br>');
  }catch(e){
    console.error(e);
    res.textContent='讀取資料失敗：'+e.message;
  }
}

// 小工具
function debugPath(b){
  const lp=calcLifePath(b);
  console.log(`daily/${batchDate}/${batchDate}_flowday_1_lifepath_${lp}.json`);
}
