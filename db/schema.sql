USE shm_db;

CREATE TABLE users (
    user_id INTEGER AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('USER', 'MODERATOR', 'ADMIN') NOT NULL DEFAULT 'USER',
    gender VARCHAR(50),
    birthdate DATE,
    region CHAR(2), -- Use continent codes
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE subscription_plan (
    plan_id INTEGER AUTO_INCREMENT PRIMARY KEY,
    plan_name VARCHAR(255) NOT NULL,
    price FLOAT NOT NULL,
    max_devices INTEGER NOT NULL,
    hd_available BOOLEAN NOT NULL,
    ultra_hd_available BOOLEAN NOT NULL,
    duration_days INTEGER -- Nullable for indefinite plans
);

CREATE TABLE user_subscription (
    user_subscription_id INTEGER AUTO_INCREMENT PRIMARY KEY,
    user_id INTEGER,
    plan_id INTEGER DEFAULT 1, -- Default to Basic Plan
    start_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    end_date TIMESTAMP, -- Nullable for indefinite subscriptions
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (plan_id) REFERENCES subscription_plan(plan_id) ON DELETE CASCADE
);

CREATE TABLE billing (
    billing_id INTEGER AUTO_INCREMENT PRIMARY KEY,
    user_subscription_id INTEGER,
    amount FLOAT NOT NULL,
    payment_method VARCHAR(100),
    payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    due_date TIMESTAMP NOT NULL,
    payment_status ENUM('PENDING', 'COMPLETED', 'FAILED') NOT NULL DEFAULT 'PENDING',
    FOREIGN KEY (user_subscription_id) REFERENCES user_subscription(user_subscription_id) ON DELETE CASCADE
);

DELIMITER $$

CREATE TRIGGER update_billing_failed_status
BEFORE INSERT ON billing
FOR EACH ROW
BEGIN
    IF NEW.due_date < CURRENT_TIMESTAMP AND NEW.payment_status != 'COMPLETED' THEN
        SET NEW.payment_status = 'FAILED';
    END IF;
END$$

DELIMITER ;

CREATE TABLE movies (
    movie_id INTEGER AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    poster VARCHAR(255),
    description TEXT,
    release_year INTEGER,
    duration INTEGER,
    is_available BOOLEAN NOT NULL,
    imdb_id VARCHAR(20) UNIQUE
);

CREATE TABLE genres (
    genre_id INTEGER AUTO_INCREMENT PRIMARY KEY,
    genre_description VARCHAR(100),
    genre_name VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE movie_genre (
    movie_id INTEGER,
    genre_id INTEGER,
    PRIMARY KEY (movie_id, genre_id),
    FOREIGN KEY (movie_id) REFERENCES movies(movie_id) ON DELETE CASCADE,
    FOREIGN KEY (genre_id) REFERENCES genres(genre_id) ON DELETE CASCADE
);

CREATE TABLE media (
    media_id INTEGER AUTO_INCREMENT PRIMARY KEY,
    movie_id INTEGER,
    episode INTEGER,
    season INTEGER,
    description TEXT,
    upload_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    file_path VARCHAR(255),
    status ENUM('PENDING', 'APPROVED', 'REJECTED') NOT NULL,
    FOREIGN KEY (movie_id) REFERENCES movies(movie_id) ON DELETE CASCADE
);

CREATE TABLE watch_history (
    user_id INTEGER,
    media_id INTEGER,
    watched_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    watch_duration INTEGER NOT NULL DEFAULT 0, -- Watch duration in seconds
    PRIMARY KEY (user_id, media_id, watched_at),
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (media_id) REFERENCES media(media_id) ON DELETE CASCADE
);

CREATE TABLE reviews (
    review_id INTEGER AUTO_INCREMENT PRIMARY KEY,
    user_id INTEGER,
    movie_id INTEGER,
    media_id INTEGER,
    rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
    review_text VARCHAR(500),
    review_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (movie_id) REFERENCES movies(movie_id) ON DELETE CASCADE
);

CREATE TABLE device (
    device_id INTEGER AUTO_INCREMENT PRIMARY KEY,
    user_id INTEGER,
    device_type VARCHAR(100) NOT NULL,
    device_name VARCHAR(255) NOT NULL,
    registered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- INDEXING

-- For movie lookups and filters
CREATE INDEX idx_movies_release_year ON movies(release_year);
CREATE INDEX idx_movies_title ON movies(title);
CREATE INDEX idx_movies_imdb_id ON movies(imdb_id);

-- For joining reviews with movies
CREATE INDEX idx_reviews_movie_id ON reviews(movie_id);

-- For joining movie_genre and genres
CREATE INDEX idx_movie_genre_movie_id ON movie_genre(movie_id);
CREATE INDEX idx_movie_genre_genre_id ON movie_genre(genre_id);
CREATE INDEX idx_genres_genre_id ON genres(genre_id);

-- For joining media with movies and watch history
CREATE INDEX idx_media_movie_id ON media(movie_id);
CREATE INDEX idx_media_media_id ON media(media_id);
CREATE INDEX idx_watch_history_media_id ON watch_history(media_id);

-- For tracking watch history
CREATE INDEX idx_watch_history_user_id_media_id ON watch_history(user_id, media_id);

-- For users lookup
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);