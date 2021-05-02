import React from 'react';
import { Route, Switch } from 'react-router';
import { IRoute } from '../../common/interfaces/route.interface';
import routes from '../../routes';

import './main-content.page.scss';

const MainContent: React.FC = () => {
  return (
    <div className="main-content">
      <Switch>
        {
          routes.map((route: IRoute) => {
            return (
              <Route
                key={ route.path }
                path={ route.path }
                exact
                component={ route.component }
              />
            );
          })
        }
      </Switch>
    </div>
  );
};

export default MainContent;
