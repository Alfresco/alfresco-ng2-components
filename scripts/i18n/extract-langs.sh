#!/usr/bin/env bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

LANGS_OUTPUT="./i18n"

output_folder(){
    if [ $1 -eq 0 ]; then
        echo "No arguments supplied. Default path for output will be used ./i18n"
    else
        LANGS_OUTPUT="$1"
    fi
}

show_help() {
    echo "Usage: extract-langs.sh Extract the i18n files from the repo and create a zip"
    echo ""
    echo "--output or -o to specify a folder otherwise it will be created in i18n"
}

while [[ $1  == -* ]]; do
    case "$1" in
      -h|--help|-\?) show_help; exit 0;;
      --output|-o)  output_folder $2; shift;;
    esac
done

COMPONENTS_ROOT="$DIR/../../lib"

# Find all directories in $COMPONENTS_ROOT called i18n and add the demo-shell manually
COMPONENTS=(`find $COMPONENTS_ROOT -type d -name i18n -not \( -name '*.*' -o -path '**/node_modules*'  -o -path '**/bundles*' \)`)
COMPONENTS+=("$DIR/../../demo-shell/resources/i18n")

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
      DEST="$LANGS_OUTPUT/$LANG/${COMPONENT_DIR#${DIR}/../}"
      echo "Copying $i to $DEST"
      `mkdir -p $DEST`
      `cp $i $DEST`
    fi
  done
done

echo "====== Create a zip ======"
zip -r ${LANGS_OUTPUT}/i18n.zip ./${LANGS_OUTPUT}/*
