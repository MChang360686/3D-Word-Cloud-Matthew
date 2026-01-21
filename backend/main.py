from fastapi import FastAPI
from newspaper import Article


app = FastAPI()


@app.get('/')
def root():
    return {"message": "Hello World"}

@app.get('/get_article')
def get_article(url: str):
    try:
        article = Article(url)
        article.download()
        article.parse()

        return {'message': article.text}
    except Exception as e:
        return {'message': 'article could not be accessed'}
    