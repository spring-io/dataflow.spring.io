import React from "react"
import { Link } from "gatsby"

import { Layout } from "../components/common/layout"
import { Seo } from "../components/common/seo"

const FeaturesPage = () => (
  <Layout>
    <Seo title="Spring Cloud Data Flow Features" />
    <div className="container">
      <div class="layout-basic">
        <h1>Features</h1>
      </div>
    </div>
  </Layout>
)

export default FeaturesPage
