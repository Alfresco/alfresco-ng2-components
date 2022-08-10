import { create } from '@storybook/theming';
import alfrescoLogo from './assets/alfresco-logo.svg';

export default create({
  base: 'light',
  brandTitle: 'Hyland | Alfresco Storybook App',
  brandUrl: 'https://www.alfresco.com/',
  brandImage: alfrescoLogo,
});
