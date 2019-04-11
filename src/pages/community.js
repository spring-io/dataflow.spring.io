import React from "react"
import { Link } from "gatsby"

import { Layout } from "../components/common/layout"
import { Seo } from "../components/common/seo"

const CommunityPage = () => (
  <Layout>
    <Seo title="Spring Cloud Data Flow Community" />
    <div className="container">
      <div class="layout-basic">
        <h1>Community</h1>
      </div>
    </div>
  </Layout>
)

export default CommunityPage
