# recommender-service/app.py
from flask import Flask, request, jsonify
import recommender
import pandas as pd
import requests

# TODO por isto a dar com o docker
# TODO ligar o express a BD
# TODO conectar isto à express API
# TODO ver que output a base de dados dá para os users e filmes
# TODO verificar o primeiro recommend based on movie
# TODO verificar o reccomend based on user
# TODO
# TODO
# TODO
# TODO
# TODO
# TODO
# TODO
# TODO

# Import your trained model or recommendation functions here
EXPRESS_URL = 'http://localhost:3000'
EXPRESS_MOVIES_ENDPOINT = f"{EXPRESS_URL}/api/movies/all"
EXPRESS_MOVIE_GENRES_ENDPOINT = f"{EXPRESS_URL}/api/movies/genre/list"
EXPRESS_USER_RATINGS_ENDPOINT = f"{EXPRESS_URL}/api/recommendation"


global movie_df

app = Flask(__name__)

def load_movie_database():
    global movie_df
    
    print(f"Fetching all movies from Express: {EXPRESS_MOVIES_ENDPOINT}")

    try:
        response = requests.get(EXPRESS_MOVIES_ENDPOINT, timeout=5)

        response.raise_for_status()

        movie_data_wrapper = response.json()

        movie_data = movie_data_wrapper.get('movies',[])

        movie_list = movie_data.get('results',[])

        if not movie_list:
            print("WARNING: Express returned no movies. DataFrame will be empty.")
        
        movie_df = pd.DataFrame(movie_data).set_index('id')

        print(f"Successfully loaded {len(movie_list)} movies into cache")

    except requests.exceptions.RequestException as e:
        print(f"FATAL ERROR: Could not connect to Express to load movie data. Check Express service.")
        raise SystemExit(e)
    
def load_movie_genres():
    print(f"Fetching all movie genres from Express: {EXPRESS_MOVIE_GENRES_ENDPOINT}")

    try:
        response = requests.get(EXPRESS_MOVIE_GENRES_ENDPOINT, timeout=5)

        response.raise_for_status()

        genre_data_wrapper = response.json()

        genre_list = genre_data_wrapper.get('genres',[])

        print(f"Fetched {len(genre_list)} genres")


        genre_ids = [genre['id'] for genre in genre_list]

        return genre_ids
    
    except requests.exceptions.RequestException as e:
        print(f"FATAL ERROR: Could not connect to Express to load genres data. Check Express service.")
        raise SystemExit(e)

def get_user_movie_ratings(user_id):
    express_endpoint = f"{EXPRESS_USER_RATINGS_ENDPOINT}/{user_id}"
    
    print(f"Fetching user ratings from Express: {express_endpoint}")

    try:
        response = requests.get(express_endpoint, timeout=5)
        response.raise_for_status()
        user_data = response.json()
        
        # Assumindo que a Express API retorna algo como:
        # {'user_id': 123, 'ratings': [{'movie_id': 1, 'rating': 4.5}, ...]}
        user_ratings_list = user_data.get('ratings', [])
        
        if not user_ratings_list:
            return []
        
        # Enriquecer os ratings com informação dos filmes
        enriched_ratings = []
        for rating_data in user_ratings_list:
            movie_id = rating_data.get('movie_id')
            rating_value = rating_data.get('rating')
            
            # Buscar informação do filme no movies_df
            if movie_id in movie_df.index:
                movie_info = movie_df.loc[movie_id]
                enriched_ratings.append({
                    'id': movie_id,
                    'title': movie_info.get('title', 'Unknown'),
                    'genre_ids': movie_info.get('genre_ids', []),
                    'rating': rating_value
                })
        
        return enriched_ratings
        
    except requests.exceptions.RequestException as e:
        print(f"Error connecting to Express or received bad response: {e}")
        return []

@app.route('/recommend/movie/<string:movie_title>', methods=['GET'])
def recommend_by_movie(movie_title):
    """
    Endpoint para recomendar filmes baseado num filme específico
    """
    try:
        top_n = request.args.get('top_n', default=5, type=int)
        
        recommendations = recommender.similar_movies_recommendation(
            title=movie_title,
            top_n=top_n
        )
        
        if recommendations is None:
            return jsonify({
                "error": f"No movie found with title containing '{movie_title}'"
            }), 404
        
        # Converter Series para lista
        rec_list = recommendations.tolist()
        
        return jsonify({
            "movie_title": movie_title,
            "recommendations": rec_list,
            "count": len(rec_list)
        })
        
    except Exception as e:
        print(f"Error in recommend_by_movie: {e}")
        return jsonify({"error": str(e)}), 500
    
@app.route('/recommend/user/<int:user_id>', methods=['GET'])
def recommend_by_user(user_id, top_n=5):
    """
    Endpoint para recomendar filmes baseado no histórico do utilizador
    """
    try:
        
        print(f"Fetching ratings for user {user_id} from Exepress: {EXPRESS_USER_RATINGS_ENDPOINT}")
        
        response = requests.get(
            f"{EXPRESS_USER_RATINGS_ENDPOINT}/user/{user_id}",
            params={'top_n': top_n}
        )

        response.raise_for_status()

        user_ratings_data = response.json()
        
        # 1. Buscar ratings do utilizador
        user_ratings = user_ratings_data.get('ratings',[])
        
        if not user_ratings:
            return jsonify({
                "error": f"User {user_id} has no ratings or was not found"
            }), 404
        
        # 2. Gerar recomendações
        recommendations_df = recommender.user_based_recommendation(
            userID=user_id,
            userMoviesReviews=user_ratings,
            top_n=top_n
        )
        
        if recommendations_df.empty:
            return jsonify({
                "error": "Could not generate recommendations"
            }), 500
        
        # 3. Converter DataFrame para lista de dicionários
        rec_list = recommendations_df.reset_index().to_dict('records')
        
        return jsonify({
            "user_id": user_id,
            "based_on_movies": len(user_ratings),
            "recommendations": rec_list,
            "count": len(rec_list)
        })
        
    except Exception as e:
        print(f"Error in recommend_by_user: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        "status": "healthy",
        "movies_loaded": len(movies_df) if movies_df is not None else 0
    })

if __name__ == '__main__':
    load_movie_database()
    load_movie_genres()
    
    print("\n=== Recommender Service Started ===")
    print("Available endpoints:")
    print("  GET /recommend/movie/<movie_title>?top_n=5")
    print("  GET /recommend/user/<user_id>?top_n=5")
    print("  GET /health")
    print("=" * 40 + "\n")
    
    app.run(port=8000, debug=True)