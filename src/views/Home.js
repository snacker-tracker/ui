import React, { Fragment, Component } from "react"

import API from '../lib/API'

import CanvasJSReact from '../lib/canvasjs.react'
const  CanvasJSChart = CanvasJSReact.CanvasJSChart
const  CanvasJS = CanvasJSReact.CanvasJS

class TopScansGraph extends Component {
  render() {
    const dp = this.props.topscans.map( topscan => {
      return {
        y: topscan.count,
        label: this.props.codes[topscan.code] || "UNKNOWN"
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

    this.state = {
      code: false,
      scans: false
    }
  }
  async componentDidMount() {
    let options = {}
    if(this.props.auth.isAuthenticated) {
      options = {
        token: this.props.auth.getTokenSilently
      }
    }

    this.setState({scans: false, codes: false})

    const client = new API(this.props.config.REPORTER_URL, options)

    let scans = await client.GetTopScans({limit: 10})
    let codes = await client.ListCodes({limit: 150})

    codes = (await codes.json()).items
    scans = (await scans.json()).items

    const codes_hash = {}

    for(const code of codes) {
      codes_hash[code.code] = code.name
    }


    this.setState({scans, codes: codes_hash})
  }

  render() {
    if(!this.state.scans || !this.state.codes) {
      return ("...")
    } else {
      return (
        <Fragment>
          <TopScansGraph codes={this.state.codes} topscans={this.state.scans} />
        </Fragment>
      )
    }
  }
}

export default Home;
