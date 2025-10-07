---
Title: Debug, test, build and promote
Level: Basic
---

In this tutorial you are going to learn how to debug, test, build and promote the Alfresco Digital Workspace (aka ADW). Being an application built using the Alfresco Development Framework (aka ADF), what is described here for ADW is mostly valid also for any other ADF-based application. Differences and common commands will be described as part of this tutorial.

Being a standard Angular application, the lifecycle and the tasks described for ADW are following the same principles, tooling and best practices of any other standard Angular application. We are not going to detail here what is widely described for Angular based applications (for example for what concern the debugging) but we are going to point on third party content and best practices.

# Installing

The command to be used is the same of any Angular application

    npm install

## Applications and distributions

As part of the ADW distribution there are three different distributions to be run:
-   content-ce (Open Source Alfresco Content Application)
-   content-ee (Alfresco Digital Workspace with Alfresco Process Services extension)
-   content-ee-cloud (Alfresco Digital Workspace with Alfresco Process Automation extension)

The default distribution for ADW is set to be content-ee.

For the Alfresco Content Application (aka ACA) or any other ADF-based application, the is always one distribution and no need to specify it at build level.

## Starting

The following command is valid for ADW.

    npm start <content-ce|content-ee|content-ee-cloud> [prod]

For ACA or any other ADF-based application the command is simply npm start.

## Testing

The following command is valid for ADW.

    npm run build <content-ce|content-ee|content-ee-cloud> [prod]

For ACA or any other ADF-based application the command is simply `npm run build`.

Unit tests on ACA and ADW are developed and executed using [Karma](https://karma-runner.github.io/ "https://karma-runner.github.io/"). If you want to learn more about the available unit tests and maybe develop one (or some), you can check directly in the source code as an example.

Unit tests are developed in files with extension `specs.ts`. Almost every component has a relatedspecs.ts file stored directly in the same folder where the component lives. A unit test lloks like the following piece of source code.

    it('...descrioption...', () => { // Source code. });

You can refer to the [Karma](https://karma-runner.github.io/ "https://karma-runner.github.io/") documentation and tutorials for further details on how to develop your own tests.

## Debugging

The debugging strategy for ADW, ACA or any other ADF-based application does not differ from what is recommended for any standard Angular application. Please refer to the dedicated content or documentation for further details.

## Building

The following command is valid for ADW.

    npm run build <content-ce|content-ee|content-ee-cloud> [prod]

For ACA or any other ADF-based application the command is simply npm run build.

Once the build succeeds, a new folder named `dist` is created inside the project root. Inside of it, you will find a collection of files representing the distribution of your application.

## Building without one or more extensions

To exclude any of the bundled extensions from the distribution, you simply need to remove the imported module representing the extension, from the imports.

In case of ADW, update the `apps/content-ee/src/app/extensions.module.ts` file and remove one or more modules from the imports, as shown below.

    @NgModule({
	    imports: [
		    AosExtensionModule,
		    AcaAboutModule,
		    AcaSettingsModule,
		    AiViewModule,
		    RecordModule,
		    ProcessServicesExtensionModule,
		    ContentServicesExtensionModule,
		    ExtensionsOrderExtensionModule,
		 ],
	}) export class AppExtensionsModule {}

## Promoting in a different environment

Once built, the compiled ADF-based application is available as a collection of files directly in the `dist` folder. The promotion of the distribution of the application in a different environment can be done simply by copying the files in the target server.

Also in this case, nothing differs from a standard Angular application and the same tips and best practices can be followed.
