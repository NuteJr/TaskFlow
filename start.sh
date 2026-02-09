#!/bin/bash

echo "=========================================="
echo "   TaskFlow SQLite - Quick Start"
echo "=========================================="
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "[1/3] Installing dependencies..."
    npm install
    if [ $? -ne 0 ]; then
        echo "ERROR: npm install failed"
        exit 1
    fi
fi

# Check if database exists
if [ ! -f "backend/prisma/dev.db" ]; then
    echo "[2/3] Setting up database..."
    cd backend
    npx prisma generate
    npx prisma migrate dev --name init
    npx prisma db seed
    cd ..
fi

echo "[3/3] Starting servers..."
echo ""
echo -e "${BLUE}Frontend:${NC} http://localhost:3000"
echo -e "${BLUE}Backend:${NC}  http://localhost:3001/api"
echo ""
echo "Login: demo@taskflow.app / demo123"
echo ""

# Start both servers
npm run dev
