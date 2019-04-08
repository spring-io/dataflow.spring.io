import React from "react"
import PropTypes from "prop-types"

import Header from "./Header"
import Footer from "./Footer"

import fontawesome from "@fortawesome/fontawesome"
import { fab } from "@fortawesome/free-brands-svg-icons"
import { fas } from "@fortawesome/free-solid-svg-icons"
import { far } from "@fortawesome/free-regular-svg-icons"
import "@fortawesome/fontawesome-svg-core/styles.css"
import { config } from "@fortawesome/fontawesome-svg-core"

import "../../../styles/app.scss"

config.autoAddCss = false
fontawesome.library.add(fab, fas, far)

const Layout = ({ children }) => (
  <>
    <div>
      <Header />
      <main>{children}</main>
      <Footer />
    </div>
  </>
)

Layout.propTypes = {
  children: PropTypes.node.isRequired,
}

export default Layout
