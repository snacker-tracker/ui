import React, { Component, Fragment } from "react"

import { Row, Col, Badge } from "react-bootstrap"
import { NavLink } from "react-router-dom"
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'

import API from '../lib/API'

dayjs.extend(relativeTime)

class CategoryView extends Component {
  constructor(props) {
    super(props)

    this.state = {
      codes: []
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

    let codes = await client.ListCodes({
      categories: this.props.match.params.category
    })

    codes = (await codes.json()).items


    this.setState({codes})
  }



  render() {
    let rows = null
    // if we've loaded data, essentially
    if(this.state.codes.length > 0) {

      let i = 0
      rows = this.state.codes.map( s => {
        i++
        return (
          <Row key={i} className={["d-flex", "scan-row", i % 2 === 0 ? "odd" : "even"] }>
            <Col>
              <NavLink to={"/codes/" + s.code }>{s.code}</NavLink>
            </Col>
            <Col>
              {s.name}
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

export default CategoryView
