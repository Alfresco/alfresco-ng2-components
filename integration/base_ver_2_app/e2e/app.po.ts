import { browser, by, element } from 'protractor';

export class AdfAppPage {
  navigateTo() {
    return browser.get('/');
  }

  getToolbar() {
    return element(by.tagName('adf-toolbar'));
  }
}
