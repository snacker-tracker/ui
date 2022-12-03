import React, { Component } from "react";

import url from 'url'

import { Badge, Button, Container, Image, Row, Col, Carousel } from "react-bootstrap"
import { NavLink } from 'react-router-dom'

import API from '../lib/API'

import CanvasJSReact from '../lib/canvasjs.react'
const  CanvasJSChart = CanvasJSReact.CanvasJSChart

const BadgeLink = (props) => {
  return (
    <NavLink key={props.to} to={props.to}>
      <Badge bg={"primary"} style={{"color":"white"}}>{props.category}</Badge>
    </NavLink>
  )
}

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

    //const query = queryString.parse(this.props.location.search)
      //
    const query = {
        "period": "daily"
    }

    this.state = {
      counts: [],
      period: query.period || 'daily',
      badges: []
    }
  }

  componentDidMount() {
    this.load()
    this.loadGraph(this.state.period)
  }

  componentDidUpdate(previousProps, previousState) {
    const q = url.parse(this.props.location.search, true).query
    const query = {
        "period": q.period || "daily"
    }

    if(query.period !== previousState.period) {
      this.setState({period: query.period})
      this.loadGraph(query.period)
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

    const badges = []
    const parents = []
    if(code.categories) {
      for(const category of code.categories) {
        badges.push((<BadgeLink to={["categories", parents.concat([category]).join('.')].join('/')} category={category} />))
        parents.push(category)
      }
    }

    this.setState({code, pictures: pictures.items, badges})
  }

  makeGraphLink(period) {
    return this.props.location.pathname + "?period=" + period
  }

  render() {
    const edit_button = <NavLink to={"/codes/" + this.props.match.params.code + "/edit"} style={{"float":"right"}}>
      <Button>Edit</Button>
    </NavLink>

    return (
      <Container>
          <h1>{this.state.code && (this.state.code.name)}
              {this.props.auth.isAuthenticated && edit_button}
          </h1>

        <Row>
          {this.state.badges && this.state.badges.map( badge => {
            return badge
          })}
        </Row>
        <Row>
          <Col md="3">
              <Row>
                <Col>
                <Carousel>
                  {this.state.pictures && this.state.pictures.map( p => {
                    return (
                        <Carousel.Item>
                            <Image key={p.id} src={p.url} rounded fluid />
                        </Carousel.Item>
                    )
                  })}
                </Carousel>
                </Col>
              </Row>
          </Col>

          <Col>
            <Container>
              {this.state.counts.length > 0 && (<ScanCountGraph counts={this.state.counts} period={this.state.period_map[this.state.period]} />)}
              <NavLink to={this.makeGraphLink('hourly')}>Hourly</NavLink> | <NavLink to={this.makeGraphLink('weekdaily')}>Weekday</NavLink> | <NavLink to={this.makeGraphLink('daily')}>Daily</NavLink>
            </Container>
            <ScanCountGraph period={this.state.period || 'daily'} counts={this.state.counts.items || []} />
          </Col>
        </Row>
      </Container>
    )
  }
}

export default CodeDetails
