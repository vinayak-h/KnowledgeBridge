# KnowledgeBridge — Full-stack POC

KnowledgeBridge is a standalone employee handover and work-continuity app. It captures work items, completed work, owners, blockers, next actions, decisions, issues, workarounds, dependencies, open questions, and reference links. It includes rule-based completeness checks and Word (DOCX) export.

## Stack
- Java 17, Spring Boot 3.4.5, Spring Web, Spring Data JPA, Bean Validation
- MySQL 8
- React 19 + Vite 8 + Tailwind CSS 3
- Apache POI for DOCX export

## Requirements

### Option 1: Docker (Rancher Desktop) — Recommended for development
- Rancher Desktop (Docker + Kubernetes in WSL)
- Node.js 20+

### Option 2: Local (no Docker) — For pure development
- JDK 17 or newer
- Maven 3.9+
- Node.js 20+
- MySQL 8 server running locally (or any MySQL 8 instance you can connect to)

## Run locally (recommended for development)

### Option 1: Docker + Rancher Desktop (Windows/macOS/Linux)

#### Windows
1. **Start Rancher Desktop**, then open a PowerShell terminal at the project root:
   ```powershell
   cd c:\personal\KnowledgeBridge
   ```

2. **Start MySQL and backend** via WSL:
   ```powershell
   & "C:\Program Files\WSL\wsl.exe" -d rancher-desktop -- sh -c "cd /mnt/c/personal/KnowledgeBridge && /mnt/c/Users/vinayak.s.hegde/AppData/Local/Programs/Rancher\ Desktop/resources/resources/linux/docker-cli-plugins/docker-compose up -d mysql backend"
   ```
   Wait for MySQL to report `healthy`.

3. **Start the frontend** in a second PowerShell terminal:
   ```powershell
   cd c:\personal\KnowledgeBridge\frontend
   npm run dev
   ```
   Open http://localhost:5173/ in your browser.

4. **Check status**:
   ```powershell
   & "C:\Program Files\WSL\wsl.exe" -d rancher-desktop -- sh -c "cd /mnt/c/personal/KnowledgeBridge && /mnt/c/Users/vinayak.s.hegde/AppData/Local/Programs/Rancher\ Desktop/resources/resources/linux/docker-cli-plugins/docker-compose ps"
   ```

**To stop** (Windows):
- Frontend: press `Ctrl+C` in its PowerShell terminal.
- Backend and MySQL:
  ```powershell
  & "C:\Program Files\WSL\wsl.exe" -d rancher-desktop -- sh -c "cd /mnt/c/personal/KnowledgeBridge && /mnt/c/Users/vinayak.s.hegde/AppData/Local/Programs/Rancher\ Desktop/resources/resources/linux/docker-cli-plugins/docker-compose down"
  ```

#### macOS / Linux
1. **Start Rancher Desktop** (or Docker Desktop), then open a terminal at the project root:
   ```bash
   cd KnowledgeBridge
   ```

2. **Start MySQL and backend**:
   ```bash
   docker compose up -d mysql backend
   ```
   Wait for MySQL to report `healthy`.

3. **Start the frontend** in a second terminal:
   ```bash
   cd frontend
   npm run dev
   ```
   Open http://localhost:5173/ in your browser.

4. **Check status**:
   ```bash
   docker compose ps
   ```

**To stop** (macOS / Linux):
- Frontend: press `Ctrl+C` in its terminal.
- Backend and MySQL:
  ```bash
  docker compose down
  ```

---

### Option 2: Local (no Docker) — Pure development

#### Setup MySQL
- Install MySQL 8 on your machine, or connect to an existing MySQL 8 instance.
- Create the database (or let the app auto-create it):
  ```bash
  mysql -h localhost -u root -p
  CREATE DATABASE knowledgebridge;
  CREATE USER 'kbuser'@'localhost' IDENTIFIED BY 'kbpassword';
  GRANT ALL PRIVILEGES ON knowledgebridge.* TO 'kbuser'@'localhost';
  FLUSH PRIVILEGES;
  ```

#### Windows
1. **Start the backend** in PowerShell at the project root:
   ```powershell
   cd backend
   $env:DB_HOST = "localhost"
   $env:DB_PORT = "3306"
   $env:DB_USER = "kbuser"
   $env:DB_PASSWORD = "kbpassword"
   mvn spring-boot:run
   ```
   Keep this terminal open. The API will be at http://localhost:8080/api/handovers.

2. **Start the frontend** in a second PowerShell terminal:
   ```powershell
   cd frontend
   npm install
   npm run dev
   ```
   Open http://localhost:5173/ in your browser.

**To stop** (Windows):
- Press `Ctrl+C` in both terminals.

#### macOS / Linux
1. **Start the backend** in a terminal at the project root:
   ```bash
   cd backend
   DB_HOST=localhost DB_PORT=3306 DB_USER=kbuser DB_PASSWORD=kbpassword mvn spring-boot:run
   ```
   Keep this terminal open. The API will be at http://localhost:8080/api/handovers.

2. **Start the frontend** in a second terminal:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
   Open http://localhost:5173/ in your browser.

**To stop** (macOS / Linux):
- Press `Ctrl+C` in both terminals.

## Features
- Create, edit, and delete handovers
- Work items with status, owner, due date, completed work, blockers, and next action
- Knowledge entries for decisions, issues, workarounds, dependencies, open questions, and general notes
- Reference links
- Rule-based completeness checks
- MySQL persistence
- DOCX export
- Spring Boot health endpoint

## Troubleshooting

### Windows: "timed out dialing Hyper-V socket" (Rancher Desktop)
If you see `failed to connect to the backend: timed out dialing Hyper-V socket`, the Docker bridge in Rancher Desktop is stalled. Restart Rancher Desktop:
1. Close Rancher Desktop.
2. Open PowerShell and run:
   ```powershell
   wsl --shutdown
   ```
3. Restart Rancher Desktop and wait 1–2 minutes.
4. Try the compose command again.

### Windows: "docker: unknown command: docker compose" (Rancher Desktop)
The VM's Docker engine lacks the compose plugin. Use the Rancher bundled binary as shown in the Windows instructions (the full path to `docker-cli-plugins/docker-compose`).

### Port already in use
If port 5173 (frontend), 8080 (backend), or 3306/3307 (MySQL) is already in use:
- **Docker mode**: Change port mappings in `docker-compose.yml`.
- **Local mode**: Stop the conflicting process or change environment variables (e.g., `DB_PORT=3307`).

### Cannot connect to MySQL (Local mode)
- Verify MySQL is running and accessible:
  ```bash
  mysql -h localhost -u kbuser -p -e "SELECT 1"
  ```
- Check your database credentials in the `DB_*` environment variables.
- If using a non-local MySQL instance, set `DB_HOST` to its IP or hostname.

### Maven build fails
- Ensure JDK 17+ is installed:
  ```bash
  java -version
  ```
- If you have multiple JDKs, set `JAVA_HOME` to point to JDK 17+.

### Frontend won't connect to backend
- Verify the backend is running:
  ```bash
  curl http://localhost:8080/actuator/health
  ```
- Check browser console (F12) for CORS or network errors.
- Ensure frontend is on http://localhost:5173/ and backend on http://localhost:8080.

## Important
This is a local POC, not production-ready. Authentication and authorization are not included. Use synthetic demo data only. There is no Jira integration, no external API, and no AI dependency. Credentials in Compose and application configuration are demo defaults; change them before any shared deployment.
