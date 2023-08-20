"use strict";
// import redis from 'redis';
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
// const client = redis?.createClient();
// export default client;
const redis_om_1 = require("redis-om");
/* pulls the Redis URL from .env */
const url = process.env.REDIS_URL;
/* create and open the Redis OM Client */
const client = () => __awaiter(void 0, void 0, void 0, function* () { return yield new redis_om_1.Client().open(url); });
exports.default = client;
