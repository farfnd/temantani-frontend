import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartPlus, faEye } from "@fortawesome/free-solid-svg-icons";
import config from "../../../../config";
import { Badge, Button, Card, Col } from "react-bootstrap";
import StockBadge from "../StockBadge";

function Product({ product }) {
  const price = parseInt(product.price).toLocaleString("id-ID");
  let offPrice = `Rp${price}/kg`;

  return (
    <Col>
      <Card className="shadow-sm">
        <Link to={`/store/products/${product.id}`} href="!#" replace>
          <StockBadge product={product} />
          <Card.Img
            variant="top"
            className="bg-dark cover"
            height="200"
            alt=""
            src={product.image ? `${config.api.inventoryService}/products/${product.id}/image` : "https://via.placeholder.com/300x200?text=No+Image"}
          />
        </Link>
        <Card.Body>
          <Card.Title className="text-center text-dark text-truncate">
            <Link to={`/store/products/${product.id}`} className="text-decoration-none text-dark" replace>
              {product.name || "N/A"}
            </Link>
          </Card.Title>
          <Card.Text className="card-text text-center text-muted mb-0">
            {offPrice}
          </Card.Text>
          <div className="d-grid d-block">
            {product.status !== 'NOT_AVAILABLE' && (
              <Button variant="outline-dark" className="mt-3">
                <Link to={`/store/products/${product.id}`} className="text-decoration-none text-dark" replace>
                  Detail
                </Link>
              </Button>
            )}
          </div>
        </Card.Body>
      </Card>
    </Col>
  );
}

export default Product;
