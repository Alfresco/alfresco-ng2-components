import { MyappPage } from './app.po';

describe('myapp App', () => {
  let page: MyappPage;

  beforeEach(() => {
    page = new MyappPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
