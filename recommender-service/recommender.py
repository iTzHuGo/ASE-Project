import pandas as pd
from sklearn.metrics.pairwise import cosine_similarity
import json

global movies_df 
global similarities_genres

def similar_movies_recommendation(title, top_n=5):


    '''
    Docstring for similar_movies_recommendation

    Esta função gere filmes recomendados baseado em outro filme.
    É efectuado um cossine similarity de um data frame que contrém os filmes e os genéros
    Ex:
     id | gen1 | gen 2 | gen 3 | ... | gen n
    | 01 | 1   |   0   |  0   |  ... |  1
    | 02 | 0   |   1   |  0   |  ... |  0
    | 03 | 0   |   1   |  1   |  ... |  0
    | 04 | 1   |   0   |  1   |  ... |  0

    Significa que: ID01 é do genero: gen1, gen n; ID02 : gen2; ID03: gen2,gen3; ID04: gen1, gen3

    Para esta tabela, aplica-se a si mesma o cossine similarity, devolve o quao parecidos sao os filmes entre si. 
    Ordena-se a linha do filme com o nome em `title` e vai se buscar o 2o elemento ate top_n elementos. O primeiro elemento será sempre ele próprio
    
    :param title: Movie title to search for similar movies
    :param movies_df: All movies dataframe
    :param top_n: Defaults to 5. Defines the number of movies to output
    '''

    matching_movies = movies_df[movies_df['title'].str.contains(title, case=False)]
    
    if len(matching_movies) == 0:
        print(f"No movie found with title containing '{title}'")
        return None
    

    genre_matrix = pd.get_dummies(movies_df['genre_ids'].apply(pd.Series).stack()).groupby(level=0).sum().astype(int)

    similarities_genres = cosine_similarity(genre_matrix)

    print(similarities_genres)
   
    movie_position = movies_df.index.get_loc(matching_movies.index[0])
        
    similarity_scores = list(enumerate(similarities_genres[movie_position]))
    
    similarity_scores = sorted(similarity_scores, key=lambda x: x[1], reverse=True)

    movie_positions = [i[0] for i in similarity_scores[1:top_n+1]]

    recommended_movies = movies_df.iloc[movie_positions]['title']

    
    return recommended_movies


def user_based_recommendation(userID, userMoviesReviews, top_n=5):
    '''
    Docstring for user_based_recommendation

    Esta função irá gerar filmes recomendados a um utilizador. 

    Irá utilizar um algoritmo baeado no cosine similarity.
    Será gerado um pseudo-filme, tendo em conta os géneros dos filmes que o user deu review, e o valor da sua review (0-5 estrelas).
    Utilizando esse pseudo-filme, faremos a cosine_similarity com todos os filmes na data base.
    O output será uma lista de IDs de filmes para recomendar.
    
    :param userID: ID do utilizador
    :param userMoviesReviews: lista de filmes que o utilizador userID deu review
    :param top_n: Default = 5. Escolhe quantos filmes sugerir ao utilizador
    '''

    # Criar um dataFrame dos userMoviesReviews

    userMoviesReviews_df = pd.DataFrame(userMoviesReviews).set_index('id')

    # Criar um average userMoviesReviews tendo em conta a media dos ratings
    
    # Cria um dicionario com keys de genero ID adicionado +1 por cada filme que o tenha
    average_movie_genre = dict()
    for movie in userMoviesReviews:
        for genre in movie['genre_ids']:
            average_movie_genre[genre] = average_movie_genre.get(genre,0) + 1

    # TODO Decidir quanto vale o género tendo em conta que rating obteve

    # Faz o average
    for genre in average_movie_genre:
        average_movie_genre[genre] = average_movie_genre.get(genre)/len(userMoviesReviews)


    average_movie_genre_df = pd.DataFrame([average_movie_genre])
    average_movie_genre_df.index([-1])
    
    usermovies_matrix = pd.get_dummies(usermovies_matrix['genre_ids'].apply(pd.Series).stack()).groupby(level=0).sum().astype(int)
    average_movie_matrix = pd.get_dummies
    # Aplicar o pd.dummies a esse average
    # Fazer o cosine similarity com o average user movie
    # Devolver o top_n filmes em relacao ao 


    return []


if __name__ == "__main__" :



    with open("movieData.json", "r", encoding='utf-8') as movieJsonFile:
        movie_data = json.load(movieJsonFile).get('results', [])
    
    movies_df = pd.DataFrame(movie_data).set_index('id')

    print(movies_df.head())
    print(f"\nTotal movies: {len(movies_df)}")

    # Transforma numa matriz em que os ids dos filmes sao 
    # o indice (colunas) e as colunas sao os ids do genero   
    
    


    movie_name = input("Enter movie name:")
    print(similar_movies_recommendation(movie_name))
    





