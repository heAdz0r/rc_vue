const puppeteer = require('puppeteer');
const fs = require('fs');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());

app.post('/update-data', async (req, res) => {
  try {
    const filters = req.body;
    const data = await fetchData(filters);
    fs.writeFileSync('data.json', JSON.stringify(data, null, 2));
    res.sendStatus(200);
  } catch (error) {
    console.error('Failed to update data:', error);
    res.sendStatus(500);
  }
});

async function fetchData(filters) {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  // Код для авторизации и навигации
  await page.goto('http://rc.mydepartment.ru/web?#view_type=pivot&model=account.analytic.line&menu_id=170&action=259', {
    waitUntil: 'networkidle2',
    timeout: 60000
  });

  await page.type('#login', 'e.sprogis@inlinegroup.ru');
  await page.type('#password', 'Sofia3191016');
  await page.click('.oe_login_buttons .btn-primary');

  await page.waitForNavigation();

  const result = await page.evaluate(async (filters) => {
    const response = await fetch("http://rc.mydepartment.ru/web/dataset/call_kw/account.analytic.line/read_group", {
      headers: {
        "accept": "application/json, text/javascript, */*; q=0.01",
        "accept-language": "ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7",
        "content-type": "application/json",
        "proxy-authorization": "Basic MmIyMWUwODZiYTI1ZDBiNzRiZDdlMjI5Mjc4NDIyYWU6LVhIZ1lWTWFWazZ0dDZKdg==",
        "proxy-connection": "keep-alive",
        "x-requested-with": "XMLHttpRequest"
      },
      method: 'POST',
      body: JSON.stringify({
        jsonrpc: '2.0',
        method: 'call',
        params: {
          model: 'account.analytic.line',
          method: 'read_group',
          args: [],
          kwargs: {
            groupby: [filters.groupBy],
            fields: ['user_id', 'project_id', 'task_id', 'date', 'unit_amount'],
            domain: [
              ["project_id", "!=", false],
              ["date", ">=", filters.startDate],
              ["date", "<=", filters.endDate],
              ["project_id", "ilike", filters.projectId]
            ],
            context: {
              lang: 'ru_RU',
              tz: false,
              uid: 195,
              group_by_no_leaf: true,
              search_default_today: 1,
              params: { action: 259 },
              pivot_measures: ['unit_amount'],
              pivot_column_groupby: ['date:month'],
              pivot_row_groupby: ['user_id', 'project_id', 'task_id'],
              group_by: 'task_id'
            },
            offset: 0,
            lazy: false,
            limit: false,
            orderby: false
          }
        },
        id: 208032934
      })
    });
    const data = await response.json();
    return data;
  }, filters);

  await browser.close();
  return result;
}

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
