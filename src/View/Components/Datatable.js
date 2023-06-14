import React from 'react';
import { Row, Col, Table } from 'react-bootstrap';
import {
    DatatableWrapper,
    Filter,
    Pagination,
    PaginationOptions,
    TableBody,
    TableHeader
} from 'react-bs-datatable';

const Datatable = ({ data, headers }) => {
    return (
        <DatatableWrapper
            body={data}
            headers={headers}
            paginationOptionsProps={{
                initialState: {
                    rowsPerPage: 10,
                    options: [5, 10, 15, 20]
                }
            }}
        >
            <Row className="mb-4 p-2">
                <Col xs={12} lg={4} className="d-flex flex-col justify-content-end align-items-end">
                    <Filter />
                </Col>
                <Col xs={12} sm={6} lg={4} className="d-flex flex-col justify-content-lg-center align-items-center justify-content-sm-start mb-2 mb-sm-0">
                    <PaginationOptions />
                </Col>
                <Col xs={12} sm={6} lg={4} className="d-flex flex-col justify-content-end align-items-end">
                    <Pagination />
                </Col>
            </Row>
            <Table>
                <TableHeader />
                <TableBody />
            </Table>
        </DatatableWrapper>
    );
};

export default Datatable;
