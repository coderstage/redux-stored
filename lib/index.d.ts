
declare module 'redux-stored' {
  export function Bind(component: object, actions: object): object;
  export function Middleware(store: object): object;
  export function Register(components: object, actions: object, models: object): object;
}