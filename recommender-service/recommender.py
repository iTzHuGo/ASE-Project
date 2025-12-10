import pandas as pd
from sklearn.metrics.pairwise import cosine_similarity
import json

global movies_df 
global similarities_genres

def similar_movies_recommendation(title, top_n=5):
    
    # Get the position (row number) of the movie, not the ID
    matching_movies = movies_df[movies_df['title'].str.contains(title, case=False)]
    
    if len(matching_movies) == 0:
        print(f"No movie found with title containing '{title}'")
        return None
    
    # Get position in the dataframe (for indexing the similarity matrix)
    movie_position = movies_df.index.get_loc(matching_movies.index[0])
    
    # Get similarity scores for this movie
    similarity_scores = list(enumerate(similarities_genres[movie_position]))

    # Sort by similarity (descending)
    similarity_scores = sorted(similarity_scores, key=lambda x: x[1], reverse=True)

    # Get top N similar movies (skip the first one, which is itself)
    movie_positions = [i[0] for i in similarity_scores[1:top_n+1]]

    # Return the titles
    recommended_movies = movies_df.iloc[movie_positions]['title']
    
    return recommended_movies



if __name__ == "__main__" :

    

    with open("movieData.json", "r", encoding='utf-8') as movieJsonFile:
        movie_data = json.load(movieJsonFile).get('results', [])
    
    movies_df = pd.DataFrame(movie_data).set_index('id')

    print(movies_df.head())
    print(f"\nTotal movies: {len(movies_df)}")

    # Transforma numa matriz em que os ids dos filmes sao 
    # o indice (colunas) e as colunas sao os ids do genero   
    genre_matrix = pd.get_dummies(movies_df['genre_ids'].apply(pd.Series).stack()).groupby(level=0).sum().astype(int)
    
    print("\nGenre Matrix:")
    print(genre_matrix.head())

    similarities_genres = cosine_similarity(genre_matrix)

    movie_name = input("Enter movie name:")
    print(similar_movies_recommendation(movie_name))
    





