#!/usr/bin/env bash

set -e

echo building $1
npm install
npm run build $*
