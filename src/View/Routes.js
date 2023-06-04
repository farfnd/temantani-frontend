import React, { useContext } from "react";
import { Switch, Route, BrowserRouter as Router, Redirect } from "react-router-dom";
import { GamesProvider } from "../Contexts/GamesContext";
import { MoviesProvider } from "../Contexts/MoviesContext";
import { UserContext } from "../Contexts/UserContext";
import Cookies from "js-cookie";

import AuthLayout from "./Components/AuthLayout";
import LayoutComponent from "./Components/LayoutComponent";
import Home from "./Pages/Home";
import GamesList from "./Pages/Games/GamesList";
import GamesForm from "./Pages/Games/GamesForm";
import Login from "./Pages/Auth/Login"
import Register from "./Pages/Auth/Register";
import ChangePassword from "./Pages/Auth/ChangePassword";
import MoviesList from "./Pages/Movies/MoviesList";
import MoviesForm from "./Pages/Movies/MoviesForm";
import GameDetails from "./Pages/Games/GameDetails";
import MovieDetails from "./Pages/Movies/MovieDetails";

const Routes = () => {
  const { loginStatus, setLoginStatus } = useContext(UserContext)

  const NotLoggedInRoute = ({ ...props }) => {
    if (Cookies.get('token') === undefined) { return <Route {...props} /> }
    else { return <Redirect to="/" /> }
  }

  const LoggedInRoute = ({ ...props }) => {
    if (Cookies.get('token') !== undefined) { return <Route {...props} /> }
    else if (Cookies.get('token') === undefined) { return <Redirect to="/" /> }
  }

  return (
    <>
      <Router>
        <GamesProvider>
          <MoviesProvider>
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

              <Route path="/games" exact>
                <LayoutComponent body={<GamesList />} />
              </Route>

              <Route path="/games/view/:id" exact>
                <LayoutComponent body={<GameDetails />} />
              </Route>

              <Route path="/movies" exact>
                <LayoutComponent body={<MoviesList />} />
              </Route>

              <Route path="/movies/view/:id" exact>
                <LayoutComponent body={<MovieDetails />} />
              </Route>

              <LoggedInRoute path="/games/create" exact>
                <LayoutComponent body={<GamesForm />} />
              </LoggedInRoute>

              <LoggedInRoute path="/games/edit/:id" exact>
                <LayoutComponent body={<GamesForm />} />
              </LoggedInRoute>

              <LoggedInRoute path="/movies/create" exact>
                <LayoutComponent body={<MoviesForm />} />
              </LoggedInRoute>

              <LoggedInRoute path="/movies/edit/:id" exact>
                <LayoutComponent body={<MoviesForm />} />
              </LoggedInRoute>

              <LoggedInRoute path="/change-password" exact>
                <LayoutComponent body={<ChangePassword />} />
              </LoggedInRoute>

            </Switch>
          </MoviesProvider>
        </GamesProvider>
      </Router>
    </>
  )

}

export default Routes