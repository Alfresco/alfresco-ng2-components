#!/usr/bin/env bash

smart_build_process_services_cloud() {
    echo "========= Process Services Cloud ========="
    echo "====== lint ======"
    ./node_modules/.bin/tslint -p ./lib/process-services-cloud/tsconfig.json -c ./lib/tslint.json || exit 1

    echo "====== Unit test ======"
    ng test process-services-cloud --watch=false || exit 1

    echo "====== Build ======"
    ng build process-services-cloud || exit 1

    echo "====== Build style ======"
    node ./lib/config/bundle-process-services-cloud-scss.js || exit 1

    echo "====== Copy i18n ======"
    mkdir -p ./lib/dist/process-services-cloud/bundles/assets/adf-process-services-cloud/i18n
    cp -R ./lib/process-services-cloud/src/lib/i18n/* ./lib/dist/process-services-cloud/bundles/assets/adf-process-services-cloud/i18n

    echo "====== Copy assets ======"
    cp -R ./lib/process-services-cloud/src/lib/assets/* ./lib/dist/process-services-cloud/bundles/assets

    echo "====== Move to node_modules ======"
    rm -rf ./node_modules/@alfresco/adf-process-services-cloud/ && \
    mkdir -p ./node_modules/@alfresco/adf-process-services-cloud/ && \
    cp -R ./lib/dist/process-services-cloud/* ./node_modules/@alfresco/adf-process-services-cloud/
}

smart_build_process_services() {
    echo "========= Process Services ========="
    echo "====== lint ======"
    ./node_modules/.bin/tslint -p ./lib/process-services/tsconfig.json -c ./lib/tslint.json || exit 1

    echo "====== Unit test ======"
    ng test process-services --watch=false || exit 1

    echo "====== Build ======"
    ng build process-services || exit 1

    echo "====== Build style ======"
    node ./lib/config/bundle-process-services-scss.js || exit 1

    echo "====== Copy i18n ======"
    mkdir -p ./lib/dist/process-services/bundles/assets/adf-process-services/i18n
    cp -R ./lib/process-services/i18n/* ./lib/dist/process-services/bundles/assets/adf-process-services/i18n

    echo "====== Copy assets ======"
    cp -R ./lib/process-services/assets/* ./lib/dist/process-services/bundles/assets

    echo "====== Move to node_modules ======"
    rm -rf ./node_modules/@alfresco/adf-process-services/ && \
    mkdir -p ./node_modules/@alfresco/adf-process-services/ && \
    cp -R ./lib/dist/process-services/* ./node_modules/@alfresco/adf-process-services/
}

smart_build_content_services() {
    echo "========= Content Services ========="
    echo "====== lint ======"
    ./node_modules/.bin/tslint -p ./lib/content-services/tsconfig.json -c ./lib/tslint.json || exit 1

    echo "====== Unit test ======"
    ng test content-services --watch=false || exit 1

    echo "====== Build ======"
    npm run ng-packagr -- -p ./lib/content-services/  || exit 1

    echo "====== Build style ======"
    node ./lib/config/bundle-content-services-scss.js || exit 1

    echo "====== Copy i18n ======"
    mkdir -p ./lib/dist/content-services/bundles/assets/adf-content-services/i18n
    cp -R ./lib/content-services/i18n/* ./lib/dist/content-services/bundles/assets/adf-content-services/i18n

    echo "====== Copy assets ======"
    cp -R ./lib/content-services/assets/* ./lib/dist/content-services/bundles/assets

    echo "====== Move to node_modules ======"
    rm -rf ./node_modules/@alfresco/adf-content-services/ && \
    mkdir -p ./node_modules/@alfresco/adf-content-services/ && \
    cp -R ./lib/dist/content-services/* ./node_modules/@alfresco/adf-content-services/
}


smart_build_core() {
    echo "========= Core ========="
    echo "====== lint ======"
    npm run lint-lib || exit 1

    echo "====== Unit tests ======"
    echo "====== Unit tests:core ======"
    ng test core --watch=false || exit 1
    echo "====== Unit tests:content-services ======"
    ng test content-services --watch=false || exit 1
    echo "====== Unit tests:process-services ======"
    ng test process-services --watch=false || exit 1
    echo "====== Unit tests:process-services-cloud ======"
    ng test process-services-cloud --watch=false || exit 1

    echo "====== Build ======"
    npm run build-lib  || exit 1

    echo "====== Upload to ACS ======"
    node ./scripts/upload-build-lib-in-cs.js -u "$E2E_USERNAME"  -p "$E2E_PASSWORD" --host "$E2E_HOST" -f $TRAVIS_BUILD_NUMBER

    echo "====== Create demo-shell ======"
    npm run build:dist || exit 1

    echo "====== E2E ======"
    echo "====== E2E:core ======"
    ./scripts/test-e2e-lib.sh -host localhost:4200 -proxy "$E2E_HOST" -u "$E2E_USERNAME" -p "$E2E_PASSWORD" -e $E2E_EMAIL -b -save --folder core --skip-lint --use-dist --timeout 7000
}

eval BRANCH_NAME=""
eval HEAD_SHA_BRANCH=""
eval SHA_2="HEAD"

show_help() {
    echo "Usage: smart-build.sh"
    echo ""
    echo "-b branch name"
}

branch_name(){
    BRANCH_NAME=$1
}

while [[ $1  == -* ]]; do
    case "$1" in
      -b)  branch_name $2; shift 2;;
      -*) echo "invalid option: $1" 1>&2; show_help; exit 0;;
    esac
done

if [[ "$BRANCH_NAME" == "" ]]
then
    echo "The branch name is mandatory"
    exit 0
fi

#HEAD_SHA_BRANCH=(`git merge-base origin/$BRANCH_NAME HEAD`)
HEAD_SHA_BRANCH=af28c79
echo "Branch name $BRANCH_NAME HEAD sha " $HEAD_SHA_BRANCH

#find affected libs
npm run affected:libs -- "$HEAD_SHA_BRANCH" "HEAD" > deps.txt

#clean file
sed -i '/^$/d'  ./deps.txt
sed -i '/alfresco-components/d' ./deps.txt
sed -i '/nx affected:libs/d' ./deps.txt
sed -i '/^$/d'  ./deps.txt

#read result from file
while IFS= read -r var
do
    fileLine=$var
done < "./deps.txt"

echo "Libs changed: $fileLine";
#transform string to array
libs=(`echo $fileLine | sed 's/^$/\n/g'`)

#core
for i in "${libs[@]}"
do
    if [ "$i" == "core" ] ; then
        smart_build_core
        exit 0;
    fi
done

#content-services
for i in "${libs[@]}"
do
    if [ "$i" == "content-services" ] ; then
        smart_build_content_services
    fi
done

#process-services
for i in "${libs[@]}"
do
    if [ "$i" == "process-services" ] ; then
        smart_build_process_services
    fi
done

#cloud
for i in "${libs[@]}"
do
    if [ "$i" == "process-services-cloud" ] ; then
        smart_build_process_services_cloud
    fi
done

rm deps.txt
