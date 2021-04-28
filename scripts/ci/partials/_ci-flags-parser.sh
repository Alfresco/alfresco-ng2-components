# Note no #!/bin/sh as this should not spawn
# an extra shell, since this partial shell script
# is supposed to be invoked as part of another.

# ===========================================================================
# Flag for overwrite the affected projects calculation
# ===========================================================================
# Usage:
# This flag is intended to be used only for debugging purposes!!!
#
# To run only a few projects, provide a valid list of comma separated projects
# git commit -m "[affected:project-name1,project-name2] you commit message"
#

# ---------------------------------------------------------------
# Forced CI run
# ---------------------------------------------------------------
if [[ $COMMIT_MESSAGE == *"[ci:force]"* ]]; then
    echo -e "\e[31mWarning: CI build is going to run regardless of its Draft and approval status. You must be a Jedi!\e[0m"
    export CI_FORCE_RUN=true
else
    export CI_FORCE_RUN=false
fi
