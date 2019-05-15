import execa from 'execa'
import path from 'path'

import versions from '../content/versions.json'
import { cleanDir, createDir, execaOptions, info, log, main } from './utils'

const DATA_DIR = path.join(__dirname, '../data')
const REPO = 'spring-io/dataflow.spring.io'
const ANAME = 'dataflow.spring.io'
const AEXT = '.tar.gz'
const url = version => `https://github.com/${REPO}/archive/${version}${AEXT}`
const loadRepos = async () => {
  info('Loading')
  cleanDir(DATA_DIR)
  createDir(DATA_DIR)
  const uniqueVersions = [...new Set(Object.values(versions))]
  for (let version of uniqueVersions) {
    if (version === 'next' || version === 'master') {
      info(`Skipping master`)
      continue
    }
    info(`Loading version ${version}`)
    const archive = path.join(DATA_DIR, `${version}${AEXT}`)
    downloadVersion(url(version), archive)
    extractVersion(archive, version)
    cleanDir(archive)
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

main('load-repos', loadRepos)
