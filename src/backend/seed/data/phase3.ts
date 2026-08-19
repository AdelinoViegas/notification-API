import {
  serviceModel,
  serviceCategoryModel,
  examClassificationModel,
  examGroupModel,
  specialtyModel,
  nursingModel,
  sectionModel,
  internalServiceModel,
} from "@/backend/model";
import { seedCollection, resolveMapByName } from "../helpers";

// ─────────────────────────────────────────────────────────────────────────────
// FASE 3: Serviços Clínicos + Enfermarias (dependem das Fases 1 e 2)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Dados dos serviços em formato legível.
 * As referências (categoria, classificação, grupo, especialidade) são nomes
 * que são resolvidos para ObjectId em runtime.
 */

interface RawService {
  name: string;
  kind: "exam" | "consultation" | "surgery";
  category: string;
  classification: string;
  group: string;
  specialty?: string;
  price: number;
}

// ── Exames Laboratoriais ────────────────────────────────────────────────────

const labExams: RawService[] = [
  { name: "Hemograma Completo", kind: "exam", category: "Hematologia", classification: "Rotina", group: "Análises Clínicas", price: 3500 },
  { name: "Velocidade de Sedimentação (VS)", kind: "exam", category: "Hematologia", classification: "Rotina", group: "Análises Clínicas", price: 2000 },
  { name: "Tempo de Protrombina (TP)", kind: "exam", category: "Hematologia", classification: "Rotina", group: "Análises Clínicas", price: 3000 },
  { name: "Grupo Sanguíneo e Rh", kind: "exam", category: "Hematologia", classification: "Rotina", group: "Análises Clínicas", price: 2500 },
  { name: "Glicemia em Jejum", kind: "exam", category: "Bioquímica", classification: "Rotina", group: "Análises Clínicas", price: 2000 },
  { name: "Ureia", kind: "exam", category: "Bioquímica", classification: "Rotina", group: "Análises Clínicas", price: 2500 },
  { name: "Creatinina", kind: "exam", category: "Bioquímica", classification: "Rotina", group: "Análises Clínicas", price: 2500 },
  { name: "Transaminases (TGO/TGP)", kind: "exam", category: "Bioquímica", classification: "Rotina", group: "Análises Clínicas", price: 4000 },
  { name: "Ácido Úrico", kind: "exam", category: "Bioquímica", classification: "Rotina", group: "Análises Clínicas", price: 2500 },
  { name: "Colesterol Total", kind: "exam", category: "Bioquímica", classification: "Rotina", group: "Análises Clínicas", price: 3000 },
  { name: "Triglicerídeos", kind: "exam", category: "Bioquímica", classification: "Rotina", group: "Análises Clínicas", price: 3000 },
  { name: "Bilirrubina Total e Fracções", kind: "exam", category: "Bioquímica", classification: "Rotina", group: "Análises Clínicas", price: 3500 },
  { name: "Proteínas Totais", kind: "exam", category: "Bioquímica", classification: "Rotina", group: "Análises Clínicas", price: 2500 },
  { name: "Urocultura", kind: "exam", category: "Microbiologia", classification: "Especial", group: "Análises Clínicas", price: 5000 },
  { name: "Hemocultura", kind: "exam", category: "Microbiologia", classification: "Especial", group: "Análises Clínicas", price: 6000 },
  { name: "Cultura de Secreções", kind: "exam", category: "Microbiologia", classification: "Especial", group: "Análises Clínicas", price: 5500 },
  { name: "Teste Rápido de Malária (TDR)", kind: "exam", category: "Parasitologia", classification: "Urgente", group: "Análises Clínicas", price: 1500 },
  { name: "Gota Espessa", kind: "exam", category: "Parasitologia", classification: "Urgente", group: "Análises Clínicas", price: 2000 },
  { name: "Exame Parasitológico de Fezes", kind: "exam", category: "Parasitologia", classification: "Rotina", group: "Análises Clínicas", price: 2000 },
  { name: "VIH 1 e 2 (Teste Rápido)", kind: "exam", category: "Imunologia e Serologia", classification: "Especial", group: "Análises Clínicas", price: 3000 },
  { name: "VDRL (Sífilis)", kind: "exam", category: "Imunologia e Serologia", classification: "Rotina", group: "Análises Clínicas", price: 2500 },
  { name: "Hepatite B (HBsAg)", kind: "exam", category: "Imunologia e Serologia", classification: "Especial", group: "Análises Clínicas", price: 4000 },
  { name: "Hepatite C (Anti-HCV)", kind: "exam", category: "Imunologia e Serologia", classification: "Especial", group: "Análises Clínicas", price: 4500 },
  { name: "PCR (Proteína C Reactiva)", kind: "exam", category: "Imunologia e Serologia", classification: "Urgente", group: "Análises Clínicas", price: 3500 },
  { name: "Widal (Febre Tifóide)", kind: "exam", category: "Imunologia e Serologia", classification: "Rotina", group: "Análises Clínicas", price: 3000 },
  { name: "Urina Tipo II", kind: "exam", category: "Urianálise", classification: "Rotina", group: "Análises Clínicas", price: 1500 },
  { name: "Urina de 24 Horas", kind: "exam", category: "Urianálise", classification: "Especial", group: "Análises Clínicas", price: 3000 },
];

