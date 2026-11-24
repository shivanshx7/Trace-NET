# TraceNet Learning Lab

An educational project inspired by TraceNet, built from scratch to explore security lessons, fictional investigation data, and lab simulations.

<a href="https://drive.google.com/file/d/1IuV_ACnj0ATMMsjT_q9gw_5ERO-qcyUU/view?usp=sharing">slides</a>

## About

This project is a hands-on learning exercise. I’m building its features myself with AI guidance, using original code, design, and sample data.

## Features

- Security lessons with fictional evidence and defensive guidance
- Searchable sample profiles and infrastructure records
- Visual relationships between records
- A simulated lab with sample nodes and logs
- PostgreSQL-backed persistence with a browser-local sample-data fallback
- Reports and data exports

## Tech Stack

- React + TypeScript + Vite frontend
- Express API
- PostgreSQL database, accessed by the API through `pg`

## Getting Started

1. Install PostgreSQL and create a database, for example `createdb tracenet`.
2. Set `DATABASE_URL`, for example `postgresql://postgres:password@localhost:5432/tracenet`.
3. Apply the schema migration with `npx prisma migrate dev --name init`.
4. Seed the bundled sample records with `npx prisma db seed` (optional; the app also initializes sample data on first connection).
5. In one terminal run `npm run server`.
6. In another terminal run `npm run dev` and open `http://localhost:3000`.

## Desktop App

The same React application can run in an Electron window. Install dependencies with `npm install`, then run `npm run desktop:dev` for desktop development. To create a packaged build for the current operating system, run `npm run desktop:build`; installers are written to `release/`.

The desktop app uses the existing local sample data and browser storage fallback when the PostgreSQL API is not running. To use PostgreSQL, start the API with `npm run server` and configure `DATABASE_URL` as described above.

The API is available at `http://localhost:3001/api/health`. If PostgreSQL is unreachable, the app falls back to bundled sample data and a local browser backup. Changes made while offline stay in the browser backup; they are not automatically synchronized to PostgreSQL.

## Database Model

- `threat_actors`: actor primary key, unique handle, category, confidence score, and full JSONB profile.
- `infrastructure`: infrastructure primary key and nullable actor foreign key (`ON DELETE SET NULL`).
- `linkages`: two actor foreign keys (`ON DELETE CASCADE`) and a checked confidence score.
- `audit_reports` and `app_settings`: JSONB records.

The API applies a full-state update in a PostgreSQL transaction so a failed constraint check rolls back the entire snapshot. Indexes support infrastructure-by-actor and linkage-by-source/target lookups.

## Safety and Scope

All examples are fictional and intended for education. Simulated findings and confidence values are not verified evidence or attribution.

## Learning Approach

AI will help me understand concepts, plan milestones, and review my work. I’ll write the code myself..
