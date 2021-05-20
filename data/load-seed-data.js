/* eslint-disable no-console */
import client from '../lib/client.js';
// import our seed data:
import users from './users.js';
import favorites from './favorites.js';

run();

async function run() {

  try {

    const data = await Promise.all(
      users.map(user => {
        return client.query(`
          INSERT INTO users (name, email, hash)
          VALUES ($1, $2, $3)
          RETURNING *;
        `,
        [user.name, user.email, user.password]);
      })
    );
    
    const user = data[0].rows[0];

    await Promise.all(
      favorites.map(favorite => {
        return client.query(`
        INSERT INTO favorites (name, thumbnail_url, num_servings, user_id)
        VALUES ($1, $2, $3, $4)
        `,
        [favorite.name, favorite.thumbnail_url, favorite.num_servings, user.id]);
      })
    );
    

    console.log('seed data load complete');
  }
  catch(err) {
    console.log(err);
  }
  finally {
    client.end();
  }
    
}