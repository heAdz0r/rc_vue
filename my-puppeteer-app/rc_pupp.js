const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());
app.use(express.static(path.join(__dirname))); // Делаем корневую папку статической

app.post('/update-data', async (req, res) => {
  try {
    const filters = req.body;
    const data = await fetchData(filters);
    const filePath = path.join(__dirname, 'data.json');
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    res.sendStatus(200);
  } catch (error) {
    console.error('Failed to update data:', error);
    res.sendStatus(500);
  }
});

app.get('/data.json', (req, res) => {
  const filePath = path.join(__dirname, 'data.json');
  try {
    if (fs.existsSync(filePath)) {
      res.sendFile(filePath);
    } else {
      res.status(404).send('File not found');
    }
  } catch (error) {
    console.error('Error reading data.json:', error);
    res.status(500).send('Server error');
  }
});

async function fetchData(filters, retryCount = 3) {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  try {
    await page.goto('http://rc.mydepartment.ru/web?#view_type=pivot&model=account.analytic.line&menu_id=170&action=259', {
      waitUntil: 'networkidle2',
      timeout: 120000 // Увеличиваем таймаут до 2 минут
    });

    await page.type('#login', 'e.sprogis@inlinegroup.ru');
    await page.type('#password', 'Sofia3191016');
    await page.click('.oe_login_buttons .btn-primary');
    await page.waitForNavigation();

    const result = await page.evaluate(async (filters) => {
      const domain = [["project_id", "!=", false]];
      if (filters.startDate) domain.push(["date", ">=", filters.startDate]);
      if (filters.endDate) domain.push(["date", "<=", filters.endDate]);
      if (filters.projectId) domain.push(["project_id", "ilike", filters.projectId]);

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
              groupby: filters.groupBy,
              fields: filters.groupBy.concat(['unit_amount']),
              domain,
              context: {
                lang: 'ru_RU',
                tz: false,
                uid: 195,
                group_by_no_leaf: true,
                search_default_today: 1,
                params: { action: 259 },
                pivot_measures: ['unit_amount'],
                pivot_column_groupby: ['date:month'],
                pivot_row_groupby: filters.groupBy,
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

  } catch (error) {
    console.error('Failed to fetch data:', error);
    await browser.close();
    if (retryCount > 0) {
      console.log(`Retrying... (${retryCount} attempts left)`);
      return fetchData(filters, retryCount - 1);
    } else {
      throw error;
    }
  }
}

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
