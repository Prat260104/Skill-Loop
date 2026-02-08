#!/bin/bash

echo "🛑 Stopping All Skill Loop Services..."
echo "======================================"

# Kill ML Service (uvicorn)
echo "Stopping ML Service (port 8000/8001)..."
pkill -f "uvicorn"

# Kill Spring Boot (maven)
echo "Stopping Spring Boot (port 9090)..."
pkill -f "spring-boot:run"

# Kill Frontend (vite/npm)
echo "Stopping React Frontend (port 5173)..."
pkill -f "vite"

# Wait a moment
sleep 2

echo ""
echo "✅ All services stopped!"
echo ""
echo "To verify, run:"
echo "  lsof -i :8000"
echo "  lsof -i :8001"
echo "  lsof -i :9090"
echo "  lsof -i :5173"
