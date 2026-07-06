"use server";

import {
  deceasedPatientModel,
  patientModel,
  morgueChamberModel,
  morgueAccommodationModel,
  morgueExitModel,
  db,
} from "@/backend/model";
import { getDeceasedPatient } from "@/backend/api/clinical/urgency-bank-api";
import { kinshipDegree } from "@/backend/api/clinical/translator";
import { getDataAndHoursFormat } from "@/lib/date-formater";
import { SelectionOption } from "@/components/ui/selection";
import { revalidatePath } from "next/cache";

/** Traduz o _id do grau de parentesco (ex: "father") para o label em português (ex: "Pai") */
function kinshipLabel(id?: string | null): string {
  if (!id) return "—";
  return kinshipDegree.find((k) => k._id === id)?.label ?? id;
}


export type MorgueWaitingPatient = {
  id: string;
  fullname: string;
  gender: string;
  processNumber: string;
  admissionDate: string;
  dateOfDeath: string;
  service: string;
};

export type MorgueAccommodatedPatient = {
  id: string;            // accommodationId
  fullname: string;
  chamber: string;
  drawer: string;
  responsibleName: string;
  responsibleBI: string;
  responsibleContact: string;
  responsibleKinship: string;
};

export type MorguePatientDetail = {
  patientId: string;
  fullname: string;
  gender: string;
  age: string;
  processNumber: string;
  admissionDate: string;
  dateOfDeath: string;
  service: string;
  admissionDiagnosis: string;
  responsibleName: string;
  responsibleContact: string;
  responsibleKinship: string;
};

// ─── Lista de Espera ─────────────────────────────────────────────────────────

export async function getMorgueWaitingList({ name }: { name?: string } = {}) {
  try {
    const deceasedList = await deceasedPatientModel.find();

    // IDs de pacientes já com registo de acomodação na morgue
    const accommodated = await morgueAccommodationModel.find().select({ patientId: 1 });
    const accommodatedIds = new Set(accommodated.map((a) => a.patientId?.toString()));

    const result: MorgueWaitingPatient[] = [];

    for (const deceased of deceasedList) {
      const pid = deceased.patientId?.toString() ?? "";
      if (accommodatedIds.has(pid)) continue; // já acomodado

      // Consistência com getDeathHistories: apenas utentes com served: true
      const patient = await patientModel.findOne({
        _id: deceased.patientId,
        served: true,
      }).select({ fullname: 1, gender: 1, registerNumber: 1 });

      if (!patient) continue;

      // Reutilizar getDeceasedPatient para obter dados completos (service, admissionDate, etc.)
      const detail = await getDeceasedPatient(pid);

      result.push({
        id: pid,
        fullname: patient.fullname ?? "",
        gender: patient.gender ?? "—",
        processNumber: patient.registerNumber?.toString() ?? "—",
        admissionDate: detail?.admissionDate ?? "—",
        dateOfDeath: detail?.dateOfDeath ?? "—",
        service: detail?.service ?? "Desconhecido",
      });
    }

    if (name) {
      return result.filter((p) =>
        p.fullname.toLowerCase().startsWith(name.toLowerCase())
      );
    }

    return result;
  } catch (e) {
    console.error(e);
    return [];
  }
}

// ─── Acomodados ──────────────────────────────────────────────────────────────

export async function getMorgueAccommodated({
  name,
  responsibleName,
  responsibleBI,
}: {
  name?: string;
  responsibleName?: string;
  responsibleBI?: string;
} = {}) {
  try {
    const accommodations = await morgueAccommodationModel.find({ served: false });
    const result: MorgueAccommodatedPatient[] = [];

    for (const acc of accommodations) {
      const patient = await patientModel
        .findOne({ _id: acc.patientId, served: true })
        .select({ fullname: 1 });
      const chamber = await morgueChamberModel
        .findById(acc.chamberId)
        .select({ name: 1 });

      if (!patient) continue;

      result.push({
        id: acc._id.toString(),
        fullname: patient.fullname ?? "",
        chamber: chamber?.name ?? "—",
        drawer: acc.drawer ?? "—",
        responsibleName: acc.responsible?.name ?? "—",
        responsibleBI: acc.responsible?.idNumber ?? "—",
        responsibleContact: acc.responsible?.contact ?? "—",
        responsibleKinship: kinshipLabel(acc.responsible?.kinship),
      });
    }

    return result.filter((item) => {
      const byName = !name || item.fullname.toLowerCase().startsWith(name.toLowerCase());
      const byResponsible =
        !responsibleName ||
        item.responsibleName.toLowerCase().startsWith(responsibleName.toLowerCase());
      const byBI = !responsibleBI || item.responsibleBI.startsWith(responsibleBI);
      return byName && byResponsible && byBI;
    });
  } catch (e) {
    console.error(e);
    return [];
  }
}

