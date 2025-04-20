
function submitBirthday() {
    const bday = document.getElementById("birthday").value;
    if (!bday) {
        document.getElementById("result").textContent = "請先輸入生日";
        return;
    }

    const date = new Date(bday);
    const digits = bday.replace(/-/g, '').split('');
    const main = digits.reduce((a, b) => a + parseInt(b), 0) % 9 || 9;
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const zodiac = getZodiac(month, day);
    const today = new Date();
    const flow = (today.getDate() + today.getMonth() + 1 + today.getFullYear()) % 9 || 9;

    const query = `主數=${main}&星座=${zodiac}&流日=${flow}`;
    document.getElementById("result").textContent = `正在查詢：${query}`;
    // 模擬查詢結果（實際部署時會連接 n8n webhook）
    setTimeout(() => {
        document.getElementById("result").textContent = `✨ ${zodiac} 今日命運之鑰：主數 ${main}、流日 ${flow}`;
    }, 1000);
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
