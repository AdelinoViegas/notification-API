import { 
  FaUserSecret as UsersIcon,
  FaKey as KeyIcon 
} from "react-icons/fa6";
import { LuStethoscope } from "react-icons/lu";
import { PiAmbulance } from "react-icons/pi";
import { FiUsers } from "react-icons/fi";
import { FaRegHospital, FaUserDoctor } from "react-icons/fa6";
import { RiCalendarScheduleLine } from "react-icons/ri";
import { BsCalendar2Week } from "react-icons/bs";
import { GrDocumentText } from "react-icons/gr";
import { GrTest } from "react-icons/gr";
import { FaRadiationAlt } from "react-icons/fa";

import type { Route } from "@/app/backend/api/manager/types";

export const clinicalIcons = [
  {
    route: 'patient',
    Icon: FiUsers,
  },
  {
    route: 'screening',
    Icon: LuStethoscope
  },
  {
    route: 'office',
    Icon: FaUserDoctor
  },
  {
    route: 'urgency-bank',
    Icon: PiAmbulance
  },
  {
    route: 'schedule-exams-services',
    Icon: RiCalendarScheduleLine
  },
  {
    route: 'phisical-unit',
    Icon: FaRegHospital
  },
  {
    route: 'exams-services',
    Icon: GrDocumentText
  },
  {
    route: 'appointment',
    Icon: RiCalendarScheduleLine
  },
  {
    route: 'doctor-calendar',
    Icon: BsCalendar2Week
  },
  {
    route: 'laboratory',
    Icon: GrTest
  },
  {
    route: 'imaging',
    Icon: FaRadiationAlt
  }
];

const clinicalRoutes = [
  {
    href: "/clinical/patient",
    route: 'patient',
    label: 'Utentes',
  },
  {
    href: "/clinical/screening",
    route: 'screening',
    label: 'Triagem',
  },
  {
    href: "/clinical/office",
    route: 'office',
    label: 'Consultório',
  },
  {
    href: "/clinical/urgency-bank",
    route: 'urgency-bank',
    label: 'Banco de Urgência',
  },
  {
    href: "/clinical/schedule-exams-services",
    route: 'schedule-exams-services',
    label: 'Exames Agendados',
  },
  {
    href: "/clinical/phisical-unit",
    route: 'phisical-unit',
    label: 'Unidades Físicas',
  },
  {
    href: "/clinical/exams-services",
    route: 'exams-services',
    label: 'Exames/Serviços Cadastrados',
  },
  {
    href: "/clinical/appointment",
    route: 'appointment',
    label: 'Consultas Agendadas',
  },
  {
    href: "/clinical/doctor-calendar",
    route: 'doctor-calendar',
    label: 'Calendário dos Medicos',
  },
  {
    href: "/clinical/laboratory",
    route: 'laboratory',
    label: 'Laboratório',
  },
  {
    href: "/clinical/imaging",
    route: 'imaging',
    label: 'Laboratório',
  }
];

const managerRoutes:Route[] = [
  {
    href: '/manager/users',
    route: '/manager/users',
    label: 'Usuários',
    Icon: UsersIcon,
  },
  {
    href: '/manager/permissions',
    route: '/manager/users',
    label: 'Permissões',
    Icon: KeyIcon,
  }
];

export {
  clinicalRoutes,
  managerRoutes,
};