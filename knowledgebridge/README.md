# KnowledgeBridge — Local Windows Edition

KnowledgeBridge is a local-first handover and work-continuity application. It helps a team capture who owns work, what's done, what's blocked, what happens next, important decisions, workarounds, dependencies, open questions, and useful reference links. It includes a handover completeness check and Word (DOCX) export.

This edition runs **without Docker**. MySQL runs locally, Spring Boot runs with Maven, and React runs with Vite.

## Quick Links

- **[Architecture & Design](docs/ARCHITECTURE.md)** – System components, data model, API specification
- **[Implementation Status](docs/IMPLEMENTATION_STATUS.md)** – What's implemented, known limitations, security gaps
- **[Testing Guide](docs/TESTING.md)** – Build commands, test coverage, manual testing checklist
- **[Project Documentation](PROJECT_DOCUMENTATION.md)** – Full technical reference: frontend, backend, database, configuration and maintenance

## Features

- Create, view, edit and delete handovers
- Record handover type, creator, recipient, dates, summary and workflow status
- Track work items, owners, due dates, completed work, blockers and next actions
- Capture decisions, issues, workarounds, dependencies, open questions and general notes
- Attach reference links to runbooks, documents and dashboards
- Search handovers by title, creator, recipient and summary
- Filter by workflow status and handover type
- Rule-based completeness check with actionable warnings
- Export a handover as a Word `.docx` file
- MySQL persistence and Spring Boot health endpoint
- Responsive dashboard and editor UI

## Technology

- Java 17
- Spring Boot 3.4.5, Spring Web, Spring Data JPA, Bean Validation and Actuator
- MySQL 8 compatible server
- React 19 and Vite
- Apache POI for DOCX generation

## Requirements on Windows

Install or have available:

1. JDK 17 or newer
2. Maven 3.9 or newer
3. Node.js 20.19+ or 22.12+
4. MySQL Server running locally (MySQL Workbench is optional and is only a database GUI)

Check installations in Command Prompt or PowerShell:

```powershell
java -version
mvn -version
node -v
npm -v
```

No Docker Desktop, Rancher Desktop, WSL or container runtime is required.

## Step 1 — Start MySQL Server

If MySQL was installed as a Windows service:

1. Press `Win + R`, enter `services.msc`, and press Enter.
2. Find the MySQL service (for example, `MySQL80`) and choose **Start** if it is stopped.

If you installed MySQL from a ZIP archive, start it with the command and data directory appropriate for your installation. For example, if your existing data directory is `C:\Users\YOUR_USER\tools\mysql\data`, open Command Prompt and run:

```bat
cd C:\Users\YOUR_USER\tools\mysql\mysql-26.7.0-winx64
bin\mysqld --console --datadir="C:\Users\YOUR_USER\tools\mysql\data"
```

Keep that terminal open while using the application. Do not run `--initialize` against an existing database directory.

## Step 2 — Create the database

Open MySQL Workbench, connect to your local server, open a SQL tab and execute:

```sql
CREATE DATABASE IF NOT EXISTS knowledgebridge
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;
```

The optional script `database/create-database.sql` contains the same command and an example for creating a dedicated database user.

## Step 3 — Start the Spring Boot backend

Open a new PowerShell window at the extracted project directory, then run:

```powershell
cd backend
$env:DB_HOST = "localhost"
$env:DB_PORT = "3306"
$env:DB_NAME = "knowledgebridge"
$env:DB_USER = "root"
$env:DB_PASSWORD = "YOUR_MYSQL_PASSWORD"
mvn spring-boot:run
```

Replace `YOUR_MYSQL_PASSWORD` with the password for the MySQL user. If the user has no password, use `$env:DB_PASSWORD = ""`. If you created a dedicated `kbuser`, set `DB_USER` and `DB_PASSWORD` to that account instead.

Keep this terminal open. The API should be available at:

