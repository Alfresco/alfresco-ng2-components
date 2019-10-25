var Bundler = require('scss-bundle').Bundler;
var writeFileSync = require('fs-extra').writeFileSync;

new Bundler().Bundle('./lib/core/src/lib/styles/_index.scss', '**/*.scss').then(result => {
    writeFileSync('./lib/dist/core/_theming.scss', result.bundledContent);
});
