var Bundler = require('scss-bundle').Bundler;
var writeFileSync = require('fs-extra').writeFileSync;
var mkdirpSync = require('fs-extra').mkdirpSync;

 new Bundler().Bundle('./core/styles/_index.scss', '**/*.scss').then(result => {
    mkdirpSync('core');
    writeFileSync('./lib/dist/core/_theming.scss', result.bundledContent);
});

 new Bundler().Bundle('./insights/styles/_index.scss', '**/*.scss').then(result => {
    mkdirpSync('insights');
    writeFileSync('./lib/dist/insights/_theming.scss', result.bundledContent);
});


 new Bundler().Bundle('./process-services/styles/_index.scss', '**/*.scss').then(result => {
    mkdirpSync('process-services');
    writeFileSync('./lib/dist/process-services/_theming.scss', result.bundledContent);
});

 new Bundler().Bundle('./content-services/styles/_index.scss', '**/*.scss').then(result => {
    mkdirpSync('content-services');
    writeFileSync('./lib/dist/content-services/_theming.scss', result.bundledContent);
});

