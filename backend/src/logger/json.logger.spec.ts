import { JsonLogger } from './json.logger';

describe('JsonLogger', () => {
  let logger: JsonLogger;

  beforeEach(() => {
    logger = new JsonLogger();
    jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.spyOn(console, 'warn').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('JSON format (log)', () => {
    const message = 'Test message';
    const optionalParams = ['param1', 42];

    logger.log(message, ...optionalParams);

    const expected = {
      level: 'log',
      message: 'Test message',
      optionalParams: ['param1', 42],
    };

    const received = (console.log as jest.Mock).mock.calls[0][0];

    const parsedReceived = JSON.parse(received);
    expect(parsedReceived).toMatchObject(expected);
    expect(received).toContain('"timestamp":');
  });

  it('JSON format (error)', () => {
    const message = 'Error message';
    const optionalParams = ['error details'];

    logger.error(message, ...optionalParams);

    const expected = {
      level: 'error',
      message: 'Error message',
      optionalParams: ['error details'],
    };

    const received = (console.error as jest.Mock).mock.calls[0][0];

    const parsedReceived = JSON.parse(received);
    expect(parsedReceived).toMatchObject(expected);
    expect(received).toContain('"timestamp":');
  });

  it('JSON format (warn)', () => {
    const message = 'Warning message';
    const optionalParams = ['warning details'];

    logger.warn(message, ...optionalParams);

    const expected = {
      level: 'warn',
      message: 'Warning message',
      optionalParams: ['warning details'],
    };

    const received = (console.warn as jest.Mock).mock.calls[0][0];

    const parsedReceived = JSON.parse(received);
    expect(parsedReceived).toMatchObject(expected);
    expect(received).toContain('"timestamp":');
  });

  it('Один (log)', () => {
    const message = 'Тест';

    logger.log(message);

    const expected = {
      level: 'log',
      message: 'Тест',
      optionalParams: [],
    };

    const received = (console.log as jest.Mock).mock.calls[0][0];

    const parsedReceived = JSON.parse(received);
    expect(parsedReceived).toMatchObject(expected);
    expect(received).toContain('"timestamp":');
  });

  it('Несколько логов (log)', () => {
    const message = 'Тест';
    const optionalParams = ['Тест2', 42, { key: 'value' }];

    logger.log(message, ...optionalParams);

    const expected = {
      level: 'log',
      message: 'Тест',
      optionalParams: ['Тест2', 42, { key: 'value' }],
    };

    const received = (console.log as jest.Mock).mock.calls[0][0];

    const parsedReceived = JSON.parse(received);
    expect(parsedReceived).toMatchObject(expected);
    expect(received).toContain('"timestamp":');
  });
});
