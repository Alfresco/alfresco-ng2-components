#!/usr/bin/env bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
VERSION_IN_PACKAGE_JSON=`node -p "require('$DIR/../package.json')".version;`;

eval JS_API=true
eval GNU=false
eval DIFFERENT_JS_API=false
eval AUTO=false
eval TOTAL_BUILD=true;
eval SEMANTIC="minor";

eval projects=( "cli"
    "core"
    "content-services"
    "process-services"
    "process-services-cloud"
    "insights"
    "testing"
    "extensions"
    "eslint-angular" )

cd `dirname $0`

prefix="@alfresco\/adf-"

projectslength=${#projects[@]}

show_help() {
    echo "Usage: update-version.sh"
    echo ""
    echo "-vj or -versionjsapi  to use a different version of js-api"
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

last_alpha_mode() {
    length=`expr $projectslength - 1`
    echo "====== Auto find last ALPHA version of ${projects[${length}]} ====="
    VERSION=$(npm view @alfresco/adf-${projects[${length}]}@alpha version)

    echo "====== version lib ${VERSION} ====="
}

next_alpha_mode() {
    # If we are creating a new alpha for a prerelease, we need to simply call it with -alpha
    if [[ $VERSION_IN_PACKAGE_JSON =~ [0-9]*\.[0-9]*\.[0-9]*-.* ]]; then
        SEMANTIC_PARAM="";
    else
        SEMANTIC_PARAM="-${SEMANTIC}";
    fi

    echo "====== Auto find next ALPHA version ===== ${SEMANTIC_PARAM} "
    VERSION=$(./next_version.sh ${SEMANTIC_PARAM} -alpha)

    echo "====== version lib ${VERSION} ====="
    JS_API=false
}

next_beta_mode() {
    echo "====== Auto find next BETA version ===== ${SEMANTIC}"
    VERSION=$(./next_version.sh -${SEMANTIC} -beta)

    echo "====== version lib ${VERSION} ====="
    JS_API=false
}

last_beta_mode() {
    echo "====== Auto find last BETA version ====="
    VERSION=$(npm view @alfresco/adf-core@beta version)

    echo "====== version lib ${VERSION} ====="

    DIFFERENT_JS_API=true
    VERSION_JS_API=$(npm view @alfresco/js-api@alpha version)

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

update_component_version() {
   echo "====== UPDATE PACKAGE VERSION of ${PACKAGE} to ${VERSION} version in all the package.json ======"
   DESTDIR="$DIR/../lib/${1}"
   cd $DESTDIR
   npm version --allow-same-version --no-git-tag-version --force ${VERSION}
   cd -
}

update_component_dependency_version() {
    echo "====== UPDATE DEPENDENCY VERSION of .* to ~${VERSION} in ${1}======"
    DESTDIR="$DIR/../lib/${1}"

    for (( j=0; j<${projectslength}; j++ ));
    do
        PROJECT=${prefix}${projects[$j]}
        sed "${sedi[@]}" "s/\"${PROJECT}\": \".*\"/\"${PROJECT}\": \">=${VERSION}\"/g"  ${DESTDIR}/package.json
        sed "${sedi[@]}" "s/\"${PROJECT}\": \"~.*\"/\"${PROJECT}\": \"~${VERSION}\"/g"  ${DESTDIR}/package.json
        sed "${sedi[@]}" "s/\"${PROJECT}\": \"^.*\"/\"${PROJECT}\": \"^${VERSION}\"/g"  ${DESTDIR}/package.json
    done
}

update_total_build_dependency_version() {
    echo "====== UPDATE TOTAL BUILD DEPENDENCY VERSION of .* to ~${VERSION} ======"
    DESTDIR="$DIR/../"

    for (( j=0; j<${projectslength}; j++ ));
    do
        PROJECT=${prefix}${projects[$j]}
        sed "${sedi[@]}" "s/\"${PROJECT}\": \".*\"/\"${PROJECT}\": \">=${VERSION}\"/g"  ${DESTDIR}/package.json
        sed "${sedi[@]}" "s/\"${PROJECT}\": \"~.*\"/\"${PROJECT}\": \"~${VERSION}\"/g"  ${DESTDIR}/package.json
        sed "${sedi[@]}" "s/\"${PROJECT}\": \"^.*\"/\"${PROJECT}\": \"^${VERSION}\"/g"  ${DESTDIR}/package.json
    done
}

update_total_build_dependency_js_version(){
    echo "====== UPDATE DEPENDENCY VERSION @alfresco/js-api total build to ~${1} in ${DESTDIR}======"
    DESTDIR="$DIR/../"
    PACKAGETOCHANGE="@alfresco\/js-api"

    sed "${sedi[@]}" "s/\"${PACKAGETOCHANGE}\": \".*\"/\"${PACKAGETOCHANGE}\": \">=${1}\"/g"  ${DESTDIR}/package.json
    sed "${sedi[@]}" "s/\"${PACKAGETOCHANGE}\": \"~.*\"/\"${PACKAGETOCHANGE}\": \"~${1}\"/g"  ${DESTDIR}/package.json
    sed "${sedi[@]}" "s/\"${PACKAGETOCHANGE}\": \"^.*\"/\"${PACKAGETOCHANGE}\": \"^${1}\"/g"  ${DESTDIR}/package.json
}

update_component_js_version(){
   echo "====== UPDATE DEPENDENCY VERSION of @alfresco/js-api in ${1} to ${2} ======"
   DESTDIR="$DIR/../lib/${1}"

   PACKAGETOCHANGE="@alfresco\/js-api"

   sed "${sedi[@]}" "s/\"${PACKAGETOCHANGE}\": \".*\"/\"${PACKAGETOCHANGE}\": \">=${2}\"/g"  ${DESTDIR}/package.json
   sed "${sedi[@]}" "s/\"${PACKAGETOCHANGE}\": \"~.*\"/\"${PACKAGETOCHANGE}\": \"~${2}\"/g"  ${DESTDIR}/package.json
   sed "${sedi[@]}" "s/\"${PACKAGETOCHANGE}\": \"^.*\"/\"${PACKAGETOCHANGE}\": \"^${2}\"/g"  ${DESTDIR}/package.json

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

update_total_build_dependency_version

if $JS_API == true; then
    if $DIFFERENT_JS_API == true; then
        update_total_build_dependency_js_version ${VERSION_JS_API}
    else
        update_total_build_dependency_js_version ${VERSION}
    fi
fi

echo "====== UPDATE DEMO SHELL ======"

DESTDIR="$DIR/../demo-shell/"
npm version --allow-same-version --no-git-tag-version --force ${VERSION}

cd $DESTDIR
npm version --allow-same-version --no-git-tag-version --force ${VERSION}
cd -
