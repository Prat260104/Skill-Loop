#!/bin/bash

echo "🚀 Starting Skill Loop - All Services"
echo "======================================"

# Start ML Service on Port 8001 (Terminal 1)
echo "Starting ML Service on port 8001..."
osascript -e 'tell app "Terminal" to do script "cd /Users/prateekrai/Desktop/Skill\\ LOOp/ml-service && source venv/bin/activate && uvicorn app.main:app --reload --port 8001"'

# Wait for ML service to load
sleep 5

# Start Spring Boot (Terminal 2)
echo "Starting Spring Boot on port 9090..."
osascript -e 'tell app "Terminal" to do script "cd /Users/prateekrai/Desktop/Skill\\ LOOp/server && mvn spring-boot:run"'

# Wait for Spring Boot to start
sleep 10

# Start Frontend (Terminal 3)
echo "Starting React Frontend on port 5173..."
osascript -e 'tell app "Terminal" to do script "cd /Users/prateekrai/Desktop/Skill\\ LOOp/client && npm run dev"'

echo ""
echo "✅ All services starting in separate terminals!"
echo ""
echo "Services:"
echo "  1. ML Service:   http://localhost:8001"
echo "  2. Spring Boot:  http://localhost:9090"
echo "  3. Frontend:     http://localhost:5173"
echo ""
echo "Press Ctrl+C in each terminal to stop services"
