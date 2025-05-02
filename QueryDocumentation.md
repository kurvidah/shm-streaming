# SQL Queries

## Movies

1. List all movies
   ```sql
   SELECT m.*, g.genre_name, media.*
   FROM movies m
   LEFT JOIN movie_genre mg ON m.movie_id = mg.movie_id
   LEFT JOIN genres g ON mg.genre_id = g.genre_id
   LEFT JOIN media ON m.movie_id = media.movie_id
   WHERE 1 = 1
   ```
   This is the baseline query that can be appended with additional filters
   - search
   ```sql
   AND (title LIKE {query} OR description_ LIKE {query} OR imdb_id LIKE {query})
   ```
   - genre
   ```sql
   AND g.genre_name LIKE {query}
   ```
   - release_year
   ```sql
   AND m.release_year = {query}
   ```
   - is_available
   ```sql
   AND m.is_available = ?
   ```
2. Get Movie by ID

   - Numeric ID

   ```sql
    -- If ID is numeric
    SELECT m.*, g.genre_name, media.*
    FROM movies m
    LEFT JOIN movie_genre mg ON m.movie_id = mg.movie_id
    LEFT JOIN genres g ON mg.genre_id = g.genre_id
    LEFT JOIN media ON m.movie_id = media.movie_id
    WHERE m.movie_id = ?

    -- If ID is slug
    SELECT m.*, g.genre_name, media.*
    FROM movies m
    LEFT JOIN movie_genre mg ON m.movie_id = mg.movie_id
    LEFT JOIN genres g ON mg.genre_id = g.genre_id
    LEFT JOIN media ON m.movie_id = media.movie_id
    WHERE LOWER(REPLACE(m.title, " ", "-")) = ?;
   ```

3. Add Movie
   ```sql
    INSERT INTO movies (title, poster, description, release_year, duration, is_available, tmdb_id) VALUES (?, ?, ?, ?, ?, ?, ?);
    INSERT INTO movie_genre (movie_id, genre_id) VALUES (?, ?);
   ```
   - if the genre specified does not exist
   ```sql
    INSERT INTO genres (name) VALUES (?);
   ```
4. Update Movie
   ```sql
    UPDATE movies
    SET title = ?, poster = ?, description = ?, release_year = ?, duration = ?, is_available = ?, tmdb_id = ?
    WHERE movie_id = ?;
   ```
   - if genre gets updated
   ```sql
    DELETE FROM movie_genre WHERE movie_id = ?;
    INSERT INTO genres (name) VALUES (?);
    INSERT INTO movie_genre (movie_id, genre_id) VALUES (?, ?);
   ```
5. Delete Movie
   Due to `CASCADE` constraint, we can delete the movie without dealing with referenced values from other tables.
   ```sql
   DELETE FROM movie WHERE movie_id = ?;
   ```
