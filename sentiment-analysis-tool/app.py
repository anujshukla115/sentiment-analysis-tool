from flask import Flask, render_template, request, jsonify, send_from_directory
from textblob import TextBlob
import os
import nltk
import socket

nltk.download('punkt', quiet=True)
nltk.download('averaged_perceptron_tagger', quiet=True)
nltk.download('movie_reviews', quiet=True)
nltk.download('stopwords', quiet=True)
nltk.download('punkt_tab', quiet=True)
nltk.download('averaged_perceptron_tagger_eng', quiet=True)

app = Flask(__name__)

def analyze_sentiment(text):
    """Analyze text and return sentiment results."""
    if not text.strip():
        return {
            'sentiment': 'Neutral',
            'polarity': 0,
            'subjectivity': 0,
            'color': '#6c757d'
        }
    
    blob = TextBlob(text)
    
    polarity = blob.sentiment.polarity
    subjectivity = blob.sentiment.subjectivity
    
    if polarity > 0.1:
        sentiment = 'Positive'
        color = '#28a745'
    elif polarity < -0.1:
        sentiment = 'Negative'
        color = '#dc3545'
    else:
        sentiment = 'Neutral'
        color = '#6c757d'
    
    return {
        'sentiment': sentiment,
        'polarity': round(polarity, 3),
        'subjectivity': round(subjectivity, 3),
        'color': color
    }

@app.route('/')
def index():
    """Render the main page."""
    return render_template('index.html')

@app.route('/analyze', methods=['POST'])
def analyze():
    """API endpoint for sentiment analysis."""
    data = request.get_json()
    text = data.get('text', '')
    
    result = analyze_sentiment(text)
    return jsonify(result)

@app.route('/static/<path:filename>')
def serve_static(filename):
    return send_from_directory('static', filename)

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    
    from werkzeug.serving import WSGIRequestHandler
    import socketserver
    
    class ReuseAddrTCPServer(socketserver.TCPServer):
        allow_reuse_address = True
    
    app.run(host='0.0.0.0', port=port, threaded=True)
