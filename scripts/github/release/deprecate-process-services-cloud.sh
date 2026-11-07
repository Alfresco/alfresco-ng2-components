#!/usr/bin/env bash

# Marks @alfresco/adf-process-services-cloud as being in maintenance mode on the npm registry.
# Requires npm write/publish access to the @alfresco scope (add --otp=<code> if 2FA is enforced).

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

PACKAGE="adf-process-services-cloud"
MESSAGE="This package is in maintenance mode: only critical bug fixes and security patches will be released. No new features are planned."
UNDO=false

show_help() {
    echo "Usage: deprecate-process-services-cloud.sh [-u|--undo]"
    echo ""
    echo "-u or --undo    remove the maintenance-mode deprecation message"
    echo "-h or --help    show this help"
}

set_npm_registry() {
    npm set registry https://registry.npmjs.org/
}

undo() {
    UNDO=true
}

while [[ $1 == -* ]]; do
    case "$1" in
      -h|--help|-\?) show_help; exit 0;;
      -u|--undo)     undo; shift;;
      -*) echo "invalid option: $1" 1>&2; show_help; exit 1;;
    esac
done

set_npm_registry

if [[ $UNDO == true ]];
then
    echo "Removing maintenance-mode deprecation for @alfresco/$PACKAGE"
    npm deprecate "@alfresco/$PACKAGE" ""
else
    echo "Marking @alfresco/$PACKAGE as maintenance mode"
    npm deprecate "@alfresco/$PACKAGE" "$MESSAGE"
fi
