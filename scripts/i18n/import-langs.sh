#!/usr/bin/env bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

LANG_ROOT="./i18n"

show_help() {
    echo "Usage: import-langs.sh --input NAME_FOLDER import the i18n files from a folder"
    echo ""
    echo "--input or -i to specify a folder where import the new files. (default value i18n)"
}

input_folder(){
    if [ $1 -eq 0 ]; then
        echo "No arguments supplied. Default path for output will be used ./i18n"
    else
        LANG_ROOT="$1"
    fi
}

while [[ $1  == -* ]]; do
    case "$1" in
      -h|--help|-\?) show_help; exit 0;;
      --input|-i)  input_folder $2; shift;;
    esac
done

COMPONENTS_ROOT="$DIR/../../"

# Findn all JSON files
FILES=(`find $LANG_ROOT -type f -name "*.json"`)

# Loop the individual components
for FILE in "${FILES[@]}"
do :

  echo "Processing $FILE"
    # Match the language so we can get to the actual destination
    if [[ $FILE =~ /[A-Z0-0_-]+/(.+)$ ]] ; then

      DEST=${BASH_REMATCH[1]} # Will contain the full file path
      echo "\tCopying $FILE to $COMPONENTS_ROOT/$DEST"
      `cp $FILE $COMPONENTS_ROOT/$DEST`
    fi
    echo ""
done
