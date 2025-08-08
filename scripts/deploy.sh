#!/bin/bash

# ClassifiedHub Deployment Script
# This script handles the complete deployment process

set -e

echo "🚀 Starting ClassifiedHub deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if required tools are installed
check_requirements() {
    print_status "Checking deployment requirements..."
    
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed"
        exit 1
    fi
    
    if ! command -v npm &> /dev/null; then
        print_error "npm is not installed"
        exit 1
    fi
    
    if ! command -v docker &> /dev/null; then
        print_warning "Docker is not installed. Some features may not work."
    fi
    
    print_status "Requirements check completed"
}

# Install dependencies
install_dependencies() {
    print_status "Installing dependencies..."
    npm ci --production=false
    print_status "Dependencies installed successfully"
}

# Run database migrations
run_migrations() {
    print_status "Running database migrations..."
    npm run db:generate
    npm run db:migrate
    print_status "Database migrations completed"
}

# Build the application
build_application() {
    print_status "Building application..."
    npm run build
    print_status "Application built successfully"
}

# Run tests
run_tests() {
    print_status "Running tests..."
    npm run test
    print_status "Tests completed successfully"
}

# Deploy to Vercel
deploy_vercel() {
    print_status "Deploying to Vercel..."
    
    if ! command -v vercel &> /dev/null; then
        print_warning "Vercel CLI not found. Installing..."
        npm install -g vercel
    fi
    
    vercel --prod
    print_status "Deployment to Vercel completed"
}

# Deploy with Docker
deploy_docker() {
    print_status "Building Docker image..."
    docker build -t classifiedhub .
    
    print_status "Stopping existing containers..."
    docker-compose down || true
    
    print_status "Starting services with Docker Compose..."
    docker-compose up -d
    
    print_status "Docker deployment completed"
}

# Main deployment function
main() {
    print_status "Starting deployment process..."
    
    check_requirements
    install_dependencies
    run_tests
    run_migrations
    build_application
    
    # Choose deployment method
    if [ "$1" = "docker" ]; then
        deploy_docker
    else
        deploy_vercel
    fi
    
    print_status "Deployment completed successfully! 🎉"
}

# Run main function with arguments
main "$@" 