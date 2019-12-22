import React, { Component } from "react";

import queryString from 'query-string'

//import Loading from "../components/Loading";

import { Container, Image, Row, Col } from "react-bootstrap";

import API from '../lib/API'

import CanvasJSReact from '../lib/canvasjs.react'
const  CanvasJSChart = CanvasJSReact.CanvasJSChart

class ScanCountGraph extends Component {
  render() {
    const dp = this.props.counts.map( count => {
      return {
        y: count.count,
        label: count[this.props.period]
      }
    })

    const options = {
      animationEnabled: true,
      theme: "light2",
      axisX: {
        title: this.props.period,
        reversed: true,
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

    this.state = {
      code: false,
      pictures: [],
      counts: [],
      period: 'daily',
      period_map: {
        daily: 'date',
        hourly: 'hour',
        weekdaily: 'weekday',
      }
    }
  }


  async componentDidMount() {
    const options = {}

    const query = queryString.parse(this.props.location.search)
    const period = query.period || 'daily'

    if(this.props.auth.isAuthenticated) {
      options.token = this.props.auth.getTokenSilently
    }

    const client = new API(this.props.config.REPORTER_URL, options)


    const code_response = await client.GetCode(this.props.match.params.code)
    const code = await code_response.json()

    const counts_response = await client.GetCodeScanCounts(this.props.match.params.code, period)
    const counts = await counts_response.json()
    counts.items.reverse()

    if(period === 'hourly') {
      counts.items = counts.items.map( point => {
        point['hour'] = (point['hour'] - (new Date().getTimezoneOffset() / 60))
        return point
      })
    }

    const pictures_response = await client.GetCodePictures(this.props.match.params.code)
    const pictures = await pictures_response.json()

    this.setState({code, pictures: pictures.items, counts: counts.items, period})
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
              {this.state.counts && (<ScanCountGraph counts={this.state.counts} period={this.state.period_map[this.state.period]} />)}
            </Container>
          </Col>
        </Row>
      </Container>
    )
  }
}

export default CodeDetails
