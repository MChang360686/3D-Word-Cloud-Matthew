from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, HttpUrl
from newspaper import Article
from sklearn.feature_extraction.text import TfidfVectorizer
import logging

# --- Logging setup ---
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# --- FastAPI setup ---
app = FastAPI(title="Article TF-IDF Analyzer")

# --- Request schema ---
class ArticleRequest(BaseModel):
    url: HttpUrl  # validates proper URL


# --- POST endpoint ---
@app.post("/analyze")
def analyze_article(request: ArticleRequest):
    url = str(request.url)
    logger.info(f"Fetching article from URL: {url}")

    # Step 1: Fetch article
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

    # Step 2: Compute TF-IDF
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

    # Step 3: Return JSON
    return {
        "url": url,
        "top_words": word_scores
    }
