import React from "react";
import logo from './logo.svg';
import './App.css';
import dayjs from 'dayjs'

import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Nav from 'react-bootstrap/Nav'

import Button from 'react-bootstrap/Button'
import Figure from 'react-bootstrap/Figure'

import Table from 'react-bootstrap/Table'

import { LinkContainer } from 'react-router-bootstrap'

import InputGroup from 'react-bootstrap/InputGroup'
import FormControl from 'react-bootstrap/FormControl'

import { Chart } from 'react-charts'

import { useAuth0 } from "./react-auth0-spa"

//import Profile from './profile'


import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";

const REPORTER_URL = window.location.href.includes('prod') ? 'https://reporter.snacker-tracker.prod.k8s.fscker.org' : 'https://reporter.snacker-tracker.qa.k8s.fscker.org'





const LoginThing = () => {
  const { isAuthenticated, loginWithPopup, logout } = useAuth0();

  console.log(isAuthenticated, loginWithPopup)

  return (
    <div>
      {!isAuthenticated && (
        <button onClick={() => loginWithPopup({})}>Log in</button>
      )}

      {isAuthenticated && <button onClick={() => logout()}>Log out</button>}
    </div>
  );
};



class DataTable extends React.Component {
  constructor(sources, columns) {
    super()

    this.state = {
      items: []
    }

    this.columns = columns
    this.sources = sources
  }

  async componentDidMount() {
    await this.load()
  }

  rows() {
    let i = 0
    if(!this.state.items) {
      return (<tr></tr>)
    }

    console.log('state', this.state)
    let items = this.state.items.map((item) => {
      i++

      const columns = Object.entries(this.columns).map( (column) => {
        return column[1](i, item)
      }).map( c => {
        return (<td>{c}</td>)
      })

      return (
        <tr key={i}>
          {columns}
        </tr>
      )
    })

    return items
  }

  header() {
    const headers = Object.keys(this.columns).map( key => {
      return (<th>{key}</th>)
    })
    return (
      <tr>
        {headers}
      </tr>
    )
  }

  async load() {
    let stuff = {}
    for(let source in this.sources) {
      const request = await fetch(this.sources[source])
      const data = await request.json()

      stuff[source] = data
    }

    stuff = await this.post_load(stuff)
    this.setState(stuff)

  }

  async post_load(data) {
    return data
  }

  render() {
    return (
      <Table striped bordered hover size="sm">
        <thead>
          {this.header()}
        </thead>
        <tbody>
          {this.rows()}
        </tbody>
      </Table>
    )
  }

}

class TopScansTable extends DataTable {
  sources = {
    items: [REPORTER_URL, 'v1/stats/top-scans'].join('/')
  }

  columns = {
    count: (i, item) => { return item.count },
    code: (i, item) => { return <LinkContainer to={"/codes/" + item.code}><a>{item.code}</a></LinkContainer> },
    name: (i, item) => { return item.product && item.product.name ? item.product.name : "UNKNOWN" },
    first: (i, item) => { return dayjs(item.first_scan).format("YYYY/MM/DD HH:mm:ss") },
    last: (i, item) => { return dayjs(item.last_scan).format("YYYY/MM/DD HH:mm:ss") }
  }

  post_load(data) {
    data.items = data.items.items
    return data
  }

}


class ProductDetailsPane extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      product: {}
    }
  }
  async componentDidMount() {

    const request = await fetch([REPORTER_URL, 'v1/codes', this.props.match.params.code].join('/'))

    if(request.status === 404) {
      this.setState({
        product: {},
        method: 'CreateCode'
      })
    } else {
      this.setState({
        product: await request.json(),
        method: 'PatchCode'
      })
    }

  }

  handleChange(event) {
    const field = event.target.name
    const thing = this.state.product
    thing[field] = event.target.value

    this.setState({product: thing})
  }

  render() {
    return (
      <Container>
        <Row>
          <Col>
            <h1>{ this.props.match.params.code } | { this.state.product && this.state.product.name}</h1>
          </Col>
        </Row>
        <Row>
          <Col lg="2">
            <Figure>
              <Figure.Image
                width={171}
                height={180}
                alt="171x180"
                src="https://d29pz51ispcyrv.cloudfront.net/images/I/gbuvuvr6A0ybxm3rW.MD256.JPEG"
              />
            </Figure>
          </Col>
          <Col>
            <InputGroup className="mb-3">
              <InputGroup.Prepend>
                <InputGroup.Text id="basic-addon1">Name</InputGroup.Text>
              </InputGroup.Prepend>
              <FormControl
                name="name"
                type="text"
                placeholder="Name"
                aria-label="Name"
                aria-describedby="basic-addon1"
                value={this.state.product && this.state.product.name}
                onChange={(e) => { this.handleChange(e) }}
              />
            </InputGroup>

            <InputGroup className="mb-3">
              <InputGroup.Prepend>
                <InputGroup.Text id="basic-addon1">Brand</InputGroup.Text>
              </InputGroup.Prepend>
              <FormControl
                type="text"
                name="brand"
                placeholder="Brand"
                aria-label="Brand"
                aria-describedby="basic-addon1"
                value={this.state.product && this.state.product.brand}
                onChange={(e) => { this.handleChange(e) }}

              />
            </InputGroup>

            <InputGroup className="mb-3">
              <InputGroup.Prepend>
                <InputGroup.Text id="basic-addon1">Quantity</InputGroup.Text>
              </InputGroup.Prepend>
              <FormControl
                type="text"
                name="quantity"

                placeholder="Quantity"
                aria-label="Quantity"
                aria-describedby="basic-addon1"
                value={this.state.product && this.state.product.quantity}
                onChange={(e) => { this.handleChange(e) }}
              />
            </InputGroup>

            <InputGroup className="mb-3">
              <InputGroup.Prepend>
                <InputGroup.Text id="basic-addon1">Url</InputGroup.Text>
              </InputGroup.Prepend>
              <FormControl
                type="text"
                name="url"

                placeholder="Url"
                aria-label="Url"
                aria-describedby="basic-addon1"
                value={this.state.product && this.state.product.url}
                onChange={(e) => { this.handleChange(e) }}
              />
            </InputGroup>
          </Col>
        </Row>
        <Row>
          <Col lg="11">
          </Col>
          <Col lg="1">
            <Button>{this.state.method === 'CreateCode' ? 'Create' : 'Save' }</Button>
          </Col>
        </Row>
        <pre>
          { JSON.stringify(this.state, null, 2) }
        </pre>
      </Container>
    )
  }
}

