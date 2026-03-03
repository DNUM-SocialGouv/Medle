#!/bin/sh

yarn migrate:latest
node scripts/server.js &
NODE_ENV=development next dev
