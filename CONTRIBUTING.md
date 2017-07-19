# Contributing to ADF 

## Submitting a Pull Request (PR)

Before you submit please follow the following step: 

* Search in  [GitHub PR](https://github.com/Alfresco/alfresco-ng2-components/pulls) for an open or closed PR
  that could solve or already solve your issue.
* Search in the [GitHub release history](https://github.com/Alfresco/alfresco-ng2-components/releases) if your
  issue has already been solved in a new version of ADF.
* Fork our repository [if you don't know how to do it read this GitHub document](https://help.github.com/articles/creating-a-pull-request-from-a-fork/)
* Make your changes in a new git branch starting from development and following the [naming convention](https://github.com/Alfresco/alfresco-ng2-components/wiki/Branching-Strategy)

     ```shell
     git checkout -b dev-{developerName}-{GitIssuedId/JiraIssueId} development
     ```

* Create your PR **including appropriate test cases** following the [code contribution acceptance criteria](https://github.com/Alfresco/alfresco-ng2-components/wiki/Code-contribution-acceptance-criteria)
* Run the test and make sure they are green and please don't comment out or exclude the already present test
* Commit your change using the [commit format message good practice](https://github.com/Alfresco/alfresco-ng2-components/wiki/Commit-format)
* Push your branch to GitHub:

    ```shell
    git push origin dev-{developerName}-{GitIssuedId/JiraIssueId}
    ```

* In GitHub, send a pull request to `development`.
* If we suggest changes then:
  * Make the required updates.
  * Re-run the test.
  * Rebase your branch and force push to your GitHub repository (this will update your Pull Request):

    ```shell
    git rebase development -i
    git push -f
    ```

## Code style

The code style in the ADF code follow the [Angular style guide](https://angular.io/guide/styleguide) plus some internal rules.
You don't have to be worry too much about out those rules because are automatically checked by tslint/codelyzer/adf-rules.
If your code is not complaint to one of this rules you will receive and error when you build the project with some help on how to fix it.
The ADF-Rules :
* File name component/directive can not to start with Alfresco/Activiti/adf this rules is to help developer to find files easily
* Class name can not to start with Alfresco/Activiti/adf for the same reason above
* scss is mandatory and the class have to start with the adf- prefix