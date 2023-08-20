import { createClient } from 'redis';


export const connectRedisClient = async () => {
  console.log('Connecting to Redis...');

  const client = createClient();
  client.on('error', err => console.log('Redis Client Error', err));
  await client.connect();

  return client;
};

export async function cacheData(req: any, res: any, next: any) {
  const redisClient = await connectRedisClient();

  const key = req.originalUrl;
  let results;
  try {
    const cacheResults = await redisClient.get(key);
    if (cacheResults) {
      results = JSON.parse(cacheResults);
      res.send({
        fromCache: true,
        data: results,
      });
    } else {
      next();
    }
  } catch (error) {
    console.error(error);
    res.status(404);
  }
}