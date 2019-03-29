#!/usr/bin/env bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
eval JS_API=true
eval GNU=false
eval DIFFERENT_JS_API=false
eval AUTO=false
eval TOTAL_BUILD=true;
eval SEMANTIC="minor";

eval projects=( "core"
    "content-services"
    "process-services"
    "process-services-cloud"
    "insights"
    "testing"
    "extensions" )

cd `dirname $0`

prefix="@alfresco\/adf-"

projectslength=${#projects[@]}

show_help() {
    echo "Usage: update-version.sh"
    echo ""
    echo "-sj or -sjsapi  don't update js-api version"
    echo "-vj or -versionjsapi  to use a different version of js-api"
    echo "-components execute the change version only in the components "
    echo "-v or -version  version to update"
    echo "-major increase the major number and reset minor and patch"
    echo "-minor increase the minor number and reset the patch number"
    echo "-patch increase the patch number"
    echo "-nextalpha update next alpha version of js-api and lib automatically"
    echo "-nextbeta update next beta version of js-api and lib automatically"
    echo "-alpha update last alpha version of js-api and lib automatically"
    echo "-beta update beta alpha version of js-api and lib automatically"
    echo "-gnu for gnu"
}

skip_js() {
    echo "====== Skip JS-API change version $1 ====="
    JS_API=false
}

last_alpha_mode() {
    length=`expr $projectslength - 1`
    echo "====== Auto find last ALPHA version of ${projects[${length}]} ====="
    VERSION=$(npm view @alfresco/adf-${projects[${length}]}@alpha version)

    echo "====== version lib ${VERSION} ====="

    DIFFERENT_JS_API=true
    VERSION_JS_API=$(npm view @alfresco/js-api@alpha version)

    echo "====== version js-api ${DIFFERENT_JS_API} ====="
}

next_alpha_mode() {
    echo "====== Auto find next ALPHA version ===== ${SEMANTIC} "
    VERSION=$(./next_version.sh -${SEMANTIC} -alpha)

    echo "====== version lib ${VERSION} ====="

    DIFFERENT_JS_API=true
    VERSION_JS_API=$(npm view @alfresco/js-api@alpha version)

    echo "====== version js-api ${DIFFERENT_JS_API} ====="
}

next_beta_mode() {
    echo "====== Auto find next BETA version ===== ${SEMANTIC}"
    VERSION=$(./next_version.sh -${SEMANTIC} -beta)

    echo "====== version lib ${VERSION} ====="

    DIFFERENT_JS_API=true
    VERSION_JS_API=$(npm view @alfresco/js-api@beta version)

    echo "====== version js-api ${DIFFERENT_JS_API} ====="
}

last_beta_mode() {
    echo "====== Auto find last BETA version ====="
    VERSION=$(npm view @alfresco/adf-core@beta version)

    echo "====== version lib ${VERSION} ====="

    DIFFERENT_JS_API=true
    VERSION_JS_API=$(npm view @alfresco/js-api@beta version)

    echo "====== version js-api ${DIFFERENT_JS_API} ====="
}

gnu_mode() {
    echo "====== GNU MODE ====="
    GNU=true
}

semantic_set() {
    echo "====== semantic MODE $1 ====="
    SEMANTIC=$1
}

version_change() {
    echo "====== New version $1 ====="
    VERSION=$1
}

version_js_change() {
    echo "====== Alfresco JS-API version $1 ====="
    VERSION_JS_API=$1
    DIFFERENT_JS_API=true
}

only_components() {
    echo "====== UPDATE Only the components ====="
    TOTAL_BUILD=false
}


update_component_version() {
   echo "====== UPDATE PACKAGE VERSION of ${PACKAGE} to ${VERSION} version in all the package.json ======"
   DESTDIR="$DIR/../lib/${1}"
   sed "${sedi[@]}" "s/\"version\": \".*\"/\"version\": \"${VERSION}\"/g"  ${DESTDIR}/package.json
}

update_component_dependency_version(){
   DESTDIR="$DIR/../lib/${1}"

   for (( j=0; j<${projectslength}; j++ ));
    do
       echo "====== UPDATE DEPENDENCY VERSION of .* to ~${VERSION} in ${1}======"

       sed "${sedi[@]}" "s/\"${prefix}${projects[$j]}\": \".*\"/\"${prefix}${projects[$j]}\": \"${VERSION}\"/g"  ${DESTDIR}/package.json
       sed "${sedi[@]}" "s/\"${prefix}${projects[$j]}\": \"~.*\"/\"${prefix}${projects[$j]}\": \"~${VERSION}\"/g"  ${DESTDIR}/package.json
       sed "${sedi[@]}" "s/\"${prefix}${projects[$j]}\": \"^.*\"/\"${prefix}${projects[$j]}\": \"^${VERSION}\"/g"  ${DESTDIR}/package.json

    done
}

update_total_build_dependency_version(){
   DESTDIR="$DIR/../"

   for (( j=0; j<${projectslength}; j++ ));
    do
       echo "====== UPDATE TOTAL BUILD DEPENDENCY VERSION of .* to ~${VERSION} in ${1}======"
       sed "${sedi[@]}" "s/\"${prefix}${projects[$j]}\": \".*\"/\"${prefix}${projects[$j]}\": \"${VERSION}\"/g"  ${DESTDIR}/package.json
       sed "${sedi[@]}" "s/\"${prefix}${projects[$j]}\": \"~.*\"/\"${prefix}${projects[$j]}\": \"~${VERSION}\"/g"  ${DESTDIR}/package.json
       sed "${sedi[@]}" "s/\"${prefix}${projects[$j]}\": \"^.*\"/\"${prefix}${projects[$j]}\": \"^${VERSION}\"/g"  ${DESTDIR}/package.json
     done
}

update_total_build_dependency_js_version(){
    echo "====== UPDATE DEPENDENCY VERSION @alfresco/js-api total build to ~${1} in ${DESTDIR}======"
    DESTDIR="$DIR/../"
    PACKAGETOCHANGE="@alfresco\/js-api"

    sed "${sedi[@]}" "s/\"${PACKAGETOCHANGE}\": \".*\"/\"${PACKAGETOCHANGE}\": \"${1}\"/g"  ${DESTDIR}/package.json
    sed "${sedi[@]}" "s/\"${PACKAGETOCHANGE}\": \"~.*\"/\"${PACKAGETOCHANGE}\": \"${1}\"/g"  ${DESTDIR}/package.json
    sed "${sedi[@]}" "s/\"${PACKAGETOCHANGE}\": \"^.*\"/\"${PACKAGETOCHANGE}\": \"${1}\"/g"  ${DESTDIR}/package.json

    # not needed for not
    #JSAPINODE="alfresco-js-api-node"

    #sed "${sedi[@]}" "s/\"${JSAPINODE}\": \".*\"/\"${JSAPINODE}\": \"${1}\"/g"  ${DESTDIR}/package.json
    #sed "${sedi[@]}" "s/\"${JSAPINODE}\": \"~.*\"/\"${JSAPINODE}\": \"${1}\"/g"  ${DESTDIR}/package.json
    #sed "${sedi[@]}" "s/\"${JSAPINODE}\": \"^.*\"/\"${JSAPINODE}\": \"${1}\"/g"  ${DESTDIR}/package.json
}

update_component_js_version(){
   echo "====== UPDATE DEPENDENCY VERSION of @alfresco/js-api in ${1} to ${2} ======"
   DESTDIR="$DIR/../lib/${1}"

   PACKAGETOCHANGE="@alfresco\/js-api"

   sed "${sedi[@]}" "s/\"${PACKAGETOCHANGE}\": \".*\"/\"${PACKAGETOCHANGE}\": \"${2}\"/g"  ${DESTDIR}/package.json
   sed "${sedi[@]}" "s/\"${PACKAGETOCHANGE}\": \"~.*\"/\"${PACKAGETOCHANGE}\": \"${2}\"/g"  ${DESTDIR}/package.json
   sed "${sedi[@]}" "s/\"${PACKAGETOCHANGE}\": \"^.*\"/\"${PACKAGETOCHANGE}\": \"${2}\"/g"  ${DESTDIR}/package.json

}

args=("$@")

while [[ $1  == -* ]]; do
    case "$1" in
      -major)  semantic_set "major"; shift;;
      -minor)  semantic_set "minor"; shift;;
      -patch) semantic_set "patch"; shift;;
      -*) shift;;
    esac
