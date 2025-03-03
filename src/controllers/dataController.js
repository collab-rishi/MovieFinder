const {
  searchMovies,
  getActors,
  movieExistsInDB,
  fetchMovieAndCastDetails,
} = require("../services/fileService.js");

const { generateSlug } = require("../utils/slugGenerator.js");

const { Op } = require("@sequelize/core");

const {
  curatedList: curatedListModel,
  curatedListItem: curatedListItemModel,
  movie: movieModel,
  review: reviewModel,
  watchlist: watchlistModel,
  wishlist: wishlistModel,
} = require("../../models");

const getMovies = async (req, res) => {
  try {
    const query = req.query.query;
    console.log(query);
    if (!query) {
      return res.status(400).json({ error: "Search term is required." });
    }
    console.log("b");
    const movies = await searchMovies(query);
    console.log("c");

    for (let movie of movies) {
      const actors = await getActors(movie.tmdbId);
      //  console.log(actors);
      movie.actors = actors;
    }

    return res.status(200).json({ movies: movies });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
};

const createCuratedList = async (req, res) => {
  try {
    const { name, description, slug } = req.body;

    const newCuratedList = await curatedListModel.create({
      name,
      description,
      slug,
    });
    console.log(newCuratedList);

    return res
      .status(201)
      .json({ message: "Curated list created successfully " });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const updateCuratedList = async (req, res) => {
  try {
    const curatedListId = req.params.curatedListId;
    const { name, description } = req.body;

    const list = await curatedListModel.findByPk(curatedListId);

    if (!list) {
      return res.status(404).json({ error: "Curated list not found" });
    }

    list.name = name || list.name;
    list.description = description || list.description;

    const newSlug = generateSlug(list.name);

    list.slug = newSlug;

    await list.save();

    res.json({
      message: "Curated list updated successfully.",
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const saveToWatchList = async (req, res) => {
  try {
    const { movieId } = req.body;
    console.log(movieId);

    const check = await movieExistsInDB(movieId);
    let movie;
    console.log(check);

    if (check == false) {
      const movieDetails = await fetchMovieAndCastDetails(movieId);
      // console.log(movieDetails);

      movie = await movieModel.create({
        tmdbId: movieId,
        title: movieDetails.title,
        genre: movieDetails.genre,
        actors: movieDetails.actors,
        releaseYear: movieDetails.releaseYear,
        rating: movieDetails.rating,
        description: movieDetails.description,
      });
      // console.log(movie);
    }

    await watchlistModel.create({
      movieId: movie.id,
    });

    return res.status(201).json({ message: "Movie added to Watchlist" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const saveToWishList = async (req, res) => {
  try {
    const { movieId } = req.body;
    console.log(movieId);

    const check = await movieExistsInDB(movieId);
    console.log(check);

    let movie = await movieModel.findOne({ where: { tmdbId: movieId } });

    if (check == false) {
      const movieDetails = await fetchMovieAndCastDetails(movieId);

      movie = await movieModel.create({
        tmdbId: movieId,
        title: movieDetails.title,
        genre: movieDetails.genre,
        actors: movieDetails.cast,
        releaseYear: movieDetails.releaseYear,
        rating: movieDetails.rating,
        description: movieDetails.description,
      });
    }

    await wishlistModel.create({
      movieId: movie.id,
    });

    return res.status(201).json({ message: "Movie added to Wishlist" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const saveToCuratedList = async (req, res) => {
  try {
    const { movieId } = req.body;
    console.log(movieId);
    let movie;

    const check = await movieExistsInDB(movieId);
    console.log(check);

    if (check == false) {
      const movieDetails = await fetchMovieAndCastDetails(movieId);

      movie = await movieModel.create({
        tmdbId: movieId,
        title: movieDetails.title,
        genre: movieDetails.genre,
        actors: movieDetails.cast,
        releaseYear: movieDetails.releaseYear,
        rating: movieDetails.rating,
        description: movieDetails.description,
      });
    }

    await curatedListModel.create({
      movieId: movie.id,
    });

    return res.status(201).json({ message: "Movie added to Curated List" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const addReviewAndRating = async (req, res) => {
  try {
    const movieId = req.params.movieId;
    console.log(movieId);

    const { rating, reviewText } = req.body;

    if (typeof rating !== "number" || rating < 0 || rating > 10) {
      return res
        .status(400)
        .json({ message: "Rating must be a number between 0 and 10." });
    }

    if (typeof reviewText !== "string" || reviewText.length > 500) {
      return res
        .status(400)
        .json({
          message: "Rating must be a string and no longer than 500 words.",
        });
    }

    const movie = await movieModel.findOne({ where: { tmdbId: movieId } });

    const review = await reviewModel.create({
      movieId: movie.id,
      rating: rating,
      reviewText: reviewText,
    });

    return res.status(201).json({ message: "Review added to Watchlist" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const searchByGenreAndActor = async (req, res) => {
  try {
  const genre = req.query.genre;
  const actor = req.query.actor;

  const movies = await movieModel.findAll({ 
    where: {
      genre: {
        [Op.like]: `%${genre}%`,  // Partial match on genre
      },
      actors: {
        [Op.like]: `%${actor}%`,  // Partial match on actors
      },
    }, 
  });
  // console.log(movie);

  return res.status(200).json({ movies: movies });
} catch (error) {
  console.error(error);
  return res.status(500).json({ error: error.message });
}

};

const sortByAttribute = async (req, res) => {

  try {

    const { list , order, sortBy } = req.query;

    if (order !== 'ASC' && order !== 'DESC') {
      return res.status(400).json({ message: 'Sort must be either ASC or DESC.' });
    }

    let listModel;

    if (list == "watchlist") {
      listModel = watchlistModel;

    } else if (list == "wishlist") {
      listModel = wishlistModel;

    } else if (list == "curatedList") {
      listModel = curatedListModel;

    }
    

    // step 1 - get all movieIds saved in the specified list
    // step 2 - fetch those movie details and then sort using order feature
    
    const sortedMovies = await listModel.findAll({
      include: [
        {
        model: movieModel,
        }
      ],
      order: [[movieModel, sortBy, order]]
     });


    return res.status(200).json({ movies: sortedMovies });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }



};

const getTopRatedMovies = async (req, res) => {

  try {

    let movies;

    movies = await movieModel.findAll({
      include: {
        model: reviewModel,
        attributes: ['reviewText'],
      },
      order: [["rating", "DESC"]],
      limit: 5,
        
    });


    const result = movies.map(movie => {
        const reviewWithWordcount = movie.reviews.map(review => {
          const wordcount = review.reviewText.split(/\s+/).length;
          return {
            review: review.reviewText,
            wordcount: wordcount
          };
        });
        return {
          title: movie.title,
          rating: movie.rating,
          review: reviewWithWordcount
        }
      });



    return res.status(200).json(result);

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }

};







module.exports = {
  getMovies,
  createCuratedList,
  updateCuratedList,
  saveToWatchList,
  saveToWishList,
  saveToCuratedList,
  addReviewAndRating,
  searchByGenreAndActor,
  sortByAttribute,
  getTopRatedMovies
};
