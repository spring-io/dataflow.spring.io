import React from 'react'
import ScrollUp from 'react-scroll-up-button'

import { IconChevronUp } from './../icons'

export const ScrollUpButton = props => {
  const styles = {
    MainStyle: {
      position: 'fixed',
      right: 20,
      width: 50,
      height: 50,
      borderRadius: 25,
      WebkitTransition: 'all 0.5s ease-in-out',
      transition: 'all 0.5s ease-in-out',
      transitionProperty: 'opacity, bottom',
      cursor: 'pointer',
      opacity: 0,
      bottom: -75,
      outline: 'none',
    },
    ToggledStyle: {
      opacity: 1,
      bottom: 20,
    },
  }
  const { style, ToggledStyle } = props
  return (
    <ScrollUp
      ContainerClassName='button-scroll-up'
      {...props}
      style={{
        ...styles.MainStyle,
        ...style,
      }}
      ToggledStyle={{
        ...styles.ToggledStyle,
        ...ToggledStyle,
      }}
    >
      <div>
        <IconChevronUp />
      </div>
    </ScrollUp>
  )
}

export default ScrollUpButton