done

set -- "${args[@]}"

while [[ $1  == -* ]]; do
    case "$1" in
      -h|--help|-\?) show_help; exit 0;;
      -v|version) version_change $2; shift 2;;
      -sj|sjsapi) skip_js; shift;;
      -vj|versionjsapi)  version_js_change $2; shift 2;;
      -gnu) gnu_mode; shift;;
      -alpha) last_alpha_mode; shift;;
      -nextalpha) next_alpha_mode; shift;;
      -beta) last_beta_mode; shift;;
      -nextbeta) next_beta_mode; shift;;
      -components) only_components; shift;;
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

# use for loop to read all values and indexes
for (( i=0; i<${projectslength}; i++ ));
do
   echo "====== UPDATE COMPONENT ${projects[$i]} ======"
   update_component_version ${projects[$i]}
   update_component_dependency_version ${projects[$i]}

   if $JS_API == true; then

    if $DIFFERENT_JS_API == true; then
        update_component_js_version ${projects[$i]} ${VERSION_JS_API}
    else
        update_component_js_version ${projects[$i]} ${VERSION}
    fi

   fi
done

if $TOTAL_BUILD; then
    echo "====== UPDATE TOTAL BUILD======"

    update_total_build_dependency_version
fi

if $JS_API == true; then
    if $DIFFERENT_JS_API == true; then
        update_total_build_dependency_js_version ${VERSION_JS_API}
    else
        update_total_build_dependency_js_version ${VERSION}
    fi
fi

echo "====== UPDATE DEMO SHELL ======"

DESTDIR="$DIR/../demo-shell/"
sed "${sedi[@]}" "s/\"version\": \".*\"/\"version\": \"${VERSION}\"/g"  ${DIR}/../demo-shell/package.json
sed "${sedi[@]}" "s/\"version\": \".*\"/\"version\": \"${VERSION}\"/g"  ${DIR}/../package.json
