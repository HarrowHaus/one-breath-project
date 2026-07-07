#!/bin/bash
# SessionStart hook — installs Node dependencies so lint, `next build`, and the
# axe accessibility gate work as soon as a Claude Code on the web session opens.
# Runs synchronously so the tools are ready before the session starts.
set -euo pipefail

# Only run in remote (Claude Code on the web) sessions; local dev is unaffected.
if [ "${CLAUDE_CODE_REMOTE:-}" != "true" ]; then
  exit 0
fi

cd "$CLAUDE_PROJECT_DIR"

# `npm install` (not `ci`) is idempotent and benefits from the cached container
# layer. The USWDS assets are vendored/committed, so no compile step is needed;
# the a11y test uses the environment's preinstalled Chromium.
npm install --no-audit --no-fund
