const queries = require(`./utils/algolia-queries`)
const markdownVars = require(`./content/documentation/variables.json`)

const plugins = [
  {
    resolve: 'gatsby-plugin-webpack-bundle-analyzer',
    options: {
      analyzerPort: 3000,
      production: true,
      openAnalyzer: false,
    },
  },
  `gatsby-plugin-react-helmet`,
  `gatsby-plugin-sass`,
  `gatsby-plugin-sitemap`,
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
    resolve: `gatsby-source-filesystem`,
    options: {
      name: `md`,
      path: `${__dirname}/data`,
      ignore: [`**/.*`, `**/files`],
    },
  },
  {
    resolve: `gatsby-transformer-remark`,
    options: {
      plugins: [
        `spring-remark-download`,
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
          resolve: 'gatsby-remark-copy-linked-files',
        },
        `gatsby-remark-attr`,
        `gatsby-remark-draw`,
        `gatsby-remark-grid-tables`,
        `gatsby-remark-autolink-headers`,
        `gatsby-remark-code-titles`,
        `gatsby-remark-external-links`,
        {
          resolve: 'gatsby-remark-mermaid',
          options: {
            theme: null,
          },
        },
        {
          resolve: 'spring-remark-variables',
          options: {
            variables: markdownVars,
          },
        },
        {
          resolve: 'gatsby-remark-embed-youtube',
          options: {
            width: 800,
            height: 400,
          },
        },
        `gatsby-remark-responsive-iframe`,
        {
          resolve: 'spring-remark-embed-snippet',
          options: {
            classPrefix: 'language-',
          },
        },
        {
          resolve: `gatsby-remark-prismjs`,
          options: {
            classPrefix: 'language-',
          },
        },
        {
          resolve: 'gatsby-remark-custom-blocks',
          options: {
            blocks: {
              danger: {
                classes: 'callout danger',
                title: 'optional',
              },
              info: {
                classes: 'callout info',
                title: 'optional',
              },
              note: {
                classes: 'callout note',
                title: 'optional',
              },
              warning: {
                classes: 'callout warning',
                title: 'optional',
              },
              success: {
                classes: 'callout success',
                title: 'optional',
              },
              tip: {
                classes: 'callout tip',
                title: 'optional',
              },
            },
          },
        },
        `spring-remark-code`,
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
]

if (
  process.env.ALGOLIA_ADMIN_KEY &&
  !process.env.ALGOLIA_ADMIN_KEY.match(/<key>/)
) {
  plugins.push({
    resolve: `gatsby-plugin-algolia`,
    options: {
      appId: `ES999KPS5F`,
      apiKey: `${process.env.ALGOLIA_ADMIN_KEY}`,
      queries,
      chunkSize: 10000, // default: 1000
    },
  })
}

module.exports = {
  siteMetadata: {
    title: `Spring Cloud Data Flow`,
    description: `Spring Cloud Data Flow puts powerful integration, batch and stream processing in the hands of the Java microservice developer`,
    author: `@springcloud`,
    siteUrl: `https://dataflow.spring.io`,
    canonical: `https://dataflow.spring.io`,
    twitter: `@springcloud`,
    image: `https://quirky-haibt-6b520a.netlify.com/images/card.jpg`,
    keywords: [`spring`, `cloud`, `dataflow`],
  },
  plugins: plugins,
}
