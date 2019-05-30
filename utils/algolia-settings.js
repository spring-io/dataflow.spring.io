#!/usr/local/bin/node

/**
 * Author: https://github.com/TryGhost/docs/blob/master/utils/algolia-settings.js
 */

/**
 * This is a script that configures our indexes
 *
 * Usage:
 *
 * NODE_ENV=production node utils/algolia-settings.js
 */

const algoliasearch = require(`algoliasearch`)

if (process.env.ALGOLIA_ADMIN_KEY_PASSWORD) {
  process.env.ALGOLIA_ADMIN_KEY = process.env.ALGOLIA_ADMIN_KEY_PASSWORD
}

const client = algoliasearch(
  process.env.GATSBY_ALGOLIA_APP_ID,
  process.env.ALGOLIA_ADMIN_KEY
)

// Any defined settings will override those in the algolia UI
const REQUIRED_SETTINGS = {
  // We chunk our pages into small algolia entries, and mark them as distinct by slug
  // This ensures we get one result per page, whichever is ranked highest
  distinct: true,
  attributeForDistinct: `slug`,
  // This ensures that chunks higher up on a page rank higher
  customRanking: [`desc(customRanking.heading)`, `asc(customRanking.position)`],
  // Defines the order algolia ranks various attributes in
  searchableAttributes: [`title`, `headings`, `html`, `url`, `fullTitle`],
}

const getIndexByName = name => client.initIndex(name)

const setSettingsForIndex = name => {
  const index = getIndexByName(name)

  index
    .setSettings(REQUIRED_SETTINGS)
    .then(() => index.getSettings())
    .then(settings => console.log(name, settings))
}

client.listIndexes().then(({ items }) => {
  items.forEach(item => setSettingsForIndex(item.name))
})
