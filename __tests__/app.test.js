import client from '../lib/client.js';
import supertest from 'supertest';
import app from '../lib/app.js';
import { execSync } from 'child_process';

const request = supertest(app);

let favoriteDish = {
  name: 'Tomato Shorba',
  id: 1,
  thumbnailUrl: 'string',
  numServings: '2',
  userId: 1
};

describe('API Routes', () => {

  afterAll(async () => {
    return client.end();
  });

  describe('/api/favorites', () => {
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

    it.skip('GET my /api/me/favorites only returns my favorites', async () => {
      // this is setup so that there is a favorite belong to someone else in the db
      const otherResponse = await request
        .post('/api/favorites')
        .set('Authorization', user.token)
        .send({
          name: 'booger soup',
          thumbnailUrl: 'string',
          numServings: '2'
        });
      console.log(otherResponse.body);
      expect(otherResponse.status).toBe(200);
      const otherFavorite = otherResponse.body;

      // we are testing this
      const response = await request.get('/api/me/favorites')
        .set('Authorization', user.token);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(expect.arrayContaining([otherFavorite]));


    });

    it('DELETE favorite to /api/favorites/:id', async () => {
      
      const response = await request
        .delete(`/api/favorites/${favoriteDish.id}`)
        .set('Authorization', user.token)
        .send(favoriteDish);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(favoriteDish);
      
    });



  });


});