exports.onClientEntry = () => {
  window.downloadLink = (evt, url) => {
    const fileName = url.split('/').slice(-1)[0]
    const req = new XMLHttpRequest()
    req.open('GET', url, true)
    req.responseType = 'blob'
    req.onload = function(event) {
      const blob = req.response
      const contentType = req.getResponseHeader('content-type')
      if (window.navigator.msSaveOrOpenBlob) {
        // Internet Explorer
        window.navigator.msSaveOrOpenBlob(
          new Blob([blob], { type: contentType }),
          fileName
        )
      } else {
        let link = document.createElement('a')
        link.setAttribute('download', fileName)
        link.setAttribute('target', '_blank')
        link.setAttribute('href', URL.createObjectURL(blob))
        link.style.position = 'absolute'
        link.style.left = '-9999px'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      }
    }
    req.send()
    return false
  }
}
