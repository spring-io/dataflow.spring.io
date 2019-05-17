const get = require(`lodash.get`)

module.exports = (content, data) => {
  data = data || {}
  return content.replace(/%(.+?)%/g, (match, key) => {
    const value = get(data, key) || null
    if (value !== null) {
      return value
    }
    return match
  })
}
