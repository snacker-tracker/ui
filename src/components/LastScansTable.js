import React, { Component } from "react";

import { Row, Col } from "react-bootstrap";


class LastScansTable extends Component {
  render() {
    return (
        <Row className="d-flex justify-content-between">
          {contentData.map((col, i) => (
            <Col key={i} md={5} className="mb-4">
              <h6 className="mb-3">
                <a href={col.link}>
                  {col.title}
                </a>
              </h6>
              <p>{col.description}</p>
            </Col>
          ))}
        </Row>
    );
  }
}

export default LastScansTable;
