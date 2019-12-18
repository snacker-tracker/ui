import React, { Component } from "react";

//import Loading from "../components/Loading";

import { Container, Image } from "react-bootstrap";

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

    const tokenProvider = this.props.auth.getTokenSilently

    const client = new API(this.props.config.REPORTER_URL, {token: tokenProvider})


    const code_response = await client.GetCode(this.props.match.params.code)
    const code = await code_response.json()

    const pictures_response = await client.GetCodePictures(this.props.match.params.code)
    const pictures = await pictures_response.json()

    this.setState({code, pictures: pictures.items})
  }

  render() {
    return (
      <Container>
        <pre>
        {this.state.code && (JSON.stringify(this.state, null, 2))}
        </pre>

        {this.state.pictures.map( p => {
          return (
            <Image src={p.url} rounded />
          )
        })}
      </Container>
    )
  }
}

export default CodeDetails
