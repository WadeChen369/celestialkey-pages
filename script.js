
/**
 * Celestial Key 前端查詢腳本
 * - 資料路徑: daily/{batchDate}/{batchDate}_flowday_{F}_lifepath_{L}.json
 * - batchDate 暫時寫死，未來可由後端自動覆寫
 * - 提供 debugPath(birthday) 方便在 Console 檢查
 */
(function(){
  const batchDate = '2025-05-03'; // ← 如資料夾更換，改這裡
  // ================= 工具函式 =================
  function calcLifePath(bdayStr){
    const digits=bdayStr.replace(/-/g,'').split('').map(Number);
    let sum=digits.reduce((a,b)=>a+b,0);
    const master=[11,22,33];
    if(master.includes(sum)) return sum;
    while(sum>=10){
      sum=sum.toString().split('').reduce((a,b)=>a+Number(b),0);
    }
    return sum;
  }
  function calcFlowDay(dateObj){
    const n=dateObj.getFullYear()+dateObj.getMonth()+1+dateObj.getDate();
    return n%9||9;
  }
  function getZodiac(m,d){
    const signs=['摩羯','水瓶','雙魚','牡羊','金牛','雙子','巨蟹','獅子','處女','天秤','天蠍','射手'];
    const edge =[20,19,20,20,21,22,23,23,23,23,22,22];
    return (d<edge[m-1]?signs[(m+10)%12]:signs[m-1]);
  }
  // 讓開發者在 Console 呼叫 debugPath('YYYY-MM-DD')
  window.debugPath=function(birthday){
    const lp=calcLifePath(birthday);
    const today=new Date(batchDate); // 用批次日期算流日
    const flow=calcFlowDay(today);
    const file=`${batchDate}_flowday_${flow}_lifepath_${lp}.json`;
    console.info('→ 會請求:',`daily/${batchDate}/${file}`);
    return `daily/${batchDate}/${file}`;
  };
  // ================ 主流程 =================
  window.submitBirthday=async function(){
    const bday=document.getElementById('birthday').value;
    const result=document.getElementById('result');
    if(!/^\d{4}-\d{2}-\d{2}$/.test(bday)){
      result.textContent='請輸入正確的生日格式 (YYYY-MM-DD)';
      return;
    }
    const lp=calcLifePath(bday);
    const d=new Date(bday);
    const zodiac=getZodiac(d.getMonth()+1,d.getDate()); // 中文去掉「座」
    const flow=calcFlowDay(new Date(batchDate)); // 固定批次日期
    const file=`${batchDate}_flowday_${flow}_lifepath_${lp}.json`;
    const url=`daily/${batchDate}/${file}`;
    try{
      const resp=await fetch(url);
      if(!resp.ok) throw new Error('找不到檔案');
      const arr=await resp.json();
      const hit=arr.find(o=>o.sign.startsWith(zodiac));
      if(!hit){result.textContent='今天這個星座沒有資料';return;}
      result.innerHTML=hit.message.replace(/\n/g,'<br>');
    }catch(err){
      console.error(err);
      result.textContent='讀取資料失敗，請檢查檔案或路徑';
    }
  };
})();
