const ProfileHelper = require('../../../common/profile-helper/helper');
const request = require('../helper/request-helper');

const taskTypeVT = require('../data/taskTypeVT.json');
const taskTypeTWO = require('../data/taskTypeTWO.json');

describe('Ticket - Search', () => {
  const profileHelper = new ProfileHelper('api');

  beforeEach(async () => {
    await profileHelper.cleanSetup();
  });

  describe('Positive Cases', () => {
    it('should return all tickets', async () => {
      await profileHelper.apply('simple-ticket');

      const response = await request({
        method: 'get',
        url: '/api/ticket/search'
      });

      expect(response.data).toEqual({
        data: [
          {
            id: 1,
            project: 'VT',
            summary: 'Test Ticket',
            type: taskTypeVT,
            status: {
              name: 'In Progress',
              type: 'in_progress'
            },
            fields: {
              description: 'Test'
            }
          },
          {
            id: 1,
            project: 'TWO',
            summary: 'Test Ticket',
            type: taskTypeTWO,
            status: {
              name: 'Open',
              type: 'open',
              default: true
            },
            fields: {
              description: 'Test'
            }
          }
        ]
      });
    });
  });
});
