if [[ $TRAVIS_BRANCH == "development" ]];
then
    ./scripts/update-version.sh -gnu -nextalpha || exit 1;
fi

./lib/dist/cli/bin/adf-cli npm-publish --npmRegistry $NPM_REGISTRY_ADDRESS --tokenRegistry $NPM_REGISTRY_TOKEN --tag $TAG_NPM --pathProject "$(pwd)"
