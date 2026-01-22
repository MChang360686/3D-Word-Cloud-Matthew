#!/bin/bash

set -e

echo "🚀 Starting project setup..."

# -----------------------------
# Backend setup
# -----------------------------
echo "📦 Setting up backend..."

cd backend

if [ ! -d "venv" ]; then
  python3 -m venv venv
fi

source venv/bin/activate
pip install --upgrade pip
pip install -r requirements.txt

echo "✅ Backend dependencies installed"

# Start backend
echo "▶️ Starting backend server..."
uvicorn main:app --reload &

deactivate
cd ..

# -----------------------------
# Frontend setup
# -----------------------------
echo "📦 Setting up frontend..."

cd frontend
npm install

echo "▶️ Starting frontend dev server..."
npm run dev &

cd ..

# -----------------------------
# Final
# -----------------------------
echo "🎉 Frontend and backend are running!"
echo "🛑 Press CTRL+C to stop all servers"

wait
