#!/bin/sh

yarn migrate:latest
node scripts/server.js &
next dev
