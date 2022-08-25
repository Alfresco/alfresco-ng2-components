const rootMain = require('../../../.storybook/main');

module.exports = {
  ...rootMain,
  core: { ...rootMain.core, builder: 'webpack5' },
  stories: [
    ...rootMain.stories,
    '../../core/**/*.stories.@(js|jsx|ts|tsx)',
    '../../content-services/**/*.stories.@(js|jsx|ts|tsx)',
    '../../process-services-cloud/**/*.stories.@(js|jsx|ts|tsx)'
  ],
  staticDirs: [
    ...rootMain.staticDirs,
    { from: '../../core/src/lib/i18n', to: 'assets/adf-core/i18n' },
    { from: '../../core/src/lib/assets/images', to: 'assets/images' },
    { from: '../../content-services/src/lib/i18n', to: 'assets/adf-content-services/i18n' },
    { from: '../../process-services-cloud/src/lib/i18n', to: 'assets/adf-process-services-cloud/i18n' },
  ],
  addons: [...rootMain.addons ]
};
