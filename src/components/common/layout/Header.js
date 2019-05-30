import React from 'react'
import { Link } from 'gatsby'
import { slide as Menu } from 'react-burger-menu'

import Logo from './Logo'
import Navigation from './Navigations'
import { IconBars } from './../icons'

class Header extends React.Component {
  state = {
    menu: false,
  }
  openMenu = () => {
    this.setState({ menu: true })
  }
  updateMenuState = value => {
    if (value.isOpen !== this.state.menu) {
      this.setState({ menu: value.isOpen })
    }
  }
  render() {
    return (
      <>
        <Menu
          onStateChange={this.updateMenuState}
          isOpen={this.state.menu}
          pageWrapId={'___gatsby'}
          outerContainerId={'___gatsby'}
        >
          <div className='logo-dataflow'>
            <Link to='/'>
              <Logo />
            </Link>
          </div>
          <div className='navigation'>
            <Link activeClassName={'active'} to='/'>
              Home
            </Link>
            <Link activeClassName={'active'} partiallyActive to='/features/'>
              Features
            </Link>
            <Link activeClassName={'active'} partiallyActive to='/docs/'>
              Documentation
            </Link>
            <Link
              activeClassName={'active'}
              partiallyActive
              to='/getting-started/'
            >
              Getting Started
            </Link>
            <Link activeClassName={'active'} partiallyActive to='/community/'>
              Community
            </Link>
          </div>
        </Menu>
        <div className='header'>
          <div className='container'>
            <div className='logo-dataflow'>
              <Link to='/'>
                <Logo />
                <span>
                  Spring Cloud <strong>Data Flow</strong>
                </span>
              </Link>
            </div>
            <div className='mb-menu'>
              <button onClick={this.openMenu}>
                <IconBars />
              </button>
            </div>

            <Navigation />
          </div>
        </div>
      </>
    )
  }
}

export default Header
