# TraceRoot

## Evidence-Driven Production Incident Investigation Agent

TraceRoot is an evidence-driven agentic workflow for investigating production incidents.

Instead of immediately producing a root-cause guess, TraceRoot maintains an explicit investigation state, gathers evidence, generates competing hypotheses, selects the next investigation action based on the current objective, executes investigation tools, and verifies the highest-confidence hypothesis.

The final output is a structured root-cause report containing:

- Root cause
- Exact source location
- Failure mechanism
- Causal chain
- Supporting evidence
- Confidence
- Verification result
- Recommended remediation

---

## Why TraceRoot?

Production incidents rarely have a single useful source of information.

An engineer may need to correlate:

- Incident reports
- Production logs
- Stack traces
- Repository source code
- Configuration
- Runtime behavior
- Regression tests

A useful investigation agent should answer:

1. What evidence do I have?
2. What does that evidence suggest?
3. What hypothesis best explains the incident?
4. What evidence is still missing?
5. What should I investigate next?
6. Can the hypothesis be verified?
7. What is the exact root cause?
8. What remediation should be applied?

TraceRoot models this investigation process explicitly as state transitions.

---

## Core Architecture

```text
                    Incident
                       |
                       v
                Evidence Collector
                       |
                       v
              Investigation State
                       |
                       v
              Objective-Driven Planner
                       |
                       v
              Investigation Tools
             /          |           \
            /           |            \
   Repository       File         Verification
      Search      Inspection
            \           |            /
             \          |           /
                       v
                 State Updater
                       |
                       v
                New Evidence
                       |
                       v
              Hypothesis Generation
                       |
                       v
                  Verification
                       |
                       v
               Root Cause Report
```

---

## Agent Investigation Flow

The investigation follows an explicit objective-driven loop:

```text
1. Load incident
       |
2. Collect initial evidence
       |
3. Create investigation state
       |
4. Determine current objective
       |
5. Plan next action
       |
6. Execute investigation tool
       |
7. Update investigation state
       |
8. Generate/refine hypotheses
       |
9. Verify highest-confidence hypothesis
       |
10. Build root-cause report
```

For INC-001, the agent currently performs:

```text
search_repository
        |
        | pool.connect
        v
search_repository
        |
        | connection.release
        v
verify_hypothesis
        |
        v
confirmed
```

---

## Current Benchmark: INC-001

TraceRoot includes a controlled production-style incident benchmark.

### Incident

**Orders API Production Incident**

The `POST /orders` endpoint intermittently returns HTTP 500 errors under increased request volume.

The production failure is:

```text
Connection pool exhausted
```

while:

```text
GET /health
```

continues to operate.

### Root Cause

The `createOrder` function acquires a database connection:

```typescript
const connection = await pool.connect();
```

but does not release the connection in the `finally` block.

The active connections therefore accumulate until the connection pool reaches its maximum capacity of five connections.

### Exact Location

```text
src/orders/service.ts
createOrder
```

### Causal Chain

```text
createOrder acquires connection
        |
        v
connection is not released
        |
        v
active connections accumulate
        |
        v
pool reaches capacity = 5
        |
        v
Connection pool exhausted
        |
        v
POST /orders returns HTTP 500
```

### Remediation

Restore:

```typescript
connection.release();
```

inside the `finally` block of `createOrder`.

---

## Project Structure

```text
traceroot-agent/
├── incidents/
│   └── INC-001/
│       ├── evidence/
│       │   ├── application.log
│       │   ├── incident.md
│       │   └── stacktrace.txt
│       ├── repository/
│       │   ├── src/
│       │   └── tests/
│       ├── ground-truth.json
│       └── metadata.json
│
├── src/
│   ├── agent/
│   │   ├── action-planner.ts
│   │   ├── evidence-collector.ts
│   │   ├── hypothesis-generator.ts
│   │   ├── investigation-loop.ts
│   │   ├── investigation-state.ts
│   │   ├── investigator.ts
│   │   ├── report-builder.ts
│   │   ├── state-updater.ts
│   │   ├── tool-executor.ts
│   │   └── run.ts
│   │
│   ├── baseline/
│   │   ├── investigator.ts
│   │   └── run.ts
│   │
│   ├── evaluator/
│   │   ├── evaluator.ts
│   │   ├── evaluator.test.ts
│   │   └── run.ts
│   │
│   ├── tools/
│   │   ├── search-repository.ts
│   │   ├── inspect-file.ts
│   │   └── verify-hypothesis.ts
│   │
│   └── domain/
│       ├── incident.ts
│       └── investigation.ts
│
├── package.json
├── package-lock.json
├── tsconfig.json
└── README.md
```

---

## Requirements

- Node.js 22 or newer
- npm

The Node.js requirement is declared in `package.json`:

