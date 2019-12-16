import React from "react";
import { Container, Row, Col } from "react-bootstrap";

import Loading from "../components/Loading";
import { useAuth0 } from "../react-auth0-spa";

const Profile = () => {
  const { loading, user, getTokenSilently } = useAuth0();


  if (loading || !user) {
    return <Loading />;
  }

  (async () => {
    const token = await getTokenSilently()
    await fetch('https://reporter.snacker-tracker.qa.k8s.fscker.org/v1/scans',
      {
        headers: {
          Authorization: `Bearer: ${token}`
        }
      }
    )
  })()


  return (
    <Container className="mb-5">
      <Row className="align-items-center profile-header mb-5 text-center text-md-left">
        <Col md={2}>
          <img
            src={user.picture}
            alt="Profile"
            className="rounded-circle img-fluid profile-picture mb-3 mb-md-0"
          />
        </Col>
        <Col md>
          <h2>{user.name}</h2>
          <p className="lead text-muted">{user.email}</p>
        </Col>
      </Row>
      <Row>
        <pre>{JSON.stringify(user, null, 2)}</pre>
      </Row>
    </Container>
  );
};

export default Profile;
