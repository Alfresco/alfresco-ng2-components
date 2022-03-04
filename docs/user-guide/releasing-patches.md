# ADF Patch Release

**Below steps describe how to create a patch release for latest ADF version**

1. Patching ADF starts from master branch, therefore you need to be sure you have the latest master branch:

    ```bash
    git checkout master
    git pull
    ```

2. Learn the version you would like to patch, you can check ADF versions [here](https://github.com/Alfresco/alfresco-ng2-components/tags).

3. Create new patch branch from master i.e. **develop-patch-VERSION** (e.g. develop-patch-4.11.1):

    ```bash
    git checkout -b develop-patch-VERSION master
    ```

4. Apply and commit your fix to **develop-patch-VERSION** branch.

5. Run [release.sh](../../scripts/release.sh) script with proper patch version:

    ```bash
    scripts/release.sh -v VERSION

    # e.g. scripts/release.sh -v 4.11.1
    ```
6. Push your changes and run all tests:

    ```bash
    git push -u origin develop-patch-VERSION
    ```

    In order to run all tests you can use **[ci:force]** flag:

    ```bash
    git commit -m '[ci:force]' --allow-empty
    git push
    ```

7. Verify if tests are green and if everything looks fine, you can proceed further.

8. Create new branch from **master** and call it **master-patch-VERSION** (e.g. master-patch-4.11.1):

    ```bash
    git checkout master
    git checkout -b master-patch-VERSION
    ```

9. Merge **develop-patch-VERSION** into **master-patch-VERSION**:

    ```bash
    git checkout master-patch-VERSION
    git merge develop-patch-VERSION
    ```

10. Push **master-patch-VERSION** branch:

    ```bash
    git push -u origin master-patch-VERSION
    ```

11. Verify if build is green and check if proper [tag](https://github.com/Alfresco/alfresco-ng2-components/tags) was created.

12. After all is done, you can **cherry-pick** your fix to develop.