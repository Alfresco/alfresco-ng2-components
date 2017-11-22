var Bundler = require('scss-bundle').Bundler;
var writeFileSync = require('fs-extra').writeFileSync;
var mkdirpSync = require('fs-extra').mkdirpSync;

 new Bundler().Bundle('./core/styles/_index.scss', '**/*.scss').then(result => {
    mkdirpSync('core');
    writeFileSync('core/dist/_theming.scss', result.bundledContent);
});

 new Bundler().Bundle('./insights/styles/_index.scss', '**/*.scss').then(result => {
    mkdirpSync('insights');
    writeFileSync('insights/dist/_theming.scss', result.bundledContent);
});


 new Bundler().Bundle('./process-services/styles/_index.scss', '**/*.scss').then(result => {
    mkdirpSync('process-services');
    writeFileSync('process-services/dist/_theming.scss', result.bundledContent);
});

 new Bundler().Bundle('./content-services/styles/_index.scss', '**/*.scss').then(result => {
    mkdirpSync('content-services');
    writeFileSync('content-services/dist/_theming.scss', result.bundledContent);
});

