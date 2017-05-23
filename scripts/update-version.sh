#!/usr/bin/env bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
eval JS_API=true

eval projects=( "ng2-alfresco-core"
    "ng2-alfresco-datatable"
    "ng2-activiti-diagrams"
    "ng2-activiti-analytics"
    "ng2-activiti-form"
    "ng2-activiti-tasklist"
    "ng2-activiti-processlist"
    "ng2-alfresco-documentlist"
    "ng2-alfresco-login"
    "ng2-alfresco-search"
    "ng2-alfresco-social"
    "ng2-alfresco-tag"
    "ng2-alfresco-social"
    "ng2-alfresco-upload"
    "ng2-alfresco-viewer"
    "ng2-alfresco-webscript"
    "ng2-alfresco-userinfo" )

cd `dirname $0`

show_help() {
    echo "Usage: update-version.sh"
    echo ""
    echo "-sj or -sjsapi  don't update js-api version"
    echo "-v or -version  version to update"
}

skip_js() {
    echo "====== Skip JS-API change version $1 ====="
    JS_API=false
}

version_change() {
    echo "====== New version $1 ====="
    VERSION=$1
}


update_component_version() {
   echo "====== UPDATE PACKAGE VERSION of ${PACKAGE} to ${VERSION} version in all the package.json ======"
   DESTDIR="$DIR/../ng2-components/${1}"
   sed -i '' "s/\"version\": \"[0-9]\\.[0-9]\\.[0-9]\"/\"version\": \"${VERSION}\"/g"  ${DESTDIR}/package.json
}

update_component_dependency_version(){
   echo "====== UPDATE DEPENDENCY VERSION of ${1} to ${VERSION} in ${1}======"
   DESTDIR="$DIR/../ng2-components/${1}"

   for PACKAGETOCHANGE in ${projects[@]}
   do
       sed -i '' "s/\"${PACKAGETOCHANGE}\": \"[0-9]\\.[0-9]\\.[0-9]\"/\"${PACKAGETOCHANGE}\": \"${VERSION}\"/g"  ${DESTDIR}/package.json

       echo "====== UPDATE DEPENDENCY VERSION of ${1} to ~${VERSION} in ${1}======"
       sed -i '' "s/\"${PACKAGETOCHANGE}\": \"~[0-9]\\.[0-9]\\.[0-9]\"/\"${PACKAGETOCHANGE}\": \"~${VERSION}\"/g"  ${DESTDIR}/package.json

       echo "====== UPDATE DEPENDENCY VERSION of ${1} to ${VERSION} in ${1} DEMO ======"
       sed -i '' "s/\"${PACKAGETOCHANGE}\": \"[0-9]\\.[0-9]\\.[0-9]\"/\"${PACKAGETOCHANGE}\": \"${VERSION}\"/g"  ${DESTDIR}/demo/package.json

       echo "====== UPDATE DEPENDENCY VERSION of ${1} to ~${VERSION} in ${1} DEMO ======"
       sed -i '' "s/\"${PACKAGETOCHANGE}\": \"~[0-9]\\.[0-9]\\.[0-9]\"/\"${PACKAGETOCHANGE}\": \"~${VERSION}\"/g"  ${DESTDIR}/demo/package.json
   done
}

