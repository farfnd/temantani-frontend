import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartPlus } from "@fortawesome/free-solid-svg-icons";
import { Badge, Button, Card, Col, Row } from "react-bootstrap";
import config from "../../../../config";
import StockBadge from "../StockBadge";

function ProductH({ product }) {
  const price = parseInt(product.price).toLocaleString("id-ID");
  let offPrice = `Rp${price}/kg`;

  return (
    <Col>
      <Card className="shadow-sm">
        <Row className="g-0">
          <Col md={4}>
            <Link to="/products/1" href="!#" replace>
              <StockBadge product={product} />
              <Card.Img
                className="rounded-start bg-dark cover w-100 h-100"
                alt=""
                src={product.image ? `${config.api.inventoryService}/images/${product.image}` : "https://via.placeholder.com/300x200?text=No+Image"}
              />
            </Link>
          </Col>
          <Col md={8}>
            <Card.Body className="h-100">
              <div className="d-flex flex-column h-100">
                <Card.Title className="text-dark text-truncate mb-1">
                  <Link to={`/store/products/${product.id}`} className="text-decoration-none text-dark" replace>
                    {product.name}
                  </Link>
                </Card.Title>
                <Card.Text className="text-muted mb-2 flex-shrink-0">
                  {offPrice}
                </Card.Text>
                <div>
                  <Link to={`/store/products/${product.id}`} className="text-decoration-none text-dark" replace>
                  <Button variant="outline-dark" className="ms-auto">
                    Detail
                  </Button>
                  </Link>
                </div>
              </div>
            </Card.Body>
          </Col>
        </Row>
      </Card>
    </Col>
  );
}

export default ProductH;
