import React from "react"
import { Link } from "gatsby"
import { Search } from "./../search"
import { InstantSearch, Configure } from "react-instantsearch-dom"

const NavigationLink = props => (
  <Link
    activeClassName={props.active ? "active" : ""}
    partiallyActive={props.to !== "/"}
    to={props.to}
  >
    {props.name}
  </Link>
)

const Navigation = () => (
  <>
    <div className="navigation">
      <NavigationLink active name="Features" to="/features/" />
      <NavigationLink active name="Documentation" to="/documentation/" />
      <NavigationLink active name="Download" to="/download/" />
      <NavigationLink active name="Community" to="/community/" />
    </div>
    <div className="navigation right">
      <Link className="button primary" to="/documentation/get-started/">
        Get Started
      </Link>
      <NavigationLink name="Blog" to="/blog/" />

      <div className="search">
        <InstantSearch
          appId="ES999KPS5F"
          apiKey="bf05705a8c4bcbacf2611d6d0e3128f4"
          indexName="Doc"
        >
          <Configure attributesToSnippet="html" />
          <Search />
        </InstantSearch>
      </div>
    </div>
  </>
)

export default Navigation
