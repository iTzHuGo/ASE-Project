# recommender-service/app.py
from flask import Flask, request, jsonify
import recommender
import pandas as pd
import requests
# Import your trained model or recommendation functions here
EXPRESS_URL = 'http://localhost:5000'
EXPRESS_MOVIES_ENDPOINT = f"{EXPRESS_URL}/api/movies/all"
EXPRESS_MOVIE_GENRES_ENDPOINT = f"{EXPRESS_URL}/api/movies/genre/list"


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

def get_movie_based_recommendations(movie_title):
    

    recommender.similar_movies_recommendation(movie_title, movies_df)

    return []

def get_user_based_recommendations(user_id):

    # Ir buscar os filmes que user_id gosta
    # Fazer matriz de generos que ele gosta e atribuir pesos
    # Aplicar a todos os generos que ha


   
        
    return []

def user_movie_ratings(user_id):

    express_endpoint = f"{EXPRESS_URL}/api/recommendation/{user_id}"

    print(f"Fetching user ratings from Express:{EXPRESS_URL}")

    try:

        response = requests.get(express_endpoint, timeout=5)

        response.raise_for_status()

        user_data = response.json()

        user_ratings_dict = user_data.get('ratings',{})

        if not user_ratings_dict:
            return jsonify({"error": "User found, but no ratings available"}), 404
    except requests.exceptions.RequestException as e:
        print(f"Error connecting to Express or received bad response: {e}")
        return jsonify({"error": "External service (Express unavailable or failed to respond)"}), 503

@app.route('/recommend/<int:user_id>', methods=['GET'])
def recommend(user_id):
    recommendations = generate_recommendations(user_id)
    return jsonify({
        "user_id": user_id,
        "recommendations": recommendations
    })

if __name__ == '__main__':
    load_movie_database()
    load_movie_genres()

    app.run(port=8000)