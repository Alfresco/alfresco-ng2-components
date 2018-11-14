var Bundler = require('scss-bundle').Bundler;
var writeFileSync = require('fs-extra').writeFileSync;

new Bundler().Bundle('./lib/insights/styles/_index.scss', '**/*.scss').then(result => {
    writeFileSync('./lib/dist/insights/_theming.scss', result.bundledContent);
});