// ─── Detalhe do falecido (para página de acomodação) ─────────────────────────

export async function getMorguePatientDetail(patientId: string): Promise<MorguePatientDetail | null> {
  try {
    // Verificar consistência: apenas utentes marcados como served
    const patient = await patientModel.findOne({ _id: patientId, served: true })
      .select({ gender: 1, birthDate: 1 });

    if (!patient) return null;

    // Reutilizar a função do histórico de óbitos — mesma lógica, sem duplicação
    const detail = await getDeceasedPatient(patientId);

    if (!detail) return null;

    const age = patient.birthDate
      ? Math.floor(
          (Date.now() - new Date(patient.birthDate).getTime()) / (365.25 * 24 * 3600 * 1000)
        ).toString()
      : "—";

    return {
      patientId,
      fullname: detail.fullname ?? "",
      gender: patient.gender ?? "—",
      age,
      processNumber: detail.processNumber?.toString() ?? "—",
      admissionDate: detail.admissionDate ?? "—",
      dateOfDeath: detail.dateOfDeath ?? "—",
      service: detail.service ?? "Desconhecido",
      admissionDiagnosis: detail.admissionDiagnosis ?? "—",
      responsibleName: "—",
      responsibleContact: "—",
      responsibleKinship: "—",
    };
  } catch (e) {
    console.error(e);
    return null;
  }
}

// ─── Detalhe de uma acomodação (para página de saída) ────────────────────────

export async function getMorgueAccommodationDetail(accommodationId: string) {
  try {
    const acc = await morgueAccommodationModel.findById(accommodationId);
    if (!acc) return null;

    const patientId = acc.patientId?.toString() ?? "";
    const detail = await getMorguePatientDetail(patientId);
    if (!detail) return null;

    return {
      ...detail,
      accommodationId,
      // Sobrescreve com os dados reais do responsável pela entrada
      responsibleName: acc.responsible?.name ?? "—",
      responsibleContact: acc.responsible?.contact ?? "—",
      responsibleKinship: kinshipLabel(acc.responsible?.kinship),
    };
  } catch (e) {
    console.error(e);
    return null;
  }
}

// ─── Câmaras ─────────────────────────────────────────────────────────────────

export async function getChambers(): Promise<SelectionOption[]> {
  try {
    const chambers = await morgueChamberModel.find().select({ name: 1 });
    return chambers.map((c) => ({ _id: c._id.toString(), label: c.name ?? "" }));
  } catch (e) {
    console.error(e);
    return [];
  }
}

export async function getChambersWithDetails() {
  try {
    return await morgueChamberModel.find();
  } catch (e) {
    console.error(e);
    return [];
  }
}

export async function getAvailableDrawers(chamberId: string): Promise<SelectionOption[]> {
  try {
    if (!chamberId) return [];

    const chamber = await morgueChamberModel.findById(chamberId);
    if (!chamber) return [];

    const usedAccommodations = await morgueAccommodationModel.find({
      chamberId,
      served: false,
    }).select({ drawer: 1 });

    const usedDrawers = new Set(usedAccommodations.map((a) => a.drawer));

    const available: SelectionOption[] = [];
    for (let i = 1; i <= (chamber.maxDrawers ?? 10); i++) {
      const label = `Gaveta ${i}`;
      if (!usedDrawers.has(label)) {
        available.push({ _id: label, label });
      }
    }

    return available;
  } catch (e) {
    console.error(e);
    return [];
  }
}

// ─── Server Actions ───────────────────────────────────────────────────────────

