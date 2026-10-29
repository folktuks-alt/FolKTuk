# FolkTuk Project Baseline

This document records the authoritative project requirements supplied for establishing the FolkTuk baseline. It distinguishes the initial architecture direction from proposals that still need validation; it does not claim that a local copy of the full Master Project Plan was read.

## Brand

- **Name:** FolkTuk
- **Slogan:** “Folks, Gather Here. Let’s Talk!”
- **Tagline:** “Connect. Converse. Belong.”

## Product direction

FolkTuk is an independent global social network built around three equally important pillars:

1. Social Connection
2. Communities
3. Opportunities

## Architecture and technology

### Initial architecture direction

- **Architecture:** Modular monolith.
- **API direction:** The API is to be versioned and documented. Its detailed contract remains to be specified.

### Proposed choices, pending validation

- **Frontend:** Next.js, React, and TypeScript.
- **Backend:** NestJS and TypeScript.
- **Database:** PostgreSQL.
- **File and media storage:** S3-compatible object storage; provider not selected.
- **Containerization:** Docker.
- **Hosting direction:** DigitalOcean, subject to technical and commercial validation.

These are proposals, not finalized implementation decisions. Authentication, background processing, deployment configuration, and package versions require further technical evaluation. Other unresolved work is tracked in [Open Decisions](OPEN_DECISIONS.md).
