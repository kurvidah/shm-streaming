USE shmdb;

CREATE TABLE users (
    user_id INTEGER AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role_id INTEGER DEFAULT 1 REFERENCES roles(role_id),
    gender VARCHAR(50),
    age INTEGER,
    religion VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE roles (
    role_id INTEGER PRIMARY KEY,
    role_name VARCHAR(100) NOT NULL
);

CREATE TABLE subscription_plan (
    plan_id INTEGER PRIMARY KEY,
    plan_name VARCHAR(255) NOT NULL,
    price FLOAT NOT NULL,
    max_devices INTEGER NOT NULL,
    hd_available BOOLEAN NOT NULL,
    ultra_hd_available BOOLEAN NOT NULL,
    duration_days INTEGER NOT NULL
);

CREATE TABLE user_subscription (
    user_subscription_id INTEGER PRIMARY KEY,
    user_id INTEGER,
    plan_id INTEGER,
    start_date TIMESTAMP NOT NULL,
    end_date TIMESTAMP NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (plan_id) REFERENCES subscription_plan(plan_id)
);

CREATE TABLE billing (
    billing_id INTEGER PRIMARY KEY,
    user_subscription_id INTEGER,
    amount FLOAT NOT NULL,
    payment_method VARCHAR(100) NOT NULL,
    payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    due_date TIMESTAMP NOT NULL,
    payment_status VARCHAR(50) NOT NULL,
    FOREIGN KEY (user_subscription_id) REFERENCES user_subscription(user_subscription_id)
);

CREATE TABLE movies (
    movie_id INTEGER PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    poster VARCHAR(255),
    description TEXT,
    release_year INTEGER,
    genre VARCHAR(100),
    duration INTEGER,
    is_available BOOLEAN NOT NULL,
    imdb_id VARCHAR(20) UNIQUE
);

CREATE TABLE watch_history (
    user_id INTEGER,
    movie_id INTEGER,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    watch_duration INTEGER NOT NULL,
    PRIMARY KEY (user_id, movie_id, timestamp),
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (movie_id) REFERENCES movies(movie_id)
);

CREATE TABLE reviews (
    review_id INTEGER PRIMARY KEY,
    user_id INTEGER,
    movie_id INTEGER,
    rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
    review_text VARCHAR(500),
    review_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (movie_id) REFERENCES movies(movie_id)
);

CREATE TABLE device (
    device_id INTEGER PRIMARY KEY,
    user_id INTEGER,
    device_type VARCHAR(100) NOT NULL,
    device_name VARCHAR(255) NOT NULL,
    registered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

CREATE TABLE media (
    media_id INTEGER PRIMARY KEY,
    movie_id INTEGER,
    episode INTEGER,
    description TEXT,
    FOREIGN KEY (movie_id) REFERENCES movies(movie_id)
);