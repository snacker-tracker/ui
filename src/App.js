import React from "react"
import { Router, Switch } from "react-router-dom"
import { Container } from "react-bootstrap"

import PrivateRoute from "./components/PrivateRoute"
import AuthOptionalRoute from "./components/AuthOptionalRoute"
import Loading from "./components/Loading"
import NavBar from "./components/NavBar"
import Home from "./views/Home"
import Profile from "./views/Profile"
import CodeDetails from "./views/CodeDetails"
import CodeEdit from "./views/CodeEdit"
import LastScans from "./views/LastScans"
import TopScans from "./views/TopScans"
import CategoriesView from "./views/Categories"
import CategoryView from "./views/Category"
import D3View from "./views/D3"
import { useAuth0 } from "./react-auth0-spa"
import history from "./utils/history"

// styles
import "./App.css"

const App = () => {
  const { loading } = useAuth0()

  if (loading) {
    return <Loading />
  }

  return (
    <Router history={history}>
      <div id="app" className="d-flex flex-column h-100">
        <NavBar />
        <Container className="flex-grow-1 mt-5">
          <Switch>
            <AuthOptionalRoute path="/" exact component={Home} />
            <AuthOptionalRoute path="/last-scans" exact component={LastScans} />
            <AuthOptionalRoute path="/top-scans" exact component={TopScans} />
            <AuthOptionalRoute path="/codes/:code" exact component={CodeDetails} />
            <AuthOptionalRoute path="/codes/:code/edit" exact component={CodeEdit} />
            <AuthOptionalRoute path="/categories" exact component={CategoriesView} />
            <AuthOptionalRoute path="/categories/:category" component={CategoryView} />
            <AuthOptionalRoute path="/d3" component={D3View} />
            <PrivateRoute path="/profile" component={Profile} />
          </Switch>
        </Container>
      </div>
    </Router>
  )
}

export default App
