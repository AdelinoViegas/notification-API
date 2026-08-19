import { phase1 } from "./data/phase1";
import { phase2 } from "./data/phase2";
import { phase3 } from "./data/phase3";
import { phase4 } from "./data/phase4";
import { phase5 } from "./data/phase5";

/**
 * Seed de Configurações Clínicas
 * 
 * Executa a parametrização completa do módulo clínico em 5 fases,
 * respeitando as dependências entre colecções.
 * 
 * Fases 1-4: Dados de configuração (parametrização)
 * Fase 5: Utentes de teste (dados operacionais para demo)
 * 
 * NUNCA executar em produção — apenas para ambientes de
 *     desenvolvimento e apresentação.
 * 
 * Idempotente: pode ser executado múltiplas vezes sem duplicar dados.
 */
export async function runSeed(): Promise<void> {
  if (process.env.NODE_ENV === "production") {
    console.error(" [SEED] Abortado — ambiente de produção detectado.");
    return;
  }

  console.log("\n🌱 ═══════════════════════════════════════════════");
  console.log("   Seed de Configurações Clínicas");
  console.log("   ═══════════════════════════════════════════════\n");

  const start = Date.now();

  try {
    await phase1();  // Dados independentes
    await phase2();  // Categorias + Secções
    await phase3();  // Serviços Clínicos + Enfermarias
    await phase4();  // Camas
    await phase5();  // Utentes de Teste

    const elapsed = ((Date.now() - start) / 1000).toFixed(2);
    console.log(`\n✅ Seed concluído com sucesso em ${elapsed}s`);
    console.log("═══════════════════════════════════════════════════\n");
  } catch (error) {
    const elapsed = ((Date.now() - start) / 1000).toFixed(2);
    console.error(`\n❌ Seed falhou após ${elapsed}s:`, error);
    console.error("═══════════════════════════════════════════════════\n");
  }
}
