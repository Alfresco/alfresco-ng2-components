#!/usr/bin/env bash

affected="$(./scripts/affected-libs.sh -b "$TRAVIS_BRANCH")"
libs=(`echo $affected | sed 's/^$/\n/g'`)

#core
for i in "${libs[@]}"
do
    if [ "$i" == "core$" ] ; then
        ./scripts/build-core.sh
    fi
done

#content-services
for i in "${libs[@]}"
do
    if [ "$i" == "content-services$" ] ; then
        ./scripts/build-content-services.sh
    fi
done

#process-services
for i in "${libs[@]}"
do
    if [ "$i" == "process-services$" ] ; then
        ./scripts/build-process-services-cloud.sh
    fi
done

#process-services-cloud
for i in "${libs[@]}"
do
    if [ "$i" == "process-services-cloud$" ] ; then
        ./scripts/build-process-services-cloud.sh
    fi
done

#insights
for i in "${libs[@]}"
do
    if [ "$i" == "insights$" ] ; then
        ./scripts/build-insights.sh
    fi
done

#extensions
for i in "${libs[@]}"
do
    if [ "$i" == "extensions$" ] ; then
        ./scripts/build-extensions.sh
    fi
done
