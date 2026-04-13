#!/bin/bash

# this command tells bash: "if any command fails, stop the script immediately."
set -e

echo "Build script"

# add the commands here
npm ci
npm run eslint
npm run test
npm run build
