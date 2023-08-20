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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const helpers_1 = require("../helpers");
const express_1 = __importDefault(require("express"));
const middleware_1 = require("../middleware"); // Make sure to import the middleware
const apiRouter = express_1.default.Router();
apiRouter.get('/people', middleware_1.cacheData, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('Request received', { url: req.originalUrl });
    const key = req.originalUrl;
    let results;
    try {
        results = yield (0, helpers_1.getPeopleData)();
        const client = yield (0, middleware_1.connectRedisClient)();
        yield client.set(key, JSON.stringify(results), {
            EX: 180,
            NX: true,
        });
        res.send({
            fromCache: false,
            data: results,
        });
    }
    catch (error) {
        console.error(error);
        res.status(404).send("Data unavailable");
    }
}));
apiRouter.get('/films', middleware_1.cacheData, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('Request received', { url: req.originalUrl });
    const key = req.originalUrl;
    try {
        const results = yield (0, helpers_1.getAllMoviesWithCharacterNames)();
        // redisClient.set(req.originalUrl, JSON.stringify(response.data));
        const client = yield (0, middleware_1.connectRedisClient)();
        yield client.set(key, JSON.stringify(results), {
            EX: 180,
            NX: true,
        });
        res.send({
            fromCache: false,
            data: results,
        });
    }
    catch (error) {
        console.log("Error Reveived", error);
    }
}));
apiRouter.get('/films/:id', middleware_1.cacheData, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const key = req.originalUrl;
    if (!id) {
        res.status(400).send({ message: "Please enter a valid movie ID." });
    }
    const results = yield (0, helpers_1.getMovieWithCharacterNames)(parseInt(id));
    const client = yield (0, middleware_1.connectRedisClient)();
    yield client.set(key, JSON.stringify(results), {
        EX: 180,
        NX: true,
    });
    res.send({
        fromCache: false,
        data: results,
    });
}));
apiRouter.get('/people/:name', middleware_1.cacheData, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const key = req.originalUrl;
    const name = req.params.name;
    if (!name) {
        res.status(400).send({ message: "Please enter a name." });
    }
    const results = yield (0, helpers_1.getActorByName)(name);
    const client = yield (0, middleware_1.connectRedisClient)();
    yield client.set(key, JSON.stringify(results), {
        EX: 180,
        NX: true,
    });
    res.send({
        fromCache: false,
        data: results,
    });
}));
exports.default = apiRouter;
