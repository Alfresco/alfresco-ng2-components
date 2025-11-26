const { dirname, join } = require('node:path');

module.exports = {
    framework: {
        name: getAbsolutePath('@storybook/angular'),
        options: {}
    },
    staticDirs: [],
    docs: {},
    stories: []
};

function getAbsolutePath(value) {
    return dirname(require.resolve(join(value, 'package.json')));
}
