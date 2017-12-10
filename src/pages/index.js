import React from 'react'
import { Redirect, Route, Switch } from 'react-router-dom'
import { accountStore } from 'stores'
import Topbar from 'app/components/Topbar'
import HomePage from 'pages/home'
import SearchPage from 'pages/search'
import ResultsPage from 'pages/results'
import MainPage from 'pages/main'
import TenderPage from 'pages/tender'
import FavoritesPage from 'pages/favorites'
import NotFound404 from 'pages/notFound404'

class Pages extends React.Component {
  ensureAuthentication(Component) {    
    return accountStore.profile ? <Component /> : <Redirect to="/home" />
  }

  render() {
    return (
      <section>
        <Topbar />
        <Switch>
          <Route exact path="/">
            <Redirect to="/home" />
          </Route>
          <Route path="/home">
            <HomePage />
          </Route>
          <Route path="/main">
            {this.ensureAuthentication(MainPage)}
          </Route>
          <Route path="/search">
            {this.ensureAuthentication(SearchPage)}
          </Route>
          <Route path="/results/:sort/:tags/:filters">
            <ResultsPage />
          </Route>
          <Route path="/tender/:itemId">
            {this.ensureAuthentication(TenderPage)}
          </Route>
          <Route path="/favorites">
            {this.ensureAuthentication(FavoritesPage)}
          </Route>
          <Route>
            <NotFound404 />
          </Route>
        </Switch>
      </section>
    )
  }
}
export default Pages
