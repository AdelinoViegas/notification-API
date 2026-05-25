"use server";

import { omitUndefined } from "mongoose";
import { ClientSession } from "mongodb";
import {
  dischargeHistoryModel,
  inHospitalizeModel,
  hospitalizationModel,
  bedNursingModel,
  nursingModel,
  internalServiceModel,
  urgencyBankModel,
  patientModel,
} from "@/backend/model";
import { getUser } from "@/backend/api/clinical/api";
import { getDataAndHoursFormat } from "@/lib/date-formater";

// ---------- tipos de alta ----------
const dischargeTypes = [
  { _id: "hospital", label: "Alta Hospitalar" },
  { _id: "medical", label: "Alta Médica" },
];

export async function getDischargeTypes() {
  return dischargeTypes;
}

// ---------- criar registo automático ----------
export async function createDischargeRecord({
  patientId,
  dischargeDate,
  dischargeType,
  reason,
  userId,
  patientExitId,
  session,
}: {
  patientId: string;
  dischargeDate: Date;
  dischargeType: string;
  reason?: string;
  userId: string;
  patientExitId: string;
  session?: ClientSession;
}) {
  try {
    // dados do paciente
    const patient = await patientModel
      .findById({ _id: patientId })
      .select({ fullname: 1, registerNumber: 1 })
      .session(session || null);

    // dados do internamento
    const hospitalization = await hospitalizationModel
      .findOne({ patientId })
      .sort({ createdAt: -1 })
      .session(session || null);

    // Nota: não filtrar por served:false porque applyDischarge já
    // marcou o registo como served:true antes de chamar esta função
    // dentro da mesma transacção.
    const inHospitalized = await inHospitalizeModel
      .findOne({ patientId })
      .sort({ createdAt: -1 })
      .session(session || null);

    // resolver cama/enfermaria/serviço
    let internalServiceName = "Desconhecido";
    let nursingName = "Desconhecido";
    let bedName = "Desconhecido";
    let admissionDate: Date | undefined;

    if (inHospitalized) {
      admissionDate = inHospitalized.createdAt;

      const bed = await bedNursingModel
        .findById({ _id: inHospitalized.bedId })
        .session(session || null);

      if (bed) {
        bedName = (bed.bed as string) ?? "Desconhecido";

        const nursing = await nursingModel
          .findById({ _id: bed.nursingId })
          .session(session || null);

        if (nursing) {
          nursingName = (nursing.name as string) ?? "Desconhecido";
        }

        const service = await internalServiceModel
          .findById({ _id: bed.internalServiceId })
          .session(session || null);

        if (service) {
          internalServiceName = (service.name as string) ?? "Desconhecido";
        }
      }
    } else if (hospitalization) {
      admissionDate = hospitalization.createdAt;

      const service = await internalServiceModel
        .findById({ _id: hospitalization.toInternalServiceId })
        .session(session || null);

      if (service) {
        internalServiceName = (service.name as string) ?? "Desconhecido";
      }
    }

    // Se não houver dados de internamento, usar data do banco de urgência
    if (!admissionDate) {
      const urgencyCreation = await urgencyBankModel
        .findOne({ patientId })
        .select({ createdAt: 1 })
        .sort({ createdAt: -1 })
        .session(session || null);
      admissionDate = urgencyCreation?.createdAt;
    }

    // diagnóstico de admissão — buscar da urgencyBank
    let admissionDiagnosis = reason ?? "Não especificado";

    if (!reason) {
      const urgency = await urgencyBankModel
        .findOne({ patientId })
        .select({ "anamnesis.generalClinic.diagnosticHypothesis": 1 })
        .session(session || null);

      if (urgency?.anamnesis?.generalClinic?.diagnosticHypothesis?.length) {
        admissionDiagnosis =
          urgency.anamnesis.generalClinic.diagnosticHypothesis.join(", ");
      }
    }

    // médico responsável
    let doctorName = "Desconhecido";
    try {
      const doctor = await getUser(userId);
      doctorName = (doctor?.fullname as string) ?? "Desconhecido";
    } catch {
      /* sem problema se não resolver */
    }

    await dischargeHistoryModel.create(
      [
        {
          patientId,
          processNumber: inHospitalized?.processNumber ?? (patient?.registerNumber as number) ?? Date.now(),
          patientName: patient?.fullname ?? "Desconhecido",
          internalServiceName,
          nursingName,
          bedName,
          admissionDate: admissionDate ?? hospitalization?.createdAt ?? new Date(),
          dischargeDate,
          dischargeType: dischargeType ?? "hospital",
          admissionDiagnosis,
          doctorName,
          doctorId: userId,
          status: "locked",
          patientExitId,
        },
      ],
      { session }
    );

    return true;
  } catch (e) {
    console.error("[DischargeHistory] Falha ao criar registo:", e);
    return false;
  }
}

