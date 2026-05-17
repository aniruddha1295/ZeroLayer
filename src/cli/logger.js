/**
 * logger.js — Shared CLI logging utility for claw-pin
 * Provides consistent, coloured output for all commands.
 */

const chalk = require('chalk');

const logger = {
  /**
   * Log a standard informational message (cyan)
   * @param {string} msg
   */
  info: (msg) => console.log(chalk.cyan(`ℹ️  ${msg}`)),

  /**
   * Log a success message (green)
   * @param {string} msg
   */
  success: (msg) => console.log(chalk.green(`✅ ${msg}`)),

  /**
   * Log a warning message (yellow)
   * @param {string} msg
   */
  warn: (msg) => console.log(chalk.yellow(`⚠️  ${msg}`)),

  /**
   * Log a user-friendly error message (red). Does NOT throw.
   * @param {string} msg
   * @param {Error|null} err — optional underlying error for debug context
   */
  error: (msg, err = null) => {
    console.error(chalk.red(`❌ ${msg}`));
    if (err && process.env.DEBUG) {
      console.error(chalk.grey(err.stack || err.message));
    }
  },

  /**
   * Log a key-value pair as a labelled output line.
   * @param {string} label
   * @param {string} value
   */
  field: (label, value) =>
    console.log(`  ${chalk.bold.white(label + ':')} ${chalk.cyan(value)}`),

  /**
   * Print a horizontal divider
   */
  divider: () => console.log(chalk.grey('─'.repeat(50))),
};

module.exports = logger;
