#!/usr/bin/env bash
set -euo pipefail

# Create logs directory
mkdir -p logs

# Timestamp (UTC) for filenames
ts=$(date -u +"%Y%m%dT%H%M%SZ")

test_log=logs/test-${ts}.log
build_log=logs/build-${ts}.log

echo "=== Test run started: $(date -u) ===" > "$test_log"
# Run tests, capture stdout+stderr but don't exit on test failures (we capture output)
npm test >> "$test_log" 2>&1 || true

echo "=== Build run started: $(date -u) ===" > "$build_log"
# Run build and capture output
npm run build >> "$build_log" 2>&1 || true

echo "Saved logs:\n  $test_log\n  $build_log"