// ── Exames de Imagem ────────────────────────────────────────────────────────

const imagingExams: RawService[] = [
  { name: "Raio-X do Tórax (PA)", kind: "exam", category: "Radiologia Convencional", classification: "Rotina", group: "Diagnóstico por Imagem", price: 5000 },
  { name: "Raio-X da Coluna Cervical", kind: "exam", category: "Radiologia Convencional", classification: "Rotina", group: "Diagnóstico por Imagem", price: 5000 },
  { name: "Raio-X da Coluna Lombar", kind: "exam", category: "Radiologia Convencional", classification: "Rotina", group: "Diagnóstico por Imagem", price: 5000 },
  { name: "Raio-X do Abdómen", kind: "exam", category: "Radiologia Convencional", classification: "Urgente", group: "Diagnóstico por Imagem", price: 5000 },
  { name: "Raio-X dos Membros", kind: "exam", category: "Radiologia Convencional", classification: "Urgente", group: "Diagnóstico por Imagem", price: 4500 },
  { name: "Raio-X do Crânio", kind: "exam", category: "Radiologia Convencional", classification: "Urgente", group: "Diagnóstico por Imagem", price: 5000 },
  { name: "Ecografia Abdominal", kind: "exam", category: "Ecografia", classification: "Rotina", group: "Diagnóstico por Imagem", price: 8000 },
  { name: "Ecografia Pélvica", kind: "exam", category: "Ecografia", classification: "Rotina", group: "Diagnóstico por Imagem", price: 8000 },
  { name: "Ecografia Obstétrica", kind: "exam", category: "Ecografia", classification: "Rotina", group: "Diagnóstico por Imagem", price: 10000 },
  { name: "Ecografia Renal", kind: "exam", category: "Ecografia", classification: "Rotina", group: "Diagnóstico por Imagem", price: 8000 },
  { name: "Ecografia da Tiróide", kind: "exam", category: "Ecografia", classification: "Especial", group: "Diagnóstico por Imagem", price: 8000 },
  { name: "Ecografia Mamária", kind: "exam", category: "Ecografia", classification: "Especial", group: "Diagnóstico por Imagem", price: 10000 },
  { name: "TAC Crânio-Encefálica", kind: "exam", category: "Tomografia Computadorizada", classification: "Especial", group: "Diagnóstico por Imagem", price: 35000 },
  { name: "TAC do Tórax", kind: "exam", category: "Tomografia Computadorizada", classification: "Especial", group: "Diagnóstico por Imagem", price: 40000 },
  { name: "TAC Abdominal", kind: "exam", category: "Tomografia Computadorizada", classification: "Especial", group: "Diagnóstico por Imagem", price: 40000 },
  { name: "Ressonância Magnética Cerebral", kind: "exam", category: "Ressonância Magnética", classification: "Especial", group: "Diagnóstico por Imagem", price: 80000 },
  { name: "Ressonância Magnética da Coluna", kind: "exam", category: "Ressonância Magnética", classification: "Especial", group: "Diagnóstico por Imagem", price: 80000 },
  { name: "Electrocardiograma (ECG)", kind: "exam", category: "Electrocardiografia", classification: "Rotina", group: "Exames Complementares", price: 5000 },
];

// ── Consultas ───────────────────────────────────────────────────────────────

