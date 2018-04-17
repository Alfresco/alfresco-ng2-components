import { browser, element, by } from 'protractor';

export class MyappPage {
    navigateTo() {
        return browser.get('/');
    }

    getToolbar() {
        return element(by.tagName('adf-toolbar'));
    }
}
