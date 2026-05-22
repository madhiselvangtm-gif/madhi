#!/bin/bash
# Ollama Setup Script for VPS
# Purpose: Install and configure Ollama for resume tailoring

echo "=================================="
echo "Ollama Setup for Job Hunt Automation"
echo "=================================="
echo ""

# Check if running as root
if [ "$EUID" -ne 0 ]; then 
  echo "Please run with sudo: sudo bash ollama-setup.sh"
  exit 1
fi

# Step 1: Install Ollama
echo "Step 1: Installing Ollama..."
curl -fsSL https://ollama.com/install.sh | sh

if [ $? -eq 0 ]; then
    echo "✓ Ollama installed successfully"
else
    echo "✗ Ollama installation failed"
    exit 1
fi

# Step 2: Start Ollama service
echo ""
echo "Step 2: Starting Ollama service..."
systemctl start ollama
systemctl enable ollama

if systemctl is-active --quiet ollama; then
    echo "✓ Ollama service is running"
else
    echo "✗ Ollama service failed to start"
    exit 1
fi

# Step 3: Pull recommended model (mistral:7b)
echo ""
echo "Step 3: Pulling Mistral 7B model (this may take 10-15 minutes)..."
su - $(logname) -c "ollama pull mistral:7b"

if [ $? -eq 0 ]; then
    echo "✓ Mistral 7B model downloaded"
else
    echo "✗ Failed to download model"
    exit 1
fi

# Step 4: Test Ollama
echo ""
echo "Step 4: Testing Ollama..."
RESPONSE=$(curl -s http://localhost:11434/api/generate -d '{
  "model": "mistral:7b",
  "prompt": "Say hello in one word.",
  "stream": false
}' | grep -o '"response":"[^"]*"')

if [ ! -z "$RESPONSE" ]; then
    echo "✓ Ollama is working correctly!"
    echo "Response: $RESPONSE"
else
    echo "✗ Ollama test failed"
    exit 1
fi

# Step 5: Display info
echo ""
echo "=================================="
echo "Setup Complete!"
echo "=================================="
echo ""
echo "Ollama API URL: http://localhost:11434"
echo "Model: mistral:7b"
echo ""
echo "To test manually:"
echo "  ollama run mistral:7b \"Write a professional summary for an SDR\""
echo ""
echo "To list all models:"
echo "  ollama list"
echo ""
echo "To pull additional models:"
echo "  ollama pull llama3:8b"
echo "  ollama pull phi3:medium"
echo ""
echo "Next steps:"
echo "1. Configure n8n Module 5 to use: http://localhost:11434"
echo "2. Test resume tailoring workflow"
echo "3. Monitor VPS resource usage (RAM/CPU)"
echo ""
