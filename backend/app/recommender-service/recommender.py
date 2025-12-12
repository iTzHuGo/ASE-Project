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

    autor: miguel pereira
    metodo: manual coding
    fonte do algoritmo:  https://medium.com/@prateekgaurav/step-by-step-content-based-recommendation-system-823bbfd0541c
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

    autor: miguel pereira & ai assitent
    metodo: ai-assited
    descricao: esta feature baseia-se na de total autoria minha, foi utilizado assistencia de AI apenas para acelerar o processo, 
    visto que estava ele todo feito, já
    '''

    if not userMoviesReviews or len(userMoviesReviews) == 0:
        print(f"User {userID} has no movie reviews")
        return pd.DataFrame()
    
    # Criar um dicionário de genres 
    genre_weighted_scores = {}
    
    for movie in userMoviesReviews:
        rating = movie.get('rating', 0)
        genres = movie.get('genre_ids', [])
        
        for genre_id in genres:
            if genre_id not in genre_weighted_scores:
                genre_weighted_scores[genre_id] = 0
            # Multiplicar cada género pelo rating do filme
            genre_weighted_scores[genre_id] += rating
    
    # Normalizar os scores (dividir pelo número de filmes que contêm cada género)
    genre_count = {}
    for movie in userMoviesReviews:
        for genre_id in movie.get('genre_ids', []):
            genre_count[genre_id] = genre_count.get(genre_id, 0) + 1
    
    for genre_id in genre_weighted_scores:
        genre_weighted_scores[genre_id] = genre_weighted_scores[genre_id] / genre_count[genre_id]
    
    # Escolher os top 3 géneros
    sorted_genres = sorted(genre_weighted_scores.items(), key=lambda x: x[1], reverse=True)
    top_3_genres = [genre_id for genre_id, score in sorted_genres[:3]]
    
    print(f"User {userID} top 3 genres: {top_3_genres}")
    print(f"Genre scores: {dict(sorted_genres[:3])}")
    
    # Criar matriz de géneros para todos os filmes
    genre_matrix = pd.get_dummies(
        movies_df['genre_ids'].apply(pd.Series).stack()
    ).groupby(level=0).sum().astype(int)
    
    # Criar pseudo-filme com os top 3 géneros
    # Inicializar com zeros para todos os géneros
    pseudo_movie = pd.Series(0, index=genre_matrix.columns)
    
    # Marcar com 1 apenas os top 3 géneros
    for genre_id in top_3_genres:
        if genre_id in pseudo_movie.index:
            pseudo_movie[genre_id] = 1
    
    # Fazer reshape para formato correto (1 linha)
    pseudo_movie_matrix = pseudo_movie.values.reshape(1, -1)
    
    # Calcular cosine similarity entre pseudo-filme e todos os filmes
    similarities = cosine_similarity(pseudo_movie_matrix, genre_matrix)[0]
    
    # Ordenar por similaridade
    similarity_scores = list(enumerate(similarities))
    similarity_scores = sorted(similarity_scores, key=lambda x: x[1], reverse=True)
    
    # Filtrar filmes que o user já avaliou
    rated_movie_ids = [movie['id'] for movie in userMoviesReviews]
    
    # Obter top_n filmes (excluindo os já avaliados)
    recommended_positions = []
    for position, score in similarity_scores:
        movie_id = movies_df.iloc[position].name  # name é o index (id)
        if movie_id not in rated_movie_ids and score > 0:  # score > 0 garante alguma similaridade
            recommended_positions.append(position)
            if len(recommended_positions) >= top_n:
                break
    
    # Retornar filmes recomendados
    recommended_movies = movies_df.iloc[recommended_positions][['title', 'genre_ids']]
    
    print(f"\nRecommended {len(recommended_movies)} movies for user {userID}")
    
    return recommended_movies


if __name__ == "__main__" :



    with open("movieData.json", "r", encoding='utf-8') as movieJsonFile:
        movie_data = json.load(movieJsonFile).get('results', [])
    
    movies_df = pd.DataFrame(movie_data).set_index('id')

    print(movies_df.head())
    print(f"\nTotal movies: {len(movies_df)}")

    movie_name = input("Enter movie name:")
    print(similar_movies_recommendation(movie_name))
    





