import type { Model, FilterQuery } from "mongoose";

/**
 * Upsert genérico — insere ou actualiza documentos de forma idempotente.
 * Retorna contadores de criados vs. actualizados.
 * 
 * Nota: `data` usa `Record<string, unknown>[]` porque os dados do seed 
 * contêm IDs resolvidos como string que o Mongoose converte para ObjectId.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function seedCollection<T = any>(
  model: Model<T>,
  data: Record<string, unknown>[],
  matchKey: (doc: Record<string, unknown>) => FilterQuery<T>,
  label: string
): Promise<{ created: number; updated: number }> {
  let created = 0;
  let updated = 0;

  for (const doc of data) {
    const filter = matchKey(doc);
    const exists = await model.exists(filter);

    await model.findOneAndUpdate(
      filter,
      { $set: doc },
      { upsert: true, new: true }
    );

    if (exists) {
      updated++;
    } else {
      created++;
    }
  }

  const summary = [];
  if (created > 0) summary.push(`${created} criados`);
  if (updated > 0) summary.push(`${updated} existentes`);

  console.log(`  ✓ ${label}: ${summary.join(", ") || "0 alterações"}`);

  return { created, updated };
}

/**
 * Resolve um documento por nome e retorna o _id.
 * Lança erro se não encontrar (indica problema na ordem das fases).
 */
export async function resolveByName<T>(
  model: Model<T>,
  nameField: string,
  nameValue: string,
  label: string
): Promise<string> {
  const doc = await model.findOne({ [nameField]: nameValue }).lean();
  if (!doc) {
    throw new Error(
      `[SEED] Referência não encontrada: ${label} "${nameValue}". ` +
      `Verifique se a fase anterior foi executada.`
    );
  }
  return (doc as Record<string, unknown>)._id as string;
}

/**
 * Resolve múltiplos documentos por nome num único batch.
 * Retorna um Map<nome, _id> para lookups rápidos.
 */
export async function resolveMapByName<T>(
  model: Model<T>,
  nameField: string,
  label: string
): Promise<Map<string, string>> {
  const docs = await model.find({}).lean();
  const map = new Map<string, string>();

  for (const doc of docs) {
    const record = doc as Record<string, unknown>;
    map.set(record[nameField] as string, String(record._id));
  }

  console.log(`  ↳ ${label}: ${map.size} referências carregadas`);
  return map;
}
