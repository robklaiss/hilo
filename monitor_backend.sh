#!/bin/bash

# Configuration
TARGET_URL="http://localhost:5001/ping"
SLEEP_INTERVAL=5 # seconds

echo "Starting backend monitoring for $TARGET_URL every $SLEEP_INTERVAL seconds..."
echo "Press Ctrl+C to stop."
echo "--------------------------------------------------"

while true
do
    TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')
    HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$TARGET_URL")

    if [ "$HTTP_STATUS" -eq 200 ]; then
        echo "[$TIMESTAMP] STATUS: UP ($HTTP_STATUS)"
    else
        echo "[$TIMESTAMP] STATUS: DOWN (HTTP $HTTP_STATUS)"
    fi

    sleep "$SLEEP_INTERVAL"
done
