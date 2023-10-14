const puppeteer = require('puppeteer');

module.exports = class PuppeteerHelper {
  constructor({ browser, page }) {
    this.browser = browser;
    this.page = page;
  }

  static async init() {
    const browser = await puppeteer.launch({
      args: ['--no-sandbox'],
      headless: 'new'
    });
    const helper = new PuppeteerHelper({
      browser,
      page: await browser.newPage()
    });

    return helper;
  }

  async goto(path) {
    const fullUrl = `http://localhost:5001${path}`;

    await this.page.goto(fullUrl);
  }

  async getInnerText(selector) {
    await this.page.waitForSelector(selector);

    const result = await this.page.evaluate((selector) => {
      return document.querySelector(selector).innerText;
    }, selector);

    return result;
  }
};