const consultations: RawService[] = [
  { name: "Consulta de Medicina Geral", kind: "consultation", category: "Consulta Externa", classification: "Rotina", group: "Consultas Médicas", specialty: "Medicina Geral", price: 5000 },
  { name: "Consulta de Medicina Interna", kind: "consultation", category: "Consulta de Especialidade", classification: "Rotina", group: "Consultas Médicas", specialty: "Medicina Interna", price: 8000 },
  { name: "Consulta de Pediatria", kind: "consultation", category: "Consulta Externa", classification: "Rotina", group: "Consultas Médicas", specialty: "Pediatria", price: 5000 },
  { name: "Consulta de Cardiologia", kind: "consultation", category: "Consulta de Especialidade", classification: "Rotina", group: "Consultas Médicas", specialty: "Cardiologia", price: 10000 },
  { name: "Consulta de Cirurgia Geral", kind: "consultation", category: "Consulta de Especialidade", classification: "Rotina", group: "Consultas Médicas", specialty: "Cirurgia Geral", price: 8000 },
  { name: "Consulta de Ortopedia", kind: "consultation", category: "Consulta de Especialidade", classification: "Rotina", group: "Consultas Médicas", specialty: "Ortopedia e Traumatologia", price: 8000 },
  { name: "Consulta de Ginecologia", kind: "consultation", category: "Consulta de Especialidade", classification: "Rotina", group: "Consultas Médicas", specialty: "Ginecologia e Obstetrícia", price: 8000 },
  { name: "Consulta de Neurologia", kind: "consultation", category: "Consulta de Especialidade", classification: "Rotina", group: "Consultas Médicas", specialty: "Neurologia", price: 10000 },
  { name: "Consulta de Dermatologia", kind: "consultation", category: "Consulta de Especialidade", classification: "Rotina", group: "Consultas Médicas", specialty: "Dermatologia", price: 8000 },
  { name: "Consulta de Oftalmologia", kind: "consultation", category: "Consulta de Especialidade", classification: "Rotina", group: "Consultas Médicas", specialty: "Oftalmologia", price: 8000 },
  { name: "Consulta de Urologia", kind: "consultation", category: "Consulta de Especialidade", classification: "Rotina", group: "Consultas Médicas", specialty: "Urologia", price: 10000 },
  { name: "Consulta de Pneumologia", kind: "consultation", category: "Consulta de Especialidade", classification: "Rotina", group: "Consultas Médicas", specialty: "Pneumologia", price: 8000 },
  { name: "Consulta de Gastroenterologia", kind: "consultation", category: "Consulta de Especialidade", classification: "Rotina", group: "Consultas Médicas", specialty: "Gastroenterologia", price: 10000 },
  { name: "Consulta de ORL", kind: "consultation", category: "Consulta de Especialidade", classification: "Rotina", group: "Consultas Médicas", specialty: "Otorrinolaringologia", price: 8000 },
  { name: "Consulta Pré-Operatória", kind: "consultation", category: "Consulta Pré-Operatória", classification: "Pré-operatório", group: "Consultas Médicas", specialty: "Anestesiologia", price: 6000 },
  { name: "Consulta de Seguimento Pós-Operatório", kind: "consultation", category: "Consulta de Seguimento", classification: "Rotina", group: "Consultas Médicas", specialty: "Cirurgia Geral", price: 5000 },
];

// ── Cirurgias ───────────────────────────────────────────────────────────────

const surgeries: RawService[] = [
  { name: "Apendicectomia", kind: "surgery", category: "Cirurgia de Urgência", classification: "Urgente", group: "Procedimentos Cirúrgicos", price: 80000 },
  { name: "Colecistectomia", kind: "surgery", category: "Cirurgia Programada", classification: "Rotina", group: "Procedimentos Cirúrgicos", price: 120000 },
  { name: "Herniorrafia Inguinal", kind: "surgery", category: "Cirurgia Programada", classification: "Rotina", group: "Procedimentos Cirúrgicos", price: 75000 },
  { name: "Herniorrafia Umbilical", kind: "surgery", category: "Cirurgia Programada", classification: "Rotina", group: "Procedimentos Cirúrgicos", price: 70000 },
  { name: "Cesariana", kind: "surgery", category: "Cirurgia de Urgência", classification: "Urgente", group: "Procedimentos Cirúrgicos", price: 100000 },
  { name: "Laparotomia Exploradora", kind: "surgery", category: "Cirurgia de Urgência", classification: "Urgente", group: "Procedimentos Cirúrgicos", price: 150000 },
  { name: "Drenagem de Abcesso", kind: "surgery", category: "Pequena Cirurgia", classification: "Urgente", group: "Procedimentos Cirúrgicos", price: 25000 },
  { name: "Sutura de Ferida", kind: "surgery", category: "Pequena Cirurgia", classification: "Urgente", group: "Procedimentos Cirúrgicos", price: 15000 },
  { name: "Redução de Fractura", kind: "surgery", category: "Cirurgia de Urgência", classification: "Urgente", group: "Procedimentos Cirúrgicos", price: 60000 },
  { name: "Osteossíntese", kind: "surgery", category: "Cirurgia Programada", classification: "Especial", group: "Procedimentos Cirúrgicos", price: 200000 },
  { name: "Amputação", kind: "surgery", category: "Cirurgia de Urgência", classification: "Urgente", group: "Procedimentos Cirúrgicos", price: 120000 },
  { name: "Circuncisão", kind: "surgery", category: "Pequena Cirurgia", classification: "Rotina", group: "Procedimentos Cirúrgicos", price: 30000 },
  { name: "Histerectomia", kind: "surgery", category: "Cirurgia Programada", classification: "Especial", group: "Procedimentos Cirúrgicos", price: 180000 },
  { name: "Prostatectomia", kind: "surgery", category: "Cirurgia Programada", classification: "Especial", group: "Procedimentos Cirúrgicos", price: 200000 },
  { name: "Tiroidectomia", kind: "surgery", category: "Cirurgia Programada", classification: "Especial", group: "Procedimentos Cirúrgicos", price: 160000 },
];

