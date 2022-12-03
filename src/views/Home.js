import React, { Fragment, Component } from "react"

import API from '../lib/API'
import dayjs from 'dayjs'

import { NavLink } from 'react-router-dom'

import url from 'url'

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

class Home extends React.Component {
  constructor(props) {
    super(props)
    const query = url.parse(this.props.location.search, true).query

    this.state = {
      code: false,
      scans: false,
      period: query.period || 'all-time',
      location: null
    }
  }

  slugMappings = {
      'this-week': ["This week", dayjs().startOf('week').toISOString()],
      'last-7-days': ["Last 7 days", dayjs().subtract(7, 'day').toISOString()],
      'this-month': ["This month", dayjs().startOf('month').toISOString()],
      'last-30-days': ["Last 30 days", dayjs().subtract(30, 'day').toISOString()],
      'year-to-date': ["Year to date", dayjs().startOf('year').toISOString()],
      'all-time': ["All time", null]
    }


  componentDidUpdate(_previousProps, previousState) {
    const query = url.parse(this.props.location.search, true).query
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

    const opts = {}

    if(Object.keys(this.slugMappings).includes(this.state.period)) {
        if(this.slugMappings[this.state.period][1] != null) {
            opts.from_date = this.slugMappings[this.state.period][1]
        }
    }

    if(opts.from_date == null) {
        delete opts.from_date
    }

    const client = new API(this.props.config.REPORTER_URL, options)

    let scans = await client.GetTopScans({limit: 10, ...opts})
    scans = (await scans.json()).items
    this.setState({scans})

    if(!this.state.codes) {
      let codes = await client.ListCodes({limit: 500})
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
      const things = Object.entries(this.slugMappings).map( m => {
        return (<NavLink to={this.makeGraphLink(m[0])}>{m[1][0]}</NavLink> )
      })

      const len = things.length

      for(let i = 0; i < ((len -1) * 2); i = i + 2) {
        things.splice(i + 1, 0, " | ")
      }

      return (
        <Fragment>
        {things}
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
