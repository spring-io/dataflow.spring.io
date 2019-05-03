exports.onClientEntry = () => {
  window.changeTab = (evt, index) => {
    const target = evt.target
    const tabsItems = target.parentNode.parentNode.children[1].children
    const tabsHeaders = target.parentNode.parentNode.children[0].children
    for (let i = 0; i < tabsItems.length; i++) {
      tabsItems[i].className = 'tab-item'
      tabsHeaders[i].className = 'tab-item'
    }
    tabsItems[index].className = 'tab-item active'
    tabsHeaders[index].className = 'tab-item active'
  }
}
