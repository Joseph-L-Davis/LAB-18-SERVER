/* eslint-disable no-console */
// import dependencies
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import client from './client.js';
import ensureAuth from './auth/ensure-auth.js';
import createAuthRoutes from './auth/create-auth-routes.js';
import { formatRecipes } from './munge-utils.js';
import request from 'superagent';
// import { unirest } from 'unirest';

// make an express app
const app = express();

// allow our server to be called from any website
app.use(cors());
// read JSON from body of request when indicated by Content-Type
app.use(express.json());
// enhanced logging
app.use(morgan('dev'));

const authRoutes = createAuthRoutes();

// setup authentication routes to give user an auth token
// creates a /api/auth/signin and a /api/auth/signup POST route. 
// each requires a POST body with a .email and a .password and .name
app.use('/api/auth', authRoutes);



// var req = unirest('GET', 'https://tasty.p.rapidapi.com/recipes/list');

// var req = request.get('https://tasty.p.rapidapi.com/recipes/list');

// req.query({
//   'from': '0',
//   'size': '20',
//   'tags': 'under_30_minutes'
// });

// req.headers({
//   'x-rapidapi-key': '89f81e7bd5mshd5de49e06c53005p1bc150jsnf985c53dffbe',
//   'x-rapidapi-host': 'tasty.p.rapidapi.com',
//   'useQueryString': true
// });


// req.end(function(res) {
//   if (res.error) throw new Error(res.error);

//   console.log(res.body);
// });

// heartbeat route
app.get('/', (req, res) => {
  res.send('Yummmm Food API');
});

// everything that starts with "/api" below here requires an auth token!
// In theory, you could move "public" routes above this line
app.use('/api', ensureAuth);

// API routes:

app.get('/api/me/favorites', async (req, res) => {
  // use SQL query to get data...
  try {
    const data = await client.query(`
      SELECT  id, name, 
              thumbnail_url as "thumbnailUrl", num_servings as "numServings",
              user_id as "userId"
      FROM    favorites
      WHERE   user_id = $1;
    `, [req.userId]);

    // send back the data
    res.json(data.rows); 
  }
  catch(err) {
    console.log(err);
    res.status(500).json({ error: err.message });  
  }
});

app.get('/api/recipes/:id/favorites', async (req, res) => {
  // use SQL query to get data...
  try {
    const data = await client.query(`
      SELECT  id, name, 
              thumbnail_url as "thumbnailUrl", num_servings as "numServings",
              user_id as "userId",
              u.name as "userName"
      FROM    favorites f
      JOIN    users u
      ON      f.user_id = u.id
      WHERE   movie_id = $1;
    `, [req.params.id]);

    // send back the data
    res.json(data.rows[0] || null); 
  }
  catch(err) {
    console.log(err);
    res.status(500).json({ error: err.message });  
  }
});


app.post('/api/favorites', async (req, res) => {
  // use SQL query to get data...
  const favorite = req.body;
  try {
    const data = await client.query(`
      INSERT INTO favorites (name, thumbnail_url, num_servings, user_id)
      VALUES ($1, $2, $3, $4)
      RETURNING id, name, thumbnail_url as "thumbnailUrl", num_servings as "numServings", user_id as "userId"
    `, [favorite.name, favorite.thumbnailUrl, favorite.numServings, req.userId]
    );

    // send back the data
    res.json(data.rows[0] || null);
  }
  catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/favorites/:id', async (req, res) => {
  try {
    const data = await client.query(`
      DELETE FROM  favorites 
      WHERE        id = $1
      AND          user_id = $2
      RETURNING    id, name, 
                   thumbnail_url as "thumbnailUrl", num_servings as "numServings",
                   user_id as "userId";   
    `, [req.params.id, req.userId]);

    res.json(data.rows[0]); 
  }
  catch(err) {
    console.log(err);
    res.status(500).json({ error: err.message });  
  }
});

app.get('/api/recipes', async (req, res) => {
  try {
    // use our API Key
    
    // use superagent
    // call the real api
    const response = await request.get('https://tasty.p.rapidapi.com/recipes/list')
      .set({ 'x-rapidapi-key': process.env.TASTY_API_KEY })
      .set('Accept', 'application/json');
      // .query({ query: req.query.search });
    // console.log(response.body);
    // munge the data
    const recipes = formatRecipes(response.body);
    
    // send it back
    res.json(recipes);
  }
  catch(err) {
    console.log(err);
    res.status(500).send({ error: err });
  }
});

app.get('/api/recipes/:id', async (req, res) => {
  try {

    const response = await request.get(`https://tasty.p.rapidapi.com/recipes/detail?id=${req.params.id}`)
      .query({ api_key: process.env.TASTY_API_KEY });
    
    // munge the data
    const recipes = formatRecipes(response.body);
    
    // send it back
    res.json(recipes);
  }
  catch(err) {
    console.log(err);
    res.status(500).send({ error: err });
  }
});


export default app;