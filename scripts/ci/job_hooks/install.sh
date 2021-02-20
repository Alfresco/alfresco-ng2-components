#!/usr/bin/env bash

# ===================================================================
# In this hook-file invoke commands and install dependencies.
# Envinomnent variable declarations are supposed to be
# in the "before_install.sh" hook script or in the env.yml file.
# ===================================================================

# ========== AWS CLI ==========
echo "Installing awscli (silent install)"
pip install --user awscli -q

# ========== Install node_modules or restore it from cloud cache ==========
# If the node_modules folder hasn't been restored from Travis workspace
if [[ ! -d $NODE_MODULES_DIR ]]; then
    echo -e "\e[31mTravis Workspace doesn't contain $NODE_MODULES_DIR, checking S3...\e[0m"

    aws s3 ls $S3_NODE_MODULES_CACHE_PATH > /dev/null

    # If there is no cache uploaded yet to S3
    if [ "$?" -ne 0 ]
    then
        echo -e "\e[31mCache entry for current package-lock.json ($S3_NODE_MODULES_CACHE_ID) doesn't exist, doing installation now.\e[0m"
        npm ci --quiet && scripts/ci/utils/artifact-to-s3.sh -a "$NODE_MODULES_DIR" -o "$S3_NODE_MODULES_CACHE_PATH"
    # Otherwise the cache is already on S3
    else
        echo -e "\e[32mCache entry for current package-lock.json ($S3_NODE_MODULES_CACHE_ID) exist, downloading...\e[0m"
        scripts/ci/utils/artifact-from-s3.sh -a "$S3_NODE_MODULES_CACHE_PATH" -o "$NODE_MODULES_DIR"
    fi
else
    echo -e "\e[32mThe $NODE_MODULES_DIR folder exists, possibly it was restored from the Travis Workspace...\e[0m"
fi
