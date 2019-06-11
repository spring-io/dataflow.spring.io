exports.onClientEntry = () => {
  window.toggleQuestion = evt => {
    let questionBlock = evt.target.parentNode

    if (questionBlock.className.indexOf('question-block') === -1) {
      questionBlock = questionBlock.parentNode
    }

    if (questionBlock.className.indexOf('active') > -1) {
      questionBlock.className = 'question-block'
    } else {
      questionBlock.className = 'question-block active'
    }
  }
}

exports.onRouteUpdate = ({ location, prevLocation }) => {
  const hash = window.location.hash.replace('#', '')
  if (hash) {
    setTimeout(() => {
      const block = document.getElementById(hash)
      if (block && block.className === 'question-block') {
        block.className = 'question-block active'
      }
    }, 100)
  }
}
