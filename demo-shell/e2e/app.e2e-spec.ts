import { MyappPage } from './app.po';

describe('myapp App', () => {
    let page: MyappPage;

    beforeEach(() => {
        page = new MyappPage();
    });

    it('should display toolbar', () => {
        page.navigateTo();
        expect(page.getToolbar()).toBeDefined();
    });
});
