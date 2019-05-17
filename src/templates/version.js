import PropTypes from 'prop-types'
import React from 'react'
import classNames from 'classnames'
import get from 'lodash.get'
import { Sticky, StickyContainer } from 'react-sticky'
import { graphql } from 'gatsby'

import versions from './../../content/versions.json'
import { Layout, Seo, SidebarNav } from '../components/common'
import {
  SummaryTile,
  VersionSelect,
  getTree,
  getVersions,
} from '../components/documentation'

class DocumentationVersion extends React.Component {
  render() {
    const { page, pages } = this.props.data
    const options = {
      summary: get(page, 'frontmatter.summary') || false,
      path: get(page, 'path'),
    }
    const tree = getTree(pages)
    const summary = getTree(pages, options.path)
    const optionVersions = getVersions(versions)
    return (
      <Layout>
        <Seo title={`Documentation ${this.props.data.page.context.version}`} />
        <StickyContainer>
          <div className='container'>
            <div className={classNames('layout-sidebars', 'layout-2-sidebars')}>
              <div className='sidebar'>
                <Sticky topOffset={20}>
                  {({ style }) => (
                    <div style={{ ...style }}>
                      <div className='sidebar-content'>
                        {optionVersions.length > 1 && (
                          <VersionSelect
                            versions={optionVersions}
                            version={this.props.data.page.context.version}
                          />
                        )}
                        <div className='box'>
                          <SidebarNav
                            page={{ fields: { category: null } }}
                            tree={tree}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </Sticky>
              </div>
              <div className='main'>
                <div className='main-content'>
                  <h1>Version {this.props.data.page.context.version}</h1>
                  <div className='post-content md' />
                  {summary && (
                    <>
                      <div className='summary tiles md'>
                        <SummaryTile tree={summary} />
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </StickyContainer>
      </Layout>
    )
  }
}

DocumentationVersion.propTypes = {
  data: PropTypes.shape({
    page: PropTypes.object.isRequired,
    pages: PropTypes.object.isRequired,
  }).isRequired,
}

export const articleQuery = graphql`
  query($versionPath: String, $version: String) {
    page: sitePage(context: { versionPath: { eq: $versionPath } }) {
      id
      path
      context {
        version
      }
    }
    pages: allMarkdownRemark(
      filter: {
        fields: {
          hash: { eq: "documentation" }
          version: { eq: $version }
          exclude: { ne: true }
        }
        frontmatter: { exclude: { eq: null } }
      }
      sort: { fields: fields___slug, order: ASC }
    ) {
      edges {
        node {
          id
          fields {
            path
            version
            category
          }
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
  }
`

export default DocumentationVersion
