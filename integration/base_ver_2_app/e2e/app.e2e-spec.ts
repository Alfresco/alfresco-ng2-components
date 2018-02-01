import { AdfAppPage } from './app.po';

describe('adf-app App', () => {
  let page: AdfAppPage;

  beforeEach(() => {
    page = new AdfAppPage();
  });

  it('should display toolbar', () => {
    page.navigateTo();
    expect(page.getToolbar()).toBeDefined();
  });
});
