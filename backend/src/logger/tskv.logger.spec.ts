import { TskvLogger } from './tskv.logger';

describe('TskvLogger', () => {
  let logger: TskvLogger;

  beforeEach(() => {
    logger = new TskvLogger();
    jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  it('Корректный формат логов', () => {
    logger.log('Test message');
    expect(console.log).toHaveBeenCalledWith(
      expect.stringMatching(/time=.*\tlevel=log\tmessage=Test message/),
    );
  });
});
