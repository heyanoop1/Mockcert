# MockCert Deployment Guide for Ubuntu 24.04 LTS

This guide explains how to install Docker, clone the project, configure environment variables, and run the application on Ubuntu 24.04 LTS using Docker Compose.

## 1) Install Docker and Docker Compose

Run the following commands as a regular user with sudo access:

```bash
sudo apt update
sudo apt install -y ca-certificates curl gnupg lsb-release

sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
sudo chmod a+r /etc/apt/keyrings/docker.gpg

echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  $(. /etc/os-release && echo $VERSION_CODENAME) stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

sudo systemctl enable --now docker
sudo usermod -aG docker $USER
newgrp docker
```

If your current shell does not refresh group permissions automatically, log out and log back in before continuing.

## 2) Install Node.js (optional, for local DB/admin tasks)

The app is designed to run with Docker Compose, but Node.js is useful for local maintenance or Prisma commands.

```bash
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt install -y nodejs
node -v
npm -v
```

## 3) Clone the Repository

```bash
cd ~
git clone <your-repo-url> mockcert
cd mockcert
```

## 4) Configure Environment Variables

Copy the sample environment file:

```bash
cp .env.example .env
```

Then edit the file:

```bash
nano .env
```

Example configuration:

```env
DATABASE_URL="postgresql://postgres:postgres@postgres:5432/mockcert?schema=public"
AUTH_SECRET="replace-with-long-random-secret"
AUTH_URL="http://localhost:3000"
ADMIN_NAME="MockCert Admin"
ADMIN_EMAIL="admin@localhost"
ADMIN_PASSWORD="ChangeMe123!"
NEXT_PUBLIC_APP_NAME="MockCert"
APP_BASE_URL="http://localhost:3000"
UPLOAD_DIR="./uploads"
MAX_UPLOAD_SIZE_MB="10"
ATTEMPT_TOKEN_SECRET="replace-with-long-random-secret"
IP_HASH_SECRET="replace-with-long-random-secret"
RATE_LIMIT_WINDOW_SECONDS="60"
RATE_LIMIT_MAX_REQUESTS="60"
NODE_ENV="production"
```

For a public server deployment, replace localhost with your server hostname or domain name, and use secure secret values.

## 5) Build and Start the Application with Docker Compose

From the project root:

```bash
docker compose up -d --build
```

Check the running containers:

```bash
docker compose ps
```

View logs:

```bash
docker compose logs -f app
```

## 6) Run Prisma Migration and Generate Client

If your database is empty and Prisma migrations are required:

```bash
docker compose exec app npx prisma migrate deploy
docker compose exec app npx prisma generate
```

If you have a seed script:

```bash
docker compose exec app npm run db:seed
```

## 7) Access the App

Open the following URL in a browser:

```text
http://<server-ip>:3000
```

For example:

```text
http://192.168.1.50:3000
```

## 8) Useful Commands

Stop all services:

```bash
docker compose down
```

Restart after code changes:

```bash
docker compose up -d --build
```

Recreate containers from scratch:

```bash
docker compose up -d --build --force-recreate
```

Check logs:

```bash
docker compose logs -f
```

## 9) Production Notes

For a real production environment, it is recommended to:

- place the app behind Nginx or Caddy
- use HTTPS with a valid TLS certificate
- store secrets in environment-specific secure storage
- keep database credentials out of source control
- use a managed PostgreSQL service when possible

## 10) Troubleshooting

### Docker permission issue

If docker commands fail with permission errors:

```bash
sudo usermod -aG docker $USER
newgrp docker
```

### App is not starting

Check the container logs:

```bash
docker compose logs -f app
```

### Database connection issues

Confirm PostgreSQL is running:

```bash
docker compose ps
```

Then verify the database URL in `.env` matches the Compose service name:

```text
postgresql://postgres:postgres@postgres:5432/mockcert?schema=public
```

## Summary

The app can be deployed on Ubuntu 24.04 LTS using Docker Compose with a single command:

```bash
docker compose up -d --build
```

This starts the app and database together, and the app is available on port 3000 by default.
