import React from "react";
import { Badge } from "react-bootstrap";

const StockBadge = ({ product }) => {
    const dateOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    const date = product.preOrderEstimatedDate ? new Date(product.preOrderEstimatedDate).toLocaleDateString('id-id', dateOptions) : 'N/A';

    if (product.stock && product.stock > 0) {
        return (
            <Badge bg="success" className="position-absolute" style={{ top: "0.5rem", right: "0.5rem" }}>
                {product.stock} kg
            </Badge>
        );
    } else if (product.status === 'PREORDER') {
        return (
            <Badge bg="info" className="position-absolute" style={{ top: "0.5rem", right: "0.5rem" }}>
                Pre-order<br />est. {date}
            </Badge>
        );
    } else {
        return (
            <Badge bg="danger" className="position-absolute" style={{ top: "0.5rem", right: "0.5rem" }}>
                Stok habis
            </Badge>
        );
    }
};

export default StockBadge;
