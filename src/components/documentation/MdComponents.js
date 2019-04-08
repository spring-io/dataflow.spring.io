import React from "react"
import PropTypes from "prop-types"
import classNames from "classnames"
import { Link } from "gatsby"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

const Callout = ({ variant, children }) => (
  <div className={classNames("callout", variant)}>
    <strong>{variant}</strong>: {children}
  </div>
)

Callout.defaultProps = {
  variant: "note",
}

const Button = ({ variant, path, children }) => {
  let icon = ""
  if (variant == "github") {
    icon = <FontAwesomeIcon icon={["fab", "github"]} size="2x" />
  }

  return (
    <div className="div-button">
      <a href={path} className={classNames("button", variant)}>
        {icon}
        {children}
      </a>
    </div>
  )
}

Button.defaultProps = {
  variant: "default",
  path: "#",
}

export default {
  button: Button,
  callout: Callout,
}
