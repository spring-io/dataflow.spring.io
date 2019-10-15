import execa from 'execa'
import path from 'path'

import versions from '../content/versions.json'
import { cleanDir, createDir, execaOptions, info, log, main } from './utils'

const MASTER_DIR = path.join(__dirname, '../content/documentation')
const DATA_DIR = path.join(__dirname, '../data')
const REPO = 'spring-io/dataflow.spring.io'
const ANAME = 'dataflow.spring.io'
const AEXT = '.tar.gz'
const url = version => `https://github.com/${REPO}/archive/${version}${AEXT}`
const loadRepos = async () => {
  info('Loading')
  cleanDir(DATA_DIR)
  createDir(DATA_DIR)
  for (let versionId of Object.keys(versions)) {
    info(versionId)
    const version = versions[versionId]
    if (version.branch === 'master') {
      info(`Link version ${versionId} (name: ${version.name})`)
      linkFile(MASTER_DIR, path.join(DATA_DIR, versionId))
    } else {
      info(`Loading version ${versionId} (name: ${version.name})`)
      const archive = path.join(DATA_DIR, `${versionId}${AEXT}`)
      downloadVersion(url(versionId), archive)
      extractVersion(archive, versionId)
      cleanDir(archive)
    }
  }
}

const downloadVersion = (url, dest) => {
  log('Downloading', url, 'to', dest)
  const { failed } = execa.sync('curl', ['-fLs', url, '-o', dest], execaOptions)
  if (failed) throw new Error(`Couldn't download ${url} to ${dest}`)
}

const extractVersion = (file, version) => {
  log('Extracting', file)
  const dest = `${DATA_DIR}/${version}`
  createDir(dest)
  const { failed } = execa.sync(
    'tar',
    [
      '-C',
      dest,
      '--strip-components=3',
      '-xvzf',
      file,
      `${ANAME}-${version}/content/documentation`,
    ],
    execaOptions
  )
  if (failed) throw new Error(`Couldn't extract ${file}`)
}

const linkFile = (src, dest) => {
  log('Linking', src, 'to', dest)
  const { failed } = execa.sync('ln', ['-s', src, dest], execaOptions)
  if (failed) throw new Error(`Couldn't link ${src} to ${dest}`)
}

main('load-repos', loadRepos)
