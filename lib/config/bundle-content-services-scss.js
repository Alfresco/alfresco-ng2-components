var Bundler = require('scss-bundle').Bundler;
var writeFileSync = require('fs').writeFileSync;

new Bundler().Bundle('./lib/content-services/src/lib/styles/_index.scss', '**/*.scss').then(result => {
    writeFileSync('./lib/dist/content-services/_theming.scss', result.bundledContent);
});
