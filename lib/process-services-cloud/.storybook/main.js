const rootMain = require('../../../.storybook/main');


module.exports = {
  ...rootMain,

  core: { ...rootMain.core, builder: 'webpack4' },

  stories: [
    ...rootMain.stories,
<<<<<<< HEAD
    '../src/lib/**/*.stories.@(js|jsx|ts|tsx)'
=======
    '../src/lib/**/*.stories.@(mdx|ts)',
    '../src/lib/**/task-header-cloud.component.stories.@(js|jsx|ts|tsx)'
>>>>>>> 4f6281928 ([AAE-5953] migrated stories and mocks)
  ],
  addons: [...rootMain.addons ],
  webpackFinal: async (config, { configType }) => {
    // apply any global webpack configs that might have been specified in .storybook/main.js
    if (rootMain.webpackFinal) {
      config = await rootMain.webpackFinal(config, { configType });
    }



    // add your own webpack tweaks if needed

    return config;
  },
};
