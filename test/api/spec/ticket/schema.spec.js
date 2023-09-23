const ProfileHelper = require('../../../common/profile-helper/helper');
const request = require('../helper/request-helper');

describe('Ticket - Create', () => {
  const profileHelper = new ProfileHelper('api');

  beforeEach(async () => {
    await profileHelper.cleanSetup();
  });

  describe('Positive cases', () => {
    beforeEach(async () => {
      await profileHelper.apply('simple-ticket');
    });

    it('should return the correct schema', async () => {
      const response = await request({
        method: 'get',
        url: '/api/ticket/TWO/Task'
      });

      expect(response.data).toEqual({
        fields: [
          {
            id: 'description',
            name: 'Description',
            type: 'longtext',
            required: true
          }
        ]
      });
    });
  });

  describe('Negative cases', () => {
    beforeEach(async () => {
      await profileHelper.apply('simple-ticket');
    });

    it('should fail if type does not exists', async () => {
      const response = await request({
        method: 'get',
        url: '/api/ticket/TWO/Bug'
      });

      expect(response.data).toEqual({
        error: 'Bad Request',
        statusCode: 400,
        message: ['Invalid type "Bug" in project "TWO"']
      });
    });

    it('should fail if project does not exists', async () => {
      const response = await request({
        method: 'get',
        url: '/api/ticket/BLA/Task'
      });

      expect(response.data).toEqual({
        error: 'Bad Request',
        statusCode: 400,
        message: [
          'Invalid project "BLA"',
          'Invalid type "Task" in project "BLA"'
        ]
      });
    });
  });
});
