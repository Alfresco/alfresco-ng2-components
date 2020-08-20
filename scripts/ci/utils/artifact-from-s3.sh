#!/usr/bin/env bash

show_help() {
    echo "Usage: artifact-from-s3.sh <options>"
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

test ! -d $OUTPUT && mkdir -p $OUTPUT
aws s3 cp $ARTIFACT ./s3-artifact.tmp
echo 'artifact download done'
tar -xvf ./s3-artifact.tmp -C $OUTPUT >&/dev/null
echo 'tar the artifact done'
rm ./s3-artifact.tmp
echo 'remove tmp file'
