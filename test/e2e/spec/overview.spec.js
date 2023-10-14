const PuppeteerHelper = require('./helper/puppeteer');
const OverviewPage = require('./pages/Overview');
const ProfileHelper = require('../../common/profile-helper/helper');

describe('Overview Page', () => {
  const profileHelper = new ProfileHelper('e2e');

  let puppeteer;
  let overviewPage;

  beforeAll(async () => {
    puppeteer = await PuppeteerHelper.init();
    overviewPage = new OverviewPage({ puppeteer });
  });

  beforeEach(async () => {
    await profileHelper.cleanSetup();
  });

  it('should have TickIt as title', async () => {
    await puppeteer.goto('/');
    const titleText = await puppeteer.getInnerText('.navigation__title');
    expect(titleText).toEqual('TickIT');
  });

  it('should display the correct tickets', async () => {
    await profileHelper.apply('simple-ticket');

    await puppeteer.goto('/');
    const tickets = await overviewPage.getTickets();

    expect(tickets).toEqual([
      {
        id: 'VT-1',
        type: 'Task',
        summary: 'Test Ticket',
        status: 'In Progress',
        project: 'Vacation Trip'
      },
      {
        id: 'TWO-1',
        type: 'Task',
        summary: 'Test Ticket',
        status: 'Open',
        project: 'Project Two'
      }
    ])
  });
});
