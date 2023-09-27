const ProfileHelper = require('../../../common/profile-helper/helper');
const request = require('../helper/request-helper');

const taskTypeVT = require('../data/taskTypeVT.json');
const taskTypeTWO = require('../data/taskTypeTWO.json');

describe('Project - List', () => {
  const profileHelper = new ProfileHelper('api');

  beforeEach(async () => {
    await profileHelper.cleanSetup();
  });

  describe('Positive cases', () => {
    it('should return correct list of projects', async () => {
      const response = await request({
        method: 'get',
        url: '/api/project'
      });

      expect(response.data).toEqual({
        projects: [
          {
            id: 'VT',
            name: 'Vacation Trip',
            status: [
              {
                name: 'Open',
                type: 'open',
                default: true
              },
              {
                name: 'In Progress',
                type: 'in_progress'
              },
              {
                name: 'Done',
                type: 'done'
              }
            ],
            tickettypes: [taskTypeVT],
            boards: [
              {
                name: 'Project Board',
                columns: [
                  {
                    name: 'Open',
                    status: ['Open']
                  },
                  {
                    name: 'In Progress',
                    status: ['In Progress']
                  },
                  {
                    name: 'Done',
                    status: ['Done']
                  }
                ]
              }
            ]
          },
          {
            id: 'TWO',
            name: 'Project Two',
            status: [
              {
                name: 'Open',
                type: 'open',
                default: true
              },
              {
                name: 'Done',
                type: 'done'
              }
            ],
            tickettypes: [taskTypeTWO]
          }
        ]
      });
    });
  });
});
