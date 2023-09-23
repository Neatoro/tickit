const ProfileHelper = require('../../../common/profile-helper/helper');
const request = require('../helper/request-helper');

const taskTypeVT = require('../data/taskTypeVT.json');
const taskTypeTWO = require('../data/taskTypeTWO.json');

describe('Ticket - Create', () => {
  const profileHelper = new ProfileHelper('api');

  beforeEach(async () => {
    await profileHelper.cleanSetup();
  });

  it('should create a ticket', async () => {
    const response = await request({
      method: 'post',
      url: '/api/ticket',
      data: {
        project: 'VT',
        summary: 'Foo Bar',
        fields: {
          description: 'Hello World'
        },
        type: 'Task'
      }
    });

    expect(response.data).toEqual({
      id: 1,
      project: 'VT',
      summary: 'Foo Bar',
      fields: {
        description: 'Hello World'
      },
      type: taskTypeVT,
      status: { name: 'Open', type: 'open', default: true }
    });
  });

  it('should increase ticket id per project', async () => {
    await profileHelper.apply('simple-ticket');

    const responseVT = await request({
      method: 'post',
      url: '/api/ticket',
      data: {
        project: 'VT',
        summary: 'Foo Bar',
        fields: {
          description: 'Hello World'
        },
        type: 'Task'
      }
    });

    const responseTWO = await request({
      method: 'post',
      url: '/api/ticket',
      data: {
        project: 'TWO',
        summary: 'Foo Bar',
        fields: {
          description: 'Hello World'
        },
        type: 'Task'
      }
    });

    expect(responseVT.data).toEqual({
      id: 2,
      project: 'VT',
      summary: 'Foo Bar',
      fields: {
        description: 'Hello World'
      },
      type: taskTypeVT,
      status: { name: 'Open', type: 'open', default: true }
    });

    expect(responseTWO.data).toEqual({
      id: 2,
      project: 'TWO',
      summary: 'Foo Bar',
      fields: {
        description: 'Hello World'
      },
      type: taskTypeTWO,
      status: { name: 'Open', type: 'open', default: true }
    });
  });
});
