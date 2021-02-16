## Redux Stored

A react-redux implementation that stores your logic and model in an object and call it from action using middleware and from prop's component. 

All models/logic of your app will be stored in one place along with the store/state object and dispatch function.
actions can access the models by calling it from middleware without importing it.


## Usage

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



## Call a model
Model can be called inside middleware from an action.

```js
// ./src/Models/API.js
export const products = (query, cb) => {
  return fetch('/api/v1/products').then(result => cb(result));
}

// ./src/Redux/Actions/productsActions.js
export const getProducts = (query) => {	
  // Middleware
  return (store) => {
    /**
    * Get Products and Dispatch,
    * this "products" function is coming from a model
    */
    return store.products(query, results => store.dispatch({
      type: 'GET_PRODUCTS',
      payload: results
    }))
  };
};
```

## Call a logic
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

## Map state to props
Map state through static class property to component props.
```js
// ./src/Screens/Products.js
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
    )
  }
}
```

## Call from stateless component
Get props from parent component or even set a state/force update to parent component from child component
```js
// ./src/Components/Products.js
import React from 'react'
import {Inherit} from 'redux-stored'

/**
 * Export images
 */
export default Inherit((props) => {

  props.parent.setState({loaded: true}) // Set state to parent component
  return(
    <ul>
      {props.items.map((item) => (
        <li>{item.title}</li>
      ))}
    </ul>
  )
})
```

## Example

See example at [https://github.com/coderstage/redux-stored-sample](https://github.com/coderstage/redux-stored-sample)


## Change Log

[Semantic Versioning](http://semver.org/)

## License

MIT
