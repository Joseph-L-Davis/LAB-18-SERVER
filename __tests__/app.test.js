import client from '../lib/client.js';
import supertest from 'supertest';
import app from '../lib/app.js';
import { execSync } from 'child_process';

const request = supertest(app);

let favoriteDish = {
  name: 'fake dish',
  id: expect.any(Number),
  thumbnailUrl: 'string',
  numServings: '2',
  userId: 1
};

describe('API Routes', () => {

  afterAll(async () => {
    return client.end();
  });

  describe('/api/dishes', () => {
    let user;

    beforeAll(async () => {
      execSync('npm run recreate-tables');

      const response = await request
        .post('/api/auth/signup')
        .send({
          name: 'Me the User',
          email: 'me@user.com',
          password: 'password'
        });

      expect(response.status).toBe(200);

      user = response.body;
    }); 

    // append the token to your requests:
    //  .set('Authorization', user.token);
    
    it('POST to /api/favorites', async () => {
     
      const response = await request
        .post('/api/favorites')
        .set('Authorization', user.token)
        .send(favoriteDish);

      // remove this line, here to not have lint error:
      user.token;

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        userId: user.id,
        ...favoriteDish
      });
      
    });

  });
});