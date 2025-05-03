
// ============== Helper Functions ==============
function calcLifePath(bdayStr){
  const digits=bdayStr.replace(/-/g,'').split('').map(Number);
  let sum=digits.reduce((a,b)=>a+b,0);
  const master=[11,22,33];
  while(!master.includes(sum)&&sum>=10){
    sum=sum.toString().split('').reduce((a,b)=>a+Number(b),0);
  }
  return sum;
}
function getZodiac(month,day){
  const signs=['摩羯','水瓶','雙魚','牡羊','金牛','雙子','巨蟹','獅子','處女','天秤','天蠍','射手'];
  const edge =[20,19,20,20,21,22,23,23,23,23,22,22];
  return (day<edge[month-1]?signs[(month+10)%12]:signs[month-1]);
}
function calcFlowDay(dateObj){
  const n=dateObj.getFullYear()+dateObj.getMonth()+1+dateObj.getDate();
  return n%9||9;
}
// ============== Main ==============
async function submitBirthday(){
  const bday=document.getElementById('birthday').value;
  const resEl=document.getElementById('result');
  if(!/^\d{4}-\d{2}-\d{2}$/.test(bday)){
    resEl.textContent='請輸入正確的生日格式 (YYYY-MM-DD)';
    return;
  }
  const lp=calcLifePath(bday);
  const bd=new Date(bday);
  const zodiac=getZodiac(bd.getMonth()+1, bd.getDate()); // 中文不含「座」
  const today=new Date();
  const flow=calcFlowDay(today);
  const file=`flowday_${flow}_lifepath_${lp}.json`;
  const url=`daily/latest/${file}`;
  try{
    const resp=await fetch(url);
    if(!resp.ok) throw new Error('資料不存在');
    const arr=await resp.json();
    const hit=arr.find(o=>o.sign.startsWith(zodiac));
    if(!hit){resEl.textContent='今天這個星座沒有資料';return;}
    resEl.innerHTML=hit.message.replace(/\n/g,'<br>');
  }catch(err){
    console.error(err);
    resEl.textContent='讀取資料時發生錯誤，請稍後再試';
  }
}
