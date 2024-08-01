const express = require('express');
const puppeteer = require('puppeteer');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

app.post('/scrape', async (req, res) => {
  const { url, selector } = req.body;
  
  if (!url || !selector) {
    return res.status(400).json({ error: 'Missing URL or selector' });
  }

  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 160000 }); // Increased timeout to 60 seconds

    // Wait for the element to appear on the page
    await page.waitForSelector(selector, { timeout: 160000 }); // Increased timeout to 60 seconds

    // Extract the content of the element
    const result = await page.evaluate(selector => {
      const element = document.querySelector(selector);
      return element ? element.innerText : null;
    }, selector);

    await browser.close();

    if (result) {
      res.json({ result });
    } else {
      res.status(404).json({ error: 'Element not found' });
    }
  } catch (error) {
    console.error('Error fetching the URL:', error);
    res.status(500).json({ error: 'Error fetching the URL', details: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
