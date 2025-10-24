#!/bin/sh

yarn migrate:latest
node scripts/server.js &
NODE_ENV=production node_modules/.bin/next start
