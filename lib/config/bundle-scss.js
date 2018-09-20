var Bundler = require('scss-bundle').Bundler;
var writeFileSync = require('fs-extra').writeFileSync;
var mkdirpSync = require('fs-extra').mkdirpSync;

 new Bundler().Bundle('./lib/core/styles/_index.scss', '**/*.scss').then(result => {
    writeFileSync('./lib/dist/core/_theming.scss', result.bundledContent);
});

 new Bundler().Bundle('./lib/insights/styles/_index.scss', '**/*.scss').then(result => {
    writeFileSync('./lib/dist/insights/_theming.scss', result.bundledContent);
});

 new Bundler().Bundle('./lib/process-services/styles/_index.scss', '**/*.scss').then(result => {
    writeFileSync('./lib/dist/process-services/_theming.scss', result.bundledContent);
});

 new Bundler().Bundle('./lib/content-services/styles/_index.scss', '**/*.scss').then(result => {
    writeFileSync('./lib/dist/content-services/_theming.scss', result.bundledContent);
});

new Bundler().Bundle('./lib/process-services-cloud/styles/_index.scss', '**/*.scss').then(result => {
    writeFileSync('./lib/dist/process-services-cloud/_theming.scss', result.bundledContent);
});