export async function accommodatePatient(
  prev: unknown,
  formData: FormData
): Promise<{ message: string; status: boolean; guideData?: object }> {
  try {
    const patientId = formData.get("patientId") as string;
    const chamberId = formData.get("chamberId") as string;
    const drawer = formData.get("drawer") as string;
    const responsibleName = formData.get("responsibleName") as string;
    const responsibleBI = formData.get("responsibleBI") as string;
    const responsibleContact = formData.get("responsibleContact") as string;
    const responsibleKinship = formData.get("responsibleKinship") as string;

    if (!patientId || !chamberId || !drawer) {
      return { message: "Preencha todos os campos obrigatórios.", status: false };
    }

    const existing = await morgueAccommodationModel.findOne({ patientId, served: false });
    if (existing) {
      return { message: "Utente já está acomodado na morgue.", status: false };
    }

    const [acc] = await morgueAccommodationModel.create([{
      patientId,
      chamberId,
      drawer,
      responsible: {
        name: responsibleName,
        idNumber: responsibleBI,
        contact: responsibleContact,
        kinship: responsibleKinship,
      },
      served: false,
    }]);

    // Reutilizar getDeceasedPatient para dados do guia
    const detail = await getDeceasedPatient(patientId);
    const chamber = await morgueChamberModel.findById(chamberId).select({ name: 1 });

    const guideData = {
      accommodationId: acc._id.toString(),
      fullname: detail?.fullname ?? "",
      processNumber: detail?.processNumber?.toString() ?? "",
      gender: (await patientModel.findById(patientId).select({ gender: 1 }))?.gender ?? "—",
      service: detail?.service ?? "—",
      admissionDate: detail?.admissionDate ?? "—",
      dateOfDeath: detail?.dateOfDeath ?? "—",
      chamberName: chamber?.name ?? "",
      drawer,
      responsibleName,
      responsibleBI,
      responsibleContact,
      responsibleKinship: kinshipLabel(responsibleKinship),
      issuedAt: getDataAndHoursFormat(new Date()),
    };

    revalidatePath("/clinical/morgue");

    return {
      message: "Utente acomodado com sucesso!",
      status: true,
      guideData,
    };
  } catch (e) {
    console.error(e);
    return { message: "Não foi possível acomodar o utente.", status: false };
  }
}

