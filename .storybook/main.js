module.exports = {
    framework: {
        name: '@storybook/angular',
        options: {}
    },
    staticDirs: [{ from: '../../../demo-shell/src/app.config.json', to: 'app.config.json' }],
    docs: {},
    stories: [],
    addons: ['@chromatic-com/storybook']
};
