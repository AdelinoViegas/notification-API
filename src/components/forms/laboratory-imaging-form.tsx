"use client";

import InputDetails from "@/components/ui/input-details";
import InputField from "@/components/ui/input-field";
import Button from "@/components/ui/button";
import { useActionState, useEffect, useRef } from "react";
import { registerExamResult } from "@/backend/api/clinical/internal-services-api";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import ViewUserFile from "@/components/view-user-file-client";

export function LoboratoryForm({
  description,
  examId,
  serviceId,
  storageId
}: {
  description?: string;
  examId: string;
  serviceId: string;
  storageId?: string;
}) {
  const [state, action, isPending] = useActionState(registerExamResult, { message: "", status: false });
  const formRef = useRef<HTMLFormElement>(null);
  const MAX_FILE_SIZE = 1024 * 1024 * 10; // 10 MB bem definido ($10485760$ bytes)
  const router = useRouter();

  useEffect(() => {
    if (state.message) {
      if (state.status) {
        toast.success(state.message, { onOpen: router.refresh });
      } else {
        toast.warn(state.message);
      }
    }
  }, [state]);

  // Função para interceptar o envio e validar o tamanho do arquivo com segurança
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    const formData = new FormData(event.currentTarget);
    const file = formData.get("userFile") as File | null;

    if (file && file.size > MAX_FILE_SIZE) {
      event.preventDefault(); // Cancela o envio para a Server Action
      toast.warn("Arquivo muito grande! O limite máximo é de 10MB.");
      formRef.current?.reset();
      return;
    }
  };

  return (
    <form 
      action={action} 
      ref={formRef} 
      onSubmit={handleSubmit}
    >
      <input type="hidden" name="examId" value={examId} />
      <input type="hidden" name="serviceId" value={serviceId} />

      <InputDetails
        textLabel="Descrição do Resultado"
        name="description"
        defaultValue={description}
        placeholder="O resultado descritivo do exame feito"
        rows={3}
      />

      <InputField
        textLabel="Arquivo (PDF/IMAGEM/VIDEO)"
        type="file"
        name="userFile"
        accept=".pdf, video/*, image/*"
      />

      { !!storageId && <ViewUserFile  id={storageId} />}

      <Button disabled={isPending}>
        {isPending ? "A Processar..." : "Salvar"}
      </Button>
    </form>
  );
}