export async function registerBodyExit(
  prev: unknown,
  formData: FormData
): Promise<{ message: string; status: boolean; exitData?: object }> {
  try {
    const accommodationId = formData.get("accommodationId") as string;
    const patientId = formData.get("patientId") as string;

    const responsibleExitName = formData.get("responsibleExitName") as string;
    const responsibleExitBI = formData.get("responsibleExitBI") as string;
    const responsibleExitContact = formData.get("responsibleExitContact") as string;
    const responsibleExitKinship = formData.get("responsibleExitKinship") as string;

    const transportType = formData.get("transportType") as "family" | "funeral_agency";

    const transportFamilyName = formData.get("transportFamilyName") as string;
    const transportFamilyKinship = formData.get("transportFamilyKinship") as string;
    const transportFamilyBI = formData.get("transportFamilyBI") as string;
    const transportFamilyContact = formData.get("transportFamilyContact") as string;

    const transportAgencyName = formData.get("transportAgencyName") as string;
    const transportAgencyResponsible = formData.get("transportAgencyResponsible") as string;
    const transportAgencyDriver = formData.get("transportAgencyDriver") as string;
    const transportAgencyVehicleBrand = formData.get("transportAgencyVehicleBrand") as string;
    const transportAgencyVehicleColor = formData.get("transportAgencyVehicleColor") as string;
    const transportAgencyLicensePlate = formData.get("transportAgencyLicensePlate") as string;

    const docDeathCertificate = formData.get("docDeathCertificate") === "on";
    const docFamilyAuthorization = formData.get("docFamilyAuthorization") === "on";
    const docAgencyTransportGuide = formData.get("docAgencyTransportGuide") === "on";
    const docJudicialAuthorization = formData.get("docJudicialAuthorization") === "on";

    const destinationType = formData.get("destinationType") as string;
    const destinationOther = formData.get("destinationOther") as string;

    await db.transaction(async (session) => {
      await morgueExitModel.create([{
        accommodationId,
        patientId,
        responsibleExit: {
          name: responsibleExitName,
          idNumber: responsibleExitBI,
          contact: responsibleExitContact,
          kinship: responsibleExitKinship,
        },
        transportType,
        transportFamily: transportType === "family" ? {
          name: transportFamilyName,
          kinship: transportFamilyKinship,
          idNumber: transportFamilyBI,
          contact: transportFamilyContact,
        } : undefined,
        transportAgency: transportType === "funeral_agency" ? {
          name: transportAgencyName,
          responsible: transportAgencyResponsible,
          driver: transportAgencyDriver,
          vehicleBrand: transportAgencyVehicleBrand,
          vehicleColor: transportAgencyVehicleColor,
          licensePlate: transportAgencyLicensePlate,
        } : undefined,
        documents: {
          deathCertificate: docDeathCertificate,
          familyAuthorization: docFamilyAuthorization,
          agencyTransportGuide: docAgencyTransportGuide,
          judicialAuthorization: docJudicialAuthorization,
        },
        destinationType,
        destinationOther: destinationType === "other" ? destinationOther : undefined,
      }], { session });

      await morgueAccommodationModel.findByIdAndUpdate(
        accommodationId,
        { served: true },
        { session }
      );
    });

    // Dados para PDF — reutilizar getDeceasedPatient
    const acc = await morgueAccommodationModel.findById(accommodationId);
    const chamber = acc?.chamberId
      ? await morgueChamberModel.findById(acc.chamberId).select({ name: 1 })
      : null;
    const detail = await getDeceasedPatient(patientId);
    const patient = await patientModel.findById(patientId).select({ gender: 1, birthDate: 1 });

    const age = patient?.birthDate
      ? Math.floor(
          (Date.now() - new Date(patient.birthDate).getTime()) / (365.25 * 24 * 3600 * 1000)
        ).toString()
      : "—";

    const destinationLabels: Record<string, string> = {
      home: "Casa",
      cemetery: "Cemitério",
      wake: "Velório",
      military_unit: "Unidade Militar",
      other: destinationOther ?? "Outro",
    };

    const exitData = {
      fullname: detail?.fullname ?? "",
      processNumber: detail?.processNumber?.toString() ?? "",
      gender: patient?.gender ?? "—",
      age,
      dateOfDeath: detail?.dateOfDeath ?? "—",
      responsibleEntry: acc?.responsible?.name ?? "",
      responsibleEntryContact: acc?.responsible?.contact ?? "",
      responsibleEntryKinship: kinshipLabel(acc?.responsible?.kinship),
      chamberName: chamber?.name ?? "",
      drawer: acc?.drawer ?? "",
      responsibleExitName,
      responsibleExitBI,
      responsibleExitContact,
      responsibleExitKinship: kinshipLabel(responsibleExitKinship),
      transportType,
      transportFamilyName: transportType === "family" ? transportFamilyName : "",
      transportFamilyKinship: transportType === "family" ? kinshipLabel(transportFamilyKinship) : "",
      transportAgencyName: transportType === "funeral_agency" ? transportAgencyName : "",
      transportAgencyDriver: transportType === "funeral_agency" ? transportAgencyDriver : "",
      transportAgencyVehicleBrand: transportType === "funeral_agency" ? transportAgencyVehicleBrand : "",
      transportAgencyLicensePlate: transportType === "funeral_agency" ? transportAgencyLicensePlate : "",
      docDeathCertificate,
      docFamilyAuthorization,
      docAgencyTransportGuide,
      docJudicialAuthorization,
      destination: destinationLabels[destinationType] ?? destinationType,
      issuedAt: getDataAndHoursFormat(new Date()),
    };

    revalidatePath("/clinical/morgue");

    return {
      message: "Saída do corpo registada com sucesso!",
      status: true,
      exitData,
    };
  } catch (e) {
    console.error(e);
    return { message: "Não foi possível registar a saída do corpo.", status: false };
  }
}

export async function createChamber(
  prev: unknown,
  formData: FormData
): Promise<{ message: string; status: boolean }> {
  try {
    const name = formData.get("name") as string;
    const maxDrawers = parseInt(formData.get("maxDrawers") as string, 10);

    if (!name || isNaN(maxDrawers) || maxDrawers < 1) {
      return { message: "Preencha todos os campos correctamente.", status: false };
    }

    await morgueChamberModel.create({ name, maxDrawers });
    revalidatePath("/clinical/morgue");

    return { message: "Câmara cadastrada com sucesso!", status: true };
  } catch (e: unknown) {
    const err = e as { code?: number };
    if (err.code === 11000) {
      return { message: "Já existe uma câmara com este nome.", status: false };
    }
    console.error(e);
    return { message: "Não foi possível cadastrar a câmara.", status: false };
  }
}

export async function updateChamber(
  prev: unknown,
  formData: FormData
): Promise<{ message: string; status: boolean }> {
  try {
    const id = formData.get("id") as string;
    const name = formData.get("name") as string;
    const maxDrawers = parseInt(formData.get("maxDrawers") as string, 10);

    await morgueChamberModel.findByIdAndUpdate(id, { name, maxDrawers });
    revalidatePath("/clinical/morgue");

    return { message: "Câmara actualizada com sucesso!", status: true };
  } catch (e) {
    console.error(e);
    return { message: "Não foi possível actualizar a câmara.", status: false };
  }
}
