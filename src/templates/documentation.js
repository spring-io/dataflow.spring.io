import React from "react"
import ReactDOM from "react"
import { Link, graphql } from "gatsby"
import PropTypes from "prop-types"
import { get } from "lodash"
import classNames from "classnames"

import {
  getSummaryType,
  getTree,
  getPrevNext,
  getBreadcrumb,
  getMeta,
  SummaryTile,
  SummaryNav,
  MdComponents,
} from "../components/documentation"

import {
  Layout,
  SidebarNav,
  Toc,
  PrevNext,
  Breadcrumb,
} from "../components/common"

class DocumentationTemplate extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    const { page, pages } = this.props.data

    const options = {
      summary: get(page, "frontmatter.summary") || false,
      toc: get(page, "frontmatter.toc") || true,
      prevNext: get(page, "frontmatter.prevNext") || true,
      path: get(page, "frontmatter.path"),
      breadcrumb: get(page, "breadcrumb") || true,
    }

    const tree = getTree(pages)
    const breadcrumb = getBreadcrumb(pages, page)
    const meta = getMeta(pages, page)
    const summary = options.summary ? getTree(pages, options.path) : null

    let toc = !options.summary && options.toc
    let prevNext, summaryType
    if (!options.summary && options.prevNext) {
      prevNext = getPrevNext(pages, page)
    }
    if (toc) {
      const headings = get(page, "headings", []).filter(
        item => get(item, "depth", 0) > 1
      )
      if (headings.length === 0) {
        toc = false
      }
    }
    if (summary) {
      summaryType = getSummaryType(pages, page)
    }
    return (
      <Layout>
        <div className="container">
          <div
            className={classNames(
              "layout-sidebars",
              !toc ? "layout-2-sidebars" : ""
            )}
          >
            <div className="sidebar">
              <div className="sticky">
                <div className="box">
                  <SidebarNav tree={tree} />
                </div>
              </div>
            </div>
            <div className="main">
              <div className="main-content">
                {options.breadcrumb && (
                  <div className="breadcrumb md">
                    <Breadcrumb pages={breadcrumb} />
                  </div>
                )}
                <div className="post-content md">
                  <div dangerouslySetInnerHTML={{ __html: page.html }} />
                </div>
                {summary && (
                  <>
                    {summaryType === "links" ? (
                      <div className="summary md">
                        <SummaryNav tree={summary} />
                      </div>
                    ) : (
                      <div className="summary tiles md">
                        <SummaryTile tree={summary} />
                      </div>
                    )}
                  </>
                )}
                {(get(prevNext, "prev") || get(prevNext, "next")) && (
                  <div>
                    <PrevNext
                      next={get(prevNext, "next")}
                      prev={get(prevNext, "prev")}
                    />
                  </div>
                )}
              </div>
            </div>
            {toc && (
              <div className="sidebar-toc">
                <div className="sticky">
                  <div className="toc">
                    <div>
                      <strong>Content</strong>
                    </div>
                    <Toc />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </Layout>
    )
  }
}

DocumentationTemplate.propTypes = {
  data: PropTypes.shape({
    page: PropTypes.object.isRequired,
    pages: PropTypes.object.isRequired,
  }).isRequired,
}

export const articleQuery = graphql`
  query($slug: String!) {
    pages: allMarkdownRemark(
      filter: { fields: { hash: { eq: "documentation" } } }
      sort: { fields: fields___slug, order: ASC }
    ) {
      edges {
        node {
          id
          frontmatter {
            title
            description
            path
            meta_title
            meta_description
            keywords
          }
        }
      }
    }
    page: markdownRemark(frontmatter: { path: { eq: $slug } }) {
      html
      headings {
        value
        depth
      }
      frontmatter {
        title
        summary
        path
        toc
        prevNext
      }
    }
  }
`

export default DocumentationTemplate
