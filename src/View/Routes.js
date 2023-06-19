import React, { useContext } from "react";
import { Switch, Route, Redirect, useHistory } from "react-router-dom";
import { ProductsContext, ProductsProvider } from "../Contexts/ProductsContext";
import { OrdersProvider } from "../Contexts/OrdersContext";
import { UserContext } from "../Contexts/UserContext";
import Cookies from "js-cookie";
import { message } from "antd";

import AuthLayout from "./Components/AuthLayout";
import LayoutComponent from "./Components/LayoutComponent";
import WorkerLayout from "./Components/WorkerLayout";
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
import WorkerBankAccount from "./Pages/Worker/BankAccount/Show";
import WorkerBankAccountEdit from "./Pages/Worker/BankAccount/Edit";

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
              <LayoutComponent body={<AdminDashboard />} />
            </Route>

            <Route path="/admin/projects/hiring" exact>
              <LayoutComponent body={<HiringProjectList />} />
            </Route>

            <Route path="/admin/projects/hiring/:id" exact>
              <LayoutComponent body={<HiringProjectDetail />} />
            </Route>

            <Route path="/admin/projects/ongoing" exact>
              <LayoutComponent body={<OngoingProjectList />} />
            </Route>

            <Route path="/admin/projects/ongoing/:id" exact>
              <LayoutComponent body={<OngoingProjectDetail />} />
            </Route>

            <Route path="/admin/products" exact>
              <LayoutComponent body={<ProductList />} />
            </Route>

            <Route path="/admin/products/create" exact>
              <LayoutComponent body={<ProductForm />} />
            </Route>

            <Route path="/admin/products/:id/edit" exact>
              <LayoutComponent body={<ProductForm />} />
            </Route>

            <Route path="/admin/orders" exact>
              <LayoutComponent body={<OrderList />} />
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

            <Route path="/worker/bank-account" exact>
              <WorkerLayout body={<WorkerBankAccount />} />
            </Route>

            <Route path="/worker/bank-account/edit" exact>
              <WorkerLayout body={<WorkerBankAccountEdit />} />
            </Route>

            <LoggedInRoute path="/change-password" exact>
              <LayoutComponent body={<ChangePassword />} />
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
