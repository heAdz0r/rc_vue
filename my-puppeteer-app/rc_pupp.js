const puppeteer = require('puppeteer');

async function fetchData() {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    
        // Настройте тайм-аут и повторные попытки
        const maxRetries = 3;
        let retries = 0;
    
        async function navigateWithRetries(url, options) {
            while (retries < maxRetries) {
                try {
                    await page.goto(url, options);
                    return;
                } catch (error) {
                    console.log(`Attempt ${retries + 1} failed: ${error.message}`);
                    retries += 1;
                    if (retries >= maxRetries) {
                        throw error;
                    }
                }
            }
        }
    
        try {
            // Попытка зайти на сайт с увеличенным тайм-аутом и повторными попытками
            await navigateWithRetries('http://rc.mydepartment.ru/web?#view_type=pivot&model=account.analytic.line&menu_id=170&action=259', {
                waitUntil: 'networkidle2',
                timeout: 60000 // Увеличение тайм-аута до 60 секунд
            });

    // Введите данные для авторизации
    await page.type('#login', 'e.sprogis@inlinegroup.ru'); // замените 'your_username' на ваш логин
    await page.type('#password', 'Sofia3191016'); // замените 'your_password' на ваш пароль

    // Отправьте форму
    await page.click('.oe_login_buttons .btn-primary');

    await page.waitForNavigation();

    // Выполните фетч-запрос
    const result = await page.evaluate(async () => {
        const response = await fetch("http://rc.mydepartment.ru/web/dataset/call_kw/account.analytic.line/read_group", {
            headers: {
                "accept": "application/json, text/javascript, */*; q=0.01",
                "accept-language": "ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7",
                "content-type": "application/json",
                "proxy-authorization": "Basic MTM4MjQzNDE2Yjg2ZTQzNjZiNTZmYThjYjM5NjdlZWI6OE0yUHRkRnFESUdvcFpKSQ==",
                "proxy-connection": "keep-alive",
                "x-requested-with": "XMLHttpRequest"
            },
            referrer: "http://rc.mydepartment.ru/web?",
            referrerPolicy: "strict-origin-when-cross-origin",
            body: "{\"jsonrpc\":\"2.0\",\"method\":\"call\",\"params\":{\"model\":\"account.analytic.line\",\"method\":\"read_group\",\"args\":[],\"kwargs\":{\"groupby\":[\"user_id\",\"date:month\"],\"fields\":[\"user_id\",\"date\",\"unit_amount\"],\"domain\":[[\"project_id\",\"!=\",false]],\"context\":{\"lang\":\"ru_RU\",\"tz\":false,\"uid\":195,\"group_by_no_leaf\":true,\"params\":{\"action\":259,\"view_type\":\"pivot\",\"model\":\"account.analytic.line\",\"menu_id\":170,\"_push_me\":false},\"search_default_today\":1},\"offset\":0,\"lazy\":false,\"limit\":false,\"orderby\":false}},\"id\":425573476}",
            method: "POST",
            mode: "cors",
            credentials: "include"
        });
        const data = await response.json();
        return data;
    });

    console.log(result);

    await browser.close();
    return result;
} catch (error) {
    console.error('Failed to fetch data:', error);
} finally {
    await browser.close();
}
}

fetchData().then(data => {
    const fs = require('fs');
    fs.writeFileSync('data.json', JSON.stringify(data, null, 2));
});
