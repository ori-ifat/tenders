import React from 'react'
import { Redirect, Route, Switch } from 'react-router-dom'
import Topbar from 'app/components/Topbar'
import SearchPage from 'pages/search'
import ResultsPage from 'pages/results'
import HomePage from 'pages/home'
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
            <Redirect to="/home" />
          </Route>
          <Route path="/home">
            {this.ensureAuthentication(HomePage)}
          </Route>
          <Route path="/search">
            {this.ensureAuthentication(SearchPage)}
          </Route>
          <Route path="/results/:sort/:tags">
            {this.ensureAuthentication(ResultsPage)}
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
