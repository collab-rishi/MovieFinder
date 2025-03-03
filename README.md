# MS1 Assignment - Movie Management App

This is a movie management app that allows users to interact with movies using the TMDB API. Users can search for movies, save them to watchlists, wishlists, and curated lists, add reviews, and more.

## Project Overview

This application allows users to:

- Search for movies from TMDB using a query term.
- Save movies into personal lists (Watchlist, Wishlist, Curated Lists).
- Add reviews and ratings to movies.
- Search for movies by genre, actor, or director.
- Sort movies by rating or year of release.
- Track the top-rated movies with detailed reviews.

## Features

1. **Search Movies**: Users can search for movies using the TMDB API.
2. **Create and Manage Lists**: Users can create, update, and manage curated lists of movies.
3. **Add Reviews and Ratings**: Users can submit ratings and reviews for movies.
4. **Save Movies to Lists**: Users can add movies to their Watchlist, Wishlist, or Curated Lists.
5. **Search Movies by Genre and Actor**: Users can search their lists for movies by genre, actor, or director.
6. **Sort Movies**: Movies in lists can be sorted by rating or release year.
7. **Get Top 5 Movies by Rating**: Users can view the top 5 movies based on ratings with detailed reviews.

## Database Models

The app uses Sequelize ORM with SQLite to manage the following models:

1. **Movie**: Stores movie details (e.g., title, genre, release year, rating).
2. **Watchlist**: Stores movies added to a user's watchlist.
3. **Wishlist**: Stores movies added to a user's wishlist.
4. **CuratedList**: Stores curated lists of movies.
5. **Review**: Stores reviews and ratings for each movie.
6. **SearchHistory**: Logs the user's search queries.

## API Endpoints

### 1. **Search Movies**

- **Endpoint**: `GET /api/movies/search?query={query}`
- **Query Params**: `query` (search term)
- **Response**:
  ```json
  {
    "movies": [
      {
        "title": "Inception",
        "tmdbId": 27205,
        "genre": "Action, Science Fiction, Adventure",
        "actors": "Leonardo DiCaprio, Joseph Gordon-Levitt, Ken Watanabe",
        "releaseYear": 2010,
        "rating": 8.368,
        "description": "A skilled thief who commits corporate espionage by infiltrating the subconscious of his targets."
      }
    ]
  }
