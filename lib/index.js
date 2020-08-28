import React from 'react'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'


/**
 * Global
 */
let args = {}
let keep = {
  owner: {},
  models: {
    /**
     * Get args
     */
    get: (name) => args[name],
    /**
     * Set args
     */
    set: (data) => {
      let items = data
      if(typeof data == 'function') {
        items = data(args)
      }
      for(let name in items) {
        args[name] = args[name]
      }
    }
  },
  actions: {},
}


/**
 * Inherit models to component
 * @param {function} fn 
 */
export const Inherit = (Component) => {
  /**
   * Bind actions to component
   */
  return connect(null, (dispatch) => {
    return bindActionCreators(keep.actions, dispatch)
  })
  (React.memo((props) => {
    let node = keep.owner.child.stateNode
    /**
     * Inherit from parent component
     */
    let hooks = {
      ...props,
      ...node.props,
      state: node.state,
      /**
       * Force update parent component
       */
      update: (cb = null) => {
        if(cb) {
          cb(node.state)
        }
        if(node.updater.isMounted()) {
          node.forceUpdate()
        }
      },
      /**
       * Set state from function component to parent
       */
      setState: (state) => {
        if(node.updater.isMounted()) {
          node.setState(state)
        }
        return state
      },
    }
    return <Component {...hooks}/>
  }))
}


/**
 * Bind and connect actions and models to component
 * 
 * @param {object} component
 * @param {object} actions
 */
export const Bind = (component, actions = {}) => {
  /**
   * Connect actions and states to conponent
   */
  return connect(
    /**
     * Map state to props
     * @param {object} state
     */
    (state) => {
      const states = {}
      const reducers = component.mapReducers || {}
      /**
       * Map states from component's props
       */
      if(Object.keys(reducers).length > 0) {
        for(let key in reducers) {
          if(typeof state[key] == 'undefined') {
            console.error(`Unable to find "${key}" in the state. Please check the reducer or the store.`)
          } else {
            reducers[key].map(name => states[name] = state[key][name])
          }
        }
      }
      return states
    },

    /**
     * Bind and dispatch actions
     * 
     * @param {function} dispatch
     */
    (dispatch) => {
      return bindActionCreators(actions, dispatch)
    }
  )(component)
}


/**
 * You can either use middleware
 * that has action type defined or without type
 * @param {object} store 
 */
export const Middleware = store => {
  /**
   * Set
   */
  keep.models.store = store
  /**
   * Actions
   */
  return (next) => (action) => {
    /**
     * Type of action
     */
    switch(typeof action) {
      case 'object':
        /**
         * If its not a redux action
         */
        if(typeof action.type == 'undefined') {
          return action
        }
        /**
         * Default action of redux
         */
        return next(action)
      case 'function':
        /**
         * Middleware function
         */
        return action({...store, ...keep.models})
      default:
        /**
         * Custom default action
         * without type and payload
         */
        return action
    }
  }
}


/**
 * Register all components, actions
 * @param {object} components
 * @param {object} actions
 * @param {object} models
 */
export const Register = (components, actions = {}, models = {}) => {
  const items = {}
  /**
   * Wrap and connect components
   * with states and actions with models
   */
  for(let name in components) {
    /**
     * Memo
     */
    let memo = React.memo((props) => {
      let Component = React.createElement(components[name], props)
      for(let key in models) {
        if(typeof actions[key] == 'undefined') {
          keep.models[key] = models[key]
        } else {
          console.error(`Function named '${key}' is already exist in props, calling it from component will not work.`)
        }
      }
      if(Component._owner) {
        keep.owner = Component._owner
      }
      return <Component.type args={args} {...props} {...keep.models}/>
    })
    memo.displayName = name
    memo.mapReducers = components[name].map
    /**
     * Bind actions to component
     */
    items[name] = Bind(memo, actions)
  }
  /**
   * Keep persistent
   */
  keep.actions = actions

  return items
}