# CodeSaga API Baseline & Load Testing Executive Report

## 🎯 Test Execution Overview
- **Target Host**: `http://localhost:5000`
- **Virtual Concurrent Users (VUs)**: `100 Virtual Users`
- **Test Duration**: `60.03 seconds` (1 Minute continuous run)
- **Execution Timestamp**: `2026-08-27T09:19:17.826Z`

---

## 📊 Summary Performance Metrics

| Performance Metric | Measured Value | Standard Target | Status |
| :--- | :--- | :--- | :--- |
| **Requests Per Second (RPS)** | **20345.23 req/sec** | > 100 req/sec | ✅ PASSED |
| **Total Requests Processed** | **1221324 requests** | Thousands of reqs | ✅ PASSED |
| **Average Response Time** | **4.91 ms** | < 300 ms | ✅ PASSED |
| **Minimum Response Time** | **0.07 ms** | < 100 ms | ✅ PASSED |
| **Maximum Response Time** | **102.66 ms** | < 2000 ms | ✅ PASSED |
| **p90 Latency (90% of requests)** | **7.33 ms** | < 500 ms | ✅ PASSED |
| **p95 Latency (95% of requests)** | **8.83 ms** | < 800 ms | ✅ PASSED |
| **p99 Latency (99% of requests)** | **13.65 ms** | < 1200 ms | ✅ PASSED |
| **Success Rate (%)** | **100.00%** | > 99.0% | ✅ PASSED |
| **Error Rate (%)** | **0.00%** | < 1.0% | ✅ PASSED |

---

## 🔍 Endpoint Breakdown Analysis

| Endpoint Name | HTTP Method | Path | Request Count | Avg Latency (ms) | Errors |
| :--- | :---: | :--- | :---: | :---: | :---: |
| **Health Check** | `GET` | `/api/health` | 203556 | 4.90 ms | 0 |
| **Root API Info** | `GET` | `/` | 203549 | 4.91 ms | 0 |
| **User Profile Lookup** | `GET` | `/api/users/detective@codesaga.io` | 203556 | 4.90 ms | 0 |
| **Password Login** | `POST` | `/api/users/login-password` | 203558 | 4.91 ms | 0 |
| **Get User Progress** | `GET` | `/api/users/detective@codesaga.io/progress` | 203557 | 4.91 ms | 0 |
| **Update Progress Snapshot** | `PUT` | `/api/users/detective@codesaga.io/progress` | 203548 | 4.91 ms | 0 |

---

## 💡 Load Test Observations & Performance Verdict
1. **Concurrency Handling**: The CodeSaga Node.js Express server demonstrated stable throughput at **100 concurrent virtual users**, processing **1221324 requests** over 1 minute.
2. **Throughput (RPS)**: Maintained an average throughput of **20345.23 requests per second**.
3. **Response Time Stability**: The average latency remained at **4.91ms**, with the fastest response recorded at **0.07ms** and the peak max latency under load at **102.66ms**.
