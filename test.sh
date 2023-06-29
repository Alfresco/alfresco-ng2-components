#!/usr/bin/env bash
isAffected=false
affectedLibs=$(npx nx print-affected --type=lib --select=projects --base=origin/develop --head=HEAD --plain)
echo $affectedLibs
if [[  $affectedLibs =~ process-services ]]; then
    isAffected=true
fi;
echo "Determine if process-services is affected: $isAffected";