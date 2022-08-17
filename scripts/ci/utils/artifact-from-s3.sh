#!/usr/bin/env bash

show_help() {
    echo "Usage: dbpci-artifact-from-s3 <options>"
    echo ""
    echo "-a or --artifact [mandatory]: path to the s3 artifact (tar.bz2) to download and extract"
    echo "-o or --output [mandatory]: directory to extract the archive to"
}

while [[ $1  == -* ]]; do
    case "$1" in
      -h|--help|-\?) show_help; exit 0;;
      -a|--artifact) ARTIFACT=$2; shift 2;;
      -o|--output) OUTPUT=$2; shift 2;;
      -*) shift;;
    esac
done

if [ "${ARTIFACT}" == "" ] || [ "${OUTPUT}" == "" ]
then
  show_help;
  exit 1
fi

echo -e "Download from S3 $ARTIFACT to $OUTPUT"
test ! -d $OUTPUT && mkdir -p $OUTPUT

IS_PRESENT="$(aws s3 ls $ARTIFACT | wc -l | tr -d ' ')"
if [ "${IS_PRESENT}" == "1" ]
then
  echo "File ${ARTIFACT} is present. Copying"
  aws s3 cp $ARTIFACT ./s3-artifact.tmp
  tar -xf ./s3-artifact.tmp -C $OUTPUT
  rm ./s3-artifact.tmp
else
  echo "File ${ARTIFACT} not present"
  exit 1;
fi
