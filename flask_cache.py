from flask import Flask, jsonify
from flask_caching import Cache
from application.models import Score

app = Flask(__name__)

app.config['CACHE_TYPE'] = 'RedisCache'
app.config['CACHE_REDIS_HOST'] = 'localhost'
app.config['CACHE_REDIS_PORT'] = 6379
app.config['CACHE_REDIS_DB'] = 0
app.config['CACHE_DEFAULT_TIMEOUT'] = 300

cache = Cache(app)

@app.route('/api/scores', methods=['GET'])
@cache.cached(timeout=300, key_prefix='scores_data')
def get_scores():
    scores = Score.query.all()
    scores_list = []
    for score in scores:
        scores_list.append({
            "id": score.id,
            "quiz": score.quiz.name if score.quiz else "",
            "username": score.user.username if score.user else "",
            "total": score.total,
            "percentage": score.percentage,
            "timestamp": score.timestamp.strftime("%d-%m-%Y %H:%M:%S") if score.timestamp else ""
        })
    return jsonify(scores_list)

if __name__ == '__main__':
    app.run(debug=True)