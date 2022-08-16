import { create } from '@storybook/theming';
import alfrescoLogo from '../lib/core/assets/images/alfresco-logo.svg';

export default create({
  base: 'light',
  brandTitle: 'Hyland | Alfresco Storybook App',
  brandUrl: 'https://www.alfresco.com/',
  brandImage: alfrescoLogo,
});
