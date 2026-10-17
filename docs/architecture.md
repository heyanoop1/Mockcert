# MockCert architecture

## Overview

MockCert is a single-application Next.js platform with public exam browsing, candidate attempts, and admin management features for certification mock content.

## Core layers

- App Router pages for public and admin interfaces
- Prisma for PostgreSQL persistence
- Auth.js credentials login for admin access
- Route handlers for exam and import processing
- Server-side scoring and attempt lifecycle checks

## Deployment

- Docker Compose runs the Next.js app and PostgreSQL database
- Local setup uses `.env` values from `.env.example`
- Production deployment should set secure secrets and HTTPS
