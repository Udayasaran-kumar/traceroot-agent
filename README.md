# TraceRoot

## Evidence-Driven Production Incident Investigation Agent

TraceRoot is an evidence-driven agentic workflow for investigating production incidents.

Instead of immediately producing a root-cause guess, TraceRoot maintains an explicit investigation state, gathers evidence, generates hypotheses, selects the next investigation action based on the current objective, executes tools, and verifies the highest-confidence hypothesis.

The result is a structured root-cause report containing:

- Root cause
- Exact source location
- Failure mechanism
- Causal chain
- Supporting evidence
- Confidence
- Verification result
- Recommended remediation

---

# Why TraceRoot?

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
3. What hypothesis explains the incident?
4. What evidence is still missing?
5. What should I investigate next?
6. Can the hypothesis be verified?
7. What is the exact root cause?
8. What remediation should be applied?

TraceRoot models this investigation process explicitly as state transitions.

---

# Core Architecture

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
