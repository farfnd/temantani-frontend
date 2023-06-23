import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { Container, Nav, NavDropdown, Navbar } from "react-bootstrap";
import { faShoppingCart, faUserAlt } from '@fortawesome/free-solid-svg-icons'
import NavbarCollapse from "react-bootstrap/esm/NavbarCollapse";
import { UserContext } from "../../../Contexts/UserContext";

function Header() {
  const { user, fetchUserIfEmpty } = useContext(UserContext);
  const [openedDrawer, setOpenedDrawer] = useState(false)

  function toggleDrawer() {
    setOpenedDrawer(!openedDrawer);
  }

  function changeNav(event) {
    if (openedDrawer) {
      setOpenedDrawer(false)
    }
  }

  useEffect(() => {
    fetchUserIfEmpty();
  }, []);

  return (
    <header>
      <Navbar expand="lg" bg="success" fixed="top" variant="dark">
        <Container fluid>
          <Navbar.Brand>
            <Link to="/store" className="nav-link">
              TemanTani Store
            </Link>
          </Navbar.Brand>

          <NavbarCollapse className={"offcanvas-collapse " + (openedDrawer ? 'open' : '')}>
            <ul className="navbar-nav me-auto mb-lg-0">
              <li className="nav-item">
                <Link to="/store/products" className="nav-link" replace onClick={changeNav}>
                  Produk
                </Link>
              </li>
            </ul>
            {/* <button type="button" className="btn btn-outline-dark me-3 d-none d-lg-inline">
              <FontAwesomeIcon icon={faShoppingCart} />
              <span className="ms-3 badge rounded-pill bg-dark">0</span>
            </button> */}
            <Nav>
              <NavDropdown title={
                <div className="d-flex align-items-center">
                  <FontAwesomeIcon icon={faUserAlt} />
                  <span className="mx-2">{user.name}</span>
                </div>
              } id="basic-nav-dropdown" menuVariant="end">
                <NavDropdown.Item href="/store/me">Dashboard</NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item><Link to="/logout">Logout</Link></NavDropdown.Item>
              </NavDropdown>
            </Nav>
          </NavbarCollapse>

          <div className="d-inline-block d-lg-none">
            <button type="button" className="btn btn-outline-dark">
              <FontAwesomeIcon icon={faShoppingCart} />
              <span className="ms-3 badge rounded-pill bg-dark">0</span>
            </button>
            <button className="navbar-toggler p-0 border-0 ms-3" type="button" onClick={toggleDrawer}>
              <span className="navbar-toggler-icon"></span>
            </button>
          </div>
        </Container>
      </Navbar>
    </header>
  );
}

export default Header;
