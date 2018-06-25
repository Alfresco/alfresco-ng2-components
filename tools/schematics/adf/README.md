# ADF doc generator schematic

**Caution:** Although this tool should not be able to do any harm, it is still at the
experimental stage. Check the results if you use it for anything "serious".

This [schematic](https://github.com/angular/devkit/tree/master/packages/angular_devkit/schematics)
works with [Angular CLI](https://cli.angular.io/) to make it easier to generate new
component doc files for ADF.

## Setup

The schematic uses Angular CLI, so you must first install this tool using the instructions
on their [GitHub page](https://github.com/angular/angular-cli), if you have not already done so.

To set up the schematic itself for use, `cd` into the root `alfresco-ng2-components` folder and type:

    npm link tools\schematics\adf

## Usage

The schematic works with the `ng generate` command. The name of the schematic is `adf:docpage` and
it also requires the library name and filename as parameters. The general format is:

    ng generate adf:docpage lib/comp-name.type.md

Here, `lib` is one of the ADF libraries (`content-services`, `core`, `process-services`
or `insights`). The `type` portion refers to the class type the doc page refers to
(component, service, model, etc). So,

    ng generate adf:docpage core/arc-reactor.service.md

...will generate a page for the Arc Reactor service in the core library. Note that the name of the
doc file should match the name of the Typescript file where the class is defined
(arc-reactor.service.ts, in this case).