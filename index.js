const express = require("express");
require("dotenv").config();
const cors = require("cors");
const bodyParser = require("body-parser");
const {
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

} = require("./src/controllers/dataController.js");

const { sequelize } = require("./models");

const app = express();

app.use(express.json());
app.use(cors());
app.use(bodyParser.json());

app.get("/api/movies/search", getMovies);

app.post("/api/curated-lists", createCuratedList);

app.put("/api/curated-lists/:curatedListId", updateCuratedList);

app.post("/api/movies/watchlist", saveToWatchList);

app.post("/api/movies/wishlist", saveToWishList);

app.post("/api/movies/curatedlist", saveToCuratedList);

app.post("/api/movies/:movieId/reviews", addReviewAndRating)

app.get("/api/movies/searchByGenreAndActor", searchByGenreAndActor);

app.get("/api/movies/sort", sortByAttribute);

app.get("/api/movies/top5", getTopRatedMovies);


sequelize
  .authenticate()
  .then(() => {
    console.log("database connected.");
  })
  .catch((error) => {
    console.error("Unable to connect to a database", error);
  });

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});