---
Title: Getting started (as developer) with Alfresco ADF-based applications
Level: Basic
---

# Prerequisites and requirements

The first thing to do is to check the prerequisites and the requirements to run the front-end application directly into a development environment.

More in particular check that you have:

-   Alfresco Content Services (alias ACS) Community or Enterprise edition up and running (identify the URL that will be required as configuration).
-   The latest lts version of NodeJs.
-   A recent (and supported) version of a browser (see here for further details).

# Cloning and launching the front-end application

Once the environment is properly configured, open a terminal and clone the following GitHub repository in a working folder.

`git clone https://github.com/Alfresco/alfresco-content-app.git`

Once done, enter the alfresco-content-app folder and create a file named .env with the following content (put the ACS URL as value).

`API_CONTENT_HOST="https://..."`

Run `npm install` and then `npm start` to get the application up and running. The application will be available at the URL <http://localhost:4200> and the credentials are the ones required by ACS.

Congratulations! You now have the Alfresco Content App running in development mode into your development environment.

# Troubleshooting and support

If you have any issue, don’t worry! There is an entire community available to help you.

In case of problems raise a question into the [Alfresco Forum](https://hub.alfresco.com/ "https://hub.alfresco.com/") (Application Development Framework section) or connect with the developers into the [Alfresco Gitter channel](https://alfresco.atlassian.net/wiki/spaces/PM/overview "https://alfresco.atlassian.net/wiki/spaces/PM/overview").

# Bonus: Use the Enterprise stack instead of the Open Source

If you are an Alfresco Customer or an Official Partner, you might be interested in using the Enterprise stack instead of the Open Source introduced above. The changes to the tasks are not too many and you can try to do the same exercise with the following changes.

-   Use ACS Enterprise Edition instead of the Community Edition.
-   Use the `alfresco-digital-workspace-app` GitHub repository (this is a private repository so you may require to get a local copy of the project raising a request into the Alfresco Support Portal).
-   Use the following `.env` file.

    AUTH_TYPE="BASIC"
    PROVIDER="ECM"
    API_CONTENT_HOST="<https://...>"
    API_PROCESS_HOST="<https://...>"
    OAUTH_HOST="<https://.../auth/realms/alfresco>"
    E2E_HOST="<http://localhost:4200>"
    ADMIN_EMAIL="..."
    ADMIN_PASSWORD="..."
    ADF_PATH="../alfresco-ng2-components"
    ACA_BRANCH="develop"
    MAXINSTANCES=3

-   Run the application using `npm start content-ee`.

# Conclusion

In this tutorial you learned how to launch a fully-featured ADF-based application on your development environment, starting from the source code, with the purpose to have a first experience with the development principles and the best practices suggested to create front-end applications working on top of the Alfresco backend services. This is only the first success that you can do with the Alfresco technology. Continue to learn on how to develop front-end applications using Alfresco, in the following sections of the official documentation.
