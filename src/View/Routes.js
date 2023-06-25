import React, { useContext } from "react";
import { Switch, Route, Redirect, useHistory } from "react-router-dom";
import { ProductsContext, ProductsProvider } from "../Contexts/ProductsContext";
import { OrdersProvider } from "../Contexts/OrdersContext";
import { UserContext } from "../Contexts/UserContext";
import Cookies from "js-cookie";
import { message } from "antd";

import AuthLayout from "./Components/AuthLayout";
import AdminLayout from "./Components/AdminLayout";
import WorkerLayout from "./Components/WorkerLayout";
import StoreLayout from "./Components/StoreLayout";
import Home from "./Pages/Home";
import Login from "./Pages/Auth/Login"
import Register from "./Pages/Auth/Register";
import ChangePassword from "./Pages/Auth/ChangePassword";
import AdminDashboard from "./Pages/Admin/Dashboard";
import HiringProjectList from "./Pages/Admin/Project/Hiring/ProjectList";
import HiringProjectDetail from "./Pages/Admin/Project/Hiring/ProjectDetail";
import OngoingProjectList from "./Pages/Admin/Project/Ongoing/ProjectList";
import OngoingProjectDetail from "./Pages/Admin/Project/Ongoing/ProjectDetail";
import ProductList from "./Pages/Admin/Inventory/ProductList";
import ProductForm from "./Pages/Admin/Inventory/ProductForm";
import OrderList from "./Pages/Admin/Order/OrderList";
import WorkerDashboard from "./Pages/Worker/Dashboard";
import WorkerProfile from "./Pages/Worker/Profile/Show";
import WorkerProfileEdit from "./Pages/Worker/Profile/Edit";
import WorkerWorkDetailEdit from "./Pages/Worker/Profile/EditWork";
import WorkerBankAccount from "./Pages/Worker/BankAccount/Show";
import WorkerBankAccountEdit from "./Pages/Worker/BankAccount/Edit";
import WorkerProjectDashboard from "./Pages/Worker/Project/Dashboard";
import WorkerProjectHistory from "./Pages/Worker/Project/ProjectHistory";
import WorkerProjectOffers from "./Pages/Worker/Project/Offer";
import WorkerProjectDetail from "./Pages/Worker/Project/Detail";
import StoreLanding from "./Pages/Store/Landing";
import StoreProductList from "./Pages/Store/Product/ProductList";
import StoreProductDetail from "./Pages/Store/Product/ProductDetail";
import StoreBuyerDashboard from "./Pages/Store/Buyer/Orders";
import StoreBuyerAddresses from "./Pages/Store/Buyer/Addresses";
import ConfirmOrder from "./Pages/Store/Product/ConfirmOrder";
import Invoice from "./Pages/Store/Invoice";

const Routes = () => {
  const { user, setLoginStatus, setUser } = useContext(UserContext);
  const history = useHistory();

  const logout = () => {
    Cookies.remove('token');
    setUser({});
    setLoginStatus(false);
    history.push('/');
  };

  const NotLoggedInRoute = ({ ...props }) => {
    if (Cookies.get('token') === undefined) {
      return <Route {...props} />;
    } else {
      return <Redirect to="/" />;
    }
  };

  const LoggedInRoute = ({ ...props }) => {
    if (Cookies.get('token') !== undefined) {
      return <Route {...props} />;
    } else {
      message.error("You need to login first");
      return <Redirect to="/" />;
    }
  };

  return (
    <>
      <OrdersProvider>
        <ProductsProvider>
          <Switch>
            <Route path="/" exact>
              <AuthLayout body={<Home />} />
            </Route>

            <NotLoggedInRoute exact path="/login">
              <AuthLayout body={<Login />} />
            </NotLoggedInRoute>

            <NotLoggedInRoute exact path="/register">
              <AuthLayout body={<Register />} />
            </NotLoggedInRoute>

            <Route path="/admin" exact>
              <AdminLayout body={<AdminDashboard />} />
            </Route>

            <Route path="/admin/projects/hiring" exact>
              <AdminLayout body={<HiringProjectList />} />
            </Route>

            <Route path="/admin/projects/hiring/:id" exact>
              <AdminLayout body={<HiringProjectDetail />} />
            </Route>

            <Route path="/admin/projects/ongoing" exact>
              <AdminLayout body={<OngoingProjectList />} />
            </Route>

            <Route path="/admin/projects/ongoing/:id" exact>
              <AdminLayout body={<OngoingProjectDetail />} />
            </Route>

            <Route path="/admin/products" exact>
              <AdminLayout body={<ProductList />} />
            </Route>

            <Route path="/admin/products/create" exact>
              <AdminLayout body={<ProductForm />} />
            </Route>

            <Route path="/admin/products/:id/edit" exact>
              <AdminLayout body={<ProductForm />} />
            </Route>

            <Route path="/admin/orders" exact>
              <AdminLayout body={<OrderList />} />
            </Route>

            <Route path="/worker" exact>
              <WorkerLayout body={<WorkerDashboard />} />
            </Route>

            <Route path="/worker/profile" exact>
              <WorkerLayout body={<WorkerProfile />} />
            </Route>

            <Route path="/worker/profile/edit" exact>
              <WorkerLayout body={<WorkerProfileEdit />} />
            </Route>

            <Route path="/worker/work-details/edit" exact>
              <WorkerLayout body={<WorkerWorkDetailEdit />} />
            </Route>

            <Route path="/worker/bank-account" exact>
              <WorkerLayout body={<WorkerBankAccount />} />
            </Route>

            <Route path="/worker/bank-account/edit" exact>
              <WorkerLayout body={<WorkerBankAccountEdit />} />
            </Route>

            <Route path="/worker/projects" exact>
              <WorkerLayout body={<WorkerProjectDashboard />} />
            </Route>

            <Route path="/worker/projects/active" exact>
              <WorkerLayout body={<WorkerProjectDashboard />} />
            </Route>

            <Route path="/worker/projects/history" exact>
              <WorkerLayout body={<WorkerProjectHistory />} />
            </Route>

            <Route path="/worker/projects/offers" exact>
              <WorkerLayout body={<WorkerProjectOffers />} />
            </Route>

            <Route path="/worker/projects/history/:id" exact>
              <WorkerLayout body={<WorkerProjectDetail />} />
            </Route>

            <Route path="/store" exact>
              <StoreLayout body={<StoreLanding />} />
            </Route>

            <Route path="/store/products" exact>
              <StoreLayout body={<StoreProductList />} />
            </Route>

            <Route path="/store/products/:id" exact>
              <StoreLayout body={<StoreProductDetail />} />
            </Route>

            <Route path="/store/me" exact>
              <StoreLayout body={<StoreBuyerDashboard />} />
            </Route>

            <Route path="/store/me/orders" exact>
              <StoreLayout body={<StoreBuyerDashboard />} />
            </Route>

            <Route path="/store/me/addresses" exact>
              <StoreLayout body={<StoreBuyerAddresses />} />
            </Route>

            <Route path="/store/checkout" exact>
              <StoreLayout body={<ConfirmOrder />} />
            </Route>

            <Route path="/invoice/:id" exact>
              <Invoice/>
            </Route>

            <LoggedInRoute path="/change-password" exact>
              <AdminLayout body={<ChangePassword />} />
            </LoggedInRoute>

            <LoggedInRoute path="/logout" exact>
              {logout}
            </LoggedInRoute>
          </Switch>
        </ProductsProvider>
      </OrdersProvider>
    </>
  );
};

export default Routes;
