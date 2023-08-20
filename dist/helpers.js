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
exports.getActorByName = exports.getMovieWithCharacterNames = exports.getPeopleData = exports.getAllMoviesWithCharacterNames = void 0;
const axios = require('axios'); // You need to have axios installed
function getMovieData(movieUrl) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield axios.get(movieUrl);
            const movie = response.data;
            const characterNames = yield getCharacterNames(movie.characters);
            return Object.assign(Object.assign({}, movie), { characters: characterNames });
        }
        catch (error) {
            console.error(`Error fetching movie data from ${movieUrl}: ${error}`);
            return null;
        }
    });
}
function getCharacterNames(characterUrls) {
    return __awaiter(this, void 0, void 0, function* () {
        const characterNames = [];
        for (const url of characterUrls) {
            try {
                const characterResponse = yield axios.get(url);
                const characterName = characterResponse.data.name;
                characterNames.push(characterName);
            }
            catch (error) {
                console.error(`Error fetching character data from ${url}: ${error}`);
            }
        }
        return characterNames;
    });
}
function getAllMoviesWithCharacterNames() {
    return __awaiter(this, void 0, void 0, function* () {
        const moviesUrl = 'https://swapi.dev/api/films/';
        try {
            const response = yield axios.get(moviesUrl);
            const movies = response.data.results;
            const movieDataPromises = movies.map((movie) => getMovieData(movie.url));
            const movieData = yield Promise.all(movieDataPromises);
            return movieData;
        }
        catch (error) {
            console.error('Error:', error);
            console.error(`Error fetching Movies data from ${moviesUrl}: ${error}`);
            return [];
        }
    });
}
exports.getAllMoviesWithCharacterNames = getAllMoviesWithCharacterNames;
function getPeopleData() {
    return __awaiter(this, void 0, void 0, function* () {
        const peopleUrl = 'https://swapi.dev/api/people/';
        try {
            const response = yield axios.get(peopleUrl);
            const people = response.data;
            return Object.assign({}, people);
        }
        catch (error) {
            console.error(`Error fetching People data from ${peopleUrl}: ${error}`);
            return null;
        }
    });
}
exports.getPeopleData = getPeopleData;
function getMovieWithCharacterNames(movieId) {
    return __awaiter(this, void 0, void 0, function* () {
        const movieUrl = `https://swapi.dev/api/films/${movieId}`;
        try {
            const response = yield axios.get(movieUrl);
            const movie = response.data;
            const movieData = yield getMovieData(movie.url);
            return movieData;
        }
        catch (error) {
            console.error(`Error fetching Movie data from ${movieUrl}: ${error}`);
            return [];
        }
    });
}
exports.getMovieWithCharacterNames = getMovieWithCharacterNames;
function getActorByName(name) {
    return __awaiter(this, void 0, void 0, function* () {
        const peopleUrl = `https://swapi.dev/api/people/?search=${name}`;
        try {
            const response = yield axios.get(peopleUrl);
            const people = response.data.results;
            return people;
        }
        catch (error) {
            console.error(`Error fetching People data from ${peopleUrl}: ${error}`);
            return null;
        }
    });
}
exports.getActorByName = getActorByName;
