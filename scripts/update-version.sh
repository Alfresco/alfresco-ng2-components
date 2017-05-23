#!/usr/bin/env bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
eval JS_API=true
eval GNU=false

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
    echo "-gnu for gnu"
}

skip_js() {
    echo "====== Skip JS-API change version $1 ====="
    JS_API=false
}

gnu_mode() {
    echo "====== GNU MODE ====="
    GNU=true
}

version_change() {
    echo "====== New version $1 ====="
    VERSION=$1
}


update_component_version() {
   echo "====== UPDATE PACKAGE VERSION of ${PACKAGE} to ${VERSION} version in all the package.json ======"
   DESTDIR="$DIR/../ng2-components/${1}"
   sed "${sedi[@]}" "s/\"version\": \"[0-9]\\.[0-9]\\.[0-9]\"/\"version\": \"${VERSION}\"/g"  ${DESTDIR}/package.json
}

update_component_dependency_version(){
   DESTDIR="$DIR/../ng2-components/${1}"

   for (( j=0; j<${projectslength}; j++ ));
    do
       echo "====== UPDATE DEPENDENCY VERSION of ${projects[$j]} to ~${VERSION} in ${1}======"

       sed "${sedi[@]}" "s/\"${projects[$j]}\": \"[0-9]\\.[0-9]\\.[0-9]\"/\"${projects[$j]}\": \"${VERSION}\"/g"  ${DESTDIR}/package.json
       sed "${sedi[@]}" "s/\"${projects[$j]}\": \"~[0-9]\\.[0-9]\\.[0-9]\"/\"${projects[$j]}\": \"~${VERSION}\"/g"  ${DESTDIR}/package.json

       if [[ "${1}" != "ng2-alfresco-core" ]]
       then
        echo "====== UPDATE DEPENDENCY VERSION of ${projects[$j]} to ~${VERSION} in ${1} DEMO ======"
        sed "${sedi[@]}" "s/\"${projects[$j]}\": \"[0-9]\\.[0-9]\\.[0-9]\"/\"${projects[$j]}\": \"${VERSION}\"/g"  ${DESTDIR}/demo/package.json
        sed "${sedi[@]}" "s/\"${projects[$j]}\": \"~[0-9]\\.[0-9]\\.[0-9]\"/\"${projects[$j]}\": \"~${VERSION}\"/g"  ${DESTDIR}/demo/package.json
       fi

     done
}

update_component_js_version(){
   echo "====== UPDATE DEPENDENCY VERSION of alfresco-js-api in ${1} to ${VERSION} ======"
   DESTDIR="$DIR/../ng2-components/${1}"

   PACKAGETOCHANGE="alfresco-js-api"

   echo "====== UPDATE DEPENDENCY VERSION of alfresco-js-api to ~${VERSION} in ${1}======"

   sed "${sedi[@]}" "s/\"${PACKAGETOCHANGE}\": \"[0-9]\\.[0-9]\\.[0-9]\"/\"${PACKAGETOCHANGE}\": \"${VERSION}\"/g"  ${DESTDIR}/package.json
   sed "${sedi[@]}" "s/\"${PACKAGETOCHANGE}\": \"~[0-9]\\.[0-9]\\.[0-9]\"/\"${PACKAGETOCHANGE}\": \"~${VERSION}\"/g"  ${DESTDIR}/package.json

   echo "====== UPDATE DEPENDENCY VERSION of alfresco-js-api to ${VERSION} in ${1} DEMO ======"

   sed "${sedi[@]}" "s/\"${PACKAGETOCHANGE}\": \"[0-9]\\.[0-9]\\.[0-9]\"/\"${PACKAGETOCHANGE}\": \"${VERSION}\"/g"  ${DESTDIR}/demo/package.json
   sed "${sedi[@]}" "s/\"${PACKAGETOCHANGE}\": \"~[0-9]\\.[0-9]\\.[0-9]\"/\"${PACKAGETOCHANGE}\": \"~${VERSION}\"/g"  ${DESTDIR}/demo/package.json
}

update_demo_shell_dependency_version(){

   for (( k=0; j<${projectslength}; k++ ));
    do
    echo "====== UPDATE VERSION OF DEMO-SHELL to ${projects[$k]} version ${VERSION} ======"
    DESTDIR="$DIR/../demo-shell-ng2/"
    sed "${sedi[@]}" "s/\"${projects[$k]}\": \"[0-9]\\.[0-9]\\.[0-9]\"/\"${projects[$k]}\": \"${VERSION}\"/g"  ${DESTDIR}/package.json

    echo "====== UPDATE DEPENDENCY VERSION of ${1} to ~${VERSION} in ${DESTDIR}======"
    sed "${sedi[@]}" "s/\"${projects[$k]}\": \"~[0-9]\\.[0-9]\\.[0-9]\"/\"${projects[$k]}\": \"~${VERSION}\"/g"  ${DESTDIR}/package.json
   done
}

update_demo_shell_js_version(){
    echo "====== UPDATE VERSION OF DEMO-SHELL to  alfresco-js-api version ${VERSION} ======"
    DESTDIR="$DIR/../demo-shell-ng2/"
    PACKAGETOCHANGE="alfresco-js-api"

    sed "${sedi[@]}" "s/\"${PACKAGETOCHANGE}\": \"[0-9]\\.[0-9]\\.[0-9]\"/\"${PACKAGETOCHANGE}\": \"${VERSION}\"/g"  ${DESTDIR}/package.json

    echo "====== UPDATE DEPENDENCY VERSION of ${1} to ~${VERSION} in ${DESTDIR}======"
    sed "${sedi[@]}" "s/\"${PACKAGETOCHANGE}\": \"~[0-9]\\.[0-9]\\.[0-9]\"/\"${PACKAGETOCHANGE}\": \"~${VERSION}\"/g"  ${DESTDIR}/package.json
}


while [[ $1  == -* ]]; do
    case "$1" in
      -h|--help|-\?) show_help; exit 0;;
      -v|version) version_change $2; shift 2;;
      -sj|sjsapi) skip_js; shift;;
      -gnu) gnu_mode; shift;;
      -*) shift;;
    esac
done

if $GNU; then
 sedi='-i'
else
 sedi=('-i' '')
fi

if [[ "${VERSION}" == "" ]]
then
  echo "Version number required"
  exit 1
fi

cd "$DIR/../"

echo "====== UPDATE COMPONENTS ======"

projectslength=${#projects[@]}

# use for loop to read all values and indexes
for (( i=0; i<${projectslength}; i++ ));
do
   echo "====== UPDATE COMPONENT ${projects[$i]} ======"
   update_component_version ${projects[$i]}
   update_component_dependency_version ${projects[$i]}

   if $JS_API == true; then
    update_component_js_version ${projects[$i]}
   fi
done

echo "====== UPDATE DEMO SHELL ======"

update_demo_shell_dependency_version

if $JS_API == true; then
    update_demo_shell_js_version
fi

DESTDIR="$DIR/../demo-shell-ng2/"
sed "${sedi[@]}" "s/\"version\": \"[0-9]\\.[0-9]\\.[0-9]\"/\"version\": \"${VERSION}\"/g"  ${DIR}/../demo-shell-ng2/package.json
