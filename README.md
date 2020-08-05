## Redux Stored

A react-redux implementation that stores your logic and model in an object and call it from action using middleware and from prop's component. 

All models/logic of your app will be stored in one place along with the store/state object and dispatch function.
actions can access the models by calling it from middleware without importing it.


## Available Functions

#### Register
Register all screens/containers, actions, and logics/models.

```js
Register({Home,Products}, {getProducts}, {fetchProducts});
```

#### Middleware
Apply middleware into the store.

```js
createStore(Reducers, Defaults, applyMiddleware(Middleware));
```

#### Bind
Connect multiple actions to component like bindActionCreators but with the component.

```js
Bind(Component, Actions);
```

## Call a model or logic
Model/logic can be called inside middleware from an action.

```js
// ./Redux/Actions/productsActions.js

/**
* Get products from API Service
*/
export const getProducts = (query) => {	
  // Middleware
  return (store) => {
    /**
    * Get Products and Dispatch
    */
    store.products(query, results => store.dispatch({
      type: 'GET_PRODUCTS',
      payload: results
    }))
  };
};
```

## Map state to props
Map state through static class property to component props.
```js
// ./Screens/Products.js

/**
* Products component
*/
class Products extends React.Component {
  static map = {
    // A reducer's name
    products: [
      // A state and can be called like this {this.props.items}
      'items'
    ]
  };
  render() {
    return(
      <ul>
        {this.props.items.map((item) => (
          <li>{item.title}</li>
        ))}
      </ul>
    );
  }
}
```

## Call a logic/model
Call a logic inside a component with argument.
```js
// ./src/Models/Calculate.js
export const calculate = (someArg) => ({
  add: (num1, num2) => {
    return num1 + num2;
  },
})

// ./src/Screens/Products.js
class Products extends React.Component {
  render() {
    const cal = this.props.calculate('someArg');
    return(
      <div>
        {cal.add(465, 1526)}
      </div>
    );
  }
}

```



## Example

See example at [https://github.com/coderstage/redux-stored-sample](https://github.com/coderstage/redux-stored-sample)

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


## Change Log

[Semantic Versioning](http://semver.org/)

## License

MIT
