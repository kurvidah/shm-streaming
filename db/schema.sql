USE shm_db;

CREATE TABLE users (
    user_id INTEGER AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('USER', 'MODERATOR', 'ADMIN') NOT NULL DEFAULT 'USER',
    gender VARCHAR(50),
    birthdate DATE,
    region CHAR(2), -- Use ISO 3166-1 alpha-2 country codes
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE subscription_plan (
    plan_id INTEGER AUTO_INCREMENT PRIMARY KEY,
    plan_name VARCHAR(255) NOT NULL,
    price FLOAT NOT NULL,
    max_devices INTEGER NOT NULL,
    hd_available BOOLEAN NOT NULL,
    ultra_hd_available BOOLEAN NOT NULL,
    duration_days INTEGER NOT NULL
);

CREATE TABLE user_subscription (
    user_subscription_id INTEGER AUTO_INCREMENT PRIMARY KEY,
    user_id INTEGER,
    plan_id INTEGER,
    start_date TIMESTAMP NOT NULL,
    end_date TIMESTAMP NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (plan_id) REFERENCES subscription_plan(plan_id) ON DELETE CASCADE
);

CREATE TABLE billing (
    billing_id INTEGER AUTO_INCREMENT PRIMARY KEY,
    user_subscription_id INTEGER,
    amount FLOAT NOT NULL,
    payment_method VARCHAR(100) NOT NULL,
    payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    due_date TIMESTAMP NOT NULL,
    payment_status VARCHAR(50) NOT NULL,
    FOREIGN KEY (user_subscription_id) REFERENCES user_subscription(user_subscription_id) ON DELETE CASCADE
);

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
    genre_description VARCHAR(100) NOT NULL,
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
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    watch_duration INTEGER NOT NULL, -- Watch duration in seconds
    PRIMARY KEY (user_id, media_id, timestamp),
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
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);