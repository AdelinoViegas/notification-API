import {
  patientModel,
  demographyModel,
  responsibleModel,
  groupModel,
  accessTypeModel,
  externalUnitModel,
} from "@/backend/model";
import { seedCollection, resolveByName } from "../helpers";

// ─────────────────────────────────────────────────────────────────────────────
// FASE 5: Utentes de Teste (dados operacionais para demonstração)
//
// ⚠️  Estes dados são exclusivamente para ambientes de desenvolvimento
//     e apresentação. Em produção os utentes são cadastrados manualmente.
// ─────────────────────────────────────────────────────────────────────────────

interface RawPatient {
  fullname: string;
  birthDate: string;
  gender: string;
  civilState: string;
  tel: string;
  documentation: string;
  demography: {
    nationality: string;
    naturality: string;
    province: string;
    actualLocation: string;
    street: string;
    homeNumber: string;
  };
  responsibles: { name: string; kinship: string; tel: string }[];
  group: {
    type: string;
    group?: {
      name: string;
      apolice: number;
      tel: string;
    };
  };
  access: {
    type: string;
    externalUnit?: string; // nome da unidade externa (se transferido)
  };
}

const testPatients: RawPatient[] = [
  {
    fullname: "Manuel António da Silva",
    birthDate: "1985-03-15",
    gender: "masculine",
    civilState: "married",
    tel: "923000001",
    documentation: "005LA000001",
    demography: {
      nationality: "Angolana",
      naturality: "Luanda",
      province: "Luanda",
      actualLocation: "Maianga",
      street: "Rua da Missão",
      homeNumber: "45",
    },
    responsibles: [
      { name: "Ana Maria da Silva", kinship: "mother", tel: "923100001" },
      { name: "Carlos A. da Silva", kinship: "father", tel: "923100002" },
    ],
    group: { type: "personal" },
    access: { type: "direct" },
  },
  {
    fullname: "Maria José dos Santos",
    birthDate: "1990-07-22",
    gender: "feminine",
    civilState: "single",
    tel: "923000002",
    documentation: "005LA000002",
    demography: {
      nationality: "Angolana",
      naturality: "Benguela",
      province: "Luanda",
      actualLocation: "Talatona",
      street: "Rua 21",
      homeNumber: "12",
    },
    responsibles: [
      { name: "Rosa M. dos Santos", kinship: "mother", tel: "923200001" },
      { name: "José F. dos Santos", kinship: "father", tel: "923200002" },
    ],
    group: {
      type: "assured",
      group: { name: "ENSA", apolice: 100200, tel: "222300400" },
    },
    access: { type: "direct" },
  },
  {
    fullname: "Pedro Miguel Fernandes",
    birthDate: "2018-11-10",
    gender: "masculine",
    civilState: "single",
    tel: "923000003",
    documentation: "005LA000003",
    demography: {
      nationality: "Angolana",
      naturality: "Luanda",
      province: "Luanda",
      actualLocation: "Viana",
      street: "Rua do Zango",
      homeNumber: "78",
    },
    responsibles: [
      { name: "Joana P. Fernandes", kinship: "mother", tel: "923300001" },
      { name: "Miguel A. Fernandes", kinship: "father", tel: "923300002" },
    ],
    group: { type: "personal" },
    access: { type: "transferred", externalUnit: "Hospital Josina Machel" },
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Execução
// ─────────────────────────────────────────────────────────────────────────────

export async function phase5(): Promise<void> {
  console.log("\n FASE 5: Utentes de Teste");

  for (const raw of testPatients) {
    // 1. Upsert do utente (match por documentação — única por utente)
    await seedCollection(
      patientModel,
      [{
        fullname: raw.fullname,
        birthDate: new Date(raw.birthDate),
        gender: raw.gender,
        civilState: raw.civilState,
        tel: raw.tel,
        documentation: raw.documentation,
      }],
      (doc) => ({ documentation: doc.documentation }),
      `Utente: ${raw.fullname}`
    );

    // Buscar o _id do utente inserido/existente
    const patientDoc = await patientModel.findOne({
      documentation: raw.documentation,
    }).lean();

    if (!patientDoc) {
      console.error(`Utente ${raw.fullname} não encontrado após upsert.`);
      continue;
    }

    const patientId = String(patientDoc._id);

    // 2. Demografia
    await seedCollection(
      demographyModel,
      [{
        patientId,
        ...raw.demography,
      }],
      (doc) => ({ patientId: doc.patientId }),
      `Demografia`
    );

    // 3. Responsáveis
    await seedCollection(
      responsibleModel,
      [{
        patientId,
        responsibles: raw.responsibles,
      }],
      (doc) => ({ patientId: doc.patientId }),
      `Responsáveis`
    );

    // 4. Grupo
    await seedCollection(
      groupModel,
      [{
        patientId,
        type: raw.group.type,
        ...(raw.group.group ? { group: raw.group.group } : {}),
      }],
      (doc) => ({ patientId: doc.patientId }),
      `Grupo`
    );

    // 5. Tipo de Acesso
    const accessData: Record<string, unknown> = {
      patientId,
      type: raw.access.type,
    };

    if (raw.access.type === "transferred" && raw.access.externalUnit) {
      accessData.externalUnitId = await resolveByName(
        externalUnitModel,
        "name",
        raw.access.externalUnit,
        "Unidade Externa"
      );
    }

    await seedCollection(
      accessTypeModel,
      [accessData],
      (doc) => ({ patientId: doc.patientId }),
      `Tipo de Acesso`
    );
  }

  console.log(`Total de utentes processados: ${testPatients.length}`);
}
