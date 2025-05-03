<script>
// 手動指定「資料批次日期」作測試；正式版可用 getToday() 或 fetch meta
const DATA_DATE   = '2025-05-03';   // 先寫死
// 如果要動態：把 n8n 產物同步複製成 daily/latest/ 目錄
// const DATA_DATE = 'latest';

function pad(n){return n.toString().padStart(2,'0');}

// === 主邏輯 ===
async function submitBirthday(){
  try{
    const b = document.getElementById('birthday').value;
    if(!/^\d{4}-\d{2}-\d{2}$/.test(b)) throw '日期格式錯誤';

    /* 1) 生命路徑數 */
    const digits = b.replace(/\D/g,'').split('').map(Number);
    let lp = digits.reduce((a,b)=>a+b,0);
    while(![11,22,33].includes(lp) && lp>=10){
      lp = lp.toString().split('').reduce((a,b)=>a+Number(b),0);
    }

    /* 2) 星座 (中文不帶「座」) */
    const d = new Date(b);
    const zlist = ['摩羯','水瓶','雙魚','牡羊','金牛','雙子','巨蟹','獅子','處女','天秤','天蠍','射手'];
    const edge  = [20,19,20,20,21,21,23,23,23,23,22,22];
    const m=d.getMonth(), day=d.getDate();
    const zodiac = (day<edge[m]? zlist[(m+11)%12]:zlist[m]);

    /* 3) 流日 */
    const today=new Date();
    const flow  = ((today.getFullYear()+today.getMonth()+1+today.getDate())%9)||9;

    /* 4) 檔名 + fetch */
    const file  = `${DATA_DATE}_flowday_${flow}_lifepath_${lp}.json`;
    const url   = `daily/${DATA_DATE}/${file}`;

    const res   = await fetch(url);
    if(!res.ok) throw `找不到 ${url}`;
    const arr   = await res.json();

    const hit   = arr.find(o=>o.sign.startsWith(zodiac));
    if(!hit)    throw '這個星座今天沒有資料';

    document.getElementById('result').innerHTML = hit.message.replace(/\n/g,'<br>');
  }catch(err){
    console.error(err);
    document.getElementById('result').textContent = '目前無可用資料，請稍後再試';
  }
}
</script>
