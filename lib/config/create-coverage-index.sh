#!/bin/bash

ROOT=./lib/coverage
HTTP="/"
OUTPUT="./lib/coverage/index.html"
RULE=".*\.\(html\)"

echo "<h1>Coverage ADF Reports</h1>" > $OUTPUT
echo "<ul>" >> $OUTPUT
i=0
for filepath in `find "$ROOT" -maxdepth 1 -mindepth 1 -type d| sort`; do
  path=`basename "$filepath"`
  for i in `find "$filepath" -regex "$RULE" -maxdepth 1 -mindepth 1 -type f| sort`; do
    file=`basename "$i"`
    echo "    <li><a href=\"/$path/$file\">$path</a></li>" >> $OUTPUT
  done
done
echo "</ul>" >> $OUTPUT
