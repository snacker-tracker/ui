import React, { Fragment, Component } from "react"

import API from '../lib/API'
import dayjs from 'dayjs'

import Dropdown from 'react-bootstrap/Dropdown'
import { NavLink } from 'react-router-dom'

import queryString from 'query-string'

import CanvasJSReact from '../lib/canvasjs.react'

const  CanvasJSChart = CanvasJSReact.CanvasJSChart

class TopScansGraph extends Component {
  render() {
    const dp = this.props.topscans.map( topscan => {
      return {
        y: topscan.count,
        label: this.props.codes[topscan.code] || topscan.code
      }
    })

    const options = {
      animationEnabled: true,
      theme: "light2",
      axisX: {
        title: "Product",
        reversed: true,
      },
      axisY: {
        title: "Scan Count",
      },
      data: [{
        type: "bar",
        dataPoints: dp
      }]
    }

    return (
    <div>
      <h1>Top 10 Scans</h1>
      <CanvasJSChart options = {options}
        /* onRef={ref => this.chart = ref} */
      />
      {/*You can get reference to the chart instance as shown above using onRef. This allows you to access all chart properties and methods*/}
    </div>
    )
  }
}

/*
    <Content />
*/

class Home extends React.Component {
  constructor(props) {
    super(props)
    const query = queryString.parse(this.props.location.search)

    this.state = {
      code: false,
      scans: false,
      period: query.period || 'all-time'
    }
  }

  componentDidUpdate(previousProps, previousState) {
    const query = queryString.parse(this.props.location.search)
    const period = query.period || 'all-time'
    if(period !== previousState.period) {
      this.setState({period})
      this.load()
    }
  }

  async load() {
    let options = {}
    if(this.props.auth.isAuthenticated) {
      options = {
        token: this.props.auth.getTokenSilently
      }
    }

    console.log(this.state.period)

    const opts = {}
    switch(this.state.period) {
      case 'this-week':
        opts.from_date = dayjs().startOf('week').toISOString()
        break

      case 'last-7-days':
        opts.from_date = dayjs().subtract(7, 'day').toISOString()
        break

      case 'this-month':
        opts.from_date = dayjs().startOf('month').toISOString()
        break

      case 'last-30-days':
        opts.from_date = dayjs().subtract(30, 'day').toISOString()
        break

      case 'year-to-date':
        opts.from_date = dayjs().startOf('year').toISOString()
        break

      case 'all-time':
      default:
        break
    }

    const client = new API(this.props.config.REPORTER_URL, options)

    let scans = await client.GetTopScans({limit: 10, ...opts})
    scans = (await scans.json()).items
    this.setState({scans})

    if(!this.state.codes) {
      let codes = await client.ListCodes({limit: 200})
      codes = (await codes.json()).items
      const codes_hash = {}

      for(const code of codes) {
        codes_hash[code.code] = code.name
      }

      this.setState({codes: codes_hash})
    }
  }

  async componentDidMount() {
    this.setState({scans: false, codes: false})
    this.load()
  }

  render() {
    if(!this.state.scans || !this.state.codes) {
      return ("...")
    } else {
      return (
        <Fragment>
          <NavLink to={this.makeGraphLink('this-week')}>This week</NavLink> | <NavLink to={this.makeGraphLink('last-7-days')}>Last 7 days</NavLink> | <NavLink to={this.makeGraphLink('this-month')}>This month</NavLink> | <NavLink to={this.makeGraphLink('last-30-days')}>Last 30 days</NavLink> | <NavLink to={this.makeGraphLink('year-to-date')}>Year to date</NavLink> | <NavLink to={this.makeGraphLink('all-time')}>All Time</NavLink>

          <TopScansGraph codes={this.state.codes} topscans={this.state.scans} />
        </Fragment>
      )
    }
  }

  makeGraphLink(period) {
    return this.props.location.pathname + "?period=" + period
  }
}

export default Home;
