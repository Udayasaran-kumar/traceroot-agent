# TraceRoot

## Evidence-Driven Production Incident Investigation Agent

TraceRoot is an evidence-driven agentic workflow for investigating production incidents.

Instead of immediately guessing a root cause, TraceRoot maintains an explicit investigation state, collects evidence, generates competing hypotheses, selects the next action according to its current objective, executes investigation tools, verifies the highest-confidence hypothesis, and produces a structured root-cause report.

The system is designed to demonstrate how an agent can move from fragmented production evidence to a verified diagnosis.

---

## What TraceRoot Solves

Production incidents often require engineers to correlate multiple sources:

- Incident reports
- Production logs
- Stack traces
- Repository source code
- Configuration
- Runtime behavior
- Regression tests

TraceRoot turns these sources into an explicit investigation workflow.

The agent continuously answers:

1. What evidence is available?
2. What hypotheses explain the evidence?
3. What information is still missing?
4. What should be investigated next?
5. Can the leading hypothesis be verified?
6. Where exactly is the defect?
7. What is the causal chain?
8. What remediation should be applied?

---

# Core Architecture

```text
                         Incident
                            |
                            v
                    Incident Loader
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
                  /          |          \
                 /           |           \
        Repository Search  File Inspect  Verification
                 \           |           /
                  \          |          /
                            v
                     State Updater
                            |
                            v
                  Hypothesis Generation
                            |
                            v
                    Highest-Confidence
                       Hypothesis
                            |
                            v
                       Verification
                            |
                            v
                   Root Cause Report
