-- 1. Users Table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
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
    genre_ids INT[]
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

-- 6. Genres_names Table
CREATE TABLE IF NOT EXISTS genre_names (
    id INT PRIMARY KEY,      -- TMDB Genre ID
    name VARCHAR(100) NOT NULL, -- Human-readable name
    UNIQUE(id)
);


-- TRIGGERS:
-- Function to create default lists automatically
CREATE OR REPLACE FUNCTION create_default_user_lists()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO lists (user_id, name) VALUES (NEW.id, 'Favorites');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_new_user_setup
AFTER INSERT ON users
FOR EACH ROW
EXECUTE FUNCTION create_default_user_lists();


-- ADD DATA:

INSERT INTO genre_names (id, name) VALUES 
(28, 'Action'),
(12, 'Adventure'),
(16, 'Animation'),
(35, 'Comedy'),
(80, 'Crime'),
(99, 'Documentary'),
(18, 'Drama'),
(14, 'Fantasy'),
(27, 'Horror'),
(878, 'Science Fiction'),
(53, 'Thriller');

-- 1. Insert Movies
INSERT INTO movies (tmdb_id, title, release_date, duration_min, synopsis, genre_ids) VALUES 
(27205, 'Inception', '2010-07-16', 148, 'A thief who steals corporate secrets...', '{878, 28, 12}'),
(603, 'The Matrix', '1999-03-31', 136, 'A computer hacker learns from mysterious rebels...', '{28, 878}'),
(238, 'The Godfather', '1972-03-14', 175, 'Spanning the years 1945 to 1955...', '{80, 18}');

-- 2. Insert Users with 'password' as the password
INSERT INTO users (username, email, password, role) VALUES 
('Alice', 'alice@gmail.com', '$2b$10$f3WAfEyfuHTDaJPiHs1Th.N.3heOGAFDYt.lHKFlxV0mCnO26kCgG', 'user'),
('admin', 'admin@gmail.com', '$2b$10$f3WAfEyfuHTDaJPiHs1Th.N.3heOGAFDYt.lHKFlxV0mCnO26kCgG', 'admin'),
('Bob', 'bob@gmail.com', '$2b$10$f3WAfEyfuHTDaJPiHs1Th.N.3heOGAFDYt.lHKFlxV0mCnO26kCgG', 'user');


-- 3. Insert Rating
INSERT INTO ratings (user_id, movie_id, rating_value, comment) VALUES
(1, 1, 5, 'Mind-blowing movie!');

-- 4. Insert into Lists
INSERT INTO list_movies (list_id, movie_id) VALUES (1, 1);