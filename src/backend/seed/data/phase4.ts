import {
  bedNursingModel,
  nursingModel,
  internalServiceModel,
} from "@/backend/model";
import { seedCollection } from "../helpers";

// ─────────────────────────────────────────────────────────────────────────────
// FASE 4: Camas (dependem das Enfermarias da Fase 3)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Gera camas sequenciais (C-01, C-02, ..., C-N) para cada enfermaria.
 * Usa o maxBedNumber da enfermaria como limite.
 */
export async function phase4(): Promise<void> {
  console.log("\n FASE 4: Camas");

  // Carregar enfermarias com o serviço interno associado
  const nursingsData = await nursingModel.find({}).lean();

  if (nursingsData.length === 0) {
    console.log("Nenhuma enfermaria encontrada. Fase 4 ignorada.");
    return;
  }

  // Carregar serviços internos para mapear ID → nome (para logging)
  const internalServices = await internalServiceModel.find({}).lean();
  const serviceNameMap = new Map<string, string>();
  for (const svc of internalServices) {
    serviceNameMap.set(String(svc._id), svc.name);
  }

  let totalBeds = 0;

  for (const nursing of nursingsData) {
    const bedCount = nursing.maxBedNumber || 0;
    if (bedCount === 0) continue;

    const beds = [];
    for (let i = 1; i <= bedCount; i++) {
      const bedName = `C-${String(i).padStart(2, "0")}`;
      beds.push({
        bed: bedName,
        nursingId: String(nursing._id),
        internalServiceId: String(nursing.internalServiceId),
      });
    }

    await seedCollection(
      bedNursingModel,
      beds,
      (doc) => ({
        bed: doc.bed,
        nursingId: doc.nursingId,
        internalServiceId: doc.internalServiceId,
      }),
      `Camas ${nursing.name} (${serviceNameMap.get(String(nursing.internalServiceId)) || "?"})`
    );

    totalBeds += bedCount;
  }

  console.log(`Total de camas processadas: ${totalBeds}`);
}
