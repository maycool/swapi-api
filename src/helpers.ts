const axios = require('axios');

interface MovieData {
  title: string;
  episode_id: number;
  opening_crawl: string;
  director: string;
  producer: string;
  release_date: string;
  characters: string[];
  planets: string[];
  starships: string[];
  vehicles: string[];
  species: string[];
  created: string;
  edited: string;
  url: string;
}

async function getMovieData(movieUrl:string) {
  try {
    const response = await axios.get(movieUrl);
    const movie:MovieData = response.data;
    const characterNames = await getCharacterNames(movie.characters);
    
    return {
      ...movie,
      characters: characterNames
    };
  } catch (error) {
    console.error(`Error fetching movie data from ${movieUrl}: ${error}`);
    return null;
  }
}

async function getCharacterNames(characterUrls:string[]) {
  const characterNames = [];

  for (const url of characterUrls) {
    try {
      const characterResponse = await axios.get(url);
      const characterName = characterResponse.data.name;
      characterNames.push(characterName);
    } catch (error) {
      console.error(`Error fetching character data from ${url}: ${error}`);
    }
  }

  return characterNames;
}

export async function getAllMoviesWithCharacterNames() {
  const moviesUrl = 'https://swapi.dev/api/films/';
  try {
    const response = await axios.get(moviesUrl);
    const movies = response.data.results;

    const movieDataPromises = movies.map((movie:MovieData) => getMovieData(movie.url));
    const movieData = await Promise.all(movieDataPromises);

    return movieData;
  } catch (error) {
    console.error('Error:', error);
    console.error(`Error fetching Movies data from ${moviesUrl}: ${error}`);

    return [];
  }
}

export async function getPeopleData() {
  const peopleUrl = 'https://swapi.dev/api/people/';
  try {
    const response = await axios.get(peopleUrl);
    const people = response.data;
    
    return {
      ...people,
    };
  } catch (error) {
    console.error(`Error fetching People data from ${peopleUrl}: ${error}`);
    return null;
  }
}

export async function getMovieWithCharacterNames(movieId: number) {
  const movieUrl = `https://swapi.dev/api/films/${movieId}`;
  try {
    const response = await axios.get(movieUrl);
    const movie = response.data;

    const movieData = await getMovieData(movie.url);

    return movieData;
  } catch (error) {
    console.error(`Error fetching Movie data from ${movieUrl}: ${error}`);
    return [];
  }
}

export async function getActorByName(name:string) {
  const peopleUrl = `https://swapi.dev/api/people/?search=${name}`;
  try {
    const response = await axios.get(peopleUrl);
    const people = response.data.results;
    
    return people;
  } catch (error) {
    console.error(`Error fetching People data from ${peopleUrl}: ${error}`);
    return null;
  }
}