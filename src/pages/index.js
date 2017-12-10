import React from 'react'
import { Redirect, Route, Switch } from 'react-router-dom'
import Topbar from 'app/components/Topbar'
import SearchPage from 'pages/search'
import ResultsPage from 'pages/results'
import MainPage from 'pages/main'
import TenderPage from 'pages/tender'
import FavoritesPage from 'pages/favorites'
import NotFound404 from 'pages/notFound404'

class Pages extends React.Component {
  ensureAuthentication(Component) {
    //return http.isAuthenticated ? <Component /> : <Redirect to="/login" />
    return <Component />
  }

  render() {
    return (
      <section>
        <Topbar />
        <Switch>
          <Route exact path="/">
            <Redirect to="/main" />
          </Route>
          <Route path="/main">
            {this.ensureAuthentication(MainPage)}
          </Route>
          <Route path="/search">
            {this.ensureAuthentication(SearchPage)}
          </Route>
          <Route path="/results/:sort/:tags/:filters">
            {this.ensureAuthentication(ResultsPage)}
          </Route>
          <Route path="/tender/:itemId">
            {this.ensureAuthentication(TenderPage)}
          </Route>
          <Route path="/favorites">
            {this.ensureAuthentication(FavoritesPage)}
          </Route>
          <Route>
            {this.ensureAuthentication(NotFound404)}
          </Route>
        </Switch>
      </section>
    )
  }
}
export default Pages
