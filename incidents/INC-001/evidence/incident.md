# INC-001 Production Incident

## Summary

The Orders API is experiencing elevated failures on the order creation endpoint.

## Observed behavior

- GET /health continues to return HTTP 200.
- POST /orders intermittently returns HTTP 500.
- Failures become visible under increased request volume.
- The application reports database-related errors.
- The service remains running while requests begin failing.

## Impact

Order creation requests are failing, preventing some customers from successfully creating orders.

## Investigation task

Determine the root cause of the incident using the incident description, application logs, stack traces, repository source code, tests, and available project history.

The investigation should identify:

1. The primary failure mechanism.
2. The source-code location responsible.
3. Why the failure occurs under increased request volume.
4. The minimal corrective action.
