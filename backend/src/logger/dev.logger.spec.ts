import { DevLogger } from './dev.logger';

describe('DevLogger', () => {
  let logger: DevLogger;

  beforeEach(() => {
    logger = new DevLogger();
    jest.spyOn(logger, 'log');
    jest.spyOn(logger, 'warn');
    jest.spyOn(logger, 'error');
  });

  it('тест console.log', () => {
    const message = 'Test log message';
    const optionalParams = ['param1', 42];

    logger.log(message, ...optionalParams);

    expect(logger.log).toHaveBeenCalledWith(message, ...optionalParams);
  });

  it('тест console.warn', () => {
    const message = 'Test warn message';
    const optionalParams = ['param2', 99];

    logger.warn(message, ...optionalParams);

    expect(logger.warn).toHaveBeenCalledWith(message, ...optionalParams);
  });

  it('тест console.error', () => {
    const message = 'Test error message';
    const optionalParams = ['stack trace', 'additional info'];

    logger.error(message, ...optionalParams);

    expect(logger.error).toHaveBeenCalledWith(message, ...optionalParams);
  });

  it('пустой тест console.log', () => {
    const message = 'Test log without params';

    logger.log(message);

    expect(logger.log).toHaveBeenCalledWith(message);
  });
});
