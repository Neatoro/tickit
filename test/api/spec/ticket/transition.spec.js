const ProfileHelper = require('../../../common/profile-helper/helper');
const request = require('../helper/request-helper');

describe('Ticket - Transition', () => {
  const profileHelper = new ProfileHelper('api');

  beforeEach(async () => {
    await profileHelper.cleanSetup();
  });

  describe('Positive Cases', () => {
    it('should transition to correct status', async () => {
      await profileHelper.apply('simple-ticket');

      const response = await request({
        method: 'put',
        url: '/api/ticket/VT/1/transition',
        data: {
          newStatus: 'Open'
        }
      });

      expect(response.data).toEqual({
        project: 'VT',
        id: 1,
        status: 'Open',
        type: 'Task',
        summary: 'Test Ticket'
      });
    });
  });

  describe('Negative Cases', () => {
    beforeEach(async () => {
      await profileHelper.apply('simple-ticket');
    });

    it('should fail with invalid status', async () => {
      const response = await request({
        method: 'put',
        url: '/api/ticket/VT/1/transition',
        data: {
          newStatus: 'Foo'
        }
      });

      expect(response.data).toEqual({
        error: 'Bad Request',
        statusCode: 400,
        message: [
          'Invalid status "Foo"',
          'Cannot transition from status "In Progress" to "Foo"'
        ]
      });
    });

    it('should fail with status not being a string', async () => {
      const response = await request({
        method: 'put',
        url: '/api/ticket/VT/1/transition',
        data: {
          newStatus: 3
        }
      });

      expect(response.data).toEqual({
        error: 'Bad Request',
        statusCode: 400,
        message: ['newStatus must be a string']
      });
    });

    it('should fail with if ticket cannot transition to new status', async () => {
      await profileHelper.apply('closed-ticket');

      const response = await request({
        method: 'put',
        url: '/api/ticket/VT/2/transition',
        data: {
          newStatus: 'In Progress'
        }
      });

      expect(response.data).toEqual({
        error: 'Bad Request',
        statusCode: 400,
        message: ['Cannot transition from status "Done" to "In Progress"']
      });
    });
  });
});
