#!/bin/bash
cd /tmp/kavia/workspace/code-generation/cooking-companion-5954-6314/cooking_tracker_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

