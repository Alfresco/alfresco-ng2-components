git fetch

git checkout develop
git pull --rebase
git checkout ng16-develop
git rebase origin/develop
git push origin ng16-develop --force --no-verify
echo -e "\e[34m===> Rebase complete \e[0m"

if [ $? -eq 0 ]; then
    echo -e "\e[34m===> Resetting Migration Branch \e[0m"
    git checkout ng16-migration
    git reset --hard origin/develop

    git cherry-pick  --quit
    echo -e "\e[34m===> Merge changes from cherry pick branch: ng16-develop cherry pick list\e[0m"
    git cherry-pick `git log --pretty=format:"%H" origin/develop..origin/ng16-develop --reverse` -x
    if [ $? -eq 0 ]; then
        echo -e "\e[34m===> Cherry Picking complete! Pushing... \e[0m"
        # git push origin ng16-migration --force --no-verify
        echo -e "\e[34m===> Pushed \e[0m"
    else
        echo -e "\e[31mThere was some error during cherry-picking of ng16-develop\e[0m"
        exit 1;
    fi
else
    echo -e "\e[31mThere was some error during rebasing/resetting!\e[0m"
    exit 1;
fi
