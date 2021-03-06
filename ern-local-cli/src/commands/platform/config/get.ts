import { Argv } from 'yargs'
import utils from '../../../lib/utils'
import { config as ernConfig, log } from 'ern-core'

export const command = 'get <key>'
export const desc = 'Echo the config value to stdout'

export const builder = (argv: Argv) => {
  return argv.epilog(utils.epilog(exports))
}

export const handler = async ({ key }: { key: string }) => {
  await utils.logErrorAndExitIfNotSatisfied({
    isValidPlatformConfig: {
      key,
    },
  })
  if (ernConfig.getValue(key)) {
    log.info(`Configuration value for ${key} is ${ernConfig.getValue(key)}`)
  } else {
    log.warn(`Configuration value for ${key} not found`)
  }
}
