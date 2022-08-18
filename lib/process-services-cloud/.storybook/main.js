const rootMain = require('../../../.storybook/main');

module.exports = {
  ...rootMain,
  core: { ...rootMain.core, builder: 'webpack5' },
  stories: [
    ...rootMain.stories,
    '../src/lib/**/*.stories.@(js|jsx|ts|tsx)'
  ],
  staticDirs: [
    ...rootMain.staticDirs,
    { from: '../../core/src/lib/i18n', to: 'assets/adf-core/i18n' },
    { from: __dirname + '/../src/lib/i18n', to: 'assets/adf-process-services-cloud/i18n' }
  ],
  addons: [...rootMain.addons ]
};
