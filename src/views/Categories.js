import React, { Component, Fragment } from "react"

import { Row, Col, Badge } from "react-bootstrap"
import { NavLink } from "react-router-dom"
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'

import API from '../lib/API'

dayjs.extend(relativeTime)

class CategoriesView extends Component {
  constructor(props) {
    super(props)

    this.state = {
      categories: []
    }
  }
  async componentDidMount() {

    let options = {}
    if(this.props.auth.isAuthenticated) {
      options = {
        token: this.props.auth.getTokenSilently
      }
    }

    const client = new API(this.props.config.REPORTER_URL, options)

    let categories = await client.ListCategories()

    categories = (await categories.json()).items

    this.setState({categories})
  }



  render() {
    let rows = null
    // if we've loaded data, essentially
    if(this.state.categories.length > 0 && this.state.categories.length > 0) {

      let i = 0
      rows = this.state.categories.map( s => {
        i++
        return (
          <Row key={i} className={["d-flex", "scan-row", i % 2 === 0 ? "odd" : "even"] }>
            <Col>
              <Badge>{s.count}</Badge>
            </Col>
            <Col>
              <NavLink to={"/categories/" + s.path }>{s.path}</NavLink>
            </Col>
          </Row>
        )
      })
    }
    return (
      <Fragment>
        <Row>
          <Col>
            Code Count
          </Col>
          <Col className="d-none d-sm-block">
            Name
          </Col>
        </Row>
        {rows}
      </Fragment>
    )
  }
}

export default CategoriesView
