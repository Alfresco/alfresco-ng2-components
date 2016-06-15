#!/usr/bin/env bash
cd demo-shell-ng2

#!/bin/sh
if  [[ $1 = "-install" ]]; then
    npm install
    npm run start
elif  [[ $1 = "-update " ]]; then
    npm run update
    npm run start
elif  [[ $1 = "-cleanInstall" ]]; then
    npm run clean
    npm install
    npm run start
else
    npm run start
fi