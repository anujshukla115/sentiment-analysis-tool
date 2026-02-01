# Sentiment Analysis Tool

## Overview
A Flask-based web application that analyzes text sentiment using Python's TextBlob library. Users can input text and receive sentiment analysis results including polarity (positive/negative) and subjectivity scores.

## Project Structure
- `app.py` - Main Flask application with sentiment analysis logic
- `templates/index.html` - HTML frontend with responsive UI
- `static/style.css` - CSS styling
- `static/script.js` - JavaScript for interactive functionality

## Technologies
- Python 3.12
- Flask (web framework)
- TextBlob (NLP/sentiment analysis)
- NLTK (natural language processing)
- Gunicorn (production server)

## Running the App
The app runs on port 5000 using gunicorn:
```
gunicorn --bind 0.0.0.0:5000 --reuse-port app:app
```

## Features
- Real-time sentiment analysis
- Polarity score (-1 to 1)
- Subjectivity score (0 to 1)
- Sample text examples
- Responsive design
