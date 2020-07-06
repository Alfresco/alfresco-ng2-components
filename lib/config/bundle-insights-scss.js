var Bundler = require('scss-bundle').Bundler;
var writeFileSync = require('fs').writeFileSync;

new Bundler().Bundle('./lib/insights/src/lib/styles/_index.scss', '**/*.scss').then(result => {
    writeFileSync('./lib/dist/insights/_theming.scss', result.bundledContent);
});
