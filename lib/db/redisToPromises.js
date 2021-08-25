const { promisify } = require("util");
const redisClient = require('../redis');

const getAsync = promisify(redisClient.get).bind(redisClient);
const setAsync = promisify(redisClient.set).bind(redisClient);
const msetAsync = promisify(redisClient.mset).bind(redisClient);
const mgetAsync = promisify(redisClient.mget).bind(redisClient);
const zaddAsync = promisify(redisClient.zadd).bind(redisClient);
const zrangebyscoreAsync = promisify(redisClient.zrangebyscore).bind(redisClient);
const zremAsync = promisify (redisClient.zrem).bind(redisClient);
const scanAsync = promisify(redisClient.scan).bind(redisClient);
const keysAsync = promisify(redisClient.keys).bind(redisClient);
const incrbyAsync = promisify (redisClient.incrby).bind(redisClient);

module.exports = {
    getAsync,
    setAsync,
    msetAsync,
    mgetAsync,
    zaddAsync,
    zrangebyscoreAsync,
    zremAsync,
    scanAsync,
    keysAsync,
    incrbyAsync
}