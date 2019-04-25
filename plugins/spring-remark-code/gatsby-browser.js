const copyToClipboard = str => {
  const el = document.createElement('textarea')
  el.value = str
  el.setAttribute('readonly', '')
  el.style.position = 'absolute'
  el.style.left = '-9999px'
  document.body.appendChild(el)
  const selected =
    document.getSelection().rangeCount > 0
      ? document.getSelection().getRangeAt(0)
      : false
  el.select()
  document.execCommand('copy')
  document.body.removeChild(el)
  if (selected) {
    document.getSelection().removeAllRanges()
    document.getSelection().addRange(selected)
  }
}
exports.onClientEntry = () => {
  window.codeToClipboard = evt => {
    const text = evt.target.parentNode.children[1].textContent
    copyToClipboard(text.trim())
    evt.target.innerHTML = 'Copied!'
    setTimeout(() => {
      evt.target.innerHTML = 'Copy'
    }, 2000)
  }
}
