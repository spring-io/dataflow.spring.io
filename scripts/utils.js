import chalk from 'chalk'

export const main = async (name, cmd) => {
  log(`Running ${name} script`)
  try {
    await cmd()
  } catch (err) {
    fail(err)
  }
  success(`${name} execution done`)
}

export const log = console.log
export const info = (...args) => console.log(chalk.blue('info'), ...args)
export const error = (...args) => console.log(chalk.red('error'), ...args)
export const fail = (...args) => {
  error(...args)
  process.exit(1)
}
export const success = (...args) => console.log(chalk.green('success'), ...args)
export const execaOptions = { reject: false }
