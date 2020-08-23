#!/usr/bin/env bash

show_help() {
    echo "Usage: artifact-to-s3.sh <options>"
    echo ""
    echo "-a or --artifact [mandatory]: path to the artifact to archieve (tar.bz2) and upload (like ./dist)"
    echo "-o or --output [mandatory]: the S3 object to copy it to, like: s3://bucket-name/folder/whatever.tar.bz2"
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

tar cvfj ./s3-artifact.tmp -C $ARTIFACT `ls $ARTIFACT`
aws s3 cp ./s3-artifact.tmp $OUTPUT
rm ./s3-artifact.tmp