// ── Enfermarias ─────────────────────────────────────────────────────────────

interface RawNursing {
  name: string;
  section: string;
  internalService: string;
  maxBedNumber: number;
}

const nursings: RawNursing[] = [
  { name: "ENF-A01", section: "Ala A", internalService: "Medicina Interna", maxBedNumber: 10 },
  { name: "ENF-A02", section: "Ala A", internalService: "Medicina Interna", maxBedNumber: 10 },
  { name: "ENF-B01", section: "Ala B", internalService: "Cirurgia Geral", maxBedNumber: 8 },
  { name: "ENF-B02", section: "Ala B", internalService: "Ortopedia e Traumatologia", maxBedNumber: 8 },
  { name: "ENF-C01", section: "Ala C", internalService: "Pediatria", maxBedNumber: 12 },
  { name: "ENF-C02", section: "Ala C", internalService: "Ginecologia e Obstetrícia", maxBedNumber: 10 },
  { name: "UCI-01", section: "UCI", internalService: "Cuidados Intensivos (UCI)", maxBedNumber: 6 },
];

// ─────────────────────────────────────────────────────────────────────────────
// Execução
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Resolve as referências (nomes → ObjectId) e insere serviços clínicos
 * e enfermarias.
 */
export async function phase3(): Promise<void> {
  console.log("\n FASE 3: Serviços Clínicos + Enfermarias");

  // ── Carregar mapas de referência ──────────────────────────────────────────

  // Categorias usam index composto {name, kind}, precisamos de chave composta
  const categoryDocs = await serviceCategoryModel.find({}).lean();
  const categoryMap = new Map<string, string>();
  for (const doc of categoryDocs) {
    const key = `${doc.name}::${doc.kind}`;
    categoryMap.set(key, String(doc._id));
  }
  console.log(`  ↳ Categorias: ${categoryMap.size} referências carregadas`);

  const classificationMap = await resolveMapByName(
    examClassificationModel, "name", "Classificações"
  );
  const groupMap = await resolveMapByName(
    examGroupModel, "name", "Grupos"
  );
  const specialtyMap = await resolveMapByName(
    specialtyModel, "name", "Especialidades"
  );
  const sectionMap = await resolveMapByName(
    sectionModel, "name", "Secções"
  );
  const internalServiceMap = await resolveMapByName(
    internalServiceModel, "name", "Serviços Internos"
  );

  // ── Resolver e inserir serviços ───────────────────────────────────────────

  const allServices = [...labExams, ...imagingExams, ...consultations, ...surgeries];

  const resolvedServices = allServices.map((svc) => {
    const categoryId = categoryMap.get(`${svc.category}::${svc.kind}`);
    const classificationId = classificationMap.get(svc.classification);
    const groupId = groupMap.get(svc.group);

    if (!categoryId) throw new Error(`[SEED] Categoria não encontrada: "${svc.category}" (kind: ${svc.kind})`);
    if (!classificationId) throw new Error(`[SEED] Classificação não encontrada: "${svc.classification}"`);
    if (!groupId) throw new Error(`[SEED] Grupo não encontrado: "${svc.group}"`);

    const resolved: Record<string, unknown> = {
      name: svc.name,
      kind: svc.kind,
      categoryId,
      classificationId,
      groupId,
      price: svc.price,
    };

    if (svc.specialty) {
      const specialtyId = specialtyMap.get(svc.specialty);
      if (!specialtyId) throw new Error(`[SEED] Especialidade não encontrada: "${svc.specialty}"`);
      resolved.specialtyId = specialtyId;
    }

    return resolved;
  });

  await seedCollection(
    serviceModel,
    resolvedServices,
    (doc) => ({ name: doc.name, kind: doc.kind }),
    "Serviços Clínicos"
  );

  // ── Resolver e inserir enfermarias ────────────────────────────────────────

  const resolvedNursings = nursings.map((n) => {
    const sectionId = sectionMap.get(n.section);
    const internalServiceId = internalServiceMap.get(n.internalService);

    if (!sectionId) throw new Error(`[SEED] Secção não encontrada: "${n.section}"`);
    if (!internalServiceId) throw new Error(`[SEED] Serviço Interno não encontrado: "${n.internalService}"`);

    return {
      name: n.name,
      sectionId,
      internalServiceId,
      maxBedNumber: n.maxBedNumber,
    };
  });

  await seedCollection(
    nursingModel,
    resolvedNursings,
    (doc) => ({ internalServiceId: doc.internalServiceId, name: doc.name }),
    "Enfermarias"
  );
}
