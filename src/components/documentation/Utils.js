import get from "lodash.get"
import endsWith from "lodash.endswith"
import PropTypes from "prop-types"

/**
 * Normalize the documentation URL, the URL have to end with "/"
 */
export const cleanPath = path => {
  if (!endsWith(path, "/")) {
    return `${path}/`
  }
  return path
}

/**
 * Create a formatted node object
 */
const getNodeFormatted = (arr, item) => {
  if (!item) return
  let path = cleanPath(get(item, "frontmatter.path"))
  const parentNodes = path.split("/")
  const parentPath =
    parentNodes.slice(0, parentNodes.length - 2).join("/") + "/"
  const parent = arr.edges.find(
    itemParent =>
      cleanPath(get(itemParent, "node.frontmatter.path")) ===
      cleanPath(parentPath)
  )
  return {
    title: get(item, "frontmatter.title"),
    path: cleanPath(get(item, "frontmatter.path")),
    description: get(item, "frontmatter.description"),
    parent: get(parent, "frontmatter.title", "Documentation"),
    meta: {
      title: get(item, "frontmatter.meta_title") || "",
      description: get(item, "frontmatter.meta_description") || "",
      keywords: get(item, "frontmatter.keywords") || [],
    },
  }
}

/**
 * Create an array of pages representing a breadcrumb.
 * The first page is the documentation root.
 */
export const getBreadcrumb = function getBreadcrumb(arr, page) {
  const result = []
  let pagePath = cleanPath(get(page, "frontmatter.path"))
  while (pagePath !== "/documentation/") {
    const parentNodes = pagePath.split("/")
    let node = arr.edges.find(({ node }) => {
      return cleanPath(get(node, "frontmatter.path")) === pagePath
    })
    result.push(getNodeFormatted(arr, get(node, "node")))
    pagePath = parentNodes.slice(0, parentNodes.length - 2).join("/") + "/"
  }
  result.push({
    title: "Documentation",
    path: "/documentation/",
    description: "",
    meta: {
      title: "Spring Cloud Data Flow Documentation",
      description: "Spring Cloud Data Flow Documentation",
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
 * Determine the summary type:
 * - tiles: more than one level,
 * - links: only one level of links.
 */
export const getSummaryType = function getSummaryType(arr, page) {
  const pathStart = cleanPath(get(page, "frontmatter.path"))
  const depth = pathStart.split("/").length
  const depths = arr.edges
    .filter(item => {
      const path = cleanPath(get(item, "node.frontmatter.path"))
      return !(!path.startsWith(pathStart) || pathStart === path)
    })
    .map(item => {
      return cleanPath(get(item, "node.frontmatter.path")).split("/").length
    })
  if (Math.max(...depths) > depth + 1) {
    return "tiles"
  }
  return "links"
}

getSummaryType.proptypes = {
  arr: PropTypes.shape({
    edges: PropTypes.arrayOf(
      PropTypes.shape({
        node: PropTypes.shape({
          id: PropTypes.string.isRequired,
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
 * on the path field (frontmatter.path)
 */
export const getPrevNext = function getPrevNext(arr, page) {
  let prev, next

  for (let i = 0; i < arr.edges.length; i++) {
    const node = get(arr, `edges[${i}].node`)
    if (get(node, "frontmatter.path") === get(page, "frontmatter.path")) {
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
          frontmatter: PropTypes.shape({
            title: PropTypes.string.isRequired,
            path: PropTypes.string.isRequired,
          }).isRequired,
        }).isRequired,
      })
    ).isRequired,
  }).isRequired,
  page: PropTypes.shape({
    frontmatter: PropTypes.shape({
      title: PropTypes.string.isRequired,
      path: PropTypes.string.isRequired,
    }).isRequired,
  }),
}

/**
 * Takes an array of markdown pages and create a tree
 * The tree is based on the path field (frontmatter.path)
 */
export const getTree = function getTree(arr, pathStart) {
  let map = {},
    roots = []

  const arrSelection = arr.edges.filter(item => {
    const path = get(item, "node.frontmatter.path")
    if (pathStart) {
      if (!path.startsWith(pathStart) || pathStart === path) {
        return false
      }
    }
    return true
  })
  const nodes = arrSelection.map((item, index) => {
    let path = cleanPath(get(item, "node.frontmatter.path"))
    const parentNodes = path.split("/")
    const parentPath =
      parentNodes.slice(0, parentNodes.length - 2).join("/") + "/"
    const parent = arrSelection.find(
      itemParent =>
        cleanPath(get(itemParent, "node.frontmatter.path")) ===
        cleanPath(parentPath)
    )
    map[get(item, "node.id")] = index
    return {
      id: get(item, "node.id"),
      title: get(item, "node.frontmatter.title"),
      description: get(item, "node.frontmatter.description"),
      path: cleanPath(get(item, "node.frontmatter.path")),
      parentId: get(parent, "node.id", "0"),
      children: [],
    }
  })

  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i]
    if (node.parentId !== "0") {
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
          frontmatter: PropTypes.shape({
            title: PropTypes.string.isRequired,
            path: PropTypes.string.isRequired,
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
      get(breadcrumb.find(item => get(item, "meta.title")), "meta.title") || "",
    description:
      get(
        breadcrumb.find(item => get(item, "meta.description")),
        "meta.description"
      ) || "",
    keywords:
      get(
        breadcrumb.find(item => get(item, "meta.keywords")),
        "meta.keywords"
      ) || [],
  }
}

getMeta.proptypes = {
  arr: PropTypes.shape({
    edges: PropTypes.arrayOf(
      PropTypes.shape({
        node: PropTypes.shape({
          id: PropTypes.string.isRequired,
          frontmatter: PropTypes.shape({
            title: PropTypes.string.isRequired,
            path: PropTypes.string.isRequired,
          }).isRequired,
        }).isRequired,
      })
    ).isRequired,
  }).isRequired,
  page: PropTypes.shape({
    frontmatter: PropTypes.shape({
      title: PropTypes.string.isRequired,
      path: PropTypes.string.isRequired,
    }).isRequired,
  }),
}
