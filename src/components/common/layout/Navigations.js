import React from 'react'
import { Link, StaticQuery, graphql } from 'gatsby'
import Search from './../search/Search'

import versions from '../../../../content/versions.json'
import { IconSearch } from './../icons'

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
      version = currentVersion
    }
    const algoliaVersion = versions[version].current
      ? `${versions[version].name} (current)`
      : `${versions[version].name}`
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
                    <Search
                      algoliaVersion={algoliaVersion}
                      onBlurHandler={this.toggleSearch}
                    />
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
