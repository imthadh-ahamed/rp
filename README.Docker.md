# Docker Setup Guide

## Prerequisites
- Docker installed on your system
- Docker Compose installed

## Quick Start

1. **Copy environment variables**
   ```bash
   cp .env.docker .env
   ```

2. **Build and run with Docker Compose**
   ```bash
   docker-compose up --build
   ```

3. **Access the application**
   - Client (Next.js): http://localhost:3000
   - Server (Express API): http://localhost:8080

## Individual Container Commands

### Build and run Server only
```bash
cd server
docker build -t rp-server .
docker run -p 8080:8080 --env-file ../.env rp-server
```

### Build and run Client only
```bash
cd client
docker build -t rp-client .
docker run -p 3000:3000 rp-client
```

## Docker Compose Commands

### Start services
```bash
docker-compose up
```

### Start in detached mode (background)
```bash
docker-compose up -d
```

### Stop services
```bash
docker-compose down
```

### View logs
```bash
docker-compose logs -f
```

### Rebuild containers
```bash
docker-compose up --build
```

### Remove all containers and networks
```bash
docker-compose down -v
```

## Production Deployment

For production, update the `.env` file with your production credentials and run:

```bash
docker-compose up -d
```

## Troubleshooting

### Check container status
```bash
docker-compose ps
```

### Check container logs
```bash
docker-compose logs server
docker-compose logs client
```

### Restart specific service
```bash
docker-compose restart server
docker-compose restart client
```

### Access container shell
```bash
docker-compose exec server sh
docker-compose exec client sh
```
