module.exports = {
    framework: {
        name: '@storybook/angular',
        options: {}
    },
    staticDirs: [{ from: '../../../demo-shell/src/app.config.json', to: 'app.config.json' }],
    docs: {
        autodocs: true
    },
    stories: [],
    addons:[],
};
