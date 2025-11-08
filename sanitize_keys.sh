#!/bin/bash
# 🧹 sanitize_keys.sh — remove sensitive information from text files

if [ -z "$1" ]; then
  echo "Usage: ./sanitize_keys.sh <filename>"
  exit 1
fi

INPUT_FILE="$1"
OUTPUT_FILE="sanitized_${1}"

# Use sed to redact likely secrets and credentials
sed -E '
  s/(key|KEY|Key)[=: ]+[A-Za-z0-9_\-]{10,}/\1=[REDACTED_KEY]/g;
  s/(secret|SECRET|Secret)[=: ]+[A-Za-z0-9_\-]{10,}/\1=[REDACTED_SECRET]/g;
  s/(token|TOKEN|Token)[=: ]+[A-Za-z0-9_\-]{10,}/\1=[REDACTED_TOKEN]/g;
  s/(password|PASSWORD|Password)[=: ]+[A-Za-z0-9_\-]{6,}/\1=[REDACTED_PASSWORD]/g;
  s/(postgres(ql)?):\/\/[^\s"]+/\1:\/\/[REDACTED_DB_URL]/g;
  s/(https?:\/\/)[A-Za-z0-9\.\-]+(:[0-9]+)?[^\s"]*/\1[REDACTED_URL]/g;
' "$INPUT_FILE" > "$OUTPUT_FILE"

echo "✅ Sanitized file saved as: $OUTPUT_FILE"
