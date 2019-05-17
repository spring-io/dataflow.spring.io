import PropTypes from 'prop-types'
import get from 'lodash.get'
import path from 'path'
const versions = require('../../../content/versions.json')
const currentVersion = versions.current

const isDev = process.env.NODE_ENV === 'development'

/**
 * Create a formatted node object
 */
const getNodeFormatted = (arr, item) => {
  if (!item) return
  const url = get(item, 'fields.path')
  const urlParent = path.join(path.dirname(url), '/')
  const parent = arr.edges.find(
    itemParent => get(itemParent, 'node.fields.path') === urlParent
  )
  return {
    title: get(item, 'frontmatter.title'),
    path: url,
    description: get(item, 'frontmatter.description'),
    parent: get(parent, 'frontmatter.title', 'Documentation'),
    meta: {
      title: get(item, 'frontmatter.meta_title') || '',
      description: get(item, 'frontmatter.meta_description') || '',
      keywords: get(item, 'frontmatter.keywords') || [],
    },
  }
}

/**
 * Create an array of pages representing a breadcrumb.
 * The first page is the documentation root.
 */
export const getBreadcrumb = function getBreadcrumb(arr, page) {
  const result = []
  let url = get(page, 'fields.path')

  const getNode = (edge, value) => {
    return edge.edges.find(({ node }) => get(node, 'fields.path') === value)
  }
  while (url !== `/docs/`) {
    const node = get(getNode(arr, url), 'node')
    if (!node) {
      const version = url.substr(`/docs/`.length).replace('/', '')
      result.push({
        title: version,
        path: url,
        description: '',
        meta: {
          title: `Documentation ${version}`,
          description: 'Spring Cloud Data Flow - Documentation',
          keywords: [],
        },
      })
    } else {
      result.push(getNodeFormatted(arr, get(getNode(arr, url), 'node')))
    }
    url = path.join(path.dirname(url), '/')
  }

  if (get(page, 'fields.version') === currentVersion) {
    result.push({
      title: `${get(page, 'fields.version')} (current)`,
      path: `/docs/`,
      description: '',
      meta: {
        title: 'Documentation',
        description: 'Spring Cloud Data Flow - Documentation',
        keywords: [],
      },
    })
  }

  // result.push({
  //   title: get(page, 'fields.version'),
  //   path: `/docs/${get(page, 'fields.version')}`,
  //   description: '',
  //   meta: {
  //     title: 'Spring Cloud Data Flow Documentation',
  //     description: 'Spring Cloud Data Flow Documentation',
  //     keywords: [],
  //   },
  // })

  result.push({
    title: 'Documentation',
    path: '/docs/',
    description: '',
    meta: {
      title: 'Documentation',
      description: 'Spring Cloud Data Flow Documentation',
      keywords: [],
    },
  })

  return result.reverse()
}

getBreadcrumb.proptypes = {
  arr: PropTypes.shape({
    edges: PropTypes.arrayOf(
      PropTypes.shape({
        node: PropTypes.shape({
          id: PropTypes.string.isRequired,
          fields: PropTypes.shape({
            path: PropTypes.string.isRequired,
          }).isRequired,
          frontmatter: PropTypes.shape({
            title: PropTypes.string.isRequired,
            path: PropTypes.string.isRequired,
            description: PropTypes.string,
          }).isRequired,
        }).isRequired,
      })
    ).isRequired,
  }).isRequired,
  page: PropTypes.shape({
    frontmatter: PropTypes.shape({
      title: PropTypes.string.isRequired,
      path: PropTypes.string.isRequired,
      description: PropTypes.string,
    }).isRequired,
    fields: PropTypes.shape({
      version: PropTypes.string.isRequired,
    }).isRequired,
  }),
}

/**
 * Determine the summary type:
 * - tiles: more than one level,
 * - links: only one level of links.
 */
export const getSummaryType = function getSummaryType(arr, page) {
  const url = get(page, 'fields.path')
  const depth = url.split('/').length
  const depths = arr.edges
    .filter(item => {
      const value = get(item, 'node.fields.path')
      return !(!value.startsWith(url) || url === value)
    })
    .map(item => {
      return get(item, 'node.fields.path').split('/').length
    })
  if (Math.max(...depths) > depth + 1) {
    return 'tiles'
  }
  return 'links'
}

getSummaryType.proptypes = {
  arr: PropTypes.shape({
    edges: PropTypes.arrayOf(
      PropTypes.shape({
        node: PropTypes.shape({
          id: PropTypes.string.isRequired,
          fields: PropTypes.shape({
            path: PropTypes.string.isRequired,
          }).isRequired,
          frontmatter: PropTypes.shape({
            title: PropTypes.string.isRequired,
            path: PropTypes.string.isRequired,
            description: PropTypes.string,
          }).isRequired,
        }).isRequired,
      })
    ).isRequired,
  }).isRequired,
  page: PropTypes.shape({
    frontmatter: PropTypes.shape({
      title: PropTypes.string.isRequired,
      path: PropTypes.string.isRequired,
      description: PropTypes.string,
    }).isRequired,
  }),
}

