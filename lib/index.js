import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';



let keep = {};

/**
 * Bind and connect the containers,
 * actions and models to component
 * 
 * @param {object} component
 * @param {object} actions
 */
export const Bind = (component, actions = {}) => {
  /**
   * Connect actions and states to conponent
   */
  if(component.map) {
    return connect(
      /**
       * Map state to props
       * @param {object} state
       */
      (state) => {
        const states = {};
        /**
         * Map states from component's props
         */
        for(let key in component.map) {
          component.map[key].map(name => states[name] = state[key][name]);
        }
        return states;
      },

      /**
       * Bind and dispatch actions
       * 
       * @param {function} dispatch
       */
      (dispatch) => {
        return bindActionCreators(actions, dispatch);
      }
    )(component);
  }
  return component;
};


/**
 * You can either use middleware
 * that has action type defined or without type
 * @param {object} store 
 */
export const Middleware = store => {
  /**
   * Get specific state
   * using function with state's name
   */
  store.get = (name) => {
    const state = store.getState();
    if(typeof state[name] !== 'undefined') {
      return state[name];
    }
    return state;
  };

  return (next) => (action) => {
    /**
     * Type of action
     */
    switch(typeof action) {
      case 'object':
        /**
         * Default action of redux
         */
        return next(action);
      case 'function':
        /**
         * Middleware function
         */
        return action({...store, ...keep.models});
      default:
        /**
         * Custom default action
         * without type and payload
         */
        return action;
    }
  };
};


/**
 * Register all components, actions
 * @param {object} components
 * @param {object} actions
 * @param {object} models
 */
export const Register = (components, actions = {}, models = {}) => {
  const cont = {};
  /**
   * Check if function is already declared
   * before merge it to actions
   */
  for(let key in models) {
    if(typeof actions[key] === 'undefined') {
      actions[key] = models[key];
    } else {
      console.warn(`Function named '${key}' from models has been declared already in actions, calling it from props will not work.`);
    }
  }
  /**
   * Wrap and connect components
   * with states and actions with models
   */
  for(let key in components) {
    cont[key] = Bind(components[key], actions);
  };
  keep.models = models;

  return cont;
};