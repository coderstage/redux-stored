declare module 'redux-stored' {
  export function Inherit(component: Function): Function;
  export function Middleware(store: any): any;
  export function Register(components: Object, actions: Object, models: Object): Object;
}