import React, { Component } from "react";

//import Loading from "../components/Loading";

import { Container } from "react-bootstrap";

import API from '../lib/API'

class CodeDetails extends Component {
  constructor(props) {
    super(props)

    this.state = {
      code: false
    }
  }
  async componentDidMount() {

    const tokenProvider = this.props.auth.getTokenSilently

    const client = new API(this.props.config.REPORTER_URL, {token: tokenProvider})


    const response = await client.GetCode(this.props.match.params.code)
    const code = await response.json()

    this.setState({code})
  }

  render() {
    return (
      <Container>
        <pre>
        {this.state.code && (JSON.stringify(this.state.code, null, 2))}
        </pre>
      </Container>
    )
  }
}

export default CodeDetails
