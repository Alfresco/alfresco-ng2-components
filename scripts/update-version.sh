#!/usr/bin/env bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
eval JS_API=true
eval GNU=false
eval EXEC_COMPONENT=true
eval DIFFERENT_JS_API=false
eval AUTO=false

eval projects=( "core"
    "content-services"
    "process-services"
    "insights" )

cd `dirname $0`

prefix="@alfresco\/adf-"

show_help() {
    echo "Usage: update-version.sh"
    echo ""
    echo "-sj or -sjsapi  don't update js-api version"
    echo "-vj or -versionjsapi  to use a different version of js-api"
    echo "-demoshell execute the change version only in the demo shell "
    echo "-v or -version  version to update"
    echo "-alpha update last alpha version of js-api and lib automatically"
    echo "-gnu for gnu"
}

skip_js() {
    echo "====== Skip JS-API change version $1 ====="
    JS_API=false
}

last_alpha_mode() {
    echo "====== Auto find last version ====="
    JS_API=false
    VERSION=$(npm view @alfresco/adf-core@alpha version)

    echo "====== version lib ${VERSION} ====="

    DIFFERENT_JS_API=$(npm view alfresco-js-api@alpha version)

    echo "====== version js-api ${DIFFERENT_JS_API} ====="
}

gnu_mode() {
    echo "====== GNU MODE ====="
    GNU=true
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

only_demoshell() {
    echo "====== UPDATE Only the demo shell versions ====="
    EXEC_COMPONENT=false
}


update_component_version() {
   echo "====== UPDATE PACKAGE VERSION of ${PACKAGE} to ${VERSION} version in all the package.json ======"
   DESTDIR="$DIR/../lib/${1}"
   sed "${sedi[@]}" "s/\"version\": \".*\"/\"version\": \"${VERSION}\"/g"  ${DESTDIR}/package.json
}

clean_lock() {
   echo "====== clean lock file ${1} ======"
   DESTDIR="$DIR/../lib/${1}"
   rm ${DESTDIR}/package-lock.json
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
   DESTDIR="$DIR/../lib/"

   for (( j=0; j<${projectslength}; j++ ));
    do
       echo "====== UPDATE TOTAL BUILD DEPENDENCY VERSION of .* to ~${VERSION} in ${1}======"
       sed "${sedi[@]}" "s/\"${prefix}${projects[$j]}\": \".*\"/\"${prefix}${projects[$j]}\": \"${VERSION}\"/g"  ${DESTDIR}/package.json
       sed "${sedi[@]}" "s/\"${prefix}${projects[$j]}\": \"~.*\"/\"${prefix}${projects[$j]}\": \"~${VERSION}\"/g"  ${DESTDIR}/package.json
       sed "${sedi[@]}" "s/\"${prefix}${projects[$j]}\": \"^.*\"/\"${prefix}${projects[$j]}\": \"^${VERSION}\"/g"  ${DESTDIR}/package.json
     done
}

update_total_build_dependency_js_version(){
    echo "====== UPDATE DEPENDENCY VERSION of total build to ~${1} in ${DESTDIR}======"
    DESTDIR="$DIR/../lib/"
    PACKAGETOCHANGE="alfresco-js-api"

    sed "${sedi[@]}" "s/\"${PACKAGETOCHANGE}\": \".*\"/\"${PACKAGETOCHANGE}\": \"${1}\"/g"  ${DESTDIR}/package.json
    sed "${sedi[@]}" "s/\"${PACKAGETOCHANGE}\": \"~.*\"/\"${PACKAGETOCHANGE}\": \"${1}\"/g"  ${DESTDIR}/package.json
    sed "${sedi[@]}" "s/\"${PACKAGETOCHANGE}\": \"^.*\"/\"${PACKAGETOCHANGE}\": \"${1}\"/g"  ${DESTDIR}/package.json
}

update_component_js_version(){
   echo "====== UPDATE DEPENDENCY VERSION of alfresco-js-api in ${1} to ${2} ======"
   DESTDIR="$DIR/../lib/${1}"

   PACKAGETOCHANGE="alfresco-js-api"

   sed "${sedi[@]}" "s/\"${PACKAGETOCHANGE}\": \".*\"/\"${PACKAGETOCHANGE}\": \"${2}\"/g"  ${DESTDIR}/package.json
   sed "${sedi[@]}" "s/\"${PACKAGETOCHANGE}\": \"~.*\"/\"${PACKAGETOCHANGE}\": \"${2}\"/g"  ${DESTDIR}/package.json
   sed "${sedi[@]}" "s/\"${PACKAGETOCHANGE}\": \"^.*\"/\"${PACKAGETOCHANGE}\": \"${2}\"/g"  ${DESTDIR}/package.json

}

update_demo_shell_dependency_version(){

   for (( k=0; k<${projectslength}; k++ ));
   do
    echo "====== UPDATE VERSION OF DEMO-SHELL to ${projects[$k]} version ${VERSION} ======"
    DESTDIR="$DIR/../demo-shell/"

       sed "${sedi[@]}" "s/\"${prefix}${projects[$k]}\": \".*\"/\"${prefix}${projects[$k]}\": \"${VERSION}\"/g"  ${DESTDIR}/package.json
       sed "${sedi[@]}" "s/\"${prefix}${projects[$k]}\": \"~.*\"/\"${prefix}${projects[$k]}\": \"~${VERSION}\"/g"  ${DESTDIR}/package.json
       sed "${sedi[@]}" "s/\"${prefix}${projects[$k]}\": \"^.*\"/\"${prefix}${projects[$k]}\": \"^${VERSION}\"/g"  ${DESTDIR}/package.json
   done
}

update_demo_shell_js_version(){
    echo "====== UPDATE VERSION OF DEMO-SHELL to  alfresco-js-api version ${1} ======"
    DESTDIR="$DIR/../demo-shell/"
    PACKAGETOCHANGE="alfresco-js-api"

    sed "${sedi[@]}" "s/\"${PACKAGETOCHANGE}\": \".*\"/\"${PACKAGETOCHANGE}\": \"${1}\"/g"  ${DESTDIR}/package.json
    sed "${sedi[@]}" "s/\"${PACKAGETOCHANGE}\": \"~.*\"/\"${PACKAGETOCHANGE}\": \"${1}\"/g"  ${DESTDIR}/package.json
    sed "${sedi[@]}" "s/\"${PACKAGETOCHANGE}\": \"^.*\"/\"${PACKAGETOCHANGE}\": \"${1}\"/g"  ${DESTDIR}/package.json
}

clean_lock_demo_shell(){
   echo "====== clean lock file demo-shell ======"
    DESTDIR="$DIR/../demo-shell/"
    rm ${DESTDIR}/package-lock.json
}

while [[ $1  == -* ]]; do
    case "$1" in
      -h|--help|-\?) show_help; exit 0;;
      -v|version) version_change $2; shift 2;;
      -sj|sjsapi) skip_js; shift;;
      -vj|versionjsapi)  version_js_change $2; shift 2;;
      -gnu) gnu_mode; shift;;
      -alpha) last_alpha_mode; shift;;
      -demoshell) only_demoshell; shift;;
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

