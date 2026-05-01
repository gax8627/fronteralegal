#!/bin/bash
# Double-click this file in Finder to push to GitHub
cd "$(dirname "$0")"
echo "=== NexBorder Git Push ==="
echo "Pushing to origin/main..."
git push origin main
echo ""
echo "Done. Press any key to close."
read -n 1
