import { Link } from "gatsby"
import React from "react"
import Logo from "./Logo"

const Footer = () => (
  <footer className="footer">
    <div className="container">
      <div className="colset">
        <div className="col col-copyright">
          <div className="logo">
            <Logo />
            <div>
              Spring Cloud <strong>Data Flow</strong>
              <br />
              <span>Powered by Pivotal</span>
            </div>
          </div>
          <div className="copyright-links">
            <div className="copyright">
              <p>
                © 2013-{new Date().getFullYear()} Pivotal Software, Inc. All
                Rights Reserved.
              </p>
              <p>Spring CLoud Data Flow is under the Apache 2.0 license.</p>
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
        </div>
        <div className="col col-links">
          <ul>
            <li class="heading">Product</li>
            <li>
              <a>Excepteur sint</a>
            </li>
            <li>
              <a>Occaecat</a>
            </li>
            <li>
              <a>Cupidatat</a>
            </li>
            <li>
              <a>Non proident</a>
            </li>
            <li>
              <a>Sunt in culpa</a>
            </li>
            <li>
              <a>Deserunt mollit</a>
            </li>
          </ul>
        </div>
        <div className="col col-links">
          <ul>
            <li class="heading">Documentation</li>
            <li>
              <a>Excepteur sint</a>
            </li>
            <li>
              <a>Occaecat</a>
            </li>
            <li>
              <a>Cupidatat</a>
            </li>
            <li>
              <a>Non proident</a>
            </li>
            <li>
              <a>Sunt in culpa</a>
            </li>
            <li>
              <a>Deserunt mollit</a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </footer>
)

export default Footer