- API: `http://localhost:8080/api/handovers`
- Health check: `http://localhost:8080/actuator/health`

On first startup, Hibernate creates or updates the application tables in the `knowledgebridge` database. The database user must have permission to create and alter tables.

## Step 4 — Start the React frontend

Open a **second** PowerShell window at the project directory and run:

```powershell
cd frontend
npm install
npm run dev
```

Open the Vite URL shown in the terminal, normally `http://localhost:5173`.

Keep both the backend and frontend terminals open. To stop each process, press `Ctrl + C` in its terminal.

The dev server is started with `--host 0.0.0.0`, so other machines on your network can reach it. Use `npm run build` to produce a production bundle in `frontend/dist`.

To run the backend tests, use `mvn test` in the `backend` folder.

## Optional — Configure a different API URL

By default, React calls `http://localhost:8080/api/handovers`. If your backend runs elsewhere, create `frontend/.env.local` with:

```dotenv
VITE_API_URL=http://localhost:8080/api/handovers
```

Restart Vite after changing this file.

## API endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| `GET` | `/api/handovers` | List handovers |
| `GET` | `/api/handovers?search=payments` | Search by title, creator, recipient or summary |
| `GET` | `/api/handovers?status=DRAFT&type=LEAVE` | Filter handovers |
| `GET` | `/api/handovers/{id}` | Get one handover and its child records |
| `POST` | `/api/handovers` | Create a handover |
| `PUT` | `/api/handovers/{id}` | Update a handover |
| `DELETE` | `/api/handovers/{id}` | Delete a handover and its child records |
| `GET` | `/api/handovers/{id}/completeness` | Check missing handover context |
| `GET` | `/api/handovers/{id}/export` | Download a Word document |
| `GET` | `/actuator/health` | Check backend health |

## Verify data in MySQL Workbench

```sql
USE knowledgebridge;
SHOW TABLES;
SELECT id, title, creator, recipient, status, created_at, updated_at
FROM handovers
ORDER BY updated_at DESC;
SELECT * FROM work_items;
SELECT * FROM knowledge_entries;
SELECT * FROM reference_links;
```

## Troubleshooting

### `Access denied for user`
Confirm the `DB_USER` and `DB_PASSWORD` values. Re-run the backend commands in the same PowerShell terminal after changing environment variables.

### `Communications link failure` or connection refused
MySQL Server is not running or the host/port is incorrect. Confirm that it accepts connections on `localhost:3306` and that the database exists.

### `Unknown database 'knowledgebridge'`
Create the database using Step 2 in MySQL Workbench.

### Port 8080 is already in use
Stop the other process or set `$env:SERVER_PORT = "8081"` before running Maven. If you change the backend port, update the frontend API URL and restart Vite.

### Frontend cannot reach the backend
Confirm the backend health endpoint opens at `http://localhost:8080/actuator/health`. Open browser Developer Tools (`F12`) and inspect the Console and Network tabs for the failed request.

### Maven build or Java version issue
Run `java -version` and `mvn -version`. Both should use JDK 17 or newer. If you have multiple JDKs installed, correct `JAVA_HOME` and restart PowerShell.

### NPM certificate error
If `npm install` reports a certificate/issuer error, check your company's proxy or certificate configuration. Do not disable TLS verification globally as a workaround.

## Scope and security note

This is a local proof of concept, not a production deployment. Authentication and authorization are not implemented, so use synthetic demo data and do not expose the backend or frontend dev server to a public network. Credentials are read from environment variables rather than committed into the project. No external integration or AI service is required.

## Known limitations

- The dashboard statistics are calculated from at most 10 handovers. Only the total count is accurate.
- Saving a handover replaces its work items, knowledge entries and links, so their IDs change on every save.
- Deletes are permanent. No backup or restore is built in.
- Status and type values are stored as entered and are not validated by the backend.
- Concurrent edits are last-write-wins.

