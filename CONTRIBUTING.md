# Contributing to ADF 

- [Library Contents](#submitting-a-pull-request-pr)
- [Code style](#code-style)
- [Test guide](#test-guide)

## Submitting a Pull Request (PR)

Before you submit please follow the steps below: 

* Search in  [GitHub PR](https://github.com/Alfresco/alfresco-ng2-components/pulls) for an open or closed PR
  that could solve or already solves your issue.
* Search in the [GitHub release history](https://github.com/Alfresco/alfresco-ng2-components/releases) if your
  issue has already been solved in a new version of ADF.
* Fork our repository - [if you don't know how to do it read this GitHub document](https://help.github.com/articles/creating-a-pull-request-from-a-fork/)
* Make your changes in a new git branch starting from development and following the [naming convention](https://github.com/Alfresco/alfresco-ng2-components/wiki/Branching-Strategy)

     ```shell
     git checkout -b dev-{developerName}-{GitIssuedId/JiraIssueId} development
     ```

* Create your PR **including appropriate test cases** following the [code contribution acceptance criteria](https://github.com/Alfresco/alfresco-ng2-components/wiki/Code-contribution-acceptance-criteria)
* Run the tests and make sure they are green. Please don't comment out or exclude the already existing tests
* Commit your change using the [commit format message good practice](https://github.com/Alfresco/alfresco-ng2-components/wiki/Commit-format)
* Push your branch to GitHub:

    ```shell
    git push origin dev-{developerName}-{GitIssuedId/JiraIssueId}
    ```

* In GitHub, send a pull request to `development`.
* If we suggest changes then:
  * Make the required updates.
  * Re-run the tests.
  * Rebase your branch and force push to your GitHub repository (this will update your Pull Request):

    ```shell
    git fetch development
    git checkout dev-my-branch
    git rebase development -i
    git push -f
    ```
Note: If you need more information about how to sync your fork, see [here](https://help.github.com/articles/syncing-a-fork/)

## Code style

The code style in the ADF code follows the [Angular style guide](https://angular.io/guide/styleguide) plus some internal rules.
You don’t have to worry too much about those rules because they are automatically checked by tslint/codelyzer/adf-rules.
If your code is not compliant to one of these rules you will receive an error when you build the project with some help on how to fix it.
The ADF-Rules :
* File name component/directive cannot start with Alfresco/Activiti/adf - this rule is to help developers find files easily
* Class names cannot start with Alfresco/Activiti/adf for the same reason as above
* scss is mandatory. All the classes need to have the adf- prefix

## Test guide
In ADF we are encouraging the use of behavior-driven development (BDD)

### General guidelines

* Class selector in all the tests is not suggested. Use of the element ID is preferred
* Any test case should test only one behavior
* Use of the Angular [testBed](https://angular.io/guide/testing#testbed) is highly recommended

### File name

* The file name specification as to be the same of the component/service/pipe it test plus the .spec. suffix
* The specification file has to be in the same folder of the component/service/pipe it test

### Describer Name

* The Main describer of the test should be the name of the class under test
* The sub describe is used for grouping related behavior test. Do not over use it

### Test Name

Any test should follow the naming convetion:

[Should] [ ***Expected Behavior** ] [when/after/before] [ ***State Under Test*** ].