// ---------- listar histórico ----------
export async function getDischargeHistory({
  name,
  processNumber,
  fromDate,
  toDate,
  page,
}: {
  name?: string;
  processNumber?: string;
  fromDate?: string;
  toDate?: string;
  page: number;
}) {
  try {
    const filter: Record<string, unknown> = {};

    if (name) {
      filter.patientName = new RegExp(`^${name}`, "i");
    }

    if (processNumber) {
      filter.processNumber = Number(processNumber);
    }

    if (fromDate || toDate) {
      filter.dischargeDate = omitUndefined({
        $gte: fromDate ? new Date(fromDate) : undefined,
        $lte: toDate ? new Date(toDate) : undefined,
      });
    }

    const totalItems = await dischargeHistoryModel.countDocuments(filter);
    const numberOfItems = 10;
    const skip = (page - 1) * numberOfItems;

    const records = await dischargeHistoryModel
      .find(filter)
      .sort({ dischargeDate: -1 })
      .skip(skip)
      .limit(numberOfItems);

    const formated = records.map((record) => ({
      id: record._id.toString(),
      processNumber: String(record.processNumber ?? ""),
      patientName: record.patientName as string,
      internalServiceName: record.internalServiceName as string,
      nursingName: record.nursingName as string,
      bedName: record.bedName as string,
      admissionDate: getDataAndHoursFormat(record.admissionDate as Date),
      dischargeDate: getDataAndHoursFormat(record.dischargeDate as Date),
      dischargeType:
        dischargeTypes.find((t) => t._id === record.dischargeType)?.label ??
        (record.dischargeType as string),
      admissionDiagnosis: record.admissionDiagnosis as string,
      doctorName: record.doctorName as string,
      status: record.status === "locked" ? "Bloqueado" : "Activo",
    }));

    return {
      records: formated,
      totalItems,
      availablePages: Math.ceil(totalItems / numberOfItems),
      currentPage: page,
    };
  } catch (e) {
    console.error("[DischargeHistory] Falha ao listar:", e);

    return {
      records: [],
      totalItems: 0,
      availablePages: 1,
      currentPage: page,
    };
  }
}

// ---------- obter registo individual ----------
export async function getDischargeRecord(id: string) {
  try {
    const record = await dischargeHistoryModel.findById({ _id: id });

    if (!record)
      throw new Error("Registo não encontrado!", { cause: "not_found" });

    return {
      id: record._id.toString(),
      patientId: record.patientId?.toString() as string,
      processNumber: record.processNumber as number,
      patientName: record.patientName as string,
      internalServiceName: record.internalServiceName as string,
      nursingName: record.nursingName as string,
      bedName: record.bedName as string,
      admissionDate: record.admissionDate as Date,
      dischargeDate: record.dischargeDate as Date,
      dischargeType: record.dischargeType as string,
      dischargeTypeLabel:
        dischargeTypes.find((t) => t._id === record.dischargeType)?.label ??
        (record.dischargeType as string),
      admissionDiagnosis: record.admissionDiagnosis as string,
      doctorName: record.doctorName as string,
      doctorId: record.doctorId as string,
      status: record.status as string,
      statusLabel: record.status === "locked" ? "Bloqueado" : "Activo",
      createdAt: record.createdAt as Date,
    };
  } catch (e) {
    console.error("[DischargeHistory] Falha ao obter registo:", e);
    return null;
  }
}
