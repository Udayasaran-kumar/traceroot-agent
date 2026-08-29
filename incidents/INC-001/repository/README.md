# Orders API Fixture

A small TypeScript service used as a controlled production-incident
benchmark for the TraceRoot project.

## Purpose

This repository represents a simplified Orders API.

The healthy version is used to establish the expected behavior before
introducing a controlled production defect.

## Expected healthy behavior

- `GET /health` returns HTTP 200.
- `POST /orders` creates an order.
- Database connections are released after operations.
- Repeated order creation does not exhaust the connection pool.

## Commands

Install dependencies:

```bash
npm install


