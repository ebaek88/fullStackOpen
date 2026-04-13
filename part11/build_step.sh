#!/bin/bash

echo "Build script"

# add the commands here
npm install
npm run eslint
npm run test
npm run build
sudo npx playwright install --with-deps
npm run test:e2e