const PuppeteerHelper = require('./helper/puppeteer');

describe('Overview Page', () => {
  let puppeteer;

  beforeAll(async () => {
    puppeteer = await PuppeteerHelper.init();
  });

  it('should have TickIt as title', async () => {
    await puppeteer.goto('/');
    const titleText = await puppeteer.getInnerText('.navigation__title');
    expect(titleText).toEqual('TickIT');
  });
});