projectslength=${#projects[@]}

if $EXEC_COMPONENT == true; then
    echo "====== UPDATE COMPONENTS ======"

    # use for loop to read all values and indexes
    for (( i=0; i<${projectslength}; i++ ));
    do
       clean_lock ${projects[$i]}
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

    echo "====== UPDATE TOTAL BUILD======"

    update_total_build_dependency_version

    if $JS_API == true; then
        if $DIFFERENT_JS_API == true; then
            update_total_build_dependency_js_version ${VERSION_JS_API}
        else
            update_total_build_dependency_js_version ${VERSION}
        fi
    fi
fi

echo "====== UPDATE DEMO SHELL ======"

clean_lock_demo_shell

update_demo_shell_dependency_version

if $JS_API == true; then
    if $DIFFERENT_JS_API == true; then
        update_demo_shell_js_version ${VERSION_JS_API}
    else
        update_demo_shell_js_version ${VERSION}
    fi
fi

DESTDIR="$DIR/../demo-shell/"
sed "${sedi[@]}" "s/\"version\": \".*\"/\"version\": \"${VERSION}\"/g"  ${DIR}/../demo-shell/package.json

if $EXEC_COMPONENT == true; then
    rm ${DIR}/../lib/package-lock.json
    sed "${sedi[@]}" "s/\"version\": \".*\"/\"version\": \"${VERSION}\"/g"  ${DIR}/../lib/package.json
fi
