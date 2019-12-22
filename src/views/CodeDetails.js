import React, { Component } from "react";

import queryString from 'query-string'

//import Loading from "../components/Loading";

import { Container, Image, Row, Col } from "react-bootstrap"
import { NavLink } from 'react-router-dom'

import API from '../lib/API'

import CanvasJSReact from '../lib/canvasjs.react'
const  CanvasJSChart = CanvasJSReact.CanvasJSChart

class ScanCountGraph extends Component {
  render() {
    const key = {
      'daily': 'date',
      'weekdaily': 'weekday',
      'hourly': 'hour'
    }[this.props.period]
    const dp = this.props.counts.map( count => {
      return {
        y: count.count,
        label: count[key]
      }
    })

    const options = {
      animationEnabled: true,
      theme: "light2",
      axisX: {
        title: this.props.period,
      },
      axisY: {
        title: "Scan Count",
      },
      data: [{
        type: "column",
        dataPoints: dp
      }]
    }

    return (
      <CanvasJSChart options = {options}
        /* onRef={ref => this.chart = ref} */
      />
    )
  }
}

class CodeDetails extends Component {
  constructor(props) {
    super(props)

    const query = queryString.parse(this.props.location.search)

    this.state = {
      counts: [],
      period: query.period || 'daily'
    }
  }

  componentDidMount() {
    this.load()
    this.loadGraph(this.state.period)
  }

  componentDidUpdate(previousProps, previousState) {
    const query = queryString.parse(this.props.location.search)
    const period = query.period || 'daily'
    if(period !== previousState.period) {
      this.setState({period: query.period})
      this.loadGraph(period)
    }
  }

  async loadGraph(period) {
    const options = {}
    if(this.props.auth.isAuthenticated) {
      options.token = this.props.auth.getTokenSilently
    }

    const client = new API(this.props.config.REPORTER_URL, options)
    const counts_response = await client.GetCodeScanCounts(this.props.match.params.code, period)
    const counts = await counts_response.json()

    if(period === 'hourly') {
      counts.items = counts.items.map( point => {
        point['hour'] = (point['hour'] - (new Date().getTimezoneOffset() / 60))
        return point
      })
    }

    this.setState({counts, period})
  }

  async load() {
    const options = {}

    if(this.props.auth.isAuthenticated) {
      options.token = this.props.auth.getTokenSilently
    }

    const client = new API(this.props.config.REPORTER_URL, options)


    const code_response = await client.GetCode(this.props.match.params.code)
    const code = await code_response.json()

    const pictures_response = await client.GetCodePictures(this.props.match.params.code)
    const pictures = await pictures_response.json()

    this.setState({code, pictures: pictures.items})
  }

  makeGraphLink(period) {
    return this.props.location.pathname + "?period=" + period
  }

  render() {
    return (
      <Container>
        <h1>{this.state.code && (this.state.code.name)}</h1>
        <Row>
          <Col md="3">
              <Row>
                <Col>
                  {this.state.pictures && this.state.pictures.map( p => {
                    return (
                      <Image key={p.id} src={p.url} rounded />
                    )
                  })}
                </Col>
              </Row>
          </Col>

          <Col>
            <Container>
              {this.state.counts.length > 0 && (<ScanCountGraph counts={this.state.counts} period={this.state.period_map[this.state.period]} />)}
              <NavLink to={this.makeGraphLink('hourly')}>Hourly</NavLink> | <NavLink to={this.makeGraphLink('weekdaily')}>Weekday</NavLink> | <NavLink to={this.makeGraphLink('daily')}>Daily</NavLink>
            </Container>
            <ScanCountGraph period={queryString.parse(this.props.location.search).period || 'daily'} counts={this.state.counts.items || []} />
          </Col>
        </Row>
      </Container>
    )
  }
}

export default CodeDetails
