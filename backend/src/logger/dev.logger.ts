import { Injectable, ConsoleLogger } from '@nestjs/common';

@Injectable()
export class DevLogger extends ConsoleLogger {
  log(message: any, ...optionalParams: any[]) {
    super.log(message, ...optionalParams);
  }
  error(message: any, stack?: string, context?: string) {
    super.error(message, stack, context);
  }
  warn(message: any, ...optionalParams: any[]) {
    super.warn(message, ...optionalParams);
  }
}
