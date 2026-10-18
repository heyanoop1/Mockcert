# MockCert

## Project state

This repository was empty when work began. The project has been initialized as a Next.js + TypeScript + Tailwind app and is now being built toward the Phase 1 MVP foundation.

## Implementation checklist

- [ ] Inspect repo state and scaffold project
- [ ] Add environment config and app shell
- [ ] Define Prisma schema and DB setup
- [ ] Add admin authentication foundation
- [ ] Add middleware and route protection
- [ ] Implement vendor/certification/version CRUD
- [ ] Import parsing and validation layer
- [ ] Add public catalogue and exam flow
- [ ] Add scoring and result APIs
- [ ] Add analytics, health checks, and security
- [ ] Add tests and Docker deployment
- [ ] Run lint, typecheck, and production build

## Local setup

1. Copy `.env.example` to `.env`
2. Update credentials and secrets
3. Run `npm install`
4. Run `npm run db:migrate`
5. Run `npm run db:seed`
6. Run `npm run dev`

## Phase 1 status

This repository currently includes the base Next.js app shell, config, and project scaffolding. The next steps are Prisma schema, auth, and validation work.
