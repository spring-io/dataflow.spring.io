const report = require('gatsby-cli/lib/reporter')
const get = require('lodash.get')
const fetch = require('node-fetch')

const REG = /(href=")(.*?)(")/gm

exports.onPostBuild = async function(
  { graphql },
  { query, indexName: mainIndexName }
) {
  const activity = report.activityTimer(`Checkstyles start`)
  activity.start()

  setStatus(activity, `Running query`)

  if (!query) {
    report.panic(
      `failed to perform checkstyles. You did not give "query" to this query`
    )
  }
  const result = await graphql(query)
  if (result.errors) {
    report.panic(`failed to checkstyles`, result.errors)
  }
  const nodes = get(result, 'data.pages.edges')
  const urls = get(result, 'data.pages.edges').map(({ node }) => {
    return (
      get(node, 'fields.path')
        .split('/')
        .filter(l => !!l)
        .join('/') + '/'
    )
  })

  const errors = []

  const pages = nodes.map(async function doQuery({ node }, i) {
    const html = get(node, 'html', '')
    const match = html.match(REG)
    if (match.length > 0) {
      const links = match.map(ref => ref.substring(6, ref.length - 1))

      links
        .filter(link => link[0] !== '#' && link.startsWith('/docs/'))
        .map(cleanInternalLink)
        .forEach(link => {
          if (urls.indexOf(link) === -1) {
            errors.push(
              `Broken internal link ${link} [${get(node, 'fields.path')}]`
            )
          }
        })

      const linksPromise = links.map(async function doCheck(link) {
        if (
          link[0] !== '#' &&
          !link.startsWith('http://localhost') &&
          !link.startsWith('http://192.168') &&
          (link.startsWith('https://') || link.startsWith('http://'))
        ) {
          try {
            const response = await fetch(link)
            const status = await response.status
            if (status > 399) {
              errors.push(
                `Broken external link ${link} [${get(
                  node,
                  'fields.path'
                )}][status:${status}]`
              )
              return status
            }
            return status
          } catch (err) {}
        } else {
          return null
        }
      })
      const a = await Promise.all(linksPromise)
    }

    const matchh1 = html.match(/(<h1)(.*?)(>)/gm)
    if (matchh1.length !== 1) {
      errors.push(`Invalid h1 on page ${get(node, 'fields.path')}`)
    }

    return node
  })

  try {
    await Promise.all(pages)
    if (errors.length > 0) {
      report.panic(`checkstyles: errors`, errors)
    }
  } catch (err) {
    report.panic(`failed to checkstyles`, err)
  }

  activity.end()
}

function cleanInternalLink(link) {
  if (link.indexOf('#') > -1) {
    link = link.substring(0, link.indexOf('#'))
  }
  return (
    link
      .split('/')
      .filter(l => !!l)
      .join('/') + '/'
  )
}

/**
 * Hotfix the Gatsby reporter to allow setting status (not supported everywhere)
 *
 * @param {Object} activity reporter
 * @param {String} status status to report
 */
function setStatus(activity, status) {
  if (activity && activity.setStatus) {
    activity.setStatus(status)
  } else {
    console.log('Checkstyles:', status)
  }
}
