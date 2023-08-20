"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cacheData = exports.connectRedisClient = void 0;
const redis_1 = require("redis");
const connectRedisClient = () => __awaiter(void 0, void 0, void 0, function* () {
    console.log('Connecting to Redis...');
    const client = (0, redis_1.createClient)();
    client.on('error', err => console.log('Redis Client Error', err));
    yield client.connect();
    return client;
});
exports.connectRedisClient = connectRedisClient;
function cacheData(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const redisClient = yield (0, exports.connectRedisClient)();
        const key = req.originalUrl;
        let results;
        try {
            const cacheResults = yield redisClient.get(key);
            if (cacheResults) {
                results = JSON.parse(cacheResults);
                res.send({
                    fromCache: true,
                    data: results,
                });
            }
            else {
                next();
            }
        }
        catch (error) {
            console.error(error);
            res.status(404);
        }
    });
}
exports.cacheData = cacheData;
