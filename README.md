## Redux Stored

A react and redux implementation that stores models and call it globally from actions using middleware and from prop's component. 

All models/logic of your app will be stored in one place along with the store/state object and dispatch function.
actions can access the models by calling it from middleware without importing it.

## Installation

```
npm install redux-stored
```

## Implementation

All Containers, Actions and Models/Logic will be in one place to register it to the store
and apply the middleware in order to use the actions and call the stored logic anywhere.

## Example

#### 1. Register all

```js
// ./Redux/Containers/index.js
import {Register} from 'redux-stored';

/**
 * Screens
 */
import Products from '../../Screens/Products';

/**
 * Actions
 */
import {getProducts} from '../Actions/Products';

/**
 * Models
 */
import * as ProductService from '../../Models/Services/Products';

/**
 * Register containers, actions and models
 * to connect to the components
 */
export default Register(
  {
    Products,
  },
  {
    getProducts,
  },
  {
    ...ProductService,
  }
);
```

#### 2. Apply Middleware

```js
// ./Redux/Store/index.js
import {Middleware} from 'redux-stored';
import {
  createStore as Store,
  applyMiddleware as Apply,
  combineReducers as Combine,
}
from 'redux';

/**
 * Reducers
 */
import products from '../Reducers/Products';


/**
 * Initial States
 */
const Defaults = {};

/**
 * Combine Reducers
 */
const Reducers = Combine({
  products,
});

/**
 * Export store
 */
export default Store(
  Reducers,
  Defaults,
  Apply(Middleware)
);
```

#### 3. Create Action

```js
// ./Redux/Actions/Products.js
import {GET_PRODUCTS} from '../../Constants/Types';

/**
* Get products from API Service
*/
export const getProducts = (query) => {

  return (store) => {
    /**
    * Get Products and Dispatch
    */
    store.products(query, results => store.dispatch({
      type: GET_PRODUCTS,
      payload: results
    }))
  };
};
```

#### 4. Create Reducer

```js
// ./Redux/Reducers/Products.js
import {GET_PRODUCTS} from '../../Constants/Types';

/**
 * Default States
 */
const InitialStates = {
  items: [],
};

/**
 * Export Product Reducer
 */
export default (state = InitialStates, action) => {

  switch(action.type) {
    case GET_PRODUCTS:
      return {
        ...state,
        items: action.payload
      };
    default:
      return state;
  }
};
```

#### 5. Create Service as a Model

```js
// ./Models/Services/Products.js

/**
 * Get Products
 */
export const products = (query, callback) => callback([
  {
    id: 1,
    title: 'Iphone'
  },
  {
    id: 2,
    title: 'Macbook'
  },
]);
```

#### 6. Create Component

```js
// ./Screens/Products.js
import React from 'react';

/**
 * Products Page
*/
class Products extends React.Component {

  static map = {
    products: [
      'items'
    ]
  };

  /**
   * Mount
   */
  componentDidMount = () => {
    this.props.getProducts('test');
  };

  render() {
    return (
      <div id="products">
        <ul>
          {this.props.items.map((item, index) => (
            <li key={index}>
              <strong> {item.title}</strong>
            </li>
          ))}
        </ul>
      </div>
    );
  }
}
/**
 * Export Component
 */
export default Products;
```

#### 7. Add Store to Provider

```js
// ./index.js
import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';

import {
  Route,
  BrowserRouter as Router,
} from 'react-router-dom';

/**
 * Get the store and containers
 */
import Store from './Redux/Store';
import Containers from './Redux/Containers';


const {Products} = Containers;

/**
 * Main App
 */
const App = () => (
  <Provider store={Store}>
    <Router>
      <Route path="/products" component={Products} />
    </Router>
  </Provider>
);

ReactDOM.render(<App />, document.getElementById('root'));
```

## Documentation
Soon

## Change Log

[Semantic Versioning](http://semver.org/)

## License

MIT
