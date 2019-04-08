const queries = require(`./utils/algolia-queries`)

module.exports = {
  siteMetadata: {
    title: `Spring Cloud Data Flow`,
    description: `To be updated`,
    author: `@spring`,
  },
  plugins: [
    `gatsby-plugin-react-helmet`,
    `gatsby-plugin-sass`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/images/`,
      },
    },
    {
      resolve: `gatsby-plugin-prefetch-google-fonts`,
      options: {
        fonts: [
          {
            family: `Source Sans Pro`,
            subsets: [`latin`],
            variants: [`100`, `400`, `600`, `700`],
          },
          {
            family: `Karla`,
            subsets: [`latin`],
            variants: [`100`, `300`, `400`, `700`],
          },
        ],
      },
    },
    {
      resolve: `gatsby-plugin-algolia`,
      options: {
        appId: `ES999KPS5F`,
        apiKey: `${process.env.ALGOLIA_ADMIN_KEY}`,
        queries,
        chunkSize: 10000, // default: 1000
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `md`,
        path: `${__dirname}/content/`,
        ignore: [`**/\.*`],
      },
    },
    {
      resolve: `gatsby-transformer-remark`,
      options: {
        plugins: [
          {
            resolve: `gatsby-remark-images`,
            options: {
              sizeByPixelDensity: true,
              withWebp: true,
              linkImagesToOriginal: false,
              quality: 80,
              maxWidth: 800,
            },
          },
          {
            resolve: `gatsby-remark-prismjs`,
            options: {
              classPrefix: "language-",
              inlineCodeMarker: null,
              aliases: {},
              showLineNumbers: false,
              noInlineHighlight: false,
            },
          },
          {
            resolve: "gatsby-remark-copy-linked-files",
          },
          `gatsby-remark-component`,
          `gatsby-remark-attr`,
          `gatsby-remark-grid-tables`,
          `gatsby-remark-autolink-headers`,
          `gatsby-remark-code-titles`,
          `gatsby-remark-external-links`,
        ],
      },
    },
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    `gatsby-plugin-catch-links`,
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `spring-cloud-data-flow`,
        short_name: `scdf`,
        start_url: `/`,
        background_color: `#45968f`,
        theme_color: `#45968f`,
        display: `minimal-ui`,
        icon: `src/images/dataflow-icon.png`,
      },
    },
  ],
}
