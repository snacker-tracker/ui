import React, { Component, Fragment } from "react"

import { Row, Col } from "react-bootstrap"
import { NavLink } from "react-router-dom"
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'

import API from '../lib/API'

dayjs.extend(relativeTime)

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

    let scans = await client.ListScans()
    let codes = await client.ListCodes({limit: 300})

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
        accumulator[current.code] = current.name
        return accumulator
      }, {})

      let i = 0
      rows = this.state.scans.map( s => {
        i++
        return (
          <Row key={i} className={["d-flex", "scan-row", i % 2 === 0 ? "odd" : "even"] }>
            <Col>
              <NavLink to={"/codes/" + s.code }>{s.code}</NavLink>
            </Col>
            <Col>
              {codes[s.code] || "UNKNOWN"}
            </Col>
            <Col>
              {dayjs(s.scanned_at).fromNow()} ({dayjs(s.scanned_at).format('YYYY/MM/DD HH:mm:ss')})
            </Col>
          </Row>
        )
      })
    }
    return (
      <Fragment>
        <Row>
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
