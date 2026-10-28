# CodeSaga API Baseline & Load Testing Executive Report

## 🎯 Test Execution Overview
- **Target Host**: `http://localhost:5000`
- **Virtual Concurrent Users (VUs)**: `100 Virtual Users`
- **Test Duration**: `60.08 seconds` (1 Minute continuous run)
- **Execution Timestamp**: `2026-10-28T03:03:04.553Z`

---

## 📋 General API Baseline Scope Definition

### ✅ In-Scope Operational Endpoints (High-Concurrency Baseline)
1. `GET /api/health` — Core backend health probe and MongoDB connectivity check.
2. `GET /` — API root service discovery and version metadata.
3. `GET /api/users/detective@codesaga.io` — User profile discovery and credential status lookup.
4. `GET /api/users/detective@codesaga.io/progress` — User progression state snapshot retrieval.
5. `PUT /api/users/detective@codesaga.io/progress` — User progression update with strict schema validation.

### 🚫 Explicit Exclusions (Separated Test Suites)
- **`POST /api/users/login-password` & `POST /api/users/set-password`**: Authentication endpoints are protected by SEC-02 sliding-window rate limiting (10 attempts per 15 minutes per IP address) and computationally intensive cryptographic operations (`bcrypt.compare` work factor 12). Subjecting authentication to high-frequency unthrottled load testing from a single IP is architecturally inappropriate and triggers intentional HTTP 429 rate limiting. Authentication resilience is tested separately in the dedicated authentication stress suite (`load-tests/auth-stress-test.js`).

---

## 📊 Summary Performance Metrics

| Performance Metric | Measured Value | Standard Target | Status |
| :--- | :--- | :--- | :--- |
| **Requests Per Second (RPS)** | **4217.37 req/sec** | > 100 req/sec | ✅ PASSED |
| **Total Requests Processed** | **2,53,367 requests** | Thousands of reqs | ✅ PASSED |
| **Average Response Time** | **23.67 ms** | < 300 ms | ✅ PASSED |
| **Minimum Response Time** | **0.22 ms** | < 100 ms | ✅ PASSED |
| **Maximum Response Time** | **262.92 ms** | < 2000 ms | ✅ PASSED |
| **p50 Latency (50% of requests)** | **20.52 ms** | < 200 ms | ✅ PASSED |
| **p90 Latency (90% of requests)** | **31.34 ms** | < 500 ms | ✅ PASSED |
| **p95 Latency (95% of requests)** | **37.54 ms** | < 800 ms | ✅ PASSED |
| **p99 Latency (99% of requests)** | **66.91 ms** | < 1200 ms | ✅ PASSED |
| **Success Rate (%)** | **100.00%** | >= 99.0% | ✅ PASSED |
| **Error Rate (%)** | **0.00%** | <= 1.0% | ✅ PASSED |
| **Connection Errors** | **0** | 0 errors | ✅ PASSED |
| **Request Timeouts** | **0** | 0 timeouts | ✅ PASSED |

---

## 📡 HTTP Status Code Distribution

| HTTP Status / Event | Request Count | Percentage | Description / Diagnostic Details |
| :--- | :---: | :---: | :--- |
| **HTTP 200** | **2,53,367** | 100.00% | Success (OK) |

---

## 🔍 Endpoint Breakdown Analysis

| Endpoint Name | HTTP Method | Path | Request Count | Avg Latency (ms) | Errors | Status Codes | Failure Cause / Diagnostics |
| :--- | :---: | :--- | :---: | :---: | :---: | :--- | :--- |
| **Health Check** | `GET` | `/api/health` | 50,677 | 23.52 ms | 0 | 200: 50,677 | None (100% Success) |
| **Root API Info** | `GET` | `/` | 50,674 | 23.72 ms | 0 | 200: 50,674 | None (100% Success) |
| **User Profile Lookup** | `GET` | `/api/users/detective@codesaga.io` | 50,670 | 23.77 ms | 0 | 200: 50,670 | None (100% Success) |
| **Get User Progress** | `GET` | `/api/users/detective@codesaga.io/progress` | 50,672 | 23.64 ms | 0 | 200: 50,672 | None (100% Success) |
| **Update Progress Snapshot** | `PUT` | `/api/users/detective@codesaga.io/progress` | 50,674 | 23.68 ms | 0 | 200: 50,674 | None (100% Success) |

---

## 🔬 Four-Part Architectural Conclusion & Verdict

### 1. Application / Server Errors
- **Measured Value**: **0 errors** (Zero HTTP 500, 502, 503, or 504 errors).
- **Finding**: All requests to core operational API routes executed without application exceptions, unhandled promise rejections, or database connectivity faults.

### 2. Rate-Limit Rejections
- **Measured Value**: **0 rate-limit rejections** in the baseline suite.
- **Finding**: General operational endpoints are unthrottled, maintaining smooth throughput. Authentication endpoints remain strictly guarded by SEC-02 (`authRateLimiter`, 10 req/15m) and are evaluated in the dedicated `auth-stress-test.js` suite.

### 3. Connection Errors and Timeouts
- **Measured Value**: **0 connection errors (`ECONNREFUSED`), 0 socket resets, 0 timeouts (`ETIMEDOUT`)**.
- **Finding**: The Node.js event loop and libuv threadpool sustained continuous concurrency across all 100 virtual users without dropping connections or exceeding the 5,000ms request threshold.

### 4. Baseline Performance Metrics
- **Throughput**: **4217.37 req/sec** (exceeds the 100 req/sec benchmark).
- **Latency Profile**: Average response time of **23.67 ms** with 99% of all requests resolved within **66.91 ms**.
- **Success Rate**: **100.00%** (2,53,367 of 2,53,367 requests), dynamically evaluated and verified to satisfy the **>= 99.0% standard target**.
