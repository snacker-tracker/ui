import React, { Component, useEffect, useState } from "react";

import url from 'url'

import { Badge, Button, Container, Form, Image, Nav, Row, Col, Carousel } from "react-bootstrap"
import { NavLink } from 'react-router-dom'


import API from '../lib/API'

const BadgeLink = (props) => {
    return (
        <NavLink key={props.to} to={props.to}>
            <Badge bg={"primary"} style={{"color":"white"}}>{props.category}</Badge>
        </NavLink>
    )
}

const CodeEdit = (props) => {
    const [name, setName] = useState("")
    const [category, setCategory] = useState([])
    const [created_at, setCreatedAt] = useState()
    const [updated_at, setUpdatedAt] = useState()

    const options = {}

    console.log(props)

    if(props.auth && props.auth && props.auth.isAuthenticated) {
      options['token'] = props.auth.getTokenSilently
    }

    const client = new API(props.config.REPORTER_URL, options)

    const onNameChange = (event) => {
        setName(event.target.value)
    }

    const onCategoryChange = (event) => {
        setCategory(event.target.value.split(":"))
    }

    const submit = async () => {
        const payload = {
            name,
            categories: category
        }

        await client.PatchCode(props.match.params.code, payload)
    }


    useEffect(() => {
        (async () => {


            const code_response = await client.GetCode(props.match.params.code)
            const code = await code_response.json()

            setName(code.name)
            setCategory(code.categories)
            setCreatedAt(code.created_at)
            setUpdatedAt(code.updated_at)

        })();
    }, []);

    return (
        <Container>
            <h1>{name}</h1>
            <Row>
                <Col md="9">
                    <Form>
                        <Form.Group className="mb-3" controlId="formName">
                            <Form.Label>Name</Form.Label>
                            <Form.Control type="text" placeholder="Product Name" defaultValue={name} onChange={onNameChange} />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formCategories">
                            <Form.Label>Category</Form.Label>
                            <Form.Control type="text" placeholder="Category" defaultValue={category.join(":")} onChange={onCategoryChange}/>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="createdAt">
                          <Form.Label>Created At</Form.Label>
                          <Form.Control placeholder={created_at} disabled />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="updatedAt">
                          <Form.Label>Updated At</Form.Label>
                          <Form.Control placeholder={updated_at} disabled />
                        </Form.Group>


                        <Button variant="primary" onClick={submit}>
                            Save
                        </Button>
                    </Form>
                </Col>
            </Row>
        </Container>
    )

}

export default CodeEdit
