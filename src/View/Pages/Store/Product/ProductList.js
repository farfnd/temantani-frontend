import { Link } from "react-router-dom";
import Product from "../../../Components/Store/Product/Product";
import ProductH from "../../../Components/Store/Product/ProductH";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ScrollToTopOnMount from "../../../Components/Store/ScrollToTopOnMount";
import { faHouse, faSearch, faThLarge, faThList } from "@fortawesome/free-solid-svg-icons";
import { Form, Pagination, Spinner } from "react-bootstrap";
import config from "../../../../config";
import { message } from "antd";

function FilterMenuLeft({ minPrice, maxPrice, handleMinPriceChange, handleMaxPriceChange, handleFilterApply }) {
  return (
    <ul className="list-group list-group-flush rounded">
      <li className="list-group-item">
        <h5 className="mt-1 mb-2">Rentang Harga</h5>
        <div className="d-grid d-block mb-3">
          <div className="form-floating mb-2">
            <input
              type="text"
              className="form-control"
              placeholder="Min"
              value={minPrice}
              onChange={handleMinPriceChange}
            />
            <label htmlFor="floatingInput">Minimal</label>
          </div>
          <div className="form-floating mb-2">
            <input
              type="text"
              className="form-control"
              placeholder="Max"
              value={maxPrice}
              onChange={handleMaxPriceChange}
            />
            <label htmlFor="floatingInput">Maksimal</label>
          </div>
          <button className="btn btn-dark" onClick={handleFilterApply}>
            Apply
          </button>
        </div>
      </li>
    </ul>
  );
}

function ProductList() {
  const [viewType, setViewType] = useState({ grid: true });
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [products, setProducts] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  function changeViewType() {
    setViewType({
      grid: !viewType.grid,
    });
  }

  useEffect(() => {
    fetchProducts();
  }, []);

  
  useEffect(() => {
    if (products && products.length > 0) {
      const prices = products.map((product) => product.price);
      const min = Math.min(...prices);
      const max = Math.max(...prices);
      setMinPrice(min.toString());
      setMaxPrice(max.toString());
    }
  }, [products]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${config.api.inventoryService}/products`);
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error(error);
      message.error('Error fetching products from inventory service');
      await fetchProductsFromOrderService();
    } finally {
      setLoading(false);
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
      setProducts([]);
    }
  };

  const filteredProducts = searchQuery
    ? products.filter((product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
    : products;

  const priceFilteredProducts = filteredProducts
    ? filteredProducts.filter(
      (product) =>
        product.price >= parseFloat(minPrice) &&
        product.price <= parseFloat(maxPrice)
    )
    : [];

  // Get current products
  const indexLast = currentPage * perPage;
  const indexFirst = indexLast - perPage;
  const currentProducts = priceFilteredProducts
    ? priceFilteredProducts.slice(indexFirst, indexLast)
    : [];

  // Change page
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleChangePerPage = (value) => {
    setPerPage(value);
    setCurrentPage(1);
  };

  const handleMinPriceChange = (e) => {
    setMinPrice(e.target.value);
  };

  const handleMaxPriceChange = (e) => {
    setMaxPrice(e.target.value);
  };

  const handleFilterApply = () => {
    if (minPrice === "" && maxPrice === "") {
      setProducts(filteredProducts);
    } else if (minPrice === "") {
      setProducts(
        filteredProducts.filter((product) => product.price <= parseFloat(maxPrice))
      );
    } else if (maxPrice === "") {
      setProducts(
        filteredProducts.filter((product) => product.price >= parseFloat(minPrice))
      );
    } else {
      setProducts(
        filteredProducts.filter(
          (product) =>
            product.price >= parseFloat(minPrice) &&
            product.price <= parseFloat(maxPrice)
        )
      );
    }
  };
  

  return (
    <div className="container mt-5 py-4 px-xl-5">
      <ScrollToTopOnMount />
      <nav aria-label="breadcrumb" className="bg-custom-light rounded">
        <ol className="breadcrumb p-3 mb-0">
          <li className="breadcrumb-item">
            <Link
              className="text-decoration-none"
              to="/store"
              replace
            >
              <FontAwesomeIcon icon={faHouse} />
            </Link>
          </li>
          <li className="breadcrumb-item active" aria-current="page">
            Daftar Produk
          </li>
        </ol>
      </nav>

      <div className="row mb-4 mt-lg-3">
        <div className="d-none d-lg-block col-lg-3">
          <div className="border rounded shadow-sm">
            <FilterMenuLeft
              minPrice={minPrice}
              maxPrice={maxPrice}
              handleMinPriceChange={handleMinPriceChange}
              handleMaxPriceChange={handleMaxPriceChange}
              handleFilterApply={handleFilterApply}
            />
          </div>
        </div>
        <div className="col-lg-9">
          <div className="d-flex flex-column h-100">
            <div className="row mb-3">
              <div className="col-lg-12 d-flex flex-row">
                <div className="input-group">
                  <input
                    className="form-control"
                    type="text"
                    placeholder="Cari produk"
                    aria-label="search input"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <button className="btn btn-outline-dark">
                    <FontAwesomeIcon icon={faSearch} />
                  </button>
                </div>
                <button
                  className="btn btn-outline-dark ms-2 d-none d-lg-inline"
                  onClick={changeViewType}
                >
                  <FontAwesomeIcon
                    icon={viewType.grid ? faThList : faThLarge}
                  />
                </button>
              </div>
            </div>
            {
              loading ?
                (
                  <div className="d-flex justify-content-center align-items-center w-100 h-100">
                    <Spinner animation="border" variant="primary" />
                  </div>
                ) : (
                  <>
                    <div
                      className={
                        "row row-cols-1 row-cols-md-2 row-cols-lg-2 g-3 mb-4 flex-shrink-0 " +
                        (viewType.grid ? "row-cols-xl-3" : "row-cols-xl-2")
                      }
                    >
                      {
                        currentProducts
                          ? currentProducts.map((product, i) => (
                            viewType.grid ? (
                              <Product key={i} product={product} />
                            ) : (
                              <ProductH key={i} product={product} />
                            )
                          ))
                          : (
                            <div className="d-flex justify-content-center align-items-center w-100 h-100">
                              <Spinner animation="border" variant="primary" />
                            </div>
                          )
                      }

                    </div>
                    <div className="d-flex justify-content-between mt-3">
                      <div>
                        <Pagination>
                          <Pagination.Prev
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                          />
                          {Array.from(Array(Math.ceil(products.length / perPage)).keys()).map((page) => (
                            <Pagination.Item
                              key={page + 1}
                              active={page + 1 === currentPage}
                              onClick={() => handlePageChange(page + 1)}
                            >
                              {page + 1}
                            </Pagination.Item>
                          ))}
                          <Pagination.Next
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === Math.ceil(products.length / perPage)}
                          />
                        </Pagination>
                      </div>
                      <div>
                        <Form.Label className="me-2">
                          Items per page:
                        </Form.Label>
                        <Form.Select
                          value={perPage}
                          onChange={(e) => handleChangePerPage(e.target.value)}
                        >
                          <option value="10">10</option>
                          <option value="25">25</option>
                          <option value="50">50</option>
                        </Form.Select>
                      </div>
                    </div>
                  </>
                )
            }
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductList;
