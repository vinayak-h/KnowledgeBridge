# KnowledgeBridge — Full-stack POC

KnowledgeBridge is a standalone employee handover and work-continuity app. It captures work items, completed work, owners, blockers, next actions, decisions, issues, workarounds, dependencies, open questions, and reference links. It includes rule-based completeness checks and Word (DOCX) export.

## Stack
- Java 17, Spring Boot 3.4.5, Spring Web, Spring Data JPA, Bean Validation
- MySQL 8
- React 19 + Vite 8 + Tailwind CSS 3
- Apache POI for DOCX export

## Requirements
- JDK 17 or newer (JDK 17 is the project target)
- Maven 3.9+
- Node.js 20+
- Docker Engine and Docker Compose

## Run locally (recommended for development)
Run these commands from the `KnowledgeBridge` project root.

1. Start MySQL in Docker. The host port is **3307** to avoid conflicts with an existing local MySQL server:
   ```bash
   docker compose up -d mysql
   docker compose ps
   ```
   Wait until MySQL reports `healthy`.

2. Start the backend in a terminal. If you have multiple JDKs installed, select Java 17 in that terminal first:
   ```bash
   export JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64
   export PATH="$JAVA_HOME/bin:$PATH"
   cd backend
   DB_PORT=3307 mvn spring-boot:run
   ```
   The REST API is at `http://localhost:8080/api/handovers`; health check: `http://localhost:8080/actuator/health`. Keep this terminal open.

3. Start the frontend in a second terminal:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
   Open `http://localhost:5173/`. Keep this terminal open while using the app.

4. Optional production build check:
   ```bash
   cd frontend
   npm run build
   ```

## Run backend and MySQL in Docker
From the project root:
```bash
docker compose up --build -d
```
This runs the backend container against MySQL over Docker's internal network. The backend container uses port 3306 internally; the host maps MySQL to port 3307. Run the frontend locally using step 3 above.

## Features
- Create, edit, and delete handovers
- Work items with status, owner, due date, completed work, blockers, and next action
- Knowledge entries for decisions, issues, workarounds, dependencies, open questions, and general notes
- Reference links
- Rule-based completeness checks
- MySQL persistence
- DOCX export
- Spring Boot health endpoint

## Important
This is a local POC, not production-ready. Authentication and authorization are not included. Use synthetic demo data only. There is no Jira integration, no external API, and no AI dependency. Credentials in Compose and application configuration are demo defaults; change them before any shared deployment.
