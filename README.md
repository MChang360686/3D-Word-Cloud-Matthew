# 3D-Word-Cloud-Matthew
Interactive website that visualizes news articles as a 3d word cloud.

# Requirements

## Backend
Requires Python 3.11.9 or other compatible version

Setting up a venv is recommended.  Locate requirements.txt and run ```pip install -r requirements.txt```.  Ensure fastapi\[standard\] is downloaded via ```pip install "fastapi\[standard\]"```

Once all dependencies are met, run ```fastapi dev main.py```


## Frontend
Requires Node.js 20.19.0 and npm 9 or other compatible version.  [nvm-windows 1.2.2](https://github.com/coreybutler/nvm-windows/releases/tag/1.2.2) is recommended.

Switching Node.js version to 20.19.0 can be done with ```nvm install 20.19.0``` and ```nvm use 20.19.0```

Ensure React Three Fiber and React Three Drei are installed with ```npm install three @react-three/fiber @react-three/drei```.

Run project with ```npm run dev``` in 3D-Word-Cloud-Matthew/frontend/wordcloud-3d.  

## Testing
### Backend
Check http://127.0.0.1:8000/analyze with the following JSON as the body.  If the backend is running you should see TF-IDF analysis of the article provided.
```
{
    "url": "https://nypost.com/2026/01/21/world-news/south-koreas-former-prime-minister-jailed-for-23-years/"
}
```

### Frontend
Check http://localhost:5173/.  If there are errors right click for inspect and check the console for errors.
