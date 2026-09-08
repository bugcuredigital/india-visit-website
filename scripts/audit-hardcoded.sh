#!/usr/bin/env bash
# ============================================================================
# Invariant audits — run before any push, and required at the M3 and M5 gates.
#   1. invariant #1  no contact details hardcoded outside siteSettings
#   2. invariant #6  no operator tariffs anywhere on train pages (PERMANENT
#                    regression check — tariffs are never published)
#   3. asset debt    surfaces TEMP-ASSET and DUMMY DATA flags so nothing
#                    placeholder reaches launch unnoticed
# Exit 1 on a real violation so CI/pre-push can block it.
# ============================================================================
set -uo pipefail
cd "$(dirname "$0")/.." || exit 1

fail=0
SCAN_DIRS=(src functions)
# siteSettings is the ONE legitimate home for contact details.
SETTINGS_FILE="src/lib/site-settings.ts"

echo "── 1. Hardcoded contact details (invariant #1) ──────────────────────"
hits=$(grep -rn -E "(\+91[[:space:]-]*[0-9]{5})|(tel:\+?[0-9]{6,})|(wa\.me/[0-9]+)|([a-z0-9._%-]+@[a-z0-9.-]+\.[a-z]{2,})" \
  --include="*.astro" --include="*.ts" --include="*.tsx" --include="*.js" \
  "${SCAN_DIRS[@]}" 2>/dev/null | grep -v "^${SETTINGS_FILE}:" || true)
if [ -n "$hits" ]; then
  echo "$hits"
  echo "FAIL: contact details must live in ${SETTINGS_FILE} only."
  fail=1
else
  echo "PASS: no contact details outside ${SETTINGS_FILE}."
fi

echo
echo "── 2. Operator tariffs on train pages (invariant #6) ────────────────"
tariffs=$(grep -rn -E "USD[[:space:]]*[0-9]{3,}|\\\$[[:space:]]*[0-9]{4,}|Published Tariff" \
  --include="*.astro" --include="*.md" --include="*.mdx" --include="*.json" --include="*.ts" \
  "${SCAN_DIRS[@]}" src/content 2>/dev/null || true)
if [ -n "$tariffs" ]; then
  echo "$tariffs"
  echo "FAIL: operator tariffs are never published (permanent rule)."
  fail=1
else
  echo "PASS: no operator tariff figures found."
fi

echo
echo "── 3. Placeholder debt (informational) ──────────────────────────────"
echo "TEMP-ASSET flags:  $(grep -rl "TEMP-ASSET" src public 2>/dev/null | wc -l | tr -d ' ') file(s)"
grep -rn "TEMP-ASSET" src public 2>/dev/null | sed 's/^/    /' | head -20
echo "DUMMY DATA flags:  $(grep -rn "DUMMY DATA" src astro.config.mjs 2>/dev/null | wc -l | tr -d ' ') occurrence(s)"
grep -rn "DUMMY DATA" src astro.config.mjs 2>/dev/null | sed 's/^/    /' | head -20

echo
if [ "$fail" -eq 0 ]; then
  echo "AUDIT PASSED (placeholder debt above is expected before M5/M9)."
else
  echo "AUDIT FAILED — see FAIL lines above."
fi
exit "$fail"
