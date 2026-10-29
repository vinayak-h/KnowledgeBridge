# Quick Start — KnowledgeBridge with Server-Side Pagination

## ⚡ In 3 Steps

### Step 1: Start Backend (Terminal 1)
```powershell
cd C:\personal\VoidStack-without-Docker\knowledgebridge\backend
$env:SERVER_PORT='8081'
mvn spring-boot:run -DskipTests
```

**Expected Output:**
```
Tomcat started on port 8081 (http) with context path '/'
Started KnowledgeBridgeApplication in 8.128 seconds
```

### Step 2: Start Frontend (Terminal 2)
```powershell
cd C:\personal\VoidStack-without-Docker\knowledgebridge\frontend
npm run dev
```

**Expected Output:**
```
Vite v8.3.4 ready in 1155 ms
➜  Local:   http://localhost:5174/
```

### Step 3: Open Application
**Browser:** http://localhost:5174

---

## ✅ Verification Checklist

- [ ] Dashboard loads
- [ ] Shows "Total handovers: 17"
- [ ] Shows "In progress: 8"
- [ ] Search box visible
- [ ] Status and Type filters visible
- [ ] Pagination controls visible (First/Prev/Next/Last)
- [ ] Page size selector (10/20/50)

---

## 🎯 What to Try

### 1. Search
Type "payments" in the search box → Results filter within 300ms

### 2. Filter by Status
Select "Shared" → See only shared handovers

### 3. Pagination
- Click "Next" → Load next 10 items
- Click "Last" → Jump to last page
- Change page size to "20" → Reload with 20 items

### 4. Combined Filters
- Search: "API"
- Status: "Draft"
- Page size: "50"
- Result: Filtered and paginated

---

## 🔧 Troubleshooting

### Backend won't start
```
Error: Access denied for user 'root'
Solution: Verify MySQL password is 'root' in application.yml
```

### Port 8080 in use
```
Set different port: $env:SERVER_PORT='8081'
```

### Frontend can't reach backend
```
Check .env.local: VITE_API_URL=http://localhost:8081/api/handovers
```

### No data showing
```
1. Check backend is running (http://localhost:8081/actuator/health)
2. Check CORS is enabled (no errors in browser console)
3. Refresh page (Ctrl+R)
```

---

## 📊 Dashboard Overview

**Statistics (Updated in Real-Time):**
- Total handovers
- In progress (drafts + active)
- Tracked work items
- Shared handovers

**Handover List:**
- Paginated (10/20/50 per page)
- Searchable
- Filterable by status and type
- Sortable

**Navigation:**
- First, Previous, Next, Last buttons
- Page indicator
- Page size selector
- Refresh button

---

## 🔌 API Endpoints

### List with Pagination
```
GET /api/handovers?page=0&size=10&sort=updatedAt&direction=DESC
```

### Search
```
GET /api/handovers?page=0&size=10&search=payments
```

### Filter
```
GET /api/handovers?page=0&size=10&status=SHARED&type=LEAVE
```

### Health Check
```
GET /actuator/health
```

---

## 📁 Key Files

| File | Purpose |
|------|---------|
| `backend/.../HandoverRepository.java` | Database queries |
| `backend/.../HandoverController.java` | REST endpoints |
| `backend/.../CorsConfig.java` | Frontend communication |
| `frontend/src/App.jsx` | React UI + pagination |

---

## 💡 Architecture

```
Browser (React)
    ↓ HTTP
Vite Dev Server (5174)
    ↓ Proxied requests
Spring Boot (8081)
    ↓ SQL
MySQL (3306)
```

---

## ⚙️ Configuration

**Backend:** `backend/src/main/resources/application.yml`
```yaml
server:
  port: ${SERVER_PORT:8081}
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/knowledgebridge
    username: root
    password: root
```

**Frontend:** `frontend/.env.local`
```
VITE_API_URL=http://localhost:8081/api/handovers
```

---

## ✨ Features

✅ Server-side pagination (10/20/50 items)  
✅ Search debouncing (300ms)  
✅ Advanced filtering (status, type)  
✅ Sorting (updatedAt, createdAt, title, creator)  
✅ Accurate dashboard statistics  
✅ Responsive UI  
✅ Error handling  
✅ CORS enabled  

---

## 📈 Performance

- First page load: ~10-50ms
- Search response: <1 second
- Database query: LIMIT/OFFSET optimized
- No N+1 queries

---

## 🚀 Status

✅ Backend: Running on 8081  
✅ Frontend: Running on 5174  
✅ Database: Connected  
✅ API: Responding  
✅ Application: Ready to use  

---

## 📚 For More Information

- **[Architecture & Design](docs/ARCHITECTURE.md)** – Complete system architecture, API reference, database schema
- **[Implementation Status](docs/IMPLEMENTATION_STATUS.md)** – Features, limitations, security gaps, testing status
- **[Testing Guide](docs/TESTING.md)** – Build commands, test procedures, coverage analysis
- **[Root README](README.md)** – Installation and setup guide
