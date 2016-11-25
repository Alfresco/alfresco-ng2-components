#!/usr/bin/env bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
time adf clean $DIR/../ng2-components/ng2-* --verbose
