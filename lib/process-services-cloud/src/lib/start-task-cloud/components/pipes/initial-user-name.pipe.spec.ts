import { InitialUserNamePipe } from './initial-user-name.pipe';

describe('InitialUserNamePipe', () => {
  it('create an instance', () => {
    const pipe = new InitialUserNamePipe();
    expect(pipe).toBeTruthy();
  });
});
