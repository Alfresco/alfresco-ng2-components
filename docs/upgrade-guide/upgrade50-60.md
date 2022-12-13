---
Title: Upgrading from ADF v5.0 to v6.0
---

# Upgrading from ADF v5.0 to v6.0

This guide explains how to upgrade your ADF v5.0 project to work with v6.0.

Do not skip this task, if you want your application to be updated to a most recent version of ADF. Upgrades of multiple versions of ADF cannot be done in one step only, but should follow the chain of sequential updates. 

**Note:** the steps described below might involve making significant changes
to your code. If you are working with a versioning system then you should
commit any changes you are currently working on. If you aren't using versioning
then be sure to make a backup copy of your project before going ahead with the
upgrade.

Since 6.0 is a major version release, there are [breaking changes](#breaking-changes)
you need to take into account as well as the usual library updates. After updating
the libraries, check the other sections to see if any of the changes affect your
project.

## Contents

-   [Library updates](#library-updates)
-   [Breaking changes](#breaking-changes)

## Library updates

1.  Update the `package.json` file with the latest library versions:

    ```json
    "dependencies": {
        ...
        "@alfresco/adf-core": "6.0.0",
        "@alfresco/adf-content-services": "6.0.0",
        "@alfresco/adf-process-services-cloud": "6.0.0",
        "@alfresco/adf-insights": "6.0.0",
        "@alfresco/js-api": "6.0.0",
        ...
    ```

2.  Clean your old distribution and dependencies by deleting `node_modules` and `package-lock.json`.

3.  Reinstall your dependencies
    ```sh
    npm install
    ```

## Breaking changes

The ADF project follows the [semver](https://semver.org/) conventions and so we
only make breaking changes (ie, not backward-compatible) in _major_ versions.
ADF 6.0 is the first major version since general availability so a number of
deprecated items have been removed and also some existing items have been
renamed. The sections below explain how to adapt your project to the changes
in 6.0. See also our
For more information about the changes and links to the associated
pull requests.

[TODO ADD HERE the PRs ] 
CheckAllowableOperationDirective: Moved from ADF Core to ADF content services
LibraryFavoriteDirective: Moved from ADF Core to ADF content services
LibraryMembershipDirective: Moved from ADF Core to ADF content services
NodeDeleteDirective: Moved from ADF Core to ADF content services
NodeFavoriteDirective: Moved from ADF Core to ADF content services
NodeRestoreDirective: Moved from ADF Core to ADF content services
[TODO ADD HERE the PRs ] 


Each section needs to contains:
Title
Description
How to fix it:

## Deprecated items
  


## Relocated classes

Following classes have been relocated:
- `VersionCompatibilityService` and `VersionCompatibilityDirective` relocated from `@alfresco/adf-core` to `@alfresco/adf-content-services`

## Renamed items


### New Classes or Services


### Properties and methods


### Component selectors


