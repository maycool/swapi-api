import express from 'express';
import {
  getAllMoviesWithCharacterNames,
  getPeopleData,
  getMovieWithCharacterNames,
  getActorByName
} from '../helpers';
import { cacheData, connectRedisClient } from '../middleware';

const apiRouter = express.Router();

/**
 * API Routes for Star Wars Information
 * Base path: /api
 */

/**
 * GET /api/people
 * Fetch information about people (characters) from the Star Wars universe.
 * Caches the response in Redis for future use.
 *
 * @middleware cacheData
 *
 * @returns {Object} Response object with people data
 */
apiRouter.get('/people', cacheData, async (req, res) => {
  console.log('Request received', { url: req.originalUrl });
  const key = req.originalUrl;
  try {
    // Fetch people data from the API or cache
    const results = await getPeopleData();

    // Store data in Redis cache
    const client = await connectRedisClient();
    await client.set(key, JSON.stringify(results), {
      EX: 180, // Cache for 180 seconds
      NX: true // Set only if the key does not exist
    });

    res.send({
      fromCache: false,
      data: results
    });
  } catch (error) {
    console.error(error);
    res.status(404).send('Data unavailable');
  }
});

/**
 * GET /api/films
 * Fetch information about films from the Star Wars universe, including character names.
 * Caches the response in Redis for future use.
 *
 * @middleware cacheData
 *
 * @returns {Object} Response object with films data
 */
apiRouter.get('/films', cacheData, async (req, res) => {
  console.log('Request received', { url: req.originalUrl });
  const key = req.originalUrl;
  try {
    // Fetch films data from the API or cache
    const results = await getAllMoviesWithCharacterNames();

    // Store data in Redis cache
    const client = await connectRedisClient();
    await client.set(key, JSON.stringify(results), {
      EX: 180, // Cache for 180 seconds
      NX: true // Set only if the key does not exist
    });

    res.send({
      fromCache: false,
      data: results
    });
  } catch (error) {
    console.log('Error Received', error);
    res.status(500).send('Internal Server Error');
  }
});

/**
 * GET /api/films/:id
 * Fetch information about a specific film from the Star Wars universe, including character names.
 * Caches the response in Redis for future use.
 *
 * @middleware cacheData
 *
 * @param {number} id - The ID of the film
 * @returns {Object} Response object with film data
 */
apiRouter.get('/films/:id', cacheData, async (req, res) => {
  const id = req.params.id;
  const key = req.originalUrl;
  if (!id) {
    res.status(400).send({ message: 'Please enter a valid movie ID.' });
  }
  try {
    // Fetch film data from the API or cache
    const results = await getMovieWithCharacterNames(parseInt(id));

    // Store data in Redis cache
    const client = await connectRedisClient();
    await client.set(key, JSON.stringify(results), {
      EX: 180, // Cache for 180 seconds
      NX: true // Set only if the key does not exist
    });

    res.send({
      fromCache: false,
      data: results
    });
  } catch (error) {
    console.log('Error Received', error);
    res.status(500).send('Internal Server Error');
  }
});

/**
 * GET /api/people/:name
 * Fetch information about a specific actor (person) from the Star Wars universe.
 * Caches the response in Redis for future use.
 *
 * @middleware cacheData
 *
 * @param {string} name - The name of the actor
 * @returns {Object} Response object with actor data
 */
apiRouter.get('/people/:name', cacheData, async (req, res) => {
  const key = req.originalUrl;
  const name = req.params.name;
  if (!name) {
    res.status(400).send({ message: 'Please enter a name.' });
  }
  try {
    // Fetch actor data from the API or cache
    const results = await getActorByName(name);

    // Store data in Redis cache
    const client = await connectRedisClient();
    await client.set(key, JSON.stringify(results), {
      EX: 180, // Cache for 180 seconds
      NX: true // Set only if the key does not exist
    });

    res.send({
      fromCache: false,
      data: results
    });
  } catch (error) {
    console.log('Error Received', error);
    res.status(500).send('Internal Server Error');
  }
});

export default apiRouter;