```text
node >=22
```

The current benchmark does not require an external API key or LLM provider.

The current implementation is deterministic and operates against the controlled incident fixture, repository investigation tools, and executable regression tests.

---

## Installation

Install dependencies:

```bash
npm install
```

---

## Running the Agent

Run the human-readable investigation:

```bash
npm run agent
```

Expected result includes:

```text
Status         : confirmed
Evidence items : 15
Hypotheses     : 2
Tool actions   : 3
```

The report identifies:

```text
Root cause   : Database connection leak caused by failing to release acquired connections.
Location     : src/orders/service.ts
Function     : createOrder
Confidence   : 90%
```

---

## JSON Output

For machine-readable output:

```bash
npm run agent -- --json
```

---

## Testing

Run TypeScript type checking:

```bash
npm run typecheck
```

Run the complete TraceRoot test suite:

```bash
npm test
```

The current suite contains 20 tests covering:

- Evidence collection
- Evidence deduplication
- Repository search
- Repository inspection
- Hypothesis generation
- Investigation state
- State transitions
- Action planning
- Tool execution
- Hypothesis verification
- Investigation loop
- Root-cause report generation
- Baseline evaluation
- Agent evaluation

Expected result:

```text
20 tests
20 pass
0 fail
```

---

## Fixture Verification

Run the controlled incident repository tests:

```bash
npm run fixture:test
```

These tests reproduce the database connection leak behavior and verify that repeated order creation exhausts the connection pool when connections are not released.

---

## Baseline vs Agent Evaluation

TraceRoot includes both:

- A simple baseline investigator
- The objective-driven investigation agent

Run:

```bash
npm run evaluate
```

The evaluator compares both systems using:

- Root-cause identification
- Verification
- Evidence
- Remediation
- Exact source location

Current evaluation:

```text
Baseline overall: 0.60
Agent overall:    1.00
```

The agent identifies:

```text
3/3 required evidence signals
```

and the exact source location:

```text
src/orders/service.ts
createOrder
```

This demonstrates that the agent produces a more complete investigation result than the simpler baseline.

---

## Evidence-Driven Design

TraceRoot separates evidence gathering, hypothesis generation, investigation planning, verification, and reporting.

```text
Evidence
   |
   v
Hypotheses
   |
   v
Investigation Objective
   |
   v
Tool Action
   |
   v
New Evidence
   |
   v
Verification
   |
   v
Root Cause Report
```

The investigation state tracks:

- Current objective
- Evidence
- Hypotheses
- Investigation actions
- Verification status
- Investigation status
- Final report

---

## Investigation Tools

### Repository Search

Searches the incident repository for relevant implementation and configuration evidence.

Examples:

```text
pool.connect
connection.release
maxConnections
Connection pool exhausted
```

### File Inspection

Inspects a specific repository file when deeper source-level evidence is required.

### Hypothesis Verification

Executes the incident repository's regression tests against the selected hypothesis.

For INC-001, the fixture failure confirms the connection-leak hypothesis.

---

## Verification

TraceRoot does not treat a high-confidence hypothesis as automatically proven.

The selected hypothesis is verified against the executable incident fixture.

```text
Hypothesis
    |
    v
Fixture regression tests
    |
    v
Connection pool exhaustion reproduced
    |
    v
Verification: confirmed
```

The verification result becomes part of the final root-cause report.

---

## Example Result

```text
✓ ROOT CAUSE CONFIRMED

Root cause   : Database connection leak caused by failing to release acquired connections.
Location     : src/orders/service.ts
Function     : createOrder
Confidence   : 90%

Mechanism:
  createOrder acquires a database connection with pool.connect()
  but does not release it in its finally block.

Remediation:
  Restore connection.release() in the finally block of createOrder.
```

---

## Development Validation

Before submission, run:

```bash
npm run typecheck
npm test
npm run agent
npm run evaluate
git diff --check
git status
```

Expected checkpoint:

```text
typecheck: PASS
tests:     20/20 PASS
agent:     confirmed
evaluation:
  baseline: 0.60
  agent:    1.00
git diff --check: PASS
working tree: clean
```

---

## Current Status

TraceRoot currently has a working end-to-end investigation workflow for INC-001.

Implemented capabilities include:

- Incident loading
- Evidence collection
- Evidence deduplication
- Repository search
- File inspection
- Explicit investigation state
- Objective-driven action planning
- State transitions
- Competing hypotheses
- Hypothesis verification
- Executable fixture validation
- Root-cause report generation
- Baseline investigator
- Agent-vs-baseline evaluation
- Human-readable CLI output
- JSON output
- Automated tests

The current agent successfully identifies and verifies the INC-001 database connection leak and produces the expected source location and remediation.

---

## License

TBD
