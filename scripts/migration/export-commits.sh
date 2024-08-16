git fetch

git checkout ng16-migration
git pull --rebase
git rebase origin/develop

if [ $? -eq 0 ]; then
    git push origin ng16-migration --force --no-verify

    git checkout ng16-develop
    git reset --hard origin/develop

    git checkout ng16-migration
    # git pull --rebase
    # git rebase origin/develop

    # if [ $? -eq 0 ]; then
    #     git push origin ng16-migration --force-with-lease --no-verify
    #     git checkout ng16-develop
    # else
    #     echo -e "\e[31mThere was some error during rebasing of cherry-pick branch\e[0m"
    #     exit 1;
    # fi
    git cherry-pick  --quit
    echo -e "\e[34m===> Merge changes from cherry pick branch: ng15-cherry-pick-list\e[0m"
    echo -e "git cherry-pick `git log --pretty=format:"%H" origin/develop..origin/ng16-migration --reverse` -x"
    echo -e "\e[34m===> Cherry Picking complete \e[0m"
else
    echo -e "\e[31mThere was some error during rebasing of develop-ng14\e[0m"
    exit 1;
fi
