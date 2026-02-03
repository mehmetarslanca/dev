# Developer Portfolio & Management System

A robust, full-stack personal portfolio and content management system built with a focus on modern backend architecture, real-time integrations, and security. This project serves as a central hub for showcasing professional activity, managing technical content, and providing interactive experiences for visitors.

## Overview

This application is designed to provide a comprehensive look into a developer's lifecycle. It integrates directly with GitHub and WakaTime to provide live updates on coding activity, project progress, and technology stack usage. The system also includes a custom-built blog engine and an interactive simulation component.

## Technical Stack

### Backend
- **Language:** Java 21
- **Framework:** Spring Boot 3.4.1
- **Security:** Spring Security with JWT (Stateless Authentication)
- **Persistence:** Spring Data JPA with PostgreSQL
- **Integrations:** WakaTime API, GitHub API, SMTP (Spring Mail)
- **Utilities:** MapStruct (Mapping), Lombok, Bucket4j (Rate Limiting), Spring Cache, Yauaa (User-Agent Analysis)
- **Documentation:** SpringDoc OpenAPI (Swagger UI)

### Frontend
- **Framework:** React with TypeScript
- **Build Tool:** Vite
- **Styling:** Tailwind CSS
- **Components:** Radix UI / Shadcn UI
- **State Management & Icons:** Axios, Lucide React

## Core Features

### Real-Time Activity Tracking
Integration with the WakaTime API allows the platform to display live coding statistics. It tracks IDE usage, time spent on specific projects, and language distribution, providing a transparent view of current development focus.

### Dynamic GitHub Integration
The system fetches and processes repository data directly from GitHub. It handles metadata retrieval, README parsing, and automated updates to ensure the portfolio always reflects the latest project status without manual intervention.

### Advanced Security Architecture
- **JWT Authentication:** Secure login system with short-lived access tokens and a robust refresh token mechanism.
- **Token Revocation:** Implementation of a token blacklist/revocation system to ensure complete session control.
- **Rate Limiting:** Protects sensitive endpoints (e.g., contact form, authentication) using Bucket4j to prevent brute-force and DDoS attacks.
- **Centralized Exception Handling:** A global error handling layer providing consistent and secure API responses.

### Content Management & Interactivity
- **Blog Engine:** A fully featured CRUD system for technical articles, featuring role-based access control (Admin only) and secure content rendering.
- **Interactive Simulations:** A quiz-based simulation system designed to engage users through interactive scenarios and custom logic-driven outcomes.
- **Execution Monitoring:** Interceptors for tracking execution time and system performance across various service layers.

## Development Philosophy

The backend of this project was developed with a strong emphasis on clean code, SOLID principles, and architectural integrity. While AI tools were utilized during the development process, they were strictly confined to **research, documentation assistance, and troubleshooting complex integration logic**. The core business logic, architectural design, and critical security implementations were authored manually to ensure a deep understanding of the system and its maintainability.

## API Documentation

The project follows the OpenAPI specification. When the backend is running, the documentation is accessible via Swagger UI:

- **Swagger UI:** `http://localhost:8080/swagger-ui/index.html`
- **OpenAPI Docs:** `http://localhost:8080/v3/api-docs`

## Setup and Installation

### Prerequisites
- JDK 21
- PostgreSQL
- Node.js & npm

### Backend Setup
1. Configure the `env.properties` or environment variables for:
   - Database credentials
   - JWT secret keys
   - API keys (GitHub, WakaTime)
   - SMTP settings
---

