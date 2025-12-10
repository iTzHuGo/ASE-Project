-- init.sql

-- 1. Users Table (formerly Utilizador)
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'user', -- 'admin' or 'user'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Movies Table
CREATE TABLE IF NOT EXISTS movies (
    id SERIAL PRIMARY KEY,
    tmdb_id INT UNIQUE NOT NULL, -- Crucial: Link to external API
    title TEXT NOT NULL,
    release_date DATE,
    duration_min INT,
    synopsis TEXT,
    poster_path VARCHAR(255), -- TMDB uses 'poster_path'
    genre VARCHAR(100)
);

-- 3. Ratings Table
CREATE TABLE IF NOT EXISTS ratings (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    movie_id INT NOT NULL,
    rating_value INT CHECK (rating_value >= 1 AND rating_value <= 5),
    comment TEXT,
    rated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Constraints
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (movie_id) REFERENCES movies(id) ON DELETE CASCADE,
    UNIQUE(user_id, movie_id) -- A user can only rate a specific movie once
);

-- 4. Lists Table (e.g., Favorites, Watchlist)
CREATE TABLE IF NOT EXISTS lists (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 5. List_Movies (Many-to-Many Relationship)
CREATE TABLE IF NOT EXISTS list_movies (
    list_id INT NOT NULL,
    movie_id INT NOT NULL,
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    PRIMARY KEY (list_id, movie_id),
    FOREIGN KEY (list_id) REFERENCES lists(id) ON DELETE CASCADE,
    FOREIGN KEY (movie_id) REFERENCES movies(id) ON DELETE CASCADE
);

-- Note: 'tmdb_id' uses real IDs from TMDB for future compatibility.

INSERT INTO movies (tmdb_id, title, release_date, duration_min, synopsis, genre) VALUES 
(27205, 'Inception', '2010-07-16', 148, 'A thief who steals corporate secrets...', 'Sci-Fi'),
(603, 'The Matrix', '1999-03-31', 136, 'A computer hacker learns from mysterious rebels...', 'Action'),
(238, 'The Godfather', '1972-03-14', 175, 'Spanning the years 1945 to 1955...', 'Crime');

-- Example User (password needs to be hashed in real app, this is just for DB test)
INSERT INTO users (username, email, password_hash, role) VALUES 
('Alice', 'alice@example.com', 'hashed_secret', 'user'),
('Bob', 'bob@example.com', 'hashed_secret', 'user');

-- Example Rating
INSERT INTO ratings (user_id, movie_id, rating_value, comment) VALUES
(1, 1, 5, 'Mind-blowing movie!');