import React from 'react'
import { Configure, InstantSearch } from 'react-instantsearch-dom'
import { Link, StaticQuery, graphql } from 'gatsby'

import versions from '../../../../content/versions.json'
import { IconSearch } from './../icons'
import { Search } from './../search'

const NavigationLink = props => (
  <Link
    activeClassName={props.active ? 'active' : ''}
    partiallyActive={props.to !== '/'}
    to={props.to}
  >
    {props.name}
  </Link>
)

class Navigation extends React.Component {
  state = {
    search: false,
  }

  toggleSearch = () => {
    this.setState({ search: !this.state.search })
  }

  render() {
    const currentVersion = Object.keys(versions).find(versionId => {
      const version = versions[versionId]
      return !!version['current']
    })
    let version = this.props.version ? this.props.version : currentVersion
    if (version === 'next') {
      version = 'main'
    }
    return (
      <>
        <StaticQuery
          query={graphql`
            query {
              pages: allMarkdownRemark(
                filter: {
                  fields: {
                    hash: { eq: "documentation" }
                    root: { eq: true }
                    currentVersion: { eq: true }
                  }
                }
                sort: { fields: fields___slug, order: ASC }
              ) {
                edges {
                  node {
                    id
                    fields {
                      path
                      category
                    }
                    frontmatter {
                      title
                      description
                      meta_title
                      meta_description
                      keywords
                    }
                  }
                }
              }
            }
          `}
          render={data => (
            <>
              <div className='navigation'>
                <NavigationLink active name='Features' to='/features/' />
                <NavigationLink active name='Documentation' to='/docs/' />
                <NavigationLink
                  active
                  name='Getting Started'
                  to='/getting-started/'
                />
                <NavigationLink active name='Community' to='/community/' />
                <NavigationLink active name='Blog' to='/news/' />
              </div>
              <div className='navigation right'>
                {!this.state.search ? (
                  <span className='button-search' onClick={this.toggleSearch}>
                    <IconSearch />
                    Search
                  </span>
                ) : (
                  <div className='search'>
                    <InstantSearch
                      appId='ZFB6X2VA6A'
                      apiKey='b2f4a20249e629e0915e4cfad2de8b0f'
                      indexName={`doc-${version}`}
                    >
                      <Configure attributesToSnippet='html' />
                      <Search
                        onBlur={this.toggleSearch}
                        pages={data.pages}
                        version={version}
                      />
                    </InstantSearch>
                  </div>
                )}
              </div>
            </>
          )}
        />
      </>
    )
  }
}

export default Navigation
