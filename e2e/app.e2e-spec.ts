import { PWappClientPage } from './app.po';

describe('pwapp-client App', function() {
  let page: PWappClientPage;

  beforeEach(() => {
    page = new PWappClientPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