/**
 * Takes an array of markdown pages and create a tree. The tree is based
 * on the path field (fields.path)
 */
export const getPrevNext = function getPrevNext(arr, page) {
  let prev, next

  for (let i = 0; i < arr.edges.length; i++) {
    const node = get(arr, `edges[${i}].node`)
    if (get(node, 'fields.path') === get(page, 'fields.path')) {
      prev = get(arr, `edges[${i - 1}].node`)
      next = get(arr, `edges[${i + 1}].node`)
      i = arr.edges.length
    }
  }
  return {
    prev: getNodeFormatted(arr, prev),
    next: getNodeFormatted(arr, next),
  }
}

getPrevNext.proptypes = {
  arr: PropTypes.shape({
    edges: PropTypes.arrayOf(
      PropTypes.shape({
        node: PropTypes.shape({
          id: PropTypes.string.isRequired,
          fields: PropTypes.shape({
            path: PropTypes.string.isRequired,
          }).isRequired,
          frontmatter: PropTypes.shape({
            title: PropTypes.string.isRequired,
          }).isRequired,
        }).isRequired,
      })
    ).isRequired,
  }).isRequired,
  page: PropTypes.shape({
    fields: PropTypes.shape({
      path: PropTypes.string.isRequired,
    }).isRequired,
    frontmatter: PropTypes.shape({
      title: PropTypes.string.isRequired,
    }).isRequired,
  }),
}

/**
 * Takes an array of markdown pages and create a tree
 * The tree is based on the path field (fields.path)
 */
export const getTree = function getTree(arr, pathStart) {
  let map = {},
    roots = []

  const arrSelection = arr.edges.filter(item => {
    const value = get(item, 'node.fields.path')
    if (pathStart) {
      if (!value.startsWith(pathStart) || pathStart === value) {
        return false
      }
    }
    return true
  })

  const nodes = arrSelection.map((item, index) => {
    let url = get(item, 'node.fields.path')
    const urlParent = path.join(path.dirname(url), '/')

    const parent = arrSelection.find(
      itemParent => get(itemParent, 'node.fields.path') === urlParent
    )
    map[get(item, 'node.id')] = index
    return {
      id: get(item, 'node.id'),
      title: get(item, 'node.frontmatter.title'),
      description: get(item, 'node.frontmatter.description'),
      path: get(item, 'node.fields.path'),
      parentId: get(parent, 'node.id', '0'),
      category: get(item, 'node.fields.category'),
      children: [],
    }
  })

  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i]
    if (node.parentId !== '0') {
      nodes[map[node.parentId]].children.push(node)
    } else {
      roots.push(node)
    }
  }
  return roots
}

getTree.proptypes = {
  arr: PropTypes.shape({
    edges: PropTypes.arrayOf(
      PropTypes.shape({
        node: PropTypes.shape({
          id: PropTypes.string.isRequired,
          fields: PropTypes.shape({
            path: PropTypes.string.isRequired,
          }).isRequired,
          frontmatter: PropTypes.shape({
            title: PropTypes.string.isRequired,
          }).isRequired,
        }).isRequired,
      })
    ).isRequired,
  }).isRequired,
  pathStart: PropTypes.string,
}

/**
 * Return the fields for the meta (<head />)
 * The page meta fields inherit from the parent meta fields.
 */
export const getMeta = function getMeta(arr, page) {
  const breadcrumb = getBreadcrumb(arr, page).reverse()
  return {
    title:
      get(breadcrumb.find(item => get(item, 'meta.title')), 'meta.title') || '',
    description:
      get(
        breadcrumb.find(item => get(item, 'meta.description')),
        'meta.description'
      ) || '',
    keywords:
      get(
        breadcrumb.find(item => get(item, 'meta.keywords')),
        'meta.keywords'
      ) || [],
  }
}

getMeta.proptypes = {
  arr: PropTypes.shape({
    edges: PropTypes.arrayOf(
      PropTypes.shape({
        node: PropTypes.shape({
          id: PropTypes.string.isRequired,
          fields: PropTypes.shape({
            path: PropTypes.string.isRequired,
          }).isRequired,
          frontmatter: PropTypes.shape({
            title: PropTypes.string.isRequired,
          }).isRequired,
        }).isRequired,
      })
    ).isRequired,
  }).isRequired,
  page: PropTypes.shape({
    fields: PropTypes.shape({
      path: PropTypes.string.isRequired,
    }).isRequired,
    frontmatter: PropTypes.shape({
      title: PropTypes.string.isRequired,
    }).isRequired,
  }),
}

/**
 * Enrich version object
 * Object to array
 */
export const getVersions = function getVersions(arr) {
  return Object.entries(arr)
    .map(([key, value]) => {
      if (!(!isDev && key === 'next')) {
        let title = key === 'current' ? `${value} (current)` : value
        title = title === 'next' ? `${value} (dev)` : title
        const path = key === 'current' ? `/docs/` : `/docs/${value}`
        return {
          key: value,
          title: title,
          path: path,
        }
      }
      return null
    })
    .filter(a => !!a)
}

getVersions.proptypes = {
  arr: PropTypes.arrayOf(PropTypes.object).isRequired,
}
