from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, HttpUrl
from newspaper import Article
from sklearn.feature_extraction.text import TfidfVectorizer
import logging

'''
TODO: add more NLP methods and endpoints
'''

# add logger
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# app setup + CORS config
app = FastAPI(title="Article TF-IDF Analyzer")
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",  # Vite dev server is here
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# --- Request schema ---
class ArticleRequest(BaseModel):
    url: HttpUrl  # validates proper URL


@app.post("/analyze")
def analyze_article(request: ArticleRequest):
    '''
    1. Grab article using newspaper3k
    2. Compute TF-IDF words and weights
    3. Return JSON
    '''
    url = str(request.url)
    logger.info(f"Fetching article from URL: {url}")

    try:
        article = Article(url)
        article.download()
        article.parse()
        text = article.text
    except Exception as e:
        logger.error(f"Failed to fetch or parse article: {e}")
        raise HTTPException(status_code=400, detail="Could not fetch or parse article")

    if not text.strip():
        raise HTTPException(status_code=400, detail="Article text is empty")

    logger.info(f"Article length: {len(text)} characters")

    try:
        vectorizer = TfidfVectorizer(
            stop_words="english",
            max_features=50  # top 50 words
        )
        tfidf_matrix = vectorizer.fit_transform([text])
        feature_names = vectorizer.get_feature_names_out()
        scores = tfidf_matrix.toarray()[0]

        # Build result as word:score dict
        word_scores = {word: float(score) for word, score in zip(feature_names, scores)}

    except Exception as e:
        logger.error(f"TF-IDF computation failed: {e}")
        raise HTTPException(status_code=500, detail="TF-IDF computation failed")

    return {
        "url": url,
        "top_words": word_scores
    }
