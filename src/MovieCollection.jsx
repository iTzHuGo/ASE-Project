const genresAry = ["Action", "Adventure", "Animation", "Comedy", "Crime", "Documentary", "Drama", "Family", "Fantasy", "History", "Horror", "Music", "Mystery", "Romance", "Science Fiction", "TV Movie", "Thriller", "War", "Western"]
let index = 0

{genresAry.map(genre => 
  <MovieCollection 
    movies={this.genreFilter(genre)}
    key={index++}
    genreName={genre}
  />
)}

genreFilter = (genreSearch) => {
  const movies = this.state.movies.slice(0)
  return movies.filter(movie => movie.genres.includes(genreSearch))
}