update_component_js_version(){
   echo "====== UPDATE DEPENDENCY VERSION of alfresco-js-api in ${1} to ${VERSION} in ${1}======"
   DESTDIR="$DIR/../ng2-components/${1}"

   PACKAGETOCHANGE="alfresco-js-api"
   sed -i '' "s/\"${PACKAGETOCHANGE}\": \"[0-9]\\.[0-9]\\.[0-9]\"/\"${PACKAGETOCHANGE}\": \"${VERSION}\"/g"  ${DESTDIR}/package.json

   echo "====== UPDATE DEPENDENCY VERSION of ${1} to ~${VERSION} in ${1}======"
   sed -i '' "s/\"${PACKAGETOCHANGE}\": \"~[0-9]\\.[0-9]\\.[0-9]\"/\"${PACKAGETOCHANGE}\": \"~${VERSION}\"/g"  ${DESTDIR}/package.json

   echo "====== UPDATE DEPENDENCY VERSION of ${1} to ${VERSION} in ${1} DEMO ======"
   sed -i '' "s/\"${PACKAGETOCHANGE}\": \"[0-9]\\.[0-9]\\.[0-9]\"/\"${PACKAGETOCHANGE}\": \"${VERSION}\"/g"  ${DESTDIR}/demo/package.json

   echo "====== UPDATE DEPENDENCY VERSION of ${1} to ~${VERSION} in ${1} DEMO ======"
   sed -i '' "s/\"${PACKAGETOCHANGE}\": \"~[0-9]\\.[0-9]\\.[0-9]\"/\"${PACKAGETOCHANGE}\": \"~${VERSION}\"/g"  ${DESTDIR}/demo/package.json
}

update_demo_shell_dependency_version(){

   for PACKAGETOCHANGE in ${projects[@]}
   do
    echo "====== UPDATE VERSION OF DEMO-SHELL to ${PACKAGETOCHANGE} version ${VERSION} ======"
    DESTDIR="$DIR/../demo-shell-ng2/"
    sed -i '' "s/\"${PACKAGETOCHANGE}\": \"[0-9]\\.[0-9]\\.[0-9]\"/\"${PACKAGETOCHANGE}\": \"${VERSION}\"/g"  ${DESTDIR}/package.json

    echo "====== UPDATE DEPENDENCY VERSION of ${1} to ~${VERSION} in ${DESTDIR}======"
    sed -i '' "s/\"${PACKAGETOCHANGE}\": \"~[0-9]\\.[0-9]\\.[0-9]\"/\"${PACKAGETOCHANGE}\": \"~${VERSION}\"/g"  ${DESTDIR}/package.json
   done
}

update_demo_shell_js_version(){
    echo "====== UPDATE VERSION OF DEMO-SHELL to  alfresco-js-api version ${VERSION} ======"
    DESTDIR="$DIR/../demo-shell-ng2/"
    PACKAGETOCHANGE="alfresco-js-api"

    sed -i '' "s/\"${PACKAGETOCHANGE}\": \"[0-9]\\.[0-9]\\.[0-9]\"/\"${PACKAGETOCHANGE}\": \"${VERSION}\"/g"  ${DESTDIR}/package.json

    echo "====== UPDATE DEPENDENCY VERSION of ${1} to ~${VERSION} in ${DESTDIR}======"
    sed -i '' "s/\"${PACKAGETOCHANGE}\": \"~[0-9]\\.[0-9]\\.[0-9]\"/\"${PACKAGETOCHANGE}\": \"~${VERSION}\"/g"  ${DESTDIR}/package.json
}


while [[ $1  == -* ]]; do
    case "$1" in
      -h|--help|-\?) show_help; exit 0;;
      -v|version) version_change $2; shift 2;;
      -sj|sjsapi) skip_js; shift;;
      -*) shift;;
    esac
done


if [[ "${VERSION}" == "" ]]
then
  echo "Version number required"
  exit 1
fi

cd "$DIR/../"

echo "====== UPDATE COMPONENTS ======"

for PACKAGE in ${projects[@]}
do
   update_component_version $PACKAGE
   update_component_dependency_version $PACKAGE

   if $JS_API == true; then
    update_component_js_version $PACKAGE
   fi
done

echo "====== UPDATE DEMO SHELL ======"

update_demo_shell_dependency_version

if $JS_API == true; then
    update_demo_shell_js_version
fi

DESTDIR="$DIR/../demo-shell-ng2/"
sed -i '' "s/\"version\": \"[0-9]\\.[0-9]\\.[0-9]\"/\"version\": \"${VERSION}\"/g"  ${DIR}/../demo-shell-ng2/package.json
