import {
  serviceCategoryModel,
  sectionModel,
} from "@/backend/model";
import { seedCollection } from "../helpers";

// ─────────────────────────────────────────────────────────────────────────────
// FASE 2: Dependem logicamente da Fase 1
// ─────────────────────────────────────────────────────────────────────────────

/** Categorias de Serviço - collection: exam_category */

const examCategories = [
  "Hematologia",
  "Bioquímica",
  "Microbiologia",
  "Parasitologia",
  "Imunologia e Serologia",
  "Urianálise",
  "Radiologia Convencional",
  "Ecografia",
  "Tomografia Computadorizada",
  "Ressonância Magnética",
  "Electrocardiografia",
];

const consultationCategories = [
  "Consulta Externa",
  "Consulta de Seguimento",
  "Consulta de Especialidade",
  "Consulta Pré-Operatória",
];

const surgeryCategories = [
  "Cirurgia Geral",
  "Cirurgia de Urgência",
  "Cirurgia Programada",
  "Pequena Cirurgia",
];

/** Secções (Alas) - collection: sections */
const sections = [
  "Ala A",
  "Ala B",
  "Ala C",
  "UCI",
];

// ─────────────────────────────────────────────────────────────────────────────
// Execução
// ─────────────────────────────────────────────────────────────────────────────

export async function phase2(): Promise<void> {
  console.log("\n FASE 2: Categorias de Serviço + Secções");

  // Categorias de Exame
  await seedCollection(
    serviceCategoryModel,
    examCategories.map(name => ({ name, kind: "exam" as const })),
    (doc) => ({ name: doc.name, kind: doc.kind }),
    "Categorias de Exame"
  );

  // Categorias de Consulta
  await seedCollection(
    serviceCategoryModel,
    consultationCategories.map(name => ({ name, kind: "consultation" as const })),
    (doc) => ({ name: doc.name, kind: doc.kind }),
    "Categorias de Consulta"
  );

  // Categorias de Cirurgia
  await seedCollection(
    serviceCategoryModel,
    surgeryCategories.map(name => ({ name, kind: "surgery" as const })),
    (doc) => ({ name: doc.name, kind: doc.kind }),
    "Categorias de Cirurgia"
  );

  // Secções
  await seedCollection(
    sectionModel,
    sections.map(name => ({ name })),
    (doc) => ({ name: doc.name }),
    "Secções (Alas)"
  );
}
