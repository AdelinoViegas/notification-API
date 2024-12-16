import { 
  UsersIcon,
  KeyIcon,
} from "@heroicons/react/24/outline";
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

const clinicalRoutes:Route[] = [
  {
    href: "/clinical/patient",
    route: 'patient',
    label: 'Utentes',
    Icon: FiUsers,
  },
  {
    href: "/clinical/screening",
    route: 'screening',
    label: 'Triagem',
    Icon: LuStethoscope
  },
  {
    href: "/clinical/office",
    route: 'office',
    label: 'Consultório',
    Icon: FaUserDoctor
  },
  {
    href: "/clinical/urgency-bank",
    route: 'urgency-bank',
    label: 'Banco de Urgência',
    Icon: PiAmbulance
  },
  {
    href: "/clinical/schedule-exams-services",
    route: 'schedule-exams-services',
    label: 'Exames Agendados',
    Icon: RiCalendarScheduleLine
  },
  {
    href: "/clinical/phisical-unit",
    route: 'phisical-unit',
    label: 'Unidades Físicas',
    Icon: FaRegHospital
  },
  {
    href: "/clinical/exams-services",
    route: 'exams-services',
    label: 'Exames/Serviços Cadastrados',
    Icon: GrDocumentText
  },
  {
    href: "/clinical/appointment",
    route: 'appointment',
    label: 'Consultas Agendadas',
    Icon: RiCalendarScheduleLine
  },
  {
    href: "/clinical/doctor-calendar",
    route: 'doctor-calendar',
    label: 'Calendário dos Medicos',
    Icon: BsCalendar2Week
  },
  {
    href: "/clinical/laboratory",
    route: 'laboratory',
    label: 'Laboratório',
    Icon: GrTest
  },
  {
    href: "/clinical/imaging",
    route: 'imaging',
    label: 'Laboratório',
    Icon: FaRadiationAlt
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