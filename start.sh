#!/usr/bin/env bash
cd demo-shell-ng2

#!/bin/sh
if  [[ $1 = "-install" ]]; then
    npm run start
else
    npm run start.dev
fi