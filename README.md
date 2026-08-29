# TraceRoot

Evidence-driven agentic workflow for production incident investigation.

## Problem

Production incident investigation requires engineers to correlate fragmented evidence across logs, source code, stack traces, configuration, tests, and recent changes.

## Target User

Software engineers and on-call developers investigating production incidents.

## Approach

TraceRoot investigates an incident, evaluates competing root-cause hypotheses, verifies findings where possible, and produces an evidence-backed diagnosis.

## Evaluation

The project compares a simple baseline against the final agentic workflow using the same controlled incident cases.

### Primary Metric

Root Cause Identification Accuracy.

## Status

🚧 Under development.

## Project Structure

- `src/` — application and workflow code
- `incidents/` — controlled incident cases
- `docs/` — architecture and reproduction documentation
- `baseline/` — baseline implementation
- `agent/` — agent workflow
- `evaluator/` — evaluation system

## License

TBD
