import execa from 'execa'
import path from 'path'

import external from '../content/external-files.json'
import transformer from './../plugins/spring-remark-variables/transformer'
import variables from '../content/variables.json'
import { error, execaOptions, info, log, main, success } from './utils'

const DATA_DIR = path.join(__dirname, '../content/files/ext')

const cleanDataDir = async () => {
  // log('Cleaning', DATA_DIR)
  const { failed } = await execa('rm', ['-rf', DATA_DIR], execaOptions)
  if (failed) throw new Error(`Couldn't clean ${DATA_DIR}`)
}

const createDir = async dir => {
  // log('Creating', dir)
  const { failed } = await execa('mkdir', ['-p', dir], execaOptions)
  if (failed) throw new Error(`Couldn't create ${dir}`)
}

const downloadFile = async (url, dest) => {
  // log('Downloading', url, 'to', dest)
  const { failed } = await execa('curl', ['-Ls', url, '-o', dest], execaOptions)
  if (failed) throw new Error(`Couldn't download ${url} to ${dest}`)
}

const externalFiles = async () => {
  await cleanDataDir()
  await createDir(DATA_DIR)

  for (let { file, url } of external) {
    url = transformer(url, variables)
    info('Loading', file)
    const filePath = path.join(DATA_DIR, file)
    const { dir: dirPath } = path.parse(filePath)
    await createDir(dirPath)
    await downloadFile(url, filePath)
  }
}

main('external-files', externalFiles)
