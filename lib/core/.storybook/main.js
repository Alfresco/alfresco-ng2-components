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
    { from: "../../core/i18n", to: 'assets/adf-core/i18n' },
    { from: "../../core/assets/images", to: 'assets/images' }
  ],
  addons: [...rootMain.addons ]
};
