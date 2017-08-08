#!/usr/bin/env bash

if [ $# -eq 0 ]; then
    echo "No arguments supplied. Default path for output will be used."
    LANGS_OUTPUT="./i18n"
else
    LANGS_OUTPUT="$1"
fi

COMPONENTS_ROOT="ng2-components"

# Find all directories in $COMPONENTS_ROOT called i18n and add the demo-shell manually
COMPONENTS=(`find $COMPONENTS_ROOT -type d -name i18n`)
COMPONENTS+=("demo-shell-ng2/resources/i18n")

# Loop the individual components
for COMPONENT_DIR in "${COMPONENTS[@]}"
do :

  echo "Processing $COMPONENT_DIR"

  # Grab *.json in the components i18n dir
  FILES=(`find $COMPONENT_DIR -type f -name "*.json"`)

  # Loop each i18n file
  for i in "${FILES[@]}"
  do :

    # Match the filename and extension into two groups so we can use the name as a folder for the output folder
    if [[ $i =~ /([a-zA-Z0-9_-]*)(\.json)$ ]] ; then

      TMP=${BASH_REMATCH[1]} # Will contain "en", "it", "ru" etc. without .json
      LANG=`echo "$TMP" | tr '[:lower:]' '[:upper:]'` # Conver to upper case

      # Build the output path, ensure it exists then copy the file
      DEST="$LANGS_OUTPUT/$LANG/$COMPONENT_DIR"
      echo "\tCopying $i to $DEST"
      `mkdir -p $DEST`
      `cp $i $DEST`
    fi
  done
  echo "\n"

done