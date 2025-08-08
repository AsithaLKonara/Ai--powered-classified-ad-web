# 🚀 ClassifiedHub Deployment Guide

This guide provides comprehensive instructions for deploying ClassifiedHub to production environments.

## 📋 Prerequisites

### Required Software
- **Node.js** 18+ 
- **npm** or **pnpm**
- **Git**
- **PostgreSQL** 15+
- **Redis** 7+

### Optional Software
- **Docker** & **Docker Compose**
- **Vercel CLI**
- **PM2** (for process management)

## 🔧 Environment Setup

### 1. Environment Variables

Copy the example environment file and configure your variables:

```bash
cp env.example .env.local
```

**Required Environment Variables:**

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/classifiedhub"

# Authentication
NEXTAUTH_SECRET="your-super-secret-key-here"
NEXTAUTH_URL="https://yourdomain.com"

# Payment Gateway (PayHere)
PAYHERE_MERCHANT_ID="your-merchant-id"
PAYHERE_SECRET="your-payhere-secret"

# File Storage
BLOB_READ_WRITE_TOKEN="your-vercel-blob-token"

# Email Service
RESEND_API_KEY="your-resend-api-key"
EMAIL_FROM="noreply@yourdomain.com"

# Redis
REDIS_URL="redis://localhost:6379"

# Security
JWT_SECRET="your-jwt-secret"
ENCRYPTION_KEY="your-32-character-key"
```

### 2. Database Setup

#### Local PostgreSQL
```bash
# Install PostgreSQL
brew install postgresql  # macOS
sudo apt-get install postgresql  # Ubuntu

# Create database
createdb classifiedhub

# Run migrations
npm run db:migrate
```

#### Docker PostgreSQL
```bash
# Start PostgreSQL with Docker
docker run --name classifiedhub-postgres \
  -e POSTGRES_DB=classifiedhub \
  -e POSTGRES_USER=classifiedhub_user \
  -e POSTGRES_PASSWORD=classifiedhub_password \
  -p 5432:5432 \
  -d postgres:15-alpine
```

### 3. Redis Setup

#### Local Redis
```bash
# Install Redis
brew install redis  # macOS
sudo apt-get install redis-server  # Ubuntu

# Start Redis
redis-server
```

#### Docker Redis
```bash
# Start Redis with Docker
docker run --name classifiedhub-redis \
  -p 6379:6379 \
  -d redis:7-alpine
```

## 🚀 Deployment Methods

### Method 1: Vercel Deployment (Recommended)

#### 1. Install Vercel CLI
```bash
npm install -g vercel
```

#### 2. Login to Vercel
```bash
vercel login
```

#### 3. Deploy
```bash
# Deploy to production
vercel --prod

# Or use the deployment script
./scripts/deploy.sh
```

#### 4. Configure Environment Variables in Vercel
- Go to your Vercel dashboard
- Navigate to Settings > Environment Variables
- Add all required environment variables

### Method 2: Docker Deployment

#### 1. Build and Deploy
```bash
# Build Docker image
docker build -t classifiedhub .

# Deploy with Docker Compose
docker-compose up -d

# Or use the deployment script
./scripts/deploy.sh docker
```

#### 2. Production Docker Compose
```bash
# Start production services
docker-compose --profile production up -d
```

### Method 3: Traditional Server Deployment

#### 1. Server Requirements
- **CPU**: 2+ cores
- **RAM**: 4GB+ 
- **Storage**: 20GB+
- **OS**: Ubuntu 20.04+ or CentOS 8+

#### 2. Install Dependencies
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PostgreSQL
sudo apt-get install postgresql postgresql-contrib

# Install Redis
sudo apt-get install redis-server

# Install Nginx
sudo apt-get install nginx

# Install PM2
npm install -g pm2
```

#### 3. Deploy Application
```bash
# Clone repository
git clone https://github.com/yourusername/classifiedhub.git
cd classifiedhub

# Install dependencies
npm ci --production

# Build application
npm run build

# Start with PM2
pm2 start npm --name "classifiedhub" -- start
pm2 save
pm2 startup
```

#### 4. Configure Nginx
```bash
# Copy Nginx configuration
sudo cp nginx.conf /etc/nginx/nginx.conf

# Test configuration
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx
```

## 🔒 SSL Certificate Setup

### Let's Encrypt (Free)
```bash
# Install Certbot
sudo apt-get install certbot python3-certbot-nginx

# Get SSL certificate
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Auto-renewal
sudo crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet
```

