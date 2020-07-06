var Bundler = require('scss-bundle').Bundler;
var writeFileSync = require('fs').writeFileSync;

new Bundler().Bundle('./lib/process-services-cloud/src/lib/styles/_index.scss', '**/*.scss').then(result => {
    writeFileSync('./lib/dist/process-services-cloud/_theming.scss', result.bundledContent);
});
