# KnowledgeBridge Architecture

**Date:** October 28, 2026  
**Version:** 1.0 — Current Implementation

This document describes the actual system architecture, component responsibilities, data flow, and API contracts for KnowledgeBridge.

---

## Table of Contents

1. [System Architecture](#system-architecture)
2. [Frontend Architecture](#frontend-architecture)
3. [Backend Architecture](#backend-architecture)
4. [Database Schema](#database-schema)
5. [API Specification](#api-specification)
6. [Data Flow](#data-flow)
7. [Pagination, Filtering, and Search](#pagination-filtering-and-search)
8. [Configuration](#configuration)

---

## System Architecture

### High-Level Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    Web Browser                              │
│               (Chrome, Firefox, Safari)                     │
└────────────────────────┬────────────────────────────────────┘
                         │ HTTP/CORS
                         │ Port 5173-5175
                         ↓
┌─────────────────────────────────────────────────────────────┐
│         Frontend — React 19 + Vite                          │
│         Location: ./frontend                                │
│         Port: 5173 (dev) / served static (prod)             │
│                                                              │
│  • App.jsx – Main orchestrator                             │
│  • services/api.js – API communication                     │
│  • utils/ – Constants, formatters, validation              │
│  • Responsive UI with Tailwind CSS                         │
└────────────────────────┬────────────────────────────────────┘
                         │ REST API
                         │ Port 8080 or 8081
                         ↓
┌─────────────────────────────────────────────────────────────┐
│         Backend — Spring Boot 3.4.5                        │
│         Location: ./backend                                 │
│         Port: 8081 (recommended)                            │
│                                                              │
│  • HandoverController – REST endpoints                     │
│  • HandoverRepository – Database queries                   │
│  • CorsConfig – Cross-origin policy                        │
│  • Entities – Domain model (Handover, etc.)                │
│  • Validation – @Valid, @NotBlank, @Size                  │
└────────────────────────┬────────────────────────────────────┘
                         │ JDBC
                         │ mysql:3306
                         ↓
┌─────────────────────────────────────────────────────────────┐
│         Database — MySQL 8                                 │
│         Location: Local instance                            │
│         Port: 3306                                          │
│                                                              │
│  • handovers – Main records                                │
│  • work_items – Subtasks per handover                      │
│  • knowledge_entries – Decisions, issues, etc.             │
│  • reference_links – Documentation references              │
└─────────────────────────────────────────────────────────────┘
```

### Key Characteristics

- **No external services:** Everything runs locally on Windows
- **No Docker required:** MySQL Server, Java 17, Node.js 20+
- **Separation of concerns:** Frontend, backend, database layers
- **Stateless backend:** Each request is independent
- **Server-side pagination:** Efficient database queries with filtering
- **CORS enabled:** Frontend can communicate with backend

---

## Frontend Architecture

### Technology Stack

- **React 19** – UI framework with hooks
- **Vite 8.3.4** – Build tool and development server
- **Tailwind CSS 3.4** – Styling
- **Lucide React 1.57** – Icon library
- **Node.js 20.19+** – Runtime

### Directory Structure

```
frontend/
├── index.html              # Entry HTML
├── package.json            # Dependencies
├── vite.config.js          # Vite configuration
├── tailwind.config.js      # Tailwind CSS config
├── .env.local              # Environment variables
├── README.md               # Frontend-specific setup (optional)
└── src/
    ├── main.jsx           # React bootstrap
    ├── App.jsx            # Main component (265 lines)
    ├── styles.css         # Tailwind + custom styles
    ├── services/
    │   └── api.js         # API communication layer
    ├── utils/
    │   ├── constants.js   # App-wide constants (enums, defaults)
    │   ├── formatters.js  # Display formatting (date, enum labels)
    │   └── validation.js  # Form validation rules
    └── hooks/             # (Empty, future home for custom hooks)
```

### Component Architecture

#### App.jsx – Main Application Component (265 lines)

**Responsibilities:**
- Global state management (React hooks)
- Screen navigation (dashboard vs. editor)
- API orchestration (service layer calls)
- Form handling (create/edit/delete)
- Pagination and filtering

**State Variables (17 total):**
- Screen/tab management: `screen`, `tab`, `id`, `loading`, `error`, `notice`
- Form data: `form` (current handover being edited)
- Pagination: `currentPage`, `pageSize`, `pageData`
- Filters: `search`, `statusFilter`, `typeFilter`
- Statistics: `globalStats`, `findings` (completeness check results)

**Key Functions:**
- `loadPage(pageNum, size)` – Fetch paginated data with filters
- `loadGlobalStats()` – Load statistics from all matching records
- `handlePageSizeChange(newSize)` – Update page size and reload
- `save()` – Create or update handover
- `create()` – Open editor with blank form
- `edit(id)` – Load handover and open editor

#### services/api.js – API Communication Layer

**Exported Functions (7 total):**

1. **`listHandovers(filters, pagination)`**
   - Parameters: `{ search, status, type }`, `{ page, size, sort, direction }`
   - Returns: Paginated list with metadata (totalPages, hasNext, last)
   - Backend endpoint: `GET /api/handovers`

2. **`loadHandoverStats(filters)`**
   - Parameters: `{ search, status, type }`
   - Returns: Full list (size=1000) for statistics calculation
   - Backend endpoint: `GET /api/handovers?size=1000`

3. **`getHandover(id)`**
   - Returns: Single handover with all nested entities
   - Backend endpoint: `GET /api/handovers/{id}`

4. **`saveHandover(handover)`**
   - POST if no ID, PUT if ID exists
   - Returns: Saved handover
   - Backend endpoints: `POST /api/handovers`, `PUT /api/handovers/{id}`

5. **`deleteHandover(id)`**
   - Returns: void (204 No Content)
   - Backend endpoint: `DELETE /api/handovers/{id}`

6. **`checkCompleteness(id)`**
   - Returns: `{ valid, findings }` (warnings for missing sections)
   - Backend endpoint: `GET /api/handovers/{id}/completeness`

7. **`exportHandover(id)`**
   - Returns: Blob (Word document)
   - Backend endpoint: `GET /api/handovers/{id}/export`

#### utils/constants.js

**Enums with Display Labels:**
- `HANDOVER_TYPES` – LEAVE, PROJECT_TRANSITION, ROLE_CHANGE, RESPONSIBILITY_TRANSFER
- `STATUSES` – DRAFT, READY, SHARED
- `WORK_ITEM_STATUSES` – NOT_STARTED, IN_PROGRESS, BLOCKED, COMPLETED
- `KNOWLEDGE_TYPES` – DECISION, ISSUE, WORKAROUND, DEPENDENCY, OPEN_QUESTION, GENERAL

**Configuration:**
- `DEFAULT_PAGE_SIZE` = 10
- `PAGE_SIZE_OPTIONS` = [10, 20, 50]
- `SEARCH_DEBOUNCE_MS` = 300
- `BLANK_FORM` – Empty form template
- `INITIAL_STATS` – Default statistics object

#### utils/formatters.js

**Display Functions:**
- `nice(value)` – Convert enum to human-readable label
- `dateText(value)` – Format ISO date to readable format (e.g., "Oct 28, 2026")
- `formatTimestamp(ts)` – Format timestamp with time
- `calculateCompletion(workItems)` – Calculate work progress percentage
- `getInitials(name)` – Extract initials for avatar
- `truncate(text, maxLength)` – Truncate text with ellipsis

#### utils/validation.js

**Form Validation:**
- `validateHandoverForm(form)` – Returns `{ valid, error }`
- Rules:
  - Title: required, max 255 chars
  - Creator: required
  - Dates: end date ≥ start date
  - URLs: Valid URL format for reference links

---

## Backend Architecture

### Technology Stack

- **Java 17**
- **Spring Boot 3.4.5**
  - Spring Web (REST)
  - Spring Data JPA (ORM)
  - Bean Validation (@Valid, @NotBlank, etc.)
  - Spring Boot Actuator (health endpoint)
- **Apache POI** (DOCX generation)
- **MySQL JDBC Driver**

### Directory Structure

```
backend/
├── pom.xml                # Maven dependencies
├── src/main/resources/
│   ├── application.yml    # Configuration (port, datasource)
│   └── schema.sql         # Database initialization
├── src/main/java/com/knowledgebridge/
│   ├── KnowledgeBridgeApplication.java  # Spring Boot main class
│   ├── HandoverController.java          # REST endpoints
│   ├── HandoverRepository.java          # Database queries
│   ├── HandoverService.java             # Business logic
│   ├── ExportService.java               # DOCX generation
│   ├── CorsConfig.java                  # CORS configuration
│   ├── entities/
│   │   ├── Handover.java               # Main entity
│   │   ├── WorkItem.java
│   │   ├── KnowledgeEntry.java
│   │   └── ReferenceLink.java
│   └── dto/
│       ├── HandoverInput.java          # API request DTO
│       ├── HandoverOutput.java         # API response DTO
│       └── PagedResponse.java          # Pagination metadata
└── src/test/java/...                    # Test suite (5 tests)
```

### Entity Relationships

```
Handover (1) ──< WorkItem (many)
         └─ (1) ──< KnowledgeEntry (many)
         └─ (1) ──< ReferenceLink (many)
```

**Handover Entity:**
- `id` (Long) – Primary key
- `title` (String) – Handover title
- `creator` (String) – Author name
- `recipient` (String) – Person receiving handover
- `type` (ENUM) – LEAVE, PROJECT_TRANSITION, ROLE_CHANGE, RESPONSIBILITY_TRANSFER
- `status` (ENUM) – DRAFT, READY, SHARED
- `startDate`, `endDate` (LocalDate) – Timeline
- `summary` (TEXT) – Overview
- `workItems` (List<WorkItem>) – Tasks and work
- `knowledgeEntries` (List<KnowledgeEntry>) – Context and decisions
- `referenceLinks` (List<ReferenceLink>) – Documentation links
- `createdAt`, `updatedAt` (Instant) – Timestamps

---

## Database Schema

### Tables

#### handovers
```sql
CREATE TABLE handovers (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(255) NOT NULL,
  creator VARCHAR(255),
  recipient VARCHAR(255),
  type ENUM('LEAVE','PROJECT_TRANSITION','ROLE_CHANGE','RESPONSIBILITY_TRANSFER'),
  status ENUM('DRAFT','READY','SHARED'),
  start_date DATE,
  end_date DATE,
  summary LONGTEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

#### work_items
```sql
CREATE TABLE work_items (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  handover_id BIGINT NOT NULL FOREIGN KEY REFERENCES handovers(id) ON DELETE CASCADE,
  title VARCHAR(255),
  owner VARCHAR(255),
  due_date DATE,
  status ENUM('NOT_STARTED','IN_PROGRESS','BLOCKED','COMPLETED'),
  blocker LONGTEXT
);
```

#### knowledge_entries
```sql
CREATE TABLE knowledge_entries (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  handover_id BIGINT NOT NULL FOREIGN KEY REFERENCES handovers(id) ON DELETE CASCADE,
  type ENUM('DECISION','ISSUE','WORKAROUND','DEPENDENCY','OPEN_QUESTION','GENERAL'),
  content LONGTEXT
);
```

#### reference_links
```sql
CREATE TABLE reference_links (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  handover_id BIGINT NOT NULL FOREIGN KEY REFERENCES handovers(id) ON DELETE CASCADE,
  title VARCHAR(255),
  url VARCHAR(2048)
);
```

---

## API Specification

### Base URL
```
http://localhost:8081/api
```

### Endpoints

#### 1. List Handovers (with Pagination, Search, Filtering)
```
GET /api/handovers?page=0&size=10&search=...&status=...&type=...
```

**Request Parameters:**
- `page` (int, default=0) – Zero-based page number
- `size` (int, default=10) – Items per page; allowed: 10, 20, 50
- `search` (String, optional) – Text search across title, creator, recipient, summary
- `status` (String, optional) – Filter by status (DRAFT, READY, SHARED)
- `type` (String, optional) – Filter by type (LEAVE, PROJECT_TRANSITION, etc.)
- `sort` (String, default="updatedAt") – Sort field (updatedAt, createdAt, title, creator)
- `direction` (String, default="DESC") – ASC or DESC

**Response: PagedResponse**
```json
{
  "content": [
    { "id": 1, "title": "Q4 Handover", "creator": "Alice", ... },
    ...
  ],
  "page": 0,
  "size": 10,
  "totalElements": 17,
  "totalPages": 2,
  "first": true,
  "last": false,
  "numberOfElements": 10,
  "hasNext": true,
  "hasPrevious": false
}
```

**Error Responses:**
- `400` – Invalid page size or sort field
- `500` – Database error

---

#### 2. Get Single Handover
```
GET /api/handovers/{id}
```

**Response:** Full `Handover` object with nested `workItems`, `knowledgeEntries`, `referenceLinks`

**Error Responses:**
- `404` – Handover not found

---

#### 3. Create Handover
```
POST /api/handovers
Content-Type: application/json

{
  "title": "String",
  "creator": "String",
  "recipient": "String",
  "type": "LEAVE|PROJECT_TRANSITION|ROLE_CHANGE|RESPONSIBILITY_TRANSFER",
  "status": "DRAFT|READY|SHARED",
  "startDate": "2026-10-28",
  "endDate": "2026-11-28",
  "summary": "String",
  "workItems": [...],
  "knowledgeEntries": [...],
  "referenceLinks": [...]
}
```

**Validation:**
- `title`: required, max 255 chars
- `creator`: required
- Dates: `endDate >= startDate`
- URLs: valid format

**Response:** `201 Created` with saved `Handover` object

**Error Responses:**
- `400` – Validation error (includes field-specific messages)

---

#### 4. Update Handover
```
PUT /api/handovers/{id}
Content-Type: application/json

{...}  /* Same payload as POST */
```

**Response:** `200 OK` with updated `Handover`

**Error Responses:**
- `404` – Handover not found
- `400` – Validation error

---

#### 5. Delete Handover
```
DELETE /api/handovers/{id}
```

**Response:** `204 No Content`

**Error Responses:**
- `404` – Handover not found

---

#### 6. Check Completeness
```
GET /api/handovers/{id}/completeness
```

**Response:**
```json
{
  "valid": true,
  "findings": []
}
```

or

```json
{
  "valid": false,
  "findings": [
    "Title is required",
    "At least one work item must be assigned to someone",
    ...
  ]
}
```

**Error Responses:**
- `404` – Handover not found

---

#### 7. Export as Word Document
```
GET /api/handovers/{id}/export
```

**Response:** `application/vnd.openxmlformats-officedocument.wordprocessingml.document` (blob)

The backend generates a `.docx` file using Apache POI with:
- Handover metadata (title, creator, dates)
- Work items table
- Knowledge entries
- Reference links

**Error Responses:**
- `404` – Handover not found
- `500` – Export generation failed

---

#### 8. Health Check (Actuator)
```
GET /actuator/health
```

**Response:**
```json
{
  "status": "UP",
  "components": {
    "db": { "status": "UP" },
    "diskSpace": { "status": "UP" }
  }
}
```

---

## Data Flow

### Handover Creation Flow

```
User fills form in React (App.jsx)
  ↓
Click "Save" button
  ↓
Call api.saveHandover(form)  [services/api.js]
  ↓
POST /api/handovers with form data  [HTTP]
  ↓
HandoverController.create()  [Backend]
  ├─ Validate input @Valid
  ├─ Save to database via repository
  └─ Return saved object with ID
  ↓
Frontend receives saved handover
  ↓
Update local state
  ↓
Show success message
  ↓
Reload dashboard (call loadPage)
```

### Pagination Flow

```
User clicks "Next Page" or changes "Per Page" size
  ↓
Call handlePageSizeChange(newSize) or navigate to next page
  ↓
Call loadPage(pageNum, size)  [App.jsx]
  ↓
Call api.listHandovers(filters, pagination)  [services/api.js]
  ↓
GET /api/handovers?page=0&size=50&search=...&status=...  [HTTP]
  ↓
HandoverRepository.findWithFilters()  [Backend]
  ├─ Apply WHERE: search + status + type
  ├─ Calculate LIMIT/OFFSET for page
  └─ Return Page<Handover> with metadata
  ↓
HandoverController maps to PagedResponse
  ↓
Frontend receives paginated data + metadata
  ↓
Update state: pageData, currentPage
  ↓
Re-render list with pagination controls
  ↓
Buttons disable/enable based on first/last flags
```

### Search & Filtering Flow

```
User types in search box
  ↓
Debounce 300ms (SEARCH_DEBOUNCE_MS)
  ↓
Call handleSearch(value)
  ↓
Reset currentPage = 0
  ↓
Call loadPage(0)  [with updated search state]
  ↓
API receives: search + statusFilter + typeFilter
  ↓
Backend applies filters in WHERE clause before pagination
  ↓
Results are returned with updated statistics
  ↓
Frontend displays filtered + paginated results
```

---

## Pagination, Filtering, and Search

### Server-Side Pagination (Backend)

The backend uses Spring Data JPA `Page<T>` to provide efficient pagination:

1. **Custom Query with Filters** (HandoverRepository.java)
   ```java
   @Query("SELECT h FROM Handover h WHERE " +
     "(:search IS NULL OR LOWER(CONCAT(h.title, ' ', h.creator, ' ', ...)) " +
     "LIKE LOWER(CONCAT('%', :search, '%'))) AND " +
     "(:status IS NULL OR h.status = :status) AND " +
     "(:type IS NULL OR h.type = :type) " +
     "ORDER BY h.updatedAt DESC, h.id DESC")
   Page<Handover> findWithFilters(
     @Param("search") String search,
     @Param("status") String status,
     @Param("type") String type,
     Pageable pageable);
   ```

2. **Filter Application Order:**
   - Filters applied in WHERE clause (before pagination)
   - Pagination (LIMIT/OFFSET) applied to filtered results
   - This ensures accurate totalPages count

3. **Page Metadata Returned:**
   - `totalElements` – Total records matching filters
   - `totalPages` – Calculated from totalElements ÷ size
   - `first` – Boolean, true if page=0
   - `last` – Boolean, true if this is the final page
   - `hasNext` – Boolean, true if more pages exist
   - `hasPrevious` – Boolean, true if not on first page
   - `numberOfElements` – Records in current page

### Frontend Pagination Controls

**App.jsx Pagination UI (lines 220-265):**
```jsx
// First, Previous, Next, Last buttons
// Disabled states based on pageData.first, pageData.last
// Page indicator: "Page X of Y"
// Page size selector: dropdown [10, 20, 50]
```

**Button Disabled Logic:**
- "First" button: `disabled={pageData?.first}`
- "Previous" button: `disabled={pageData?.first}`
- "Next" button: `disabled={pageData?.last}`
- "Last" button: `disabled={pageData?.last}`

### Search Implementation

- **Debounce:** 300ms (defined in constants.js)
- **Trigger:** User types in search box
- **Coverage:** Searches title, creator, recipient, summary (case-insensitive)
- **Scope:** Applies to current page (not all results)

### Statistics

**Global Statistics** (separate from pagination):
- `loadGlobalStats()` fetches ALL matching records (size=1000)
- This is used for dashboard stats that must reflect all filtered results
- Not affected by page size or current page

---

## Configuration

### Backend (application.yml)
```yaml
server:
  port: ${SERVER_PORT:8081}
  servlet:
    context-path: /

spring:
  application:
    name: knowledgebridge
  datasource:
    url: jdbc:mysql://localhost:3306/knowledgebridge
    username: root
    password: root
    driver-class-name: com.mysql.cj.jdbc.Driver
  jpa:
    hibernate:
      ddl-auto: update
    show-sql: false
    properties:
      hibernate:
        dialect: org.hibernate.dialect.MySQL8Dialect
        format_sql: true
  web:
    cors:
      allowed-origins: "http://localhost:5173,http://localhost:5174,http://localhost:5175"
      allowed-methods: "*"
      allowed-headers: "*"

management:
  endpoints:
    web:
      exposure:
        include: health,info
```

**Environment Variables:**
- `SERVER_PORT` – Spring Boot port (default: 8081)
- Database credentials: Update `username` and `password` if MySQL auth differs

### Frontend (.env.local)
```
VITE_API_URL=http://localhost:8081/api/handovers
```

**Build Configuration (vite.config.js):**
- Dev server port: 5173 (or 5174/5175 if needed)
- CORS: Handled by backend CorsConfig

### CORS Configuration (CorsConfig.java)
```java
@Configuration
public class CorsConfig implements WebMvcConfigurer {
  @Override
  public void addCorsMappings(CorsRegistry registry) {
    registry.addMapping("/api/**")
      .allowedOrigins("http://localhost:5173", 
                      "http://localhost:5174", 
                      "http://localhost:5175")
      .allowedMethods("*")
      .allowedHeaders("*")
      .allowCredentials(true);
  }
}
```

---

## Known Limitations

- **No authentication:** Anyone with access to localhost can create/edit/delete handovers
- **No authorization:** No role-based access control
- **No audit logging:** Changes are not logged
- **No concurrency control:** Last write wins (no conflict resolution)
- **Windows-only:** No Docker or multi-platform support
- **Local MySQL only:** No remote database support
- **Single user:** No multi-user collaboration features

---

## Future Enhancements

- OAuth2 / JWT authentication
- Role-based authorization
- Audit logging and change history
- Multi-user collaboration (comments, mentions)
- Template library for common handovers
- Export to PDF / Email integration
- Mobile app

---

**Last Updated:** October 28, 2026  
**Status:** Describes actual implementation, verified October 28, 2026