class LatestScansTable extends DataTable {
  sources = {
    items: [REPORTER_URL, 'v1/scans'].join('/'),
    codes: [REPORTER_URL, 'v1/codes'].join('/')
  }

  columns = {
    key: (i, item) => { return i },
    code: (i, item) => { return <LinkContainer to={"/codes/" + item.code}><a>{item.code}</a></LinkContainer> },
    name: (i, item) => { return this.state.codes && this.state.codes[item.code] ? this.state.codes[item.code].name : "UNKNOWN" },
    scanned_at: (i, item) => { return dayjs(item.scanned_at).format("YYYY/MM/DD HH:mm:ss") }
  }

  post_load(data) {
    let hash = {}
    for(let o of data.codes.items) {
      hash[o.code] = o
    }

    data.codes = hash
    data.items = data.items.items

    return data
  }

}

class GraphsPane extends React.Component {
  render() {
    return (<LineChart />)
  }
}

function App() {
  // <img src={logo} className="App-logo" alt="logo" />
  return (
    <Container className="App">
      <Row>
        <Col lg="2">
          <Nav defaultActiveKey="/latest-scans" className="flex-column">
            <Nav.Link href="/latest-scans">Latest Scans</Nav.Link>
            <Nav.Link href="/top-scans">Top Scans</Nav.Link>
            <Nav.Link href="/">Graphs</Nav.Link>
            <LoginThing />
          </Nav>
        </Col>

        <Col lg="10">
          <Router>
           <Switch>
              <Route path="/latest-scans" exact>
                <LatestScansTable />
              </Route>
              <Route path="/top-scans" exact>
                <TopScansTable />
              </Route>
              <Route path="/" exact>
                <GraphsPane />
              </Route>
              <Route path="/codes/:code" render={(props) => <ProductDetailsPane {...props} /> }>
              </Route>
            </Switch>
          </Router>
        </Col>
      </Row>
    </Container>
  );
}

class LineChart extends React.Component {
  async componentDidMount() {
    const url = [REPORTER_URL, 'v1/scans?limit=1500'].join('/')
    const request = await fetch(url)
    const data = await request.json()

    console.log(data)

    const dates = {}

    const d = data.items
      .map( s => { return dayjs(s.scanned_at).format('YYYY/MM/DD') } )
      .reduce( (acc, cur) => {
        if(!acc[cur]) {
          acc[cur] = 1
        } else {
          acc[cur]++
        }

        return acc
      }, {})

    console.log(Object.entries(d))

    let data2 = []

    let entries = Object.entries(d).reverse()
    for(let k in entries) {
      data2.push([dayjs(entries[k][0]), entries[k][1]])
    }


    console.log('d2', data2)


    let res = this.setState({
      data: [
        {
          label: 'Series 1',
          //data: [[0, 1], [1, 2], [2, 4], [3, 2], [4, 7]]
          data: data2
        }
      ],
      axes: [
        { primary: true, type: 'time', position: 'bottom' },
        { type: 'linear', position: 'left' }
      ]
    })
  }

  render() {
    if(this.state && Object.keys(this.state).length > 0) {
      return (
        <div
          style={{
            width: '95%',
            height: '400px'
          }}
        >
          <Chart data={this.state['data']} axes={this.state['axes']} series={{type: 'bar'}} tooltip />
        </div>
      )

    } else {
      return (<span></span>)
    }
  }
}

export default App;
