#!/usr/bin/env bash

set -e

echo building $1
npm install --legacy-peer-deps
npm run build $*
