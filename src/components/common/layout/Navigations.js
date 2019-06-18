import React from 'react'
import { Configure, InstantSearch } from 'react-instantsearch-dom'
import { Link, StaticQuery, graphql } from 'gatsby'

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
                    version: { eq: "master" }
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
                      apiKey='b2e54fb04eb0279d4ad1010dd38bc131'
                      indexName='doc-master'
                    >
                      <Configure attributesToSnippet='html' />
                      <Search onBlur={this.toggleSearch} pages={data.pages} />
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
