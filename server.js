const express = require('express');
const puppeteer = require('puppeteer');
const path = require('path');

const app = express();
const PORT = 4000;

// Middleware to log each request
app.use((req, res, next) => {
  console.log(`Request URL: ${req.url}`);
  next();
});

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));

app.post('/scrape', async (req, res) => {
  const url = req.body.url;
  const selector = req.body.selector;
  console.log(`Scraping URL: ${url} with selector: ${selector}`);

  if (!url || !selector) {
    console.error('URL or selector not provided');
    return res.send('Please provide both a URL and a CSS selector');
  }

  try {
    // Using Puppeteer to handle dynamic content
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle2' });

    const content = await page.evaluate((selector) => {
      const element = document.querySelector(selector);
      return element ? element.innerText.trim() : null;
    }, selector);

    await browser.close();

    if (content) {
      console.log(`Content found: ${content}`);
      return res.send(`Content: ${content}`);
    } else {
      console.log('Content not found');
      return res.send('Content not found');
    }
  } catch (error) {
    console.error(`Error fetching the URL: ${error.message}`);
    return res.send(`Error fetching the URL: ${error.message}`);
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
