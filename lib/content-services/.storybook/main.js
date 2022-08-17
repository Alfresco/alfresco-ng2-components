const rootMain = require('../../../.storybook/main');

module.exports = {
  ...rootMain,
  core: { ...rootMain.core, builder: 'webpack5' },
  stories: [
    ...rootMain.stories,
    '../**/*.stories.@(js|jsx|ts|tsx)'
  ],
  staticDirs: [
    ...rootMain.staticDirs,
    { from: __dirname + '/../src/lib/i18n', to: 'assets/adf-content-services/i18n' }
  ],
  addons: [...rootMain.addons ]
};
