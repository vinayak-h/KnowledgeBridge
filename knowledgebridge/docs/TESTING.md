# KnowledgeBridge — Testing Guide

**Date:** October 28, 2026  
**Status:** Build & test commands documented; coverage analysis complete

This document provides commands to build, test, and verify the KnowledgeBridge application.

---

## Table of Contents

1. [Backend Build & Test](#backend-build--test)
2. [Frontend Build & Test](#frontend-build--test)
3. [Manual Testing](#manual-testing)
4. [Test Coverage Analysis](#test-coverage-analysis)
5. [Known Test Gaps](#known-test-gaps)

---

## Backend Build & Test

### Prerequisites

- Java 17+
- Maven 3.9+
- MySQL 8 (running on localhost:3306)

### Build Commands

#### Clean Build (without tests)
```powershell
cd backend
mvn clean install -DskipTests
```

**Expected Output:**
```
[INFO] BUILD SUCCESS
[INFO] Total time: 7.750 s
[INFO] --- install:3.1.4:install (default-install) @ knowledgebridge ---
```

**What it does:**
- Compiles 6 Java source files
- Creates JAR: `target/knowledgebridge-0.0.1-SNAPSHOT.jar`
- Installs JAR to local Maven repository
- Time: ~7-8 seconds

#### Build with Tests
```powershell
cd backend
mvn clean install
```

**Expected Output:**
```
[INFO] BUILD SUCCESS
[INFO] Tests run: 5, Failures: 0, Errors: 0
```

**What it does:**
- Compiles sources
- Runs test suite
- Creates JAR
- Time: ~12-15 seconds

### Test Commands

#### Run All Tests
```powershell
cd backend
mvn test -q
```

**Output:**
```
[INFO] Running com.knowledgebridge.KnowledgeBridgeApplicationTests

Tests run: 5, Failures: 0, Errors: 0, Skipped: 0
```

#### Run Specific Test Class
```powershell
cd backend
mvn test -Dtest=KnowledgeBridgeApplicationTests
```

#### Run with Detailed Output
```powershell
cd backend
mvn test
```

(Removes `-q` flag for verbose output)

### Test Coverage (Backend)

**Current Status:** ~30% code coverage (estimated)

**Test Suite:** `src/test/java/com/knowledgebridge/KnowledgeBridgeApplicationTests.java`

**Test Cases (5 total):**

| Test | Endpoint | Expected Status | What It Tests |
|------|----------|-----------------|---------------|
| `unknownHandoverReturnsNotFound` | GET /api/handovers/99 | 404 | Non-existent handover |
| `unknownRouteReturnsNotFound` | GET /api/nope | 404 | Invalid route |
| `unsupportedMethodReturnsMethodNotAllowed` | PATCH /api/handovers/1 | 405 | Invalid HTTP method |
| `blankTitleIsRejectedWithFieldMessage` | POST with blank title | 400 | Input validation |
| `deleteUnknownHandoverReturnsNotFound` | DELETE /api/handovers/7 | 404 | Delete non-existent |

**Verification (Oct 28, 2026):** ✅ All 5 tests pass (100%)

---

## Frontend Build & Test

### Prerequisites

- Node.js 20.19+ or 22.12+
- npm 10+ (comes with Node.js)

### Build Commands

#### Development Server
```powershell
cd frontend
npm run dev
```

**Expected Output:**
```
VITE v8.3.4 ready in 238 ms

➜  Local:   http://localhost:5173/
➜  press h to show help
```

**What it does:**
- Starts Vite dev server on port 5173
- Enables hot module reloading (HMR)
- Watches source files for changes
- Ready for manual testing
- Time: ~1 second

#### Production Build
```powershell
cd frontend
npm run build
```

**Expected Output:**
```
vite v8.3.4 building for production...
✓ 1,924 modules transformed
dist/index.html 0.60 kB
dist/assets/index.js 261.64 kB
dist/assets/index.css 24.48 kB
Built in 1.11s
```

**What it does:**
- Compiles React with optimizations
- Bundles into `dist/` folder
- Minifies CSS and JavaScript
- Ready for deployment
- Time: ~1-2 seconds

#### Preview Build Locally
```powershell
cd frontend
npm run build
npm run preview
```

**Expected Output:**
```
  ➜  Local:   http://localhost:4173/
```

Allows testing production build locally before deployment.

### Test Commands

#### Lint with ESLint (if configured)
```powershell
cd frontend
npm run lint
```

**Note:** Linting is not currently configured in this project. Command may not exist.

### Manual Testing Checklist

All frontend testing is currently **manual**. No automated test suite is configured.

#### Dashboard Loading
- [ ] Browser loads http://localhost:5174
- [ ] No console errors (press F12 → Console tab)
- [ ] Page title shows "KnowledgeBridge"
- [ ] Hero section displays with call-to-action
- [ ] Handover list shows items (or "No handovers" if empty)
- [ ] Dashboard statistics display (Total, In Progress, Shared, Work Items)

#### Pagination
- [ ] "Per Page" dropdown shows options: 10, 20, 50
- [ ] Pagination buttons appear: First, Previous, Next, Last
- [ ] Page indicator shows "Page X of Y"
- [ ] Clicking "Next" loads next page
- [ ] Clicking "Last" jumps to last page
- [ ] Clicking "First" returns to page 1
- [ ] Page size change (e.g., 10 → 50) reloads data correctly
- [ ] Buttons disable appropriately on first/last page

#### Search & Filtering
- [ ] Typing in search box filters results (debounce ~300ms)
- [ ] Status filter (DRAFT, READY, SHARED) works
- [ ] Type filter (LEAVE, PROJECT_TRANSITION, etc.) works
- [ ] Combining search + status + type filters works
- [ ] Filters reset pagination to page 1
- [ ] Clear search returns full list

#### CRUD Operations
- [ ] Clicking "New Handover" opens editor with blank form
- [ ] Filling form and clicking "Save" creates handover
- [ ] Editing an existing handover works
- [ ] Deleting a handover removes it from list
- [ ] Form validation shows error for blank title
- [ ] Form validation shows error for invalid date range

#### Export Functionality
- [ ] Clicking "Export" on a handover generates Word document
- [ ] Downloaded file has `.docx` extension
- [ ] Opening .docx in Word shows formatted handover content
- [ ] All sections (work items, knowledge, links) are included

#### Responsiveness
- [ ] Application displays correctly on desktop (1920x1080)
- [ ] Application displays correctly on tablet (768px width)
- [ ] Application displays correctly on mobile (375px width)
- [ ] Navigation menu collapses on mobile
- [ ] Tables/lists are scrollable on small screens

#### Error Handling
- [ ] Stop backend, see error message in dashboard
- [ ] Invalid form shows validation messages
- [ ] Deleted handover shows appropriate message
- [ ] API errors display user-friendly messages

---

## Test Coverage Analysis

### Backend Coverage

**What is tested:**
- ✅ HTTP status codes (404, 405, 400)
- ✅ Input validation (blank fields rejected)
- ✅ Error responses (structured messages)
- ✅ Route handling (unknown routes return 404)

**What is NOT tested:**
- ❌ Successful handover creation (no happy-path test)
- ❌ Pagination logic
- ❌ Search and filtering
- ❌ Export functionality
- ❌ Statistics calculation
- ❌ Data updates (PUT, PATCH)
- ❌ Completeness checking
- ❌ Database persistence
- ❌ CORS configuration
- ❌ Integration with MySQL

**Coverage Estimate:** ~30% (error paths only, no happy paths)

### Frontend Coverage

**What is tested:**
- ❌ **Nothing** – No automated tests configured

**Manual verification (Oct 28, 2026):**
- ✅ App loads without errors
- ✅ Pagination works correctly
- ✅ Search debounces and filters
- ✅ CRUD operations function
- ✅ Export generates valid .docx
- ✅ No console errors or warnings
- ✅ Pagination bug is fixed

**Coverage Estimate:** ~0% (manual testing only)

---

## Known Test Gaps

### High Priority (Should Test)

| Gap | Impact | Effort | Example Test |
|-----|--------|--------|--------------|
| **Happy path tests** | Critical | 1-2 days | `POST /api/handovers` with valid data → 201 Created |
| **Pagination logic** | High | 2-3 days | Verify LIMIT/OFFSET works, page counts correct |
| **Search filtering** | High | 1-2 days | Search returns only matching results |
| **Export generation** | High | 1-2 days | Verify .docx structure and content |
| **Frontend UI tests** | High | 2-3 weeks | Jest + React Testing Library for components |
| **End-to-end tests** | Medium | 1-2 weeks | Cypress/Playwright for full workflows |

### Medium Priority (Should Consider)

| Gap | Impact | Effort |
|-----|--------|--------|
| Concurrency tests | Medium | 2-3 days |
| Performance/load tests | Medium | 2-3 days |
| Security scanning | Medium | 1-2 days |
| Database integrity tests | Medium | 1-2 days |
| API contract tests | Low | 1 day |

### Recommended Testing Strategy

**Phase 1 (1-2 weeks):** Add happy-path backend tests
- Create handover (201)
- Update handover (200)
- Delete handover (204)
- List with pagination
- Search and filter
- Completeness check

**Phase 2 (2-3 weeks):** Frontend unit tests
- Component rendering
- User interactions
- State management
- API calls

**Phase 3 (1-2 weeks):** Integration & E2E tests
- Full handover lifecycle
- Pagination workflows
- Search with filters
- Export functionality

---

## Running Tests in CI/CD

### GitHub Actions Example

```yaml
name: Build and Test

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v2
    
    - name: Set up Java
      uses: actions/setup-java@v2
      with:
        java-version: '17'
    
    - name: Run backend tests
      run: cd backend && mvn clean test
    
    - name: Set up Node
      uses: actions/setup-node@v2
      with:
        node-version: '20'
    
    - name: Run frontend build
      run: cd frontend && npm install && npm run build
```

---

## Quick Test Commands Reference

### Backend
```powershell
# Build only
mvn clean install -DskipTests

# Build + test
mvn clean install

# Test only
mvn test -q

# Test with verbose output
mvn test
```

### Frontend
```powershell
# Development server
npm run dev

# Production build
npm run build

# Preview production build
npm run preview

# Lint (if configured)
npm run lint
```

---

## Test Results (Oct 28, 2026)

### Backend Tests
```
Tests run: 5
Failures: 0
Errors: 0
Skipped: 0
Pass rate: 100%
Duration: ~4 seconds
```

✅ **Status:** All tests passing

### Frontend Build
```
Modules transformed: 1,924
Errors: 0
Warnings: 0
Duration: 1.11s
Output: dist/
```

✅ **Status:** Build successful

### Manual Testing
```
Dashboard load: ✅ No errors
Pagination: ✅ Working correctly
Search: ✅ Filters applied
CRUD: ✅ All operations working
Export: ✅ Valid .docx generated
```

✅ **Status:** All manual tests passed

---

## Troubleshooting

### Backend Build Fails
**Error:** `[ERROR] COMPILATION ERROR`

**Solution:**
- Ensure Java 17+ is installed: `java -version`
- Ensure Maven 3.9+ is installed: `mvn -version`
- Clear Maven cache: `mvn clean`

### Frontend Build Fails
**Error:** `ERR! code ERESOLVE`

**Solution:**
- Clear npm cache: `npm cache clean --force`
- Delete node_modules: `rm -r node_modules`
- Reinstall: `npm install`

### Tests Cannot Find MySQL
**Error:** `Access denied for user 'root'`

**Solution:**
- Ensure MySQL is running on localhost:3306
- Update `backend/src/main/resources/application.yml` with correct credentials
- Default: username=root, password=root

### Frontend Cannot Connect to Backend
**Error:** CORS error in browser console

**Solution:**
- Ensure backend is running on port 8081
- Check `frontend/.env.local`: `VITE_API_URL=http://localhost:8081/api/handovers`
- Verify CORS is enabled in backend (`CorsConfig.java`)

---

**Last Updated:** October 28, 2026  
**Next Review:** After adding frontend test suite
