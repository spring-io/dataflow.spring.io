import { Link } from "gatsby"
import React from "react"
import Logo from "./Logo"
import Navigation from "./Navigations"

const Header = () => (
  <div className="header">
    <div className="container">
      <h1 className="logo">
        <Link to="/">
          <Logo />
          Spring Cloud <strong>Data Flow</strong>
        </Link>
      </h1>

      <Navigation />
    </div>
  </div>
)

export default Header
