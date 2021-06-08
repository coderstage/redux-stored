import React from 'react'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'


/**
 * Stored props
 */
const keep = {
  models: {},
  actions: {},
}
export const Stored = keep


/**
 * Bind and connect actions and models to component
 * @param {object} component
 * @param {object} actions
 */
export const Bind = (Component, actions = {}) => {
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
      const reducer = Component.mapReducer || {}
      /**
       * Map states from component's props
       */
      if(Object.keys(reducer).length > 0) {
        for(let key in reducer) {
          if(typeof state[key] == 'undefined') {
            console.error(`Unable to find "${key}" in the state. Please check the reducer or the store.`)
          } else {
            reducer[key].map(name => states[name] = state[key][name])
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
  )
  (Component)
}


/**
 * Pass props to children components
 * @param {*} Child 
 */
export const Inherit = (Child) => {
  /**
   * Bind actions to component
   */
  return connect(null, (dispatch) => {
    return bindActionCreators(keep.actions, dispatch)
  })
  /**
   * Pass props to children
   */
  (React.memo((_props) => {
    return <Child {...keep.props} {..._props}/>
  }))
}


/**
 * Use either middleware
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
 * Register all components, actions and models
 * @param {object} components
 * @param {object} actions
 * @param {object} models
 */
export const Register = (components, actions = {}, models = {}) => {
  const nodes = {}
  /**
   * Models
   */
  for(let key in models) {
    if(typeof actions[key] == 'undefined') {
      keep.models[key] = models[key]
    } else {
      console.error(`Function named '${key}' is already exist in props, calling it from component will not work.`)
    }
  }
  /**
   * Wrap and connect components actions and models
   */
  for(let name in components) {
    let Component = components[name]
    /**
     * memo
     */
    let memo = React.memo((props) => {
      props = keep.props = {
        ...props,
        ...keep.models,
      }
      return <Component {...props}/>
    })
    memo.name = name
    memo.displayName = name
    /**
     * Map reducer from component
     */
    if(Component.map) {
      memo.mapReducer = Component.map
    }
    /**
     * Bind actions to component
     */
    nodes[name] = Bind(memo, actions)
  }
  /**
   * Keep persistent
   */
  keep.actions = actions
  
  return nodes
}