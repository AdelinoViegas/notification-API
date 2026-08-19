import {
  specialtyModel,
  urgencyServiceModel,
  unitModel,
  externalUnitModel,
  examClassificationModel,
  examGroupModel,
  internalServiceModel,
  morgueChamberModel,
} from "@/backend/model";
import { seedCollection } from "../helpers";

// ─────────────────────────────────────────────────────────────────────────────
// FASE 1: Dados independentes (sem referências externas)
// ─────────────────────────────────────────────────────────────────────────────

/** 1. Especialidades Médicas-collection: user_specialty */
const specialties = [
  "Medicina Geral",
  "Medicina Interna",
  "Pediatria",
  "Cirurgia Geral",
  "Ortopedia e Traumatologia",
  "Ginecologia e Obstetrícia",
  "Cardiologia",
  "Neurologia",
  "Dermatologia",
  "Oftalmologia",
  "Otorrinolaringologia",
  "Urologia",
  "Pneumologia",
  "Gastroenterologia",
  "Anestesiologia",
];

/** 2. Serviços de Urgência - collection: urgency_services */
const urgencyServices = [
  { label: "Medicina", isActive: true },
  { label: "Pediatria", isActive: true },
  { label: "Cirurgia", isActive: true },
  { label: "Ginecologia e Obstetrícia", isActive: true },
  { label: "Ortopedia", isActive: true },
];

/**
 * 3. Unidades Físicas - collection: phisical_unit
 * Nota: "Central" (workplace) já é criada pelo db.config.ts,
 * por isso não incluímos aqui.
 */
const physicalUnits = [
  { name: "Laboratório Central", unitTypeId: "laboratory" },
  { name: "Imagiologia", unitTypeId: "imaging" },
  { name: "Triagem", unitTypeId: "screening" },
  { name: "Banco de Urgência", unitTypeId: "urgency" },
];

/** 4. Unidades Externas - collection: external_units */
const externalUnits = [
  { name: "Hospital Josina Machel", municipality: "Ingombota", province: "Luanda" },
  { name: "Hospital Américo Boavida", municipality: "Ingombota", province: "Luanda" },
  { name: "Hospital Geral de Luanda", municipality: "Maianga", province: "Luanda" },
  { name: "Hospital Pediátrico David Bernardino", municipality: "Maianga", province: "Luanda" },
  { name: "Clínica Sagrada Esperança", municipality: "Talatona", province: "Luanda" },
  { name: "Hospital Militar Principal", municipality: "Maianga", province: "Luanda" },
  { name: "Maternidade Lucrécia Paím", municipality: "Ingombota", province: "Luanda" },
];

/** 5. Classificações de Serviço - collection: exam_classification */
const classifications = [
  "Rotina",
  "Urgente",
  "Especial",
  "Pré-operatório",
];

/** 6. Grupos de Serviço - collection: exam_group */
const groups = [
  "Análises Clínicas",
  "Diagnóstico por Imagem",
  "Procedimentos Cirúrgicos",
  "Consultas Médicas",
  "Exames Complementares",
];

/** 7. Serviços Internos de Internamento - collection: internalservices */
const internalServices = [
  "Medicina Interna",
  "Cirurgia Geral",
  "Pediatria",
  "Ginecologia e Obstetrícia",
  "Ortopedia e Traumatologia",
  "Cuidados Intensivos (UCI)",
];

/** 8. Câmaras da Morgue - collection: morguechambers */
const morgueChambers = [
  { name: "Câmara A", maxDrawers: 10 },
  { name: "Câmara B", maxDrawers: 10 },
  { name: "Câmara C", maxDrawers: 8 },
];

// ─────────────────────────────────────────────────────────────────────────────
// Execução
// ─────────────────────────────────────────────────────────────────────────────

export async function phase1(): Promise<void> {
  console.log("\n FASE 1: Dados independentes");

  // 1. Especialidades 
  await seedCollection(
    specialtyModel,
    specialties.map(name => ({ name })),
    (doc) => ({ name: doc.name }),
    "Especialidades Médicas"
  );

  // 2. Serviços de Urgência
  await seedCollection(
    urgencyServiceModel,
    urgencyServices,
    (doc) => ({ label: doc.label }),
    "Serviços de Urgência"
  );

  // 3. Unidades Físicas
  await seedCollection(
    unitModel,
    physicalUnits,
    (doc) => ({ name: doc.name }),
    "Unidades Físicas"
  );

  // 4. Unidades Externas
  await seedCollection(
    externalUnitModel,
    externalUnits,
    (doc) => ({ name: doc.name, municipality: doc.municipality, province: doc.province }),
    "Unidades Externas"
  );

  // 5. Classificações
  await seedCollection(
    examClassificationModel,
    classifications.map(name => ({ name })),
    (doc) => ({ name: doc.name }),
    "Classificações de Serviço"
  );

  // 6. Grupos
  await seedCollection(
    examGroupModel,
    groups.map(name => ({ name })),
    (doc) => ({ name: doc.name }),
    "Grupos de Serviço"
  );

  // 7. Serviços Internos
  await seedCollection(
    internalServiceModel,
    internalServices.map(name => ({ name })),
    (doc) => ({ name: doc.name }),
    "Serviços Internos"
  );

  // 8. Câmaras de Morgue
  await seedCollection(
    morgueChamberModel,
    morgueChambers,
    (doc) => ({ name: doc.name }),
    "Câmaras de Morgue"
  );
}
