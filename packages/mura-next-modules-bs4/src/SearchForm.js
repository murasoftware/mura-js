import React, { useState } from "react";
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Button from 'react-bootstrap/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch } from '@fortawesome/free-solid-svg-icons'

function SearchForm(props) {
    return (

        <Form method="get" id="searchForm" className="form-inline ml-5" role="search" action="/search-results" key="siteSearch">
            <InputGroup className="">
                <Form.Control
                placeholder="Search"
                aria-label="Search"
                aria-describedby="Search"
                name="q"
                type="text"
                />
                <InputGroup.Append>
                    <Button variant="light" type="submit"><FontAwesomeIcon icon={faSearch} size="lg" /></Button>
                </InputGroup.Append>
            </InputGroup>
        </Form>
    )    

}

export default SearchForm;