### Manual SSL Certificate
1. Purchase SSL certificate from your provider
2. Upload certificate files to `/etc/nginx/ssl/`
3. Update Nginx configuration
4. Restart Nginx

## 📊 Monitoring & Analytics

### 1. Application Monitoring
```bash
# Install monitoring tools
npm install -g pm2

# Monitor with PM2
pm2 monit
pm2 logs classifiedhub
```

### 2. Database Monitoring
```bash
# PostgreSQL monitoring
psql -d classifiedhub -c "SELECT * FROM pg_stat_activity;"
```

### 3. Redis Monitoring
```bash
# Redis monitoring
redis-cli info
redis-cli monitor
```

### 4. Log Management
```bash
# View application logs
pm2 logs classifiedhub

# View Nginx logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

## 🔧 Maintenance

### Database Backups
```bash
# Create backup script
cat > backup.sh << 'EOF'
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
pg_dump classifiedhub > backup_$DATE.sql
gzip backup_$DATE.sql
EOF

chmod +x backup.sh

# Schedule daily backups
crontab -e
# Add: 0 2 * * * /path/to/backup.sh
```

### Application Updates
```bash
# Pull latest changes
git pull origin main

# Install dependencies
npm ci --production

# Run migrations
npm run db:migrate

# Build application
npm run build

# Restart application
pm2 restart classifiedhub
```

### Performance Optimization
```bash
# Enable compression
npm run build

# Optimize images
npm run optimize-images

# Cache static assets
npm run cache-static
```

## 🚨 Troubleshooting

### Common Issues

#### 1. Database Connection Issues
```bash
# Check database status
sudo systemctl status postgresql

# Test connection
psql -h localhost -U classifiedhub_user -d classifiedhub
```

#### 2. Redis Connection Issues
```bash
# Check Redis status
sudo systemctl status redis

# Test Redis connection
redis-cli ping
```

#### 3. Application Won't Start
```bash
# Check logs
pm2 logs classifiedhub

# Check environment variables
pm2 env classifiedhub

# Restart application
pm2 restart classifiedhub
```

#### 4. SSL Issues
```bash
# Test SSL configuration
sudo nginx -t

# Check certificate validity
sudo certbot certificates

# Renew certificate
sudo certbot renew
```

### Performance Issues

#### 1. High Memory Usage
```bash
# Check memory usage
free -h
pm2 monit

# Optimize Node.js
export NODE_OPTIONS="--max-old-space-size=2048"
```

#### 2. Slow Database Queries
```bash
# Enable query logging
echo "log_statement = 'all'" >> /etc/postgresql/*/main/postgresql.conf
sudo systemctl restart postgresql
```

#### 3. High CPU Usage
```bash
# Check CPU usage
htop

# Profile application
npm run profile
```

## 📈 Scaling

### Horizontal Scaling
1. **Load Balancer**: Set up Nginx load balancer
2. **Multiple Instances**: Deploy multiple application instances
3. **Database Replication**: Set up PostgreSQL read replicas
4. **Redis Cluster**: Configure Redis cluster for high availability

### Vertical Scaling
1. **Increase Resources**: Upgrade server specifications
2. **Optimize Code**: Profile and optimize application code
3. **Database Optimization**: Optimize database queries and indexes
4. **Caching**: Implement Redis caching strategies

## 🔐 Security Checklist

- [ ] **HTTPS**: SSL certificate installed and configured
- [ ] **Firewall**: Configure firewall rules
- [ ] **Environment Variables**: All secrets properly configured
- [ ] **Database Security**: Strong passwords and limited access
- [ ] **Rate Limiting**: API rate limiting enabled
- [ ] **Input Validation**: All user inputs validated
- [ ] **SQL Injection**: Prepared statements used
- [ ] **XSS Protection**: Content Security Policy configured
- [ ] **CSRF Protection**: CSRF tokens implemented
- [ ] **File Upload Security**: File upload restrictions
- [ ] **Logging**: Security events logged
- [ ] **Backups**: Regular backups configured
- [ ] **Updates**: Regular security updates

## 📞 Support

### Getting Help
- **Documentation**: Check project README and documentation
- **Issues**: Create GitHub issues for bugs
- **Discussions**: Use GitHub Discussions for questions
- **Email**: support@classifiedhub.com

### Emergency Contacts
- **Technical Support**: tech@classifiedhub.com
- **Security Issues**: security@classifiedhub.com
- **Business Inquiries**: business@classifiedhub.com

---

**ClassifiedHub** - *Ready for production deployment* 🚀 