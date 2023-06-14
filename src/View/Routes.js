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
import AdminDashboard from "./Pages/Admin/Dashboard";
import HiringProjectList from "./Pages/Admin/Project/Hiring/ProjectList";
import HiringProjectDetail from "./Pages/Admin/Project/Hiring/ProjectDetail";
import OngoingProjectList from "./Pages/Admin/Project/Ongoing/ProjectList";
import OngoingProjectDetail from "./Pages/Admin/Project/Ongoing/ProjectDetail";

const Routes = () => {

  const NotLoggedInRoute = ({ ...props }) => {
    if (Cookies.get('token') === undefined) { return <Route {...props} /> }
    else { return <Redirect to="/" /> }
  }

  const LoggedInRoute = ({ ...props }) => {
    if (Cookies.get('token') !== undefined) { return <Route {...props} /> }
    else if (Cookies.get('token') === undefined) { 
      return <Redirect to="/" /> 
    }
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

              <Route path="/admin/dashboard" exact>
                <LayoutComponent body={< AdminDashboard />} />
              </Route>

              <Route path="/admin/projects/hiring" exact>
                <LayoutComponent body={< HiringProjectList />} />
              </Route>

              <Route path="/admin/projects/hiring/:id" exact>
                <LayoutComponent body={< HiringProjectDetail />} />
              </Route>

              <Route path="/admin/projects/ongoing" exact>
                <LayoutComponent body={< OngoingProjectList />} />
              </Route>

              <Route path="/admin/projects/ongoing/:id" exact>
                <LayoutComponent body={< OngoingProjectDetail />} />
              </Route>

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