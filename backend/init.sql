-- 1. Users Table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'user', -- 'admin' or 'user'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Movies Table (Cache/Reference for TMDB)
CREATE TABLE IF NOT EXISTS movies (
    id SERIAL PRIMARY KEY,
    tmdb_id INT UNIQUE NOT NULL, -- Crucial: Link to external API
    title TEXT NOT NULL,
    release_date DATE,
    duration_min INT,
    synopsis TEXT,
    poster_path VARCHAR(255),
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
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (movie_id) REFERENCES movies(id) ON DELETE CASCADE,
    UNIQUE(user_id, movie_id) -- A user can only rate a specific movie once
);

-- 4. Lists Table
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


-- AUTOMATION (TRIGGERS)
-- Function to create default lists automatically
CREATE OR REPLACE FUNCTION create_default_user_lists()
RETURNS TRIGGER AS $$
BEGIN
    -- Cria lista 'Favorites'
    INSERT INTO lists (user_id, name) VALUES (NEW.id, 'Favorites');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger: Runs every time a new user is inserted
CREATE TRIGGER trigger_new_user_setup
AFTER INSERT ON users
FOR EACH ROW
EXECUTE FUNCTION create_default_user_lists();

-- ==========================================
-- ADD DATA

-- 1. Insert Movies
INSERT INTO movies (tmdb_id, title, release_date, duration_min, synopsis, genre) VALUES 
(27205, 'Inception', '2010-07-16', 148, 'A thief who steals corporate secrets...', 'Sci-Fi'),
(603, 'The Matrix', '1999-03-31', 136, 'A computer hacker learns from mysterious rebels...', 'Action'),
(238, 'The Godfather', '1972-03-14', 175, 'Spanning the years 1945 to 1955...', 'Crime');

-- 2. Insert Users 
INSERT INTO users (username, email, password_hash, role) VALUES 
('Alice', 'alice@gmail.com', 'hashed_secret', 'user'),
('Bob', 'bob@gmail.com', 'hashed_secret', 'user');

-- 3. Insert Rating
INSERT INTO ratings (user_id, movie_id, rating_value, comment) VALUES
(1, 1, 5, 'Mind-blowing movie!');

-- 4. Insert into Lists (Demonstration)
-- Alice (User 1) puts Inception (Movie 1) in her Favorites (List 1 - created by trigger)
INSERT INTO list_movies (list_id, movie_id) VALUES (1, 1);