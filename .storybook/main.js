module.exports = {
    stories: [],
    addons: ['@storybook/addon-essentials'],
    framework: '@storybook/angular',
    staticDirs: [ { from: '../../../demo-shell/src/app.config.json', to: 'app.config.json' } ],
    core: { builder: 'webpack5' }
};
