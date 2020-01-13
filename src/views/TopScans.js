import React, { Component, Fragment } from "react"

import { Row, Col } from "react-bootstrap"
import { NavLink } from "react-router-dom"

import API from '../lib/API'

class LastScans extends Component {
  constructor(props) {
    super(props)

    this.state = {
      scans: [],
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

    let scans = await client.GetTopScans()
    let codes = await client.ListCodes({limit: 200})

    codes = (await codes.json()).items
    scans = (await scans.json()).items

    this.setState({scans, codes})
  }



  render() {
    let rows = null
    // if we've loaded data, essentially
    if(this.state.scans.length > 0 && this.state.codes.length > 0) {

      // build a hash of [code] = name
      const codes = this.state.codes.reduce( (accumulator, current) => {
        accumulator[current.code] = {
          name: current.name,
          categories: current.categories
        }
        return accumulator
      }, {})

      let i = 0
      rows = this.state.scans.map( s => {
        i++
        return (
          <Row key={i} className={["d-flex", "scan-row", i % 2 === 0 ? "odd" : "even"] }>
            <Col>
              {s.count}
            </Col>

            <Col>
              <NavLink to={"/codes/" + s.code }>{s.code}</NavLink>
            </Col>
            <Col>
              {codes[s.code] && (codes[s.code].name || "UNKNOWN")}
              {codes[s.code] && codes[s.code].categories.length > 0 ? "*" : ""}
            </Col>
            <Col>
              {s.last_scan} / {s.first_scan}
            </Col>
          </Row>
        )
      })
    }
    return (
      <Fragment>
        <Row>
          <Col className="d-none d-sm-block">
            Scan Count
          </Col>

          <Col className="d-none d-sm-block">
            Code
          </Col>
          <Col className="d-none d-sm-block">
            Name
          </Col>
          <Col className="d-none d-sm-block">
            Last Scanned
          </Col>
        </Row>
        {rows}
      </Fragment>
    )
  }
}

export default LastScans
