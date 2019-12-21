import React, { Component } from "react";

//import Loading from "../components/Loading";

import { Container, Image, Row, Col } from "react-bootstrap";

import API from '../lib/API'

class CodeDetails extends Component {
  constructor(props) {
    super(props)

    this.state = {
      code: false,
      pictures: []
    }
  }
  async componentDidMount() {
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
              ...
            </Container>
          </Col>
        </Row>

        <pre>
        </pre>

      </Container>
    )
  }
}

export default CodeDetails
