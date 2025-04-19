#!/bin/sh

# Install dependencies in root
npm install

# Install dependencies and start server in 'server' directory
cd service
npm install
node index.js &

# Go back to root directory
cd ..

 npm run dev
 