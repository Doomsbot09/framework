import chalk from "chalk";
import { LogLevel } from "../enums/log_level";

/**
 * Logs a message with a specified log level.
 * @param level - The log level (e.g., INFO, ERROR, WARNING, SUCCESS, DEFAULT).
 * @param message - The message to log.
 * @param overwrite - Whether to overwrite the previous log message.
 */
export function log(
  level: LogLevel,
  message: string,
  overwrite: boolean = false
): void {
  const formattedMessage = `[serff] ${message}`;

  if (overwrite) {
    process.stdout.write("\r\x1B[K"); // Move to the beginning of the line and clear it
  }

  switch (level) {
    case LogLevel.INFO:
      console.log(chalk.blue(formattedMessage));
      break;
    case LogLevel.ERROR:
      console.log(chalk.red(formattedMessage));
      break;
    case LogLevel.WARNING:
      console.log(chalk.yellow(formattedMessage));
      break;
    case LogLevel.SUCCESS:
      console.log(chalk.green(formattedMessage));
      break;
    case LogLevel.DEFAULT:
      console.log(chalk.grey(formattedMessage));
      break;
    default:
      console.log(formattedMessage);
      break;
  }
}
