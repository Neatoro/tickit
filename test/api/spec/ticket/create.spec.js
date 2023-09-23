const ProfileHelper = require('../../../common/profile-helper/helper');
const request = require('../helper/request-helper');

const taskTypeVT = require('../data/taskTypeVT.json');
const taskTypeTWO = require('../data/taskTypeTWO.json');

describe('Ticket - Create', () => {
  const profileHelper = new ProfileHelper('api');

  beforeEach(async () => {
    await profileHelper.cleanSetup();
  });

  describe('Positive cases', () => {
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

  describe('Negative Cases', () => {
    it('should fail if required field is missing', async () => {
      const response = await request({
        method: 'post',
        url: '/api/ticket',
        data: {
          project: 'VT',
          summary: 'Foo Bar',
          fields: {},
          type: 'Task'
        }
      });

      expect(response.status).toBe(400);
      expect(response.data).toEqual({
        message: ['Missing required fields'],
        error: 'Bad Request',
        statusCode: 400
      });
    });

    it('should fail if field has wrong type', async () => {
      const response = await request({
        method: 'post',
        url: '/api/ticket',
        data: {
          project: 'VT',
          summary: 'Foo Bar',
          fields: {
            description: 19278
          },
          type: 'Task'
        }
      });

      expect(response.status).toBe(400);
      expect(response.data).toEqual({
        message: ['Invalid field value for "description" (19278)'],
        error: 'Bad Request',
        statusCode: 400
      });
    });

    it('should fail if fields is missing', async () => {
      const response = await request({
        method: 'post',
        url: '/api/ticket',
        data: {
          project: 'VT',
          summary: 'Foo Bar',
          type: 'Task'
        }
      });

      expect(response.status).toBe(400);
      expect(response.data).toEqual({
        message: ['fields must be an object', 'fields should not be empty'],
        error: 'Bad Request',
        statusCode: 400
      });
    });

    it('should fail if project is missing', async () => {
      const response = await request({
        method: 'post',
        url: '/api/ticket',
        data: {
          fields: {
            description: 'ffop'
          },
          summary: 'Foo Bar',
          type: 'Task'
        }
      });

      expect(response.status).toBe(400);
      expect(response.data).toEqual({
        message: ['project must be a string', 'project should not be empty'],
        error: 'Bad Request',
        statusCode: 400
      });
    });

    it('should fail if summary is missing', async () => {
      const response = await request({
        method: 'post',
        url: '/api/ticket',
        data: {
          project: 'VT',
          fields: {
            description: 'ffop'
          },
          type: 'Task'
        }
      });

      expect(response.status).toBe(400);
      expect(response.data).toEqual({
        message: ['summary must be a string', 'summary should not be empty'],
        error: 'Bad Request',
        statusCode: 400
      });
    });

    it('should fail if type is missing', async () => {
      const response = await request({
        method: 'post',
        url: '/api/ticket',
        data: {
          project: 'VT',
          fields: {
            description: 'ffop'
          },
          summary: 'Foo Bar'
        }
      });

      expect(response.status).toBe(400);
      expect(response.data).toEqual({
        message: ['type must be a string', 'type should not be empty'],
        error: 'Bad Request',
        statusCode: 400
      });
    });

    it('should fail if project is not existing', async () => {
      const response = await request({
        method: 'post',
        url: '/api/ticket',
        data: {
          project: 'THREE',
          fields: {
            description: 'ffop'
          },
          summary: 'Foo Bar',
          type: 'Task'
        }
      });

      expect(response.status).toBe(400);
      expect(response.data).toEqual({
        message: [
          'Invalid project "THREE"',
          'Invalid type "Task" in project "THREE"',
          'Invalid field "description"',
          'Invalid field value for "description" (ffop)'
        ],
        error: 'Bad Request',
        statusCode: 400
      });
    });

    it('should fail if type is not supported', async () => {
      const response = await request({
        method: 'post',
        url: '/api/ticket',
        data: {
          project: 'VT',
          fields: {
            description: 'ffop'
          },
          summary: 'Foo Bar',
          type: 'Bug'
        }
      });

      expect(response.status).toBe(400);
      expect(response.data).toEqual({
        message: [
          'Invalid type "Bug" in project "VT"',
          'Invalid field "description"',
          'Invalid field value for "description" (ffop)'
        ],
        error: 'Bad Request',
        statusCode: 400
      });
    });
  });
});
