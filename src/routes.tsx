import * as React from 'react'
import { Route, Switch } from 'react-router-dom'

import Root from './components/layout/Root'
import Header from './components/layout/Header'
import HelloWorldPage from './pages/ec2-management/index'
import GroupPage from './pages/ec2-management/groups'
import IndexPage from './pages/index'

// If your app is big + you have routes with a lot of components, you should consider
// code-splitting your routes! If you bundle stuff up with Webpack, I recommend `react-loadable`.
//
// $ yarn add react-loadable
// $ yarn add --dev @types/react-loadable
//
// The given `pages/` directory provides an example of a directory structure that's easily
// code-splittable.

const Routes: React.SFC = () => (
  <Root>
    <Header title="EC2 cluster management system" />
    <Switch>
      <Route exact path="/" component={IndexPage} />
      <Route path="/home" component={() => <div style={{"textAlign": "center", "color": "black", "fontSize": "30px", "marginTop": "100px"}}>Welcome, This is a simple EC2 management system</div>} />
      <Route path="/groups" component={GroupPage} />
      <Route path="/nodes/:group" component={HelloWorldPage} />
      <Route component={() => <div>Not Found</div>} />
    </Switch>
  </Root>
)

export default Routes
