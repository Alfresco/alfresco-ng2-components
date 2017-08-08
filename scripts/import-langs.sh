#!/usr/bin/env bash

if [ $# -eq 0 ]; then
    echo "No arguments supplied. You must provide path for the translations"
    exit;
else
    LANG_ROOT=${1%/}
fi

# Findn all JSON files
FILES=(`find $LANG_ROOT -type f -name "*.json"`)

# Loop the individual components
for FILE in "${FILES[@]}"
do :

  echo "Processing $FILE"
    # Match the language so we can get to the actual destination
    if [[ $FILE =~ /[A-Z0-0_-]+/(.+)$ ]] ; then

      DEST=${BASH_REMATCH[1]} # Will contain the full file path
      echo "\tCopying $FILE to $DEST"
      `cp $FILE $DEST`
    fi
    echo "\n"
done