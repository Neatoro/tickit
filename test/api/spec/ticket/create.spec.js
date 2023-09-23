const ProfileHelper = require('../../../common/profile-helper/helper');
const request = require('../helper/request-helper');

const taskType = {
  name: 'Task',
  fields: [
    {
      id: 'description',
      name: 'Description',
      type: 'longtext',
      required: true
    }
  ],
  workflow: [
    {
      status: 'Open',
      transitions: [
        {
          name: 'Start Progress',
          target: 'In Progress'
        }
      ]
    },
    {
      status: 'In Progress',
      transitions: [
        {
          name: 'Reopen',
          target: 'Open'
        }
      ]
    },
    {
      status: 'Done',
      transitionFromAll: true,
      transitions: [
        {
          name: 'Reopen',
          target: 'Open'
        }
      ]
    }
  ]
};

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
      type: taskType,
      status: { name: 'Open', type: 'open', default: true }
    });
  });
});
