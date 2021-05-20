---
Title: Release notes v4.4.0
---

# Alfresco Application Development Framework (ADF) version 4.4.0 Release Note

These release notes provide information about the **4.4.0 release** of the Alfresco Application Development Framework.

This is the latest **General Available** release of the Application Development Framework, which contains the Angular components to build a Web Application on top of the Alfresco Platform.

The release can be found on GitHub at [this location](https://github.com/Alfresco/alfresco-ng2-components/releases/tag/4.4.0).

## Contents

-   [New package versions](#new-package-versions)
-   [Goals for this release](#goals-for-this-release)
    -   [Custom type and aspect management](#custom-type-and-aspect-management)
-   [Localisation](#localisation)
-   [References](#references)
-   [PR merged](#pr-merged)

## New package versions

    "@alfresco/adf-content-services" : "4.4.0"
    "@alfresco/adf-process-services" : "4.4.0"
    "@alfresco/adf-core" : "4.4.0"
    "@alfresco/adf-insights" : "4.4.0",
    "@alfresco/adf-extensions": "4.4.0"
    "@alfresco/adf-testing": "4.4.0"
    "@alfresco/adf-cli": "4.4.0"

## Goals for this release

This is a minor release of the Alfresco Application Development Framework, developed to receive the latest and greatest benefits of the bugfixes, and the enhancements planned since the release of the previous version.

Please report issues with this release in the [issue tracker](https://github.com/Alfresco/alfresco-ng2-components/issues/new). You can collaborate on this release or share feedback by using the discussion tools on [Gitter](http://gitter.im/Alfresco/alfresco-ng2-components).

## Notable new features

### Multivalued card-view for Date, Datetime, Integers support
The multi-valued text (d:text) were already correctly displayed in the content metadata component. From 4.4.0, ADF support also other multi-valued data types: Date, Datetime and Integers.

### Image viewer Crop and rotate
In the image viewer was  present the rotate functionality, but it wasn't possible to store the state of the rotation. Form 4.4.0, ADF has new  image manipulation capabilities :
    - crop
    - rotate
Is now also possible store the result of the rotation and the crop.

### Permission component restyle

The new permission component style has been made to add consistency across the ADF components on how  information are displayed.
Viewing permissions is now simpler and user can see more permission information displayed. The restyle has mainly focused on :

- Improve UX for toggling inheriting permissions
- Improved UX for giving users permissions


### Extensibility: support replacing values on merge

### Replacing Values

By default, the data from the extensions gets merged with the existing one.

For example:

**Application Data**

```json
{
    "languages": [
        { "key": "en", "title": "English" },
        { "key": "it", "title": "Italian" }
    ]
}
```

**Extension Data**

```json
{
    "languages": [
        { "key": "fr", "title": "French" },
    ]
}
```

**Expected Result**

At runtime, the application is going to display three languages

```json
{
    "languages": [
        { "key": "en", "title": "English" },
        { "key": "it", "title": "Italian" },
        { "key": "fr", "title": "French" },
    ]
}
```

You can replace the value by using the special key syntax:

```json
{
    "<name>.$replace": "<value>"
}
```

**Example:**

```json
{
    "languages.$replace": [
        { "key": "fr", "title": "French" }
    ]
}
```

**Expected Result**

At runtime, the application is going to display languages provided by the extension (given that no other extension file replaces the values, otherwise it is going to be a "last wins" scenario)

```json
{
    "languages": [
        { key: "fr", "title": "French" }
    ]
}
```


## Localisation

This release includes: Arabic, Brazilian Portuguese, Czech, Danish, Dutch, Finnish, French, German, Italian, Japanese, Norwegian (Bokmål), Polish, Russian, Simplified Chinese, Spanish and Swedish versions.

## References

The following is a brief list of references to help you get started with the new release:

-   [Getting started guides with Alfresco Application Development Framework](https://community.alfresco.com/community/application-development-framework/pages/get-started)
-   [Alfresco ADF Documentation on the Builder Network](../README.md)
-   [Gitter chat supporting Alfresco ADF](https://gitter.im/Alfresco/alfresco-ng2-components)
-   [ADF examples on GitHub](https://github.com/Alfresco/adf-examples)
-   [Official GitHub Project - alfresco-ng2-components](https://github.com/Alfresco/alfresco-ng2-components)
-   [Official GitHub Project - alfresco-js-api](https://github.com/Alfresco/alfresco-js-api)
-   [Official GitHub Project - generator-ng2-alfresco-app](https://github.com/Alfresco/generator-ng2-alfresco-app)

Please refer to the [official documentation](http://docs.alfresco.com/) for further details and suggestions.

## PR merged 

* [Alfresco/alfresco-ng2-components#6808 - [ACA-4340]Add method for createProcessInstanceAndClaimFirstTask](https://github.com/Alfresco/alfresco-ng2-components/pull/6808)
* [Alfresco/alfresco-ng2-components#6781 - Remove demo shell test and make cloud a bit more stable](https://github.com/Alfresco/alfresco-ng2-components/pull/6781)
* [Alfresco/alfresco-ng2-components#6822 - Bump snyk from 1.462.0 to 1.495.0](https://github.com/Alfresco/alfresco-ng2-components/pull/6822)
* [Alfresco/alfresco-ng2-components#6809 - Bump ajv-cli from 3.2.1 to 4.2.0](https://github.com/Alfresco/alfresco-ng2-components/pull/6809)
* [Alfresco/alfresco-ng2-components#6815 - [ADF-5358] - fixed duplicated type on reopening viewer](https://github.com/Alfresco/alfresco-ng2-components/pull/6815)
* [Alfresco/alfresco-ng2-components#6827 - Bump cspell from 5.3.7 to 5.3.8](https://github.com/Alfresco/alfresco-ng2-components/pull/6827)
* [Alfresco/alfresco-ng2-components#6826 - Bump @apollo/client from 3.3.10 to 3.3.12](https://github.com/Alfresco/alfresco-ng2-components/pull/6826)
* [Alfresco/alfresco-ng2-components#6823 - Add some more info on the refresh token timeout](https://github.com/Alfresco/alfresco-ng2-components/pull/6823)
* [Alfresco/alfresco-ng2-components#6799 - [ADF-5318] E2E Content Change type](https://github.com/Alfresco/alfresco-ng2-components/pull/6799)
* [Alfresco/alfresco-ng2-components#6800 - [ADF-5359] Improve response time for filter counters](https://github.com/Alfresco/alfresco-ng2-components/pull/6800)
* [Alfresco/alfresco-ng2-components#6778 - [ACA-4307] Move Process task JSON mapping e2e process and task names to ADF resource file](https://github.com/Alfresco/alfresco-ng2-components/pull/6778)
* [Alfresco/alfresco-ng2-components#6382 - [ACA-4096] - Add getProcessFilters method in testing for APS - filters util](https://github.com/Alfresco/alfresco-ng2-components/pull/6382)
* [Alfresco/alfresco-ng2-components#6832 - Bump husky from 5.1.2 to 5.2.0](https://github.com/Alfresco/alfresco-ng2-components/pull/6832)
* [Alfresco/alfresco-ng2-components#6831 - Bump snyk from 1.495.0 to 1.503.0](https://github.com/Alfresco/alfresco-ng2-components/pull/6831)
* [Alfresco/alfresco-ng2-components#6834 - additional API docs for the TestElement](https://github.com/Alfresco/alfresco-ng2-components/pull/6834)
* [Alfresco/alfresco-ng2-components#6837 - Validate config improvements](https://github.com/Alfresco/alfresco-ng2-components/pull/6837)
* [Alfresco/alfresco-ng2-components#6838 - [ACA-4350] Add widgets to inputform for SIMPLE_APP](https://github.com/Alfresco/alfresco-ng2-components/pull/6838)
* [Alfresco/alfresco-ng2-components#6806 - [ACA-4306] Testing - Add form widget ids in the SIMPLEAPP resources file](https://github.com/Alfresco/alfresco-ng2-components/pull/6806)
* [Alfresco/alfresco-ng2-components#6840 - [AAE-4751] Modify Delete method](https://github.com/Alfresco/alfresco-ng2-components/pull/6840)
* [Alfresco/alfresco-ng2-components#6843 - [MNT-22236] Permission i18n support](https://github.com/Alfresco/alfresco-ng2-components/pull/6843)
* [Alfresco/alfresco-ng2-components#6846 - Fix affect](https://github.com/Alfresco/alfresco-ng2-components/pull/6846)
* [Alfresco/alfresco-ng2-components#6738 - [AAE-4697] Restrict content node selector breadcrumb when destination folder path is wrong](https://github.com/Alfresco/alfresco-ng2-components/pull/6738)
* [Alfresco/alfresco-ng2-components#6852 - [MNT-22236] update e2e to reflect permission i18n support](https://github.com/Alfresco/alfresco-ng2-components/pull/6852)
* [Alfresco/alfresco-ng2-components#6854 - [ACA-4337]Move APW tests: claim/release standalone task, json widget](https://github.com/Alfresco/alfresco-ng2-components/pull/6854)
* [Alfresco/alfresco-ng2-components#6851 - [AAE-4823] Add resources used in e2e tests in ADW](https://github.com/Alfresco/alfresco-ng2-components/pull/6851)
* [Alfresco/alfresco-ng2-components#6857 - Bump @apollo/client from 3.3.12 to 3.3.13](https://github.com/Alfresco/alfresco-ng2-components/pull/6857)
* [Alfresco/alfresco-ng2-components#6858 - Bump css-loader from 5.1.0 to 5.2.0](https://github.com/Alfresco/alfresco-ng2-components/pull/6858)
* [Alfresco/alfresco-ng2-components#6856 - [MNT-22236] UI strings fully updated in 16 languages](https://github.com/Alfresco/alfresco-ng2-components/pull/6856)
* [Alfresco/alfresco-ng2-components#6859 - Bump karma from 5.2.3 to 6.3.1](https://github.com/Alfresco/alfresco-ng2-components/pull/6859)
* [Alfresco/alfresco-ng2-components#6850 - [AAE-4017] Change label: attach file retrieve metadata](https://github.com/Alfresco/alfresco-ng2-components/pull/6850)
* [Alfresco/alfresco-ng2-components#6853 - [AAE-4817] E2E - Add process/form wdget ids in the CANDIDATEBASEAPP resources file](https://github.com/Alfresco/alfresco-ng2-components/pull/6853)
* [Alfresco/alfresco-ng2-components#6861 - migrate library directives from ACA](https://github.com/Alfresco/alfresco-ng2-components/pull/6861)
* [Alfresco/alfresco-ng2-components#6847 - update js-api](https://github.com/Alfresco/alfresco-ng2-components/pull/6847)
* [Alfresco/alfresco-ng2-components#6863 - [AAE-4817] Add reusble method in ProcessListCloudComponent page object](https://github.com/Alfresco/alfresco-ng2-components/pull/6863)
* [Alfresco/alfresco-ng2-components#6845 - [MNT-22298] - Added check for ACS version](https://github.com/Alfresco/alfresco-ng2-components/pull/6845)
* [Alfresco/alfresco-ng2-components#6873 - [ACA-4370] Refresh filter counter on filter click](https://github.com/Alfresco/alfresco-ng2-components/pull/6873)
* [Alfresco/alfresco-ng2-components#6874 - [ADF-5225] smoke test suite](https://github.com/Alfresco/alfresco-ng2-components/pull/6874)
* [Alfresco/alfresco-ng2-components#6865 - [AAE-4824] Add more widgets to resources and cloud related methods](https://github.com/Alfresco/alfresco-ng2-components/pull/6865)
* [Alfresco/alfresco-ng2-components#6875 - [AAE-4842] Extensibility: support replacing values on merge](https://github.com/Alfresco/alfresco-ng2-components/pull/6875)
* [Alfresco/alfresco-ng2-components#6877 - Bump husky from 5.2.0 to 6.0.0](https://github.com/Alfresco/alfresco-ng2-components/pull/6877)
* [Alfresco/alfresco-ng2-components#6860 - [ACA-4220] - preselect initator values by username](https://github.com/Alfresco/alfresco-ng2-components/pull/6860)
* [Alfresco/alfresco-ng2-components#6883 - Bump y18n from 3.2.1 to 3.2.2](https://github.com/Alfresco/alfresco-ng2-components/pull/6883)
* [Alfresco/alfresco-ng2-components#6884 - Bump karma from 6.3.1 to 6.3.2](https://github.com/Alfresco/alfresco-ng2-components/pull/6884)
* [Alfresco/alfresco-ng2-components#6866 - [ACA-4324]MovAdd details about tasks in resource files](https://github.com/Alfresco/alfresco-ng2-components/pull/6866)
* [Alfresco/alfresco-ng2-components#6882 - Update wrong methods](https://github.com/Alfresco/alfresco-ng2-components/pull/6882)
* [Alfresco/alfresco-ng2-components#6885 - The one and only typo fix!](https://github.com/Alfresco/alfresco-ng2-components/pull/6885)
* [Alfresco/alfresco-ng2-components#6897 - [AAE-4924]Add method for createProcess with variables](https://github.com/Alfresco/alfresco-ng2-components/pull/6897)
* [Alfresco/alfresco-ng2-components#6887 - [ACA-3652] Add Assignment custom filter in task filter cloud component page](https://github.com/Alfresco/alfresco-ng2-components/pull/6887)
* [Alfresco/alfresco-ng2-components#6890 - improved language picker](https://github.com/Alfresco/alfresco-ng2-components/pull/6890)
* [Alfresco/alfresco-ng2-components#6901 - Run dependabot on sunday](https://github.com/Alfresco/alfresco-ng2-components/pull/6901)
* [Alfresco/alfresco-ng2-components#6894 - [ADF-5374]Fix flaky filters tests](https://github.com/Alfresco/alfresco-ng2-components/pull/6894)
* [Alfresco/alfresco-ng2-components#6889 - [ADF-5212] fix button filter color in high contrast](https://github.com/Alfresco/alfresco-ng2-components/pull/6889)
* [Alfresco/alfresco-ng2-components#6876 - Update branch for JS-API PR#3342](https://github.com/Alfresco/alfresco-ng2-components/pull/6876)
* [Alfresco/alfresco-ng2-components#6905 - Docker publish - Remove the pathProject as mandatory](https://github.com/Alfresco/alfresco-ng2-components/pull/6905)
* [Alfresco/alfresco-ng2-components#6879 - [ACA-3957] Added correct Icons and left nav, process config layout an…](https://github.com/Alfresco/alfresco-ng2-components/pull/6879)
* [Alfresco/alfresco-ng2-components#6904 - [ADF-5156] Name column fixes](https://github.com/Alfresco/alfresco-ng2-components/pull/6904)
* [Alfresco/alfresco-ng2-components#6872 - [ACA-4358][ACA-4359] [APA] Floating label added for the process and t…](https://github.com/Alfresco/alfresco-ng2-components/pull/6872)
* [Alfresco/alfresco-ng2-components#6891 - [ACA-3619] - change assignment placeholder](https://github.com/Alfresco/alfresco-ng2-components/pull/6891)
* [Alfresco/alfresco-ng2-components#6908 - Update branch for JS-API PR#3364](https://github.com/Alfresco/alfresco-ng2-components/pull/6908)
* [Alfresco/alfresco-ng2-components#6862 - [AAE-4841] - Fix content node selector current selection is lost after uploading files](https://github.com/Alfresco/alfresco-ng2-components/pull/6862)
* [Alfresco/alfresco-ng2-components#6816 - [ACA-3188] Add methods for ADW+APS1 e2e](https://github.com/Alfresco/alfresco-ng2-components/pull/6816)
* [Alfresco/alfresco-ng2-components#6807 - [ACA-4202] - forcing firefox to ignore cache when document version ha…](https://github.com/Alfresco/alfresco-ng2-components/pull/6807)
* [Alfresco/alfresco-ng2-components#6910 - Update branch for JS-API PR#3366](https://github.com/Alfresco/alfresco-ng2-components/pull/6910)
* [Alfresco/alfresco-ng2-components#6907 - docker command: Create 2 different actions publish and link](https://github.com/Alfresco/alfresco-ng2-components/pull/6907)
* [Alfresco/alfresco-ng2-components#6906 - [ADF-5363] - when aspects has no name we will show the id instead](https://github.com/Alfresco/alfresco-ng2-components/pull/6906)
* [Alfresco/alfresco-ng2-components#6916 - [AAE-4483] Add empty list drag and drop template in upload from local…](https://github.com/Alfresco/alfresco-ng2-components/pull/6916)
* [Alfresco/alfresco-ng2-components#6919 - Bump css-loader from 5.2.0 to 5.2.1](https://github.com/Alfresco/alfresco-ng2-components/pull/6919)
* [Alfresco/alfresco-ng2-components#6920 - Bump snyk from 1.503.0 to 1.530.0](https://github.com/Alfresco/alfresco-ng2-components/pull/6920)
* [Alfresco/alfresco-ng2-components#6915 - add enableFractions in form values on number widget](https://github.com/Alfresco/alfresco-ng2-components/pull/6915)
* [Alfresco/alfresco-ng2-components#6909 - [ADF-5362] - showing in the confirm dialog only the propery of the cu…](https://github.com/Alfresco/alfresco-ng2-components/pull/6909)
* [Alfresco/alfresco-ng2-components#6917 - Bump mini-css-extract-plugin from 1.3.9 to 1.4.1](https://github.com/Alfresco/alfresco-ng2-components/pull/6917)
* [Alfresco/alfresco-ng2-components#6918 - Bump jasmine-spec-reporter from 5.0.2 to 7.0.0](https://github.com/Alfresco/alfresco-ng2-components/pull/6918)
* [Alfresco/alfresco-ng2-components#6914 - [AAE-4966] Extensible app config](https://github.com/Alfresco/alfresco-ng2-components/pull/6914)
* [Alfresco/alfresco-ng2-components#6925 - [ADF-5372] - fixed wrong result pipe](https://github.com/Alfresco/alfresco-ng2-components/pull/6925)
* [Alfresco/alfresco-ng2-components#6922 - [ADF-5362] - Content type properties should be showed when content type is changed.](https://github.com/Alfresco/alfresco-ng2-components/pull/6922)
* [Alfresco/alfresco-ng2-components#6881 - [AAE-4428] Add selected file counter to attach file widget](https://github.com/Alfresco/alfresco-ng2-components/pull/6881)
* [Alfresco/alfresco-ng2-components#6926 - Revert "[ADF-5346] DocumentList - header is not scrollable when the width of the browser is small"](https://github.com/Alfresco/alfresco-ng2-components/pull/6926)
* [Alfresco/alfresco-ng2-components#6927 - Run develop only once a day](https://github.com/Alfresco/alfresco-ng2-components/pull/6927)
* [Alfresco/alfresco-ng2-components#6923 - [ADF-5370] - fixed style for container dimension](https://github.com/Alfresco/alfresco-ng2-components/pull/6923)
* [Alfresco/alfresco-ng2-components#6930 - [AAE-4879] Update tooltip card to receive custom HTML](https://github.com/Alfresco/alfresco-ng2-components/pull/6930)
* [Alfresco/alfresco-ng2-components#6928 - [MNT-22207] - resetting query fragment when clicking Reset all button…](https://github.com/Alfresco/alfresco-ng2-components/pull/6928)
* [Alfresco/alfresco-ng2-components#6939 - [AAE-4879] Detach tooltip card when directive is destroyed](https://github.com/Alfresco/alfresco-ng2-components/pull/6939)
* [Alfresco/alfresco-ng2-components#6886 - [ACA-3700] - add suspended date filter](https://github.com/Alfresco/alfresco-ng2-components/pull/6886)
* [Alfresco/alfresco-ng2-components#6929 - [ADF-5225] smoke test](https://github.com/Alfresco/alfresco-ng2-components/pull/6929)
* [Alfresco/alfresco-ng2-components#6931 - [AAE-4995] Expand ADF PeopleContentService to create new person](https://github.com/Alfresco/alfresco-ng2-components/pull/6931)
* [Alfresco/alfresco-ng2-components#6938 - [AAE-4863] Fixed the async and done warning due to new version of Karma](https://github.com/Alfresco/alfresco-ng2-components/pull/6938)
* [Alfresco/alfresco-ng2-components#6940 - [ACA-3700] - fix suspended data filter not preserving data](https://github.com/Alfresco/alfresco-ng2-components/pull/6940)
* [Alfresco/alfresco-ng2-components#6937 -  [ACA-4361] permission layout modified](https://github.com/Alfresco/alfresco-ng2-components/pull/6937)
* [Alfresco/alfresco-ng2-components#6936 - Bump snyk from 1.530.0 to 1.550.0](https://github.com/Alfresco/alfresco-ng2-components/pull/6936)
* [Alfresco/alfresco-ng2-components#6944 - Bump ssri from 6.0.1 to 6.0.2 in /lib/cli](https://github.com/Alfresco/alfresco-ng2-components/pull/6944)
* [Alfresco/alfresco-ng2-components#6943 - Improve checkFilesAreAttachedToWidget() method](https://github.com/Alfresco/alfresco-ng2-components/pull/6943)
* [Alfresco/alfresco-ng2-components#6942 - [AAE-4985] - Make SSO Role Service accept a content admin role that is not part of the JWT token](https://github.com/Alfresco/alfresco-ng2-components/pull/6942)
* [Alfresco/alfresco-ng2-components#6949 - Run all e2e for cron jobs](https://github.com/Alfresco/alfresco-ng2-components/pull/6949)
* [Alfresco/alfresco-ng2-components#6948 - [ACA-4361] should be able to change permission if search service is down](https://github.com/Alfresco/alfresco-ng2-components/pull/6948)
* [Alfresco/alfresco-ng2-components#6950 - Fix content unit tests executing twice](https://github.com/Alfresco/alfresco-ng2-components/pull/6950)
* [Alfresco/alfresco-ng2-components#6951 - improve travis ci](https://github.com/Alfresco/alfresco-ng2-components/pull/6951)
* [Alfresco/alfresco-ng2-components#6952 - [ADF-5362] - enabiling properties refresh on ADW/ACA](https://github.com/Alfresco/alfresco-ng2-components/pull/6952)
* [Alfresco/alfresco-ng2-components#6954 - [E2E] Log demo shell not starting](https://github.com/Alfresco/alfresco-ng2-components/pull/6954)
* [Alfresco/alfresco-ng2-components#6956 - rename env variable](https://github.com/Alfresco/alfresco-ng2-components/pull/6956)
* [Alfresco/alfresco-ng2-components#6953 - Travis Ci only remove e2e on develop merge](https://github.com/Alfresco/alfresco-ng2-components/pull/6953)
* [Alfresco/alfresco-ng2-components#6957 - Abn content fixes](https://github.com/Alfresco/alfresco-ng2-components/pull/6957)
* [Alfresco/alfresco-ng2-components#6962 - Fix e2e protractor](https://github.com/Alfresco/alfresco-ng2-components/pull/6962)
* [Alfresco/alfresco-ng2-components#6947 - [AAE-5021] Add listPeople method to PeopleContentService](https://github.com/Alfresco/alfresco-ng2-components/pull/6947)
* [Alfresco/alfresco-ng2-components#6960 - More documentation syntax fixes](https://github.com/Alfresco/alfresco-ng2-components/pull/6960)
* [Alfresco/alfresco-ng2-components#6963 - [ACS-1526] Fail on Draft and unapproved PRs](https://github.com/Alfresco/alfresco-ng2-components/pull/6963)
* [Alfresco/alfresco-ng2-components#6864 - [ADF-5366] initialize discovery and version compatibility service for oauth based session](https://github.com/Alfresco/alfresco-ng2-components/pull/6864)
* [Alfresco/alfresco-ng2-components#6958 - [ADF-5378] ADF Previewer: Image Rotate + Save](https://github.com/Alfresco/alfresco-ng2-components/pull/6958)
* [Alfresco/alfresco-ng2-components#6969 - Bump css-loader from 5.2.1 to 5.2.4](https://github.com/Alfresco/alfresco-ng2-components/pull/6969)
* [Alfresco/alfresco-ng2-components#6970 - Bump @apollo/client from 3.3.13 to 3.3.16](https://github.com/Alfresco/alfresco-ng2-components/pull/6970)
* [Alfresco/alfresco-ng2-components#6967 - [ADF-5371] fix swsdp in breadcrumb](https://github.com/Alfresco/alfresco-ng2-components/pull/6967)
* [Alfresco/alfresco-ng2-components#6959 - [ACA-4389] [APS1] Convert some of process services extension E2E steps to unit-tests](https://github.com/Alfresco/alfresco-ng2-components/pull/6959)
* [Alfresco/alfresco-ng2-components#6973 - Bump stylelint from 13.10.0 to 13.13.1](https://github.com/Alfresco/alfresco-ng2-components/pull/6973)
* [Alfresco/alfresco-ng2-components#6968 - [AAE-4973] - fixed start process button enabling when default process…](https://github.com/Alfresco/alfresco-ng2-components/pull/6968)
* [Alfresco/alfresco-ng2-components#6971 - Bump mini-css-extract-plugin from 1.4.1 to 1.6.0](https://github.com/Alfresco/alfresco-ng2-components/pull/6971)
* [Alfresco/alfresco-ng2-components#6974 - [ACA-4361] Review permission list](https://github.com/Alfresco/alfresco-ng2-components/pull/6974)
* [Alfresco/alfresco-ng2-components#6924 - [ADF-5379] Add a way to disable WS notifications](https://github.com/Alfresco/alfresco-ng2-components/pull/6924)
* [Alfresco/alfresco-ng2-components#6975 - CropperJS dependency from styles to assets ](https://github.com/Alfresco/alfresco-ng2-components/pull/6975)
* [Alfresco/alfresco-ng2-components#6977 - [ADF-5377] Viewer: Image Crop](https://github.com/Alfresco/alfresco-ng2-components/pull/6977)
* [Alfresco/alfresco-ng2-components#6978 - [AAE-5122] Change mouse event to leave in tooltip card](https://github.com/Alfresco/alfresco-ng2-components/pull/6978)
* [Alfresco/alfresco-ng2-components#6964 - Update branch for JS-API PR#3405](https://github.com/Alfresco/alfresco-ng2-components/pull/6964)
* [Alfresco/alfresco-ng2-components#6982 - Update branch for JS-API PR#3445](https://github.com/Alfresco/alfresco-ng2-components/pull/6982)
* [Alfresco/alfresco-ng2-components#6981 - Bump lodash from 4.17.20 to 4.17.21](https://github.com/Alfresco/alfresco-ng2-components/pull/6981)
* [Alfresco/alfresco-ng2-components#6986 - [ACA-4361] Fix data column conflict](https://github.com/Alfresco/alfresco-ng2-components/pull/6986)
* [Alfresco/alfresco-ng2-components#6985 - Bump underscore from 1.12.0 to 1.13.1 in /tools/doc](https://github.com/Alfresco/alfresco-ng2-components/pull/6985)
* [Alfresco/alfresco-ng2-components#6988 - Bump ua-parser-js from 0.7.23 to 0.7.28](https://github.com/Alfresco/alfresco-ng2-components/pull/6988)
* [Alfresco/alfresco-ng2-components#6989 - Bump hosted-git-info from 2.8.8 to 2.8.9 in /lib/cli](https://github.com/Alfresco/alfresco-ng2-components/pull/6989)
* [Alfresco/alfresco-ng2-components#6991 - Update branch for JS-API PR#3450](https://github.com/Alfresco/alfresco-ng2-components/pull/6991)
* [Alfresco/alfresco-ng2-components#6992 - [ADF-5393] auto update node version when media management actions are…](https://github.com/Alfresco/alfresco-ng2-components/pull/6992)
* [Alfresco/alfresco-ng2-components#6980 - [ADF-5390] [ADF-5391] Add multivalue cardview for Date, Datetime, Integers and Decimal properties.](https://github.com/Alfresco/alfresco-ng2-components/pull/6980)
* [Alfresco/alfresco-ng2-components#6993 - audit npm fix](https://github.com/Alfresco/alfresco-ng2-components/pull/6993)
* [Alfresco/alfresco-ng2-components#7006 - Generate documentation](https://github.com/Alfresco/alfresco-ng2-components/pull/7006)
* [Alfresco/alfresco-ng2-components#7007 - [ADF-5393] add missing event on image viewer](https://github.com/Alfresco/alfresco-ng2-components/pull/7007)
* [Alfresco/alfresco-ng2-components#7004 - [ACA-4407] unit test for data table custom header](https://github.com/Alfresco/alfresco-ng2-components/pull/7004)
* [Alfresco/alfresco-ng2-components#7008 - Update content-type-dialog.component.md](https://github.com/Alfresco/alfresco-ng2-components/pull/7008)
* [Alfresco/alfresco-ng2-components#6999 - Update branch for JS-API PR#3476](https://github.com/Alfresco/alfresco-ng2-components/pull/6999)
* [Alfresco/alfresco-ng2-components#6966 - [ACS-1525] Only run scan environment on cron](https://github.com/Alfresco/alfresco-ng2-components/pull/6966)
* [Alfresco/alfresco-ng2-components#7005 - Start Process Cloud - Use the cloud key for validate error](https://github.com/Alfresco/alfresco-ng2-components/pull/7005)
* [Alfresco/alfresco-ng2-components#7013 - [AAE-5128] [APA] Drag and Drop template is broken on Upload from your…](https://github.com/Alfresco/alfresco-ng2-components/pull/7013)
* [Alfresco/alfresco-ng2-components#7014 - LOC-300 Updated UI files in 16 languages](https://github.com/Alfresco/alfresco-ng2-components/pull/7014)
* [Alfresco/alfresco-ng2-components#7016 - StartProcessCloud - Validation key fix path](https://github.com/Alfresco/alfresco-ng2-components/pull/7016)
* [Alfresco/alfresco-ng2-components#7010 - [AAE-5139] User name style and Discovery service initialization  fix](https://github.com/Alfresco/alfresco-ng2-components/pull/7010)
* [Alfresco/alfresco-ng2-components#7015 - [ADF-5396]  cropperjs as dependency](https://github.com/Alfresco/alfresco-ng2-components/pull/7015)
* [Alfresco/alfresco-ng2-components#7011 - [AAE-5124] Show counter only when attaching files](https://github.com/Alfresco/alfresco-ng2-components/pull/7011)
* [Alfresco/alfresco-ng2-components#7017 - [ACA-4325] - disable upload button on upload new file version begin](https://github.com/Alfresco/alfresco-ng2-components/pull/7017)

Please refer to the [Alfresco issue tracker](https://issues.alfresco.com/jira/projects/ADF/issues/ADF-581?filter=allopenissues) for other known issues in this release. If you have any questions about the release, please contact us using [Gitter](https://gitter.im/Alfresco/alfresco-ng2-components).

Thanks to the whole application team and the amazing Alfresco community for the hard work.
