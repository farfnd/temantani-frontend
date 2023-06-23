import { Link } from "react-router-dom";
import config from "../../../../config";
import { Card, Col } from "react-bootstrap";

const FeatureProduct = ({ product }) => {
  return (
    <Col>
      <Card className="shadow-sm">
        <Card.Img variant="top"
          className="cover"
          height="240"
          alt=""
          src={product.image ? `${config.api.inventoryService}/images/${product.image}` : "https://via.placeholder.com/300x240?text=No+Image"}
        />
        <Card.Body>
          <Card.Title className="text-center">{product.name ?? "N/A"}</Card.Title>
          <Card.Text className="text-center text-muted">Rp{product.price ?? "N/A"}/kg</Card.Text>
          <div className="d-grid gap-2">
            <Link to={`/store/products/${product.id}`} className="btn btn-outline-dark" replace>
              Detail
            </Link>
          </div>
        </Card.Body>
      </Card>
    </Col>
  );
}

export default FeatureProduct;
