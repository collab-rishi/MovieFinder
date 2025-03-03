
const axios = require("axios");
const { profile } = require("console");
require("dotenv").config();
const {
  curatedList: curatedListModel,
  curatedListItem: curatedListItemModel,
  movie: movieModel,
  review: reviewModel,
  watchlist: watchlistModel,
  wishlist: wishlistModel,
} = require("../../models");


// const axiosInstance = axios.create({
//     baseURL: process.env.MICROSERVICE_BASE_URL,
//     headers: {
//       Authorization: `Bearer ${process.env.API_KEY}`,
//     },
//   });


console.log("1a");



const searchMovies = async (searchTerm) => {
  const API_KEY = process.env.API_KEY;
  
    try {
        console.log(searchTerm);
      const response = await axios.get("https://api.themoviedb.org/3/search/movie", {
        params: {
          api_key: API_KEY,
          query: searchTerm, 
        },
        headers: {
          Authorization: `Bearer ${API_KEY}`,
        },
        
      });
      console.log("1c");
      // console.log(response.data);
      console.log("1d");

      if (response.data && response.data.results.length > 0) {
  
        // Extract relevant data from the response
        console.log("1e");
        const movieData = response.data.results.map((movie) => ({
          title: movie.title,
          tmdbId: movie.id,
          genre: movie.genre_ids.join(", "),  // Array of genre ids
          releaseYear: movie.release_date.split('-')[0], // Extract the release year
          rating: movie.vote_average,
          description: movie.overview,
          
          
        }));
        // console.log(movieData);
        
        return movieData;
        
        
      } else {
        // Handle the case where no images are found
        console.error("No movies found for the given query.");
        return [];
      }
    } catch (error) {
      console.error("Error fetching movies from tmdb:", error.message);
      throw new Error(
        "Error fetching data from tmdb. Please try again later."
      );
    }
  };

  const getActors = async (movieId) => {
    const API_KEY = process.env.API_KEY;
    try {
      const response = await axios.get(`https://api.themoviedb.org/3/movie/${movieId}/credits`, {
        params: {
          api_key: API_KEY 
        },
        headers: {
          Authorization: `Bearer ${API_KEY}`,
        },
    });

    const actors = response.data.cast
      .filter(actor => actor.known_for_department === 'Acting')
      .map(actor => actor.name)
      .slice(0, 5)
      .join(", ");
      

      return actors;

    } catch (error) {
      console.error('Error fetching actors data from TMDB API:', error);
      throw new Error('Unable to fetch actors from TMDB');
    }

   }; 

const movieExistsInDB = async (movieId) => {
  const movie = await movieModel.findOne({ where: { tmdbId: movieId } });
  // console.log(movie);
  return movie !== null;
}

// const movieExistsInDB = async (movieId) => {

//     const movieItem = await movieModel.findOne({ where: { tmdbId: movieId }});
//     console.log(movieItem);

//     if ( movieItem == null ) {

//     const API_KEY = process.env.API_KEY;

//     const response = await axios.get(`https://api.themoviedb.org/3/movie/${movieId}`, {
//       params: {
//         api_key: API_KEY, 
//       },
//       headers: {
//           Authorization: `Bearer ${API_KEY}`,
//         },
        
//       });

//       // console.log(response.data);

//          if (response.data) {
  
        
//          const movieDat = response.data.results.map((movie) => ({
//           title: movie.title,
//           tmdbId: movie.id,
//           genre: movie.genre_ids.join(", "),  // Array of genre ids
//           releaseYear: movie.release_date.split('-')[0], // Extract the release year
//           rating: movie.vote_average,
//           description: movie.overview,
          
          
//         }));
//         console.log(movieDat);
//         console.log("1f");
//         // return movieData;

//     }

// }
// }

const fetchMovieAndCastDetails = async (movieId) => {
  const movieDetailsUrl = `https://api.themoviedb.org/3/movie/${movieId}`;
  const movieCastUrl = `https://api.themoviedb.org/3/movie/${movieId}/credits`;
  console.log(movieId+"__");

  const API_KEY = process.env.API_KEY;

  try {    

    const movieResponse = await axios.get(movieDetailsUrl, {
      params: {
        api_key: API_KEY,
      },
      headers: {
        Authorization: `Bearer ${API_KEY}`,
      },
    });

    console.log("movieResponse: "+ movieResponse);

    const castResponse = await axios.get(movieCastUrl, {
      params: {
        api_key: API_KEY,
      },
      headers: {
        Authorization: `Bearer ${API_KEY}`,
      },
    });

    console.log("castResponse: "+castResponse.data);

    const movieData = movieResponse.data;
    console.log("movieData: "+ movieData);
    const castData = castResponse.data.cast.filter(actor => actor.known_for_department === 'Acting').map(actor => actor.name).slice(0, 5).join(', ');
    console.log("castData: "+ castData);

    
    const genres = movieData.genres.map(genre => genre.name).join(', ');

    return {
      title: movieData.title,
      genre: genres,
      actors: castData,
      releaseYear: movieData.release_date.split('-')[0], // Extract the release year
      rating: movieData.vote_average,
      description: movieData.overview,
    };
    
  } catch (error) {
    throw new Error('Error fetching data from TMDB');
    
  }


};




  module.exports = {
    searchMovies,
    getActors,
    movieExistsInDB,
    fetchMovieAndCastDetails
  };