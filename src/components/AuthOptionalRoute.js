import React from "react"
import PropTypes from "prop-types"
import { Route } from "react-router-dom"
import { useAuth0 } from "../react-auth0-spa"

const AuthOptionalRoute = ({ component: Component, path, ...rest }) => {
  const { isAuthenticated, getTokenSilently } = useAuth0()

  const render = (props) => {
    return <Component {...props} auth={{isAuthenticated, getTokenSilently}} />
  }

  return <Route path={path} render={render} {...rest} />
}

AuthOptionalRoute.propTypes = {
  component: PropTypes.oneOfType([PropTypes.element, PropTypes.func])
    .isRequired,
  path: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.string)
  ]).isRequired
}

export default AuthOptionalRoute
