export default interface HeaderProps {}

export interface Route {
  href: string;
  text: string;
  active: boolean;
}

export interface NavProps {
  routes: Route[];
}
