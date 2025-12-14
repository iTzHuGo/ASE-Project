from flask import Flask, jsonify, request
import recommender


app = Flask(__name__)

@app.route('/recommend/movie', methods=['GET'])
def recommend_based_movie():
    """Recommed movie based on another movie"""
    movie_title = request.args.get('title')
    if not movie_title:
        return jsonify({"error": "Movie title parameter ('title') is required."}), 400
    
    top_n = request.args.get('top_n', default=5, type=int)

    recommendation_data = recommender.similar_movies_recommendation(movie_title, top_n)

    if recommendation_data is None:
        return jsonify({
            "error": f"No movie found with title containing '{movie_title}'"
        }), 404

    # Extract the matched title and IDs from the returned dictionary
    matched_title = recommendation_data['matched_title']
    recommended_ids = recommendation_data['recommended_ids']

    return jsonify({
        # Use the title the model actually found
        "movie_title_searched": movie_title,
        "movie_title_matched": matched_title,
        "top_n_requested" : top_n,
        "recommended_movies_ids" : recommended_ids
    })

@app.route('/recommend/user/<int:user_id>', methods=['POST'])
def recommend_based_user(user_id):
    """Recommend movies based on a user's ratings fetched from Express."""

    data = request.json
    if not data or 'ratings' not in data:
        return jsonify({"error": "Missing 'ratings' array in request body. Express did not send the data."}), 400
   
    user_ratings = data['ratings']
    top_n = request.args.get('top_n', default=5, type=int)

    if not user_ratings:
        return jsonify({
            "error": f"User {user_id} has no ratings or was not found"
        }), 404

    recommended_ids = recommender.user_based_recommendation(user_id, user_ratings, top_n)

    return jsonify({
        "user_id": user_id,
        "top_n_requested" : top_n,
        "ratings" : user_ratings,
        "recommended_movies_ids" : recommended_ids
    })

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        "status": "healthy",
        "movies_loaded": len(recommender.movies_df) if recommender.movies_df is not None else 0
    })

if __name__ == '__main__':
    recommender.movies_df = recommender.load_movie_database()
    recommender.genres_df = recommender.load_movie_genres()

    print("\n=== Recommender Service Started ===")
    print("Available endpoints:")
    print("  GET /recommend/movie")
    print("  POST /recommend/user/<user_id>")
    print("  GET /health")
    print("=" * 40 + "\n")

    app.run(host='0.0.0.0', port=8000, debug=True)