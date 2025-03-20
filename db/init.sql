CREATE TABLE roles (
    role_id INTEGER PRIMARY KEY,
    role_name VARCHAR(100) NOT NULL
);

-- Insert sample roles
INSERT INTO roles (role_id, role_name)
VALUES
(1, 'Admin'),
(2, 'Moderator'),
(3, 'User');

CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role_id INTEGER DEFAULT 3 REFERENCES roles(role_id),
    gender VARCHAR(50),
    age INTEGER,
    religion VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample users
INSERT INTO users (user_id, username, email, password, role_id, gender, age, religion, created_at)
VALUES
(1, 'admin', 'admin@shm.app', '$2y$10$DIRJgsc.nuXFW3Z7xBMPiO3ZHuvctx/Kp1QbSYaz4sAu.djwNXGmO', 1, NULL, NULL, NULL, '2025-01-01 00:00:00'),
(2, 'mod', 'mod@shm.app', '$2y$10$p/wXLYeKnDtcb2LqoQJA6OLJq/mXO.CmfDKx67NCPq6tO7gR0AVN2 ', 2, NULL, NULL, NULL, '2025-02-20 12:30:00'),
(3, 'bob_jones', 'bob.jones@example.com', 'password123', 3, 'Male', 35, 'Hindu', '2025-01-15 08:00:00');

CREATE TABLE subscription_plan (
    plan_id INTEGER PRIMARY KEY,
    plan_name VARCHAR(255) NOT NULL,
    price FLOAT NOT NULL,
    max_devices INTEGER NOT NULL,
    hd_available BOOLEAN NOT NULL,
    ultra_hd_available BOOLEAN NOT NULL,
    duration_days INTEGER NOT NULL
);

-- Insert sample subscription plans
INSERT INTO subscription_plan (plan_id, plan_name, price, max_devices, hd_available, ultra_hd_available, duration_days)
VALUES
(1, 'Basic Plan', 9.99, 1, TRUE, FALSE, 30),
(2, 'Standard Plan', 14.99, 3, TRUE, TRUE, 30),
(3, 'Premium Plan', 19.99, 5, TRUE, TRUE, 30);

CREATE TABLE user_subscription (
    user_subscription_id INTEGER PRIMARY KEY,
    user_id INTEGER,
    plan_id INTEGER,
    start_date TIMESTAMP NOT NULL,
    end_date TIMESTAMP NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (plan_id) REFERENCES subscription_plan(plan_id)
);

-- Insert sample user subscriptions
INSERT INTO user_subscription (user_subscription_id, user_id, plan_id, start_date, end_date)
VALUES
(1, 1, 2, '2025-03-01 10:00:00', '2025-03-31 10:00:00'),
(2, 2, 1, '2025-02-20 12:30:00', '2025-03-20 12:30:00'),
(3, 3, 3, '2025-01-15 08:00:00', '2025-02-14 08:00:00');

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

-- Insert sample billings
INSERT INTO billing (billing_id, user_subscription_id, amount, payment_method, payment_date, due_date, payment_status)
VALUES
(1, 1, 14.99, 'Credit Card', '2025-03-01 10:00:00', '2025-03-15 10:00:00', 'Paid'),
(2, 2, 9.99, 'PayPal', '2025-02-20 12:30:00', '2025-03-05 12:30:00', 'Unpaid'),
(3, 3, 19.99, 'Credit Card', '2025-01-15 08:00:00', '2025-02-01 08:00:00', 'Paid');

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

-- Insert sample movies
INSERT INTO movies (movie_id, title, poster, description, release_year, genre, duration, is_available, imdb_id)
VALUES
(1, 'The Matrix', 'https://m.media-amazon.com/images/M/MV5BN2NmN2VhMTQtMDNiOS00NDlhLTliMjgtODE2ZTY0ODQyNDRhXkEyXkFqcGc@._V1_SX300.jpg', 'A hacker discovers the world is a simulation.', 1999, 'Sci-Fi', 136, TRUE, 'tt0133093'),
(2, 'Inception', 'https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg', 'A thief who steals corporate secrets through the use of dream-sharing technology.', 2010, 'Sci-Fi', 148, TRUE, 'tt1375666'),
(3, 'The Godfather', 'https://m.media-amazon.com/images/M/MV5BNGEwYjgwOGQtYjg5ZS00Njc1LTk2ZGEtM2QwZWQ2NjdhZTE5XkEyXkFqcGc@._V1_SX300.jpg', 'The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.', 1972, 'Crime', 175, TRUE, 'tt0068646');

CREATE TABLE watch_history (
    user_id INTEGER,
    movie_id INTEGER,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    watch_duration INTEGER NOT NULL,
    PRIMARY KEY (user_id, movie_id, timestamp),
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (movie_id) REFERENCES movies(movie_id)
);

-- Insert sample watch history
INSERT INTO watch_history (user_id, movie_id, timestamp, watch_duration)
VALUES
(1, 1, '2025-03-02 14:00:00', 120),
(2, 2, '2025-02-21 16:00:00', 148),
(3, 3, '2025-01-20 19:00:00', 175);

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

-- Insert sample reviews
INSERT INTO reviews (review_id, user_id, movie_id, rating, review_text, review_date)
VALUES
(1, 1, 1, 5, 'Amazing movie, mind-blowing concept!', '2025-03-02 16:00:00'),
(2, 2, 2, 4, 'Great movie, but the ending was confusing.', '2025-02-21 18:00:00'),
(3, 3, 3, 5, 'A classic, the best film of all time.', '2025-01-20 20:00:00');

CREATE TABLE device (
    device_id INTEGER PRIMARY KEY,
    user_id INTEGER,
    device_type VARCHAR(100) NOT NULL,
    device_name VARCHAR(255) NOT NULL,
    registered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

-- Insert sample devices
INSERT INTO device (device_id, user_id, device_type, device_name, registered_at)
VALUES
(1, 1, 'Phone', 'iPhone 12', '2025-03-01 10:30:00'),
(2, 2, 'Laptop', 'MacBook Pro', '2025-02-20 13:00:00'),
(3, 3, 'TV', 'Samsung Smart TV', '2025-01-18 09:00:00');

CREATE TABLE media (
    media_id INTEGER PRIMARY KEY,
    movie_id INTEGER,
    episode INTEGER,
    description TEXT,
    FOREIGN KEY (movie_id) REFERENCES movies(movie_id)
);

-- Insert sample media (for TV shows or episodes)
INSERT INTO media (media_id, movie_id, episode, description)
VALUES
(1, 2, 1, 'Episode 1: Dream Extraction'),
(2, 2, 2, 'Episode 2: The Heist'),
(3, 2, 3, 'Episode 3: The Finale');