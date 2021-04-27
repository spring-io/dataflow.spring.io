import execa from 'execa'
import path from 'path'

import { execaOptions, info, log, main } from './utils'

const MASTER_DIR = path.join(__dirname, '../content/documentation')
const DATA_DIR = path.join(__dirname, '../data')

const linkMaster = async () => {
  info('Linking main')
  linkFile(MASTER_DIR, path.join(DATA_DIR, 'next'))
  linkFile(MASTER_DIR, path.join(DATA_DIR, 'main'))
}

const linkFile = (src, dest) => {
  log('Linking', src, 'to', dest)
  const { failed } = execa.sync('ln', ['-s', src, dest], execaOptions)
  if (failed) throw new Error(`Couldn't link ${src} to ${dest}`)
}

main('link-main', linkMaster)
