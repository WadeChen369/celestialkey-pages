
function submitBirthday() {
    const bday = document.getElementById("birthday").value;
    if (!bday) {
        document.getElementById("result").textContent = "請先輸入生日";
        return;
    }

    const digits = bday.replace(/-/g, '').split('').map(Number);
    const sum = digits.reduce((a, b) => a + b, 0);
    const masterNumbers = [11, 22, 33];
    let main;
    if (masterNumbers.includes(sum)) {
        main = sum;
    } else {
        let temp = sum;
        while (temp >= 10) {
            temp = temp.toString().split('').reduce((a, b) => a + Number(b), 0);
        }
        main = temp;
    }

    const date = new Date(bday);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const zodiac = getZodiac(month, day);

    const today = new Date();
    const flow = (today.getDate() + today.getMonth() + 1 + today.getFullYear()) % 9 || 9;

    // 清除預設顯示，未來可由 webhook 回傳內容更新
    document.getElementById("result").textContent = "";

    // 可在此加入 webhook 呼叫（未來接 n8n）
    console.log({ 主數: main, 星座: zodiac, 流日: flow });
}

function getZodiac(month, day) {
    const signs = [
        ["摩羯座", 1, 19], ["水瓶座", 2, 18], ["雙魚座", 3, 20], ["牡羊座", 4, 19],
        ["金牛座", 5, 20], ["雙子座", 6, 20], ["巨蟹座", 7, 22], ["獅子座", 8, 22],
        ["處女座", 9, 22], ["天秤座", 10, 22], ["天蠍座", 11, 21], ["射手座", 12, 21],
        ["摩羯座", 12, 31]
    ];
    for (const [sign, m, d] of signs) {
        if (month < m || (month === m && day <= d)) return sign;
    }
}
