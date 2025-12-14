-- Table: users
CREATE TABLE IF NOT EXISTS users (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(512) NOT NULL,
    email VARCHAR(512) NOT NULL UNIQUE,
    password VARCHAR(512) NOT NULL,
    role VARCHAR(50) DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table: genre
CREATE TABLE IF NOT EXISTS genre (
    id BIGINT PRIMARY KEY, -- IDs from TMDB
    name VARCHAR(512) NOT NULL
);

-- Table: movies
CREATE TABLE IF NOT EXISTS movies (
    id BIGSERIAL PRIMARY KEY,
    tmdb_id BIGINT NOT NULL UNIQUE,
    title VARCHAR(512) NOT NULL,
    release_date DATE,
    duration_min BIGINT,
    synopsis TEXT,
    poster_path VARCHAR(512),
    genre_ids INT[] -- Cache array for frontend performance
);

-- Table: ratings
CREATE TABLE IF NOT EXISTS ratings (
    id BIGSERIAL PRIMARY KEY,
    rating_value BIGINT NOT NULL CHECK (rating_value BETWEEN 1 AND 5),
    comment VARCHAR(512),
    rated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    movie_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    
    FOREIGN KEY (movie_id) REFERENCES movies(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE (user_id, movie_id)
);

-- Table: list
CREATE TABLE IF NOT EXISTS list (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(512) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    user_id BIGINT NOT NULL,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Table: movie_genre
CREATE TABLE IF NOT EXISTS movie_genre (
    movie_id BIGINT,
    genre_id BIGINT,
    
    PRIMARY KEY (movie_id, genre_id),
    FOREIGN KEY (movie_id) REFERENCES movies(id) ON DELETE CASCADE,
    FOREIGN KEY (genre_id) REFERENCES genre(id) ON DELETE CASCADE
);

-- Table: list_movie
CREATE TABLE IF NOT EXISTS list_movie (
    list_id BIGINT,
    movie_id BIGINT,
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    PRIMARY KEY (list_id, movie_id),
    FOREIGN KEY (list_id) REFERENCES list(id) ON DELETE CASCADE,
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
    INSERT INTO list (user_id, name) VALUES (NEW.id, 'Favorites');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_new_user_setup
AFTER INSERT ON users
FOR EACH ROW
EXECUTE FUNCTION create_default_user_lists();


-- =============================================================
-- 2. SEED DATA
-- =============================================================

-- A. Insert Genres
INSERT INTO genre (id, name) VALUES 
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
(53, 'Thriller')
ON CONFLICT (id) DO NOTHING;

-- B. Insert Movies
INSERT INTO movies (tmdb_id, title, release_date, duration_min, synopsis, genre_ids) VALUES 
(27205, 'Inception', '2010-07-16', 148, 'A thief who steals corporate secrets...', '{878, 28, 12}'),
(603, 'The Matrix', '1999-03-31', 136, 'A computer hacker learns from mysterious rebels...', '{28, 878}'),
(238, 'The Godfather', '1972-03-14', 175, 'Spanning the years 1945 to 1955...', '{80, 18}');

-- C. Insert Users
INSERT INTO users (username, email, password, role) VALUES 
('Alice', 'alice@gmail.com', '$2b$10$f3WAfEyfuHTDaJPiHs1Th.N.3heOGAFDYt.lHKFlxV0mCnO26kCgG', 'user'),
('admin', 'admin@gmail.com', '$2b$10$f3WAfEyfuHTDaJPiHs1Th.N.3heOGAFDYt.lHKFlxV0mCnO26kCgG', 'admin'),
('Bob', 'bob@gmail.com', '$2b$10$f3WAfEyfuHTDaJPiHs1Th.N.3heOGAFDYt.lHKFlxV0mCnO26kCgG', 'user');

-- D. Insert Movie_Genre Relations (Essential for Backend Joins)
-- Inception (ID 1)
INSERT INTO movie_genre (movie_id, genre_id) VALUES (1, 878), (1, 28), (1, 12);
-- Matrix (ID 2)
INSERT INTO movie_genre (movie_id, genre_id) VALUES (2, 28), (2, 878);
-- Godfather (ID 3)
INSERT INTO movie_genre (movie_id, genre_id) VALUES (3, 80), (3, 18);

-- E. Insert Ratings
INSERT INTO ratings (user_id, movie_id, rating_value, comment) VALUES
(1, 1, 5, 'Mind-blowing movies!');

-- F. Insert into List_Movies
INSERT INTO list_movie (list_id, movie_id) VALUES (1, 1);