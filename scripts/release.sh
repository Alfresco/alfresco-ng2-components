#!/usr/bin/env bash
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
ROOTDIR="$DIR/.."
cd "$ROOTDIR";

VERSION="";

show_help() {
    echo "Usage: release.sh -v <new release version> [OPTIONS]"
    echo ""
    echo "-v or --version: the new version of the libraries"
}

set_version() {
    echo "====== Preparing to release version $1 ====="
    VERSION=$1
}

escape_for_grep() {
    chars_to_change="[^A-Za-z0-9_()']"
    replace_with='\\&'
    GREPPED=`echo "$1" | sed "s/$chars_to_change/$replace_with/g"`
    echo $GREPPED;
}

while [[ $1  == -* ]]; do
    case "$1" in
      -h|--help|-\?) show_help; exit 0;;
      -v|--version) set_version $2; shift 2;;
      -*) shift;;
    esac
done

LICENSE_ROW="- [ADF $VERSION](license-info-$VERSION.md)";
LICENSE_GREP=`escape_for_grep "$LICENSE_ROW"`
LICENSE_README="$ROOTDIR/docs/license-info/README.md";
LICENSE_GREP_RESULT=`grep "$LICENSE_GREP" "$LICENSE_README"`;

#./scripts/update-version.sh -v $VERSION

if [ -z "$LICENSE_GREP_RESULT" ];
then
    echo -e "\e[33mAdding third party license info for version: $VERSION\e[0m"
    npx @alfresco/adf-cli licenses
    mv "$ROOTDIR/license-info-$VERSION.md" "$ROOTDIR/docs/license-info/license-info-$VERSION.md"
    echo $LICENSE_ROW >> $LICENSE_README
else
    echo -e "\e[32mThird party license info is already added for version: $VERSION, nothing to do here.\e[0m"
fi

VULNERABILITY_ROW="- [ADF $VERSION](audit-info-$VERSION.md)";
VULNERABILITY_GREP=`escape_for_grep "$VULNERABILITY_ROW"`
VULNERABILITY_README="$ROOTDIR/docs/vulnerability/README.md";
VULNERABILITY_GREP_RESULT=`grep "$VULNERABILITY_GREP" "$VULNERABILITY_README"`;

if [ -z "$VULNERABILITY_GREP_RESULT" ];
then
    echo -e "\e[33mAdding vulnerability info for version: $VERSION\e[0m"
    npx @alfresco/adf-cli@alpha audit
    mv "$ROOTDIR/audit-info-$VERSION.md" "$ROOTDIR/docs/vulnerability/audit-info-$VERSION.md"
    echo $VULNERABILITY_ROW >> $VULNERABILITY_README
else
    echo -e "\e[32mVulnerability info is already added for version: $VERSION, nothing to do here.\e[0m"
fi
