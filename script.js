
function submitBirthday() {
    const bdayEl = document.getElementById("birthday");
    const resultEl = document.getElementById("result");
    const bday = bdayEl.value;
    if (!bday || !/^\d{4}-\d{2}-\d{2}$/.test(bday)) {
        resultEl.textContent = "請輸入正確的生日格式（yyyy-mm-dd）";
        return;
    }

    // === 計算主數 ===
    const digits = bday.replace(/-/g, '').split('').map(Number);
    let sum = digits.reduce((a, b) => a + b, 0);
    const master = [11,22,33];
    let lifepath = sum;
    while (!master.includes(lifepath) && lifepath >= 10) {
        lifepath = lifepath.toString().split('').reduce((a,b)=>a+Number(b),0);
    }

    // === 計算星座 ===
    function getZodiac(m,d){
        const z = [
          ['摩羯座',1,19],['水瓶座',2,18],['雙魚座',3,20],['牡羊座',4,19],
          ['金牛座',5,20],['雙子座',6,20],['巨蟹座',7,22],['獅子座',8,22],
          ['處女座',9,22],['天秤座',10,22],['天蠍座',11,21],['射手座',12,21],
          ['摩羯座',12,31]
        ];
        for(const [sign,mth,day] of z){
            if(m < mth || (m===mth && d<=day)) return sign;
        }
    }
    const dateObj = new Date(bday);
    const zodiac = getZodiac(dateObj.getMonth()+1, dateObj.getDate());

    // === 計算流日 (採用今日) ===
    const today = new Date();
    const flow = (today.getDate() + today.getMonth() + 1 + today.getFullYear()) % 9 || 9;

    // === 組裝檔名並 fetch ===
    const yyyy_mm_dd = today.toISOString().slice(0,10);
    const fileName = `${yyyy_mm_dd}_flowday_${flow}_lifepath_${lifepath}.json`;
    const url = `daily/${yyyy_mm_dd}/${fileName}`;

    fetch(url)
        .then(r=>r.json())
        .then(arr=>{
            // arr is an array of 12 star-sign objects
            const key = zodiac.replace('座',''); // remove suffix for match
            const hit = arr.find(o=>o.sign.startsWith(key));
            if(!hit){
                resultEl.textContent = "暫無對應資料";
                return;
            }
            resultEl.innerHTML = hit.message.replace(/\n/g,'<br>');
        })
        .catch(err=>{
            console.error(err);
            resultEl.textContent = "讀取資料時發生錯誤，請稍後再試";
        });
}
