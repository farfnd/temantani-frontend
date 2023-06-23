import Banner from "../../Components/Store/Landing/Banner";
import FeatureProduct from "../../Components/Store/Landing/FeatureProduct";
import ScrollToTopOnMount from "../../Components/Store/ScrollToTopOnMount";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import config from "../../../config";
import { Spin } from "antd";
import { Spinner } from "react-bootstrap";

const Landing = () => {
  const [products, setProducts] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const inventoryResponse = await fetch(`${config.api.inventoryService}/products`);
      const inventoryData = await inventoryResponse.json();
      const inventoryProducts = inventoryData.filter(
        (product) => product.status === "AVAILABLE" || product.status === "PREORDER"
      );
      setProducts(inventoryProducts);
    } catch (error) {
      console.log("Failed to fetch products from inventory service. Fetching from order service instead.");

      try {
        await fetchProductsFromOrderService();
      } catch (error) {
        console.log("Failed to fetch products from order service as well.");
        // Handle the error or set default placeholder data
        setProducts([]);
      }
    }
  };

  const fetchProductsFromOrderService = async () => {
    try {
      const orderResponse = await fetch(`${config.api.orderService}/products`);
      const orderData = await orderResponse.json();
      const orderProducts = orderData.filter(
        (product) => product.status === "AVAILABLE" || product.status === "PREORDER"
      );
      setProducts(orderProducts);
    } catch (error) {
      console.log("Failed to fetch products from order service.");
      // Handle the error or set default placeholder data
      setProducts([]);
    }
  };

  return (
    <>
      <ScrollToTopOnMount />
      <Banner />
      <div className="d-flex flex-column bg-white py-4">
        <p className="text-center px-5">
          TemanTani menyediakan berbagai macam produk pertanian yang berkualitas dan terjamin keasliannya dengan harga yang terjangkau.
        </p>
        <div className="d-flex justify-content-center">
          <Link to="/store/products" className="btn btn-primary" replace>
            Lihat Semua Produk
          </Link>
        </div>
      </div>
      <h2 className="text-muted text-center mt-4 mb-3">Produk Unggulan</h2>
      <div className="container pb-5 px-lg-5">
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4 px-md-5">
          {
            products ? products.slice(0, 3).map((product) => (
              <FeatureProduct
                key={product.id ?? "N/A"}
                product={product}
              />
            )) : (
              <div className="d-flex justify-content-center align-items-center w-100 h-100">
                <Spinner animation="border" variant="primary" />
              </div>
            )
          }
        </div>
      </div>
    </>
  );
}

export default Landing;
