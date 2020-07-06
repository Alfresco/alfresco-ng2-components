var Bundler = require('scss-bundle').Bundler;
var writeFileSync = require('fs').writeFileSync;

new Bundler().Bundle('./lib/core/styles/_index.scss', '**/*.scss').then(result => {
    writeFileSync('./lib/dist/core/_theming.scss', result.bundledContent);
});
