import { IconType } from "react-icons";

type HeroIcon = React.ForwardRefExoticComponent<Omit<React.SVGProps<SVGSVGElement>, "ref"> & {
  title?: string;
  titleId?: string;
} & React.RefAttributes<SVGSVGElement>>;

type Route = {
  href: string;
  route: string;
  label: string;
  Icon?: React.ForwardRefExoticComponent<Omit<React.SVGProps<SVGSVGElement>, "ref"> & {
    title?: string;
    titleId?: string;
  } & React.RefAttributes<SVGSVGElement>> | IconType;
}

export type {
  Route,
  HeroIcon
}