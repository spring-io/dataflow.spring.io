import { Link } from "gatsby"
import React from "react"

const Footer = () => (
  <footer className="footer">
    <div className="container">
      <div className="copyright">
        <p>
          © 2013-{new Date().getFullYear()} 2018 Pivotal Software, Inc. All
          Rights Reserved.
        </p>
        <p>Spring CLoud Data Flow is under the Apache 2.0 license</p>
      </div>
      <ul>
        <li>
          <Link to="/">Terms of service</Link>
        </li>
        <li>
          <Link to="/">Privacy</Link>
        </li>
        <li>
          <Link to="/">Cookie Preferences</Link>
        </li>
      </ul>
    </div>
  </footer>
)

export default Footer
