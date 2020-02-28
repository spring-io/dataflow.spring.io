const visit = require(`unist-util-visit`)

const KEY = /^(<!--VIDEO:)(.*?)-->/

module.exports = ({ markdownAST }, options = { width: 600, height: 300 }) => {
  function isUrlValid(userInput) {
    var res = userInput.match(
      /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g
    )
    if (res == null) return false
    else return true
  }
  visit(markdownAST, `html`, node => {
    const { value } = node
    if (value && value.match(KEY)) {
      const videoUrl = value.replace('<!--VIDEO:', '').replace('-->', '')
      if (isUrlValid(videoUrl)) {
        node.type = `html`
        node.value = `<div><iframe src="${videoUrl}" width="${options.width}" height="${options.height}"></iframe></div>`
      }
    }
  })

  return markdownAST
}
