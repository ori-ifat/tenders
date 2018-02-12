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
import ThankYouPage from 'pages/thankyou'
import ArticlesPage from 'pages/articles'
import ArticlePage from 'pages/article'
import CategoryPage from 'pages/category'
import SmartAgentPage from 'pages/smartagent'
import NotFound404 from 'pages/notFound404'

class Pages extends React.Component {
  state = {
    notify: false
  }

  showNotification = (notify) => {
    this.setState({notify})
    console.log('notify', notify)
  }

  render() {
    return (
      <section>
        <Topbar notify={this.state.notify} />
        <Switch>
          <Route exact path="/">
            <Redirect to="/home" />
          </Route>
          <Route path="/home">
            <HomePage />
          </Route>
          <Route path="/main">
            <MainPage
              showNotification={this.showNotification}
            />
          </Route>
          <Route path="/search">
            <SearchPage />
          </Route>
          <Route path="/results/:sort/:tags/:filters/:isHome?">
            <ResultsPage />
          </Route>
          <Route path="/tender/:itemId">
            <TenderPage />
          </Route>
          <Route path="/smartagent">
            <SmartAgentPage
              showNotification={this.showNotification}
            />
          </Route>
          <Route path="/favorites">
            <FavoritesPage
              showNotification={this.showNotification}
            />
          </Route>
          <Route path="/reminders">
            <RemindersPage
              showNotification={this.showNotification}
            />
          </Route>
          <Route path="/publish">
            <PublishPage
              showNotification={this.showNotification}
            />
          </Route>
          <Route path="/contact">
            <ContactPage
              showNotification={this.showNotification}
            />
          </Route>
          <Route path="/subscriptions">
            <SubscriptionsPage
              showNotification={this.showNotification}
            />
          </Route>
          <Route path="/services">
            <ServicesPage
              showNotification={this.showNotification}
            />
          </Route>
          <Route path="/thankyou">
            <ThankYouPage />
          </Route>
          <Route path="/articles">
            <ArticlesPage />
          </Route>
          <Route path="/article/:id">
            <ArticlePage />
          </Route>
          <Route path="/category/:id/:name/:mode?">
            <CategoryPage />
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
