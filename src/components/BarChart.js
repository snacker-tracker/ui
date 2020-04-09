import React, { Fragment } from 'react'
import d3tip from 'd3-tip'

const d3 = Object.assign({}, require("d3-format"), require("d3-scale"), require("d3-axis"), require('d3-selection'), require('d3-array'))

/*
  <Graph>
    <Axis x></Axis>
    <Axis y></Axis>
    <Series points={} as=<Bar> />
    <Series points={} as=<Bar> />
  </Graph>
*/


/*
const ChartContext = React.createContext({
  svg: false,
  x: false,
  y: false,
  setContext(thing, value) {
    console.log(thing, value, this)
  }
})
*/


class BarChart extends React.Component {
  render() {
    return (<Fragment>
      <svg ref={ (graph) => { this.graph = graph } } height={this.props.height} width={this.props.width}>
      </svg>
    </Fragment>
    )
  }

  componentDidMount() {
    const svg = d3.select(this.graph)

    const x = d3.scaleBand()
    x.domain(
      this.props.data.map( d => {
        return d.x
      })
    )

    const y = d3.scaleLinear()
    y.domain([ 0,
      d3.max(this.props.data, (d) => {
        return Number(d.y)
      })
    ])


    const margin = this.props.margin
    const width = parseInt(this.props.width) - margin.left - margin.right
    const height = parseInt(this.props.height) - margin.top - margin.bottom

    this.width = width
    this.height = height

    this.setState({svg, width, height})

    const g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")")

    x.rangeRound([0, width])
      .padding(0.1)

    y.rangeRound([height, 0])

    const xAxis = d3.axisBottom(x)
    xAxis.tickFormat(this.props.xTickFormatter)
    g.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)

    const yAxis = d3.axisLeft(y)
    g.append("g")
      .call(yAxis)
      .append("text")
      .attr("fill", "#000")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", "0.71em")
      .attr("text-anchor", "end")
      .text("Speed")


    const tooltip = d3tip()
      .attr('class', 'd3-tip')
      .offset([-10, 0])
      .html(function(d) {
        return "<span style='color:red'>" + d.y + "</span>";
      })

    g.call(tooltip)

    g.selectAll(".bar")
      .data(this.props.data)
      .enter().append("rect")
      .attr("class", "bar")
      .attr("x", (d) => {
        return x(d.x)
      })
      .attr("y", (d) => {
        return y(Number(d.y))
      })
      .attr("width", x.bandwidth())
      .attr("height", (d) => {
        return height - y(Number(d.y))
      })
      .on('mouseover', tooltip.show)
      .on('mouseout', tooltip.hide)
  }
}

/*
├─ d3-array@1.2.4
├─ d3-axis@1.0.12
├─ d3-brush@1.1.5
├─ d3-chord@1.0.6
├─ d3-contour@1.3.2
├─ d3-fetch@1.1.2
├─ d3-force@1.2.1
├─ d3-geo@1.11.9
├─ d3-hierarchy@1.1.9
├─ d3-polygon@1.0.6
├─ d3-random@1.1.2
├─ d3-scale-chromatic@1.5.0
├─ d3-scale@2.2.2
├─ d3-shape@1.3.7
├─ d3-zoom@1.8.3
├─ d3@5.15.0
└─ rw@1.3.3
*/


export {
  BarChart
}
