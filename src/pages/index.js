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
import RemindersPage from 'pages/reminders'
import PublishPage from 'pages/publish'
import ContactPage from 'pages/contact'
import SubscriptionsPage from 'pages/subscriptions'
import ServicesPage from 'pages/services'
import ArticlesPage from 'pages/articles'
import ArticlePage from 'pages/article'
import SmartAgentPage from 'pages/smartagent'
import NotFound404 from 'pages/notFound404'

class Pages extends React.Component {

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
            <MainPage />
          </Route>
          <Route path="/search">
            <SearchPage />
          </Route>
          <Route path="/results/:sort/:tags/:filters">
            <ResultsPage />
          </Route>
          <Route path="/tender/:itemId">
            <TenderPage />
          </Route>
          <Route path="/smartagent">
            <SmartAgentPage />
          </Route>
          <Route path="/favorites">
            <FavoritesPage />
          </Route>
          <Route path="/reminders">
            <RemindersPage />
          </Route>
          <Route path="/publish">
            <PublishPage />
          </Route>
          <Route path="/contact">
            <ContactPage />
          </Route>
          <Route path="/subscriptions">
            <SubscriptionsPage />
          </Route>
          <Route path="/services">
            <ServicesPage />
          </Route>
          <Route path="/articles">
            <ArticlesPage />
          </Route>
          <Route path="/article/:id">
            <ArticlePage />
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
