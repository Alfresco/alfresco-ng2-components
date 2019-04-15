import {
  BrowserBuilder,
  NormalizedBrowserBuilderSchema
} from '@angular-devkit/build-angular';
import { Path, virtualFs } from '@angular-devkit/core';
import * as fs from 'fs';
import { Observable } from 'rxjs';

import { BuilderConfiguration, BuildEvent } from '@angular-devkit/architect';
import { tap } from 'rxjs/operators';

interface PluginBuilderSchema extends NormalizedBrowserBuilderSchema {
  /**
   * A string of the form `path/to/file#exportName` that acts as a path to include to bundle
   */
  modulePath: string;

  /**
   * A name of compiled bundle
   */
  pluginName: string;

  /**
   * A comma-delimited list of shared lib names used by current plugin
   */
  sharedLibs: string;
}
export default class PluginBuilder extends BrowserBuilder {
  private options: PluginBuilderSchema;

  private entryPointPath: string;

  patchEntryPoint(contents: string) {
    fs.writeFileSync(this.entryPointPath, contents);
  }

  buildWebpackConfig(
    root: Path,
    projectRoot: Path,
    host: virtualFs.Host<fs.Stats>,
    options: PluginBuilderSchema
  ) {
    const { pluginName, sharedLibs } = this.options;

    if (!this.options.modulePath) {
      throw Error('Please define modulePath!');
    }

    if (!pluginName) {
      throw Error('Please provide pluginName!');
    }

    const config = super.buildWebpackConfig(root, projectRoot, host, options);

    // Make sure we are producing a single bundle
    delete config.entry.polyfills;
    delete config.optimization.runtimeChunk;
    delete config.optimization.splitChunks;
    delete config.entry.styles;

    config.externals = {
      rxjs: 'rxjs',
      '@angular/core': 'ng.core',
      '@angular/common': 'ng.common',
      '@angular/forms': 'ng.forms',
      '@angular/router': 'ng.router',
      '@alfresco/adf-extensions': 'adf.extensions',
      tslib: 'tslib'
      // put here other common dependencies
    };

    if (sharedLibs) {
      config.externals = [config.externals];
      const sharedLibsArr = sharedLibs.split(',');
      sharedLibsArr.forEach(sharedLibName => {
        const factoryRegexp = new RegExp(`${sharedLibName}.ngfactory$`);
        config.externals[0][sharedLibName] = sharedLibName; // define external for code
        config.externals.push((context, request, callback) => {
          if (factoryRegexp.test(request)) {
            return callback(null, sharedLibName); // define external for factory
          }
          callback();
        });
      });
    }

    const ngCompilerPluginInstance = config.plugins.find(
      x => x.constructor && x.constructor.name === 'AngularCompilerPlugin'
    );
    if (ngCompilerPluginInstance) {
      ngCompilerPluginInstance._entryModule = this.options.modulePath;
    }

    // preserve path to entry point
    // so that we can clear use it within `run` method to clear that file
    this.entryPointPath = config.entry.main[0];

    const [modulePath, moduleName] = this.options.modulePath.split('#');

    const factoryPath = `${
      modulePath.includes('.') ? modulePath : `${modulePath}/${modulePath}`
    }.ngfactory`;
    const entryPointContents = `
       export * from '${modulePath}';
       export * from '${factoryPath}';
       import { ${moduleName}NgFactory } from '${factoryPath}';
       export default ${moduleName}NgFactory;
    `;
    this.patchEntryPoint(entryPointContents);

    config.output.filename = `${pluginName}.js`;
    config.output.library = pluginName;
    config.output.libraryTarget = 'umd';
    // workaround to support bundle on nodejs
    config.output.globalObject = `(typeof self !== 'undefined' ? self : this)`;

    return config;
  }

  run(
    builderConfig: BuilderConfiguration<PluginBuilderSchema>
  ): Observable<BuildEvent> {
    this.options = builderConfig.options;
    // I don't want to write it in my scripts every time so I keep it here
    builderConfig.options.deleteOutputPath = false;

    return super.run(builderConfig).pipe(
      tap(() => {
        // clear entry point so our main.ts is always empty
        this.patchEntryPoint('');
      })
    );
  }
}
