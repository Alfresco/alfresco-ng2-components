#!/usr/bin/env bash
set -e
set -o pipefail
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
ROOTDIR="$DIR/.."
cd "$ROOTDIR";

VERSION="";

# Pin the CLI to the release line of this branch. The `latest` and `alpha` tags
# track develop, where the licenses scanner and the pnpm based audit command are
# not compatible with the 8.0.x tooling.
ADF_CLI="@alfresco/adf-cli@~8.0.0";

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

while [[ ${1-} == -* ]]; do
    case "$1" in
      -h|--help|-\?) show_help; exit 0;;
      -v|--version) set_version $2; shift 2;;
      -*) shift;;
    esac
done

if [ -z "$VERSION" ];
then
    echo -e "\033[31mVersion number required\033[0m"
    show_help
    exit 1
fi

# The CLI names its reports after the version in the root package.json, so the
# version bump has to be in place already (scripts/update-version.sh -v VERSION).
PKG_VERSION=`node -p "require('$ROOTDIR/package.json').version"`
if [ "$PKG_VERSION" != "$VERSION" ];
then
    echo -e "\033[31mThe root package.json is at $PKG_VERSION, expected $VERSION.\033[0m"
    echo -e "\033[31mRun 'scripts/update-version.sh -v $VERSION' first.\033[0m"
    exit 1
fi

LICENSE_ROW="- [ADF $VERSION](license-info-$VERSION.md)";
LICENSE_GREP=`escape_for_grep "$LICENSE_ROW"`
LICENSE_README="$ROOTDIR/docs/license-info/README.md";
LICENSE_GREP_RESULT=`grep "$LICENSE_GREP" "$LICENSE_README" || true`;

if [ -z "$LICENSE_GREP_RESULT" ];
then
    echo -e "\033[33mAdding third party license info for version: $VERSION\033[0m"
    npx --yes "$ADF_CLI" licenses
    if [ ! -f "$ROOTDIR/license-info-$VERSION.md" ];
    then
        echo -e "\033[31mThe license report was not generated, aborting.\033[0m"
        exit 1
    fi
    mv "$ROOTDIR/license-info-$VERSION.md" "$ROOTDIR/docs/license-info/license-info-$VERSION.md"
    echo "$LICENSE_ROW" >> "$LICENSE_README"
else
    echo -e "\033[32mThird party license info is already added for version: $VERSION, nothing to do here.\033[0m"
fi

VULNERABILITY_ROW="- [ADF $VERSION](audit-info-$VERSION.md)";
VULNERABILITY_GREP=`escape_for_grep "$VULNERABILITY_ROW"`
VULNERABILITY_README="$ROOTDIR/docs/vulnerability/README.md";
VULNERABILITY_GREP_RESULT=`grep "$VULNERABILITY_GREP" "$VULNERABILITY_README" || true`;

if [ -z "$VULNERABILITY_GREP_RESULT" ];
then
    echo -e "\033[33mAdding vulnerability info for version: $VERSION\033[0m"
    npx --yes "$ADF_CLI" audit
    if [ ! -f "$ROOTDIR/audit-info-$VERSION.md" ];
    then
        echo -e "\033[31mThe audit report was not generated, aborting.\033[0m"
        exit 1
    fi
    mv "$ROOTDIR/audit-info-$VERSION.md" "$ROOTDIR/docs/vulnerability/audit-info-$VERSION.md"
    echo "$VULNERABILITY_ROW" >> "$VULNERABILITY_README"
else
    echo -e "\033[32mVulnerability info is already added for version: $VERSION, nothing to do here.\033[0m"
fi
