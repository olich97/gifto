#!/bin/bash

# scripts/start-local.sh
# Comprehensive local development setup script

echo "🚀 Starting Gifto Local Development Environment..."
echo "=================================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    print_error "Please run this script from the project root directory"
    exit 1
fi

# Check if yarn is installed
if ! command -v yarn &> /dev/null; then
    print_error "Yarn is required but not installed. Please install yarn first."
    exit 1
fi

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    print_info "Installing dependencies..."
    yarn install
    if [ $? -ne 0 ]; then
        print_error "Failed to install dependencies"
        exit 1
    fi
    print_status "Dependencies installed"
fi

# Compile contracts
print_info "Compiling smart contracts..."
npx hardhat compile
if [ $? -ne 0 ]; then
    print_error "Failed to compile contracts"
    exit 1
fi
print_status "Contracts compiled successfully"

# Run tests to ensure everything is working
print_info "Running contract tests..."
npx hardhat test
if [ $? -ne 0 ]; then
    print_error "Contract tests failed"
    exit 1
fi
print_status "All tests passed"

# Check if Hardhat node is already running
if curl -s http://localhost:8545 > /dev/null; then
    print_warning "Hardhat node is already running on port 8545"
    print_info "Killing existing node..."
    pkill -f "hardhat node" || true
    sleep 2
fi

print_info "Starting Hardhat node..."

# Start Hardhat node in background
npx hardhat node &
HARDHAT_PID=$!

# Wait for node to be ready
print_info "Waiting for Hardhat node to be ready..."
for i in {1..30}; do
    if curl -s http://localhost:8545 > /dev/null; then
        print_status "Hardhat node is ready"
        break
    fi
    if [ $i -eq 30 ]; then
        print_error "Hardhat node failed to start"
        kill $HARDHAT_PID 2>/dev/null
        exit 1
    fi
    sleep 1
done

# Deploy contracts
print_info "Deploying contracts to local network..."
sleep 2  # Give the node a moment to fully initialize
npx hardhat run scripts/dev-setup.js --network localhost
if [ $? -ne 0 ]; then
    print_error "Failed to deploy contracts"
    kill $HARDHAT_PID 2>/dev/null
    exit 1
fi

print_status "Local development environment is ready!"
echo ""
echo "🌐 Hardhat Node: http://localhost:8545 (PID: $HARDHAT_PID)"
echo "📋 Next steps:"
echo "   1. In a new terminal, run: yarn dev"
echo "   2. Open http://localhost:3000 in your browser"
echo "   3. Connect your wallet to Hardhat network"
echo ""
print_warning "To stop the Hardhat node: kill $HARDHAT_PID"
echo ""

# Function to cleanup on exit
cleanup() {
    print_info "Shutting down Hardhat node..."
    kill $HARDHAT_PID 2>/dev/null
    wait $HARDHAT_PID 2>/dev/null
    print_status "Cleanup completed"
}

# Set up signal handlers
trap cleanup SIGINT SIGTERM

# Keep the script running to maintain the node
print_info "Hardhat node is running. Press Ctrl+C to stop."
wait $HARDHAT_PID