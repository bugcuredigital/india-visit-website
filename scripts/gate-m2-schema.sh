#!/usr/bin/env bash
# ============================================================================
# M2 GATE — prove schema safety (CLAUDE.md invariant #8).
#
# "A malformed CMS entry must fail the build loudly — never render a broken
# page silently." This script breaks a seed entry four different ways, shows
# the build refusing each one, then restores and shows the build passing.
#
# Each case maps to a specific ruling, so this doubles as a regression test:
#   1. Variant B required-when-B  (discriminated union)
#   2. Testimonial consent gate   (consentConfirmed must be exactly true)
#   3. Operator tariffs           (priceFrom rejected on Variant B, invariant #6)
#   4. pace required              (ruling b13)
# ============================================================================
set -uo pipefail
cd "$(dirname "$0")/.." || exit 1

A="src/content/journeys/kerala-with-houseboat-11n-12d.md"
B="src/content/journeys/palace-on-wheels-7n-8d.md"
T="src/content/testimonials/anita-r.json"
TMP="$(mktemp -d)"
cp "$A" "$TMP/A"; cp "$B" "$TMP/B"; cp "$T" "$TMP/T"

restore() { cp "$TMP/A" "$A"; cp "$TMP/B" "$B"; cp "$TMP/T" "$T"; }
trap 'restore; rm -rf "$TMP"' EXIT

pass=0; fail=0

# Runs a build and asserts it FAILS, printing the schema's own complaint.
expect_fail() {
  local label="$1" grep_for="$2"
  echo "── $label"
  local out
  out="$(npm run build 2>&1)"
  if echo "$out" | grep -q "does not match collection schema\|InvalidContentEntryDataError"; then
    echo "   BUILD FAILED as required. Schema said:"
    echo "$out" | grep -E "does not match collection schema|^  [A-Za-z_]+(\.[A-Za-z_]+)*(\*\*)?: " \
      | sed -e 's/\*\*//g' -e 's/^ *//' -e 's/^/     /' | head -4
    if [ -n "$grep_for" ] && ! echo "$out" | grep -q "$grep_for"; then
      echo "   ...but the message did not mention '$grep_for'"; fail=$((fail+1)); return
    fi
    pass=$((pass+1))
  else
    echo "   PROBLEM: build SUCCEEDED on invalid content — schema is not enforcing this."
    fail=$((fail+1))
  fi
  echo
}

echo "============================================================"
echo " M2 GATE: schema safety demonstration"
echo "============================================================"
echo

# --- 1. Variant B loses a required module ----------------------------------
grep -v '^operatorDisclosure: >-$' "$TMP/B" \
  | sed '/^  India Visit is an authorised booking agent (GSA) for the Palace on Wheels\./,/^  journey\. Our liability is that of booking agent\.$/d' > "$B"
expect_fail "CASE 1  Variant B with operatorDisclosure removed" "operatorDisclosure"
restore

# --- 2. Testimonial without consent ----------------------------------------
sed 's/"consentConfirmed": true/"consentConfirmed": false/' "$TMP/T" > "$T"
expect_fail "CASE 2  Testimonial with consentConfirmed: false" "consentConfirmed"
restore

# --- 3. A price on a luxury-train page -------------------------------------
sed 's/^nights: 7$/nights: 7\npriceFrom: 850000/' "$TMP/B" > "$B"
expect_fail "CASE 3  Variant B carrying priceFrom (operator tariff)" "priceFrom"
restore

# --- 4. Required editorial field removed -----------------------------------
grep -v '^pace: relaxed$' "$TMP/A" > "$A"
expect_fail "CASE 4  Variant A with pace removed" "pace"
restore

# --- 5. Everything restored ------------------------------------------------
echo "── CASE 5  All seeds restored"
if npm run build 2>&1 | tail -3 | grep -q "Complete!"; then
  echo "   BUILD PASSED. Schema accepts the valid content."
  pass=$((pass+1))
else
  echo "   PROBLEM: build failed on restored, valid content."
  fail=$((fail+1))
fi

echo
echo "============================================================"
echo " ${pass} passed, ${fail} failed"
[ "$fail" -eq 0 ] && echo " M2 GATE: schema safety PROVEN" || echo " M2 GATE: NOT PROVEN"
echo "============================================================"
exit "$fail"
