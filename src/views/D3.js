/*
import React from "react"

import Jumbotron from 'react-bootstrap/Jumbotron'

import * as chart from '../components/BarChart'


import dayjs from 'dayjs'

import API from '../lib/API'

class D3 extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      height: 0,
      width: 0,
      counts: false
    }
  }

  componentDidMount() {
    let w = this.wrapper.clientWidth
    let h = this.wrapper.clientHeight
    this.setState({
      height: h,
      width: w
    })
  }

  async componentDidUpdate() {
    let options = {}
    if(this.props.auth.isAuthenticated) {
      options = {
        token: this.props.auth.getTokenSilently
      }
    }

    if(!this.state.counts) {
      const client = new API(this.props.config.REPORTER_URL, options)

      const period = 'daily'
      const id = 'date'

      let counts = await client.GetGlobalScanCounts(period)
      counts = (await counts.json()).items.map( item => {
        return {
          x: new Date(item[id]),
          y: item.count
        }
      })
      this.setState({counts})
    }
  }

  render() {
    this.wrapper = React.createRef()
    const margin = {
      top: 20,
      right: 20,
      bottom: 30,
      left: 50
    }

    const xTickFormatter = (t) => {
      const d = dayjs(t)
      if(d.day() === 1) {
        return d.format('YYYY/MM/DD')
      }
      else {
        return d.format('DD')
      }
    }

    return (<Jumbotron fluid ref={ (wrapper) => { this.wrapper = wrapper } }>
      {((this.state.height) && (this.state.counts)) && <chart.BarChart
        height={this.state.height}
        width={this.state.width}
        margin={margin}
        data={this.state.counts}
        xTickFormatter={xTickFormatter}
        >
        </chart.BarChart>}
    </Jumbotron>)
  }
}

export default D3
*/
