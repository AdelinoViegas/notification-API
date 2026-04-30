"use client";

// FEEDBACK PHASE — remover após encerrar fase de testes
import { useState } from "react";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { MdOutlineFeedback } from "react-icons/md";
import { IoClose } from "react-icons/io5";
import { toast } from "react-toastify";
import clsx from "clsx";
import { useFeedback } from "@/components/feedback/feedback-context";

type FeedbackForm = {
  nome: string;
  setor: string;
  avaliacao: string;
  funcionou: string;
  melhorar: string;
  problemas: string;
};

const INITIAL_FORM: FeedbackForm = {
  nome: "",
  setor: "",
  avaliacao: "",
  funcionou: "",
  melhorar: "",
  problemas: "",
};

const RATINGS = [1, 2, 3, 4, 5];
const RATING_LABELS: Record<number, string> = {
  1: "Muito ruim",
  2: "Ruim",
  3: "Regular",
  4: "Bom",
  5: "Excelente",
};
const RATING_COLORS: Record<number, { selected: string; hover: string }> = {
  1: { selected: "border-red-500 bg-red-50 text-red-700",    hover: "hover:border-red-300" },
  2: { selected: "border-orange-500 bg-orange-50 text-orange-700", hover: "hover:border-orange-300" },
  3: { selected: "border-amber-500 bg-amber-50 text-amber-700",  hover: "hover:border-amber-300" },
  4: { selected: "border-lime-500 bg-lime-50 text-lime-700",    hover: "hover:border-lime-300" },
  5: { selected: "border-green-500 bg-green-50 text-green-700",   hover: "hover:border-green-300" },
};

export default function FeedbackWidget() {
  const { submitted, setSubmitted } = useFeedback();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<FeedbackForm>(INITIAL_FORM);
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.avaliacao) {
      toast.warning("Por favor, selecione uma avaliação geral.");
      return;
    }
    if (!form.melhorar.trim()) {
      toast.warning("Por favor, preencha o campo 'O que precisa melhorar'.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error("Erro ao enviar feedback");

      toast.success("Feedback enviado! Obrigado pela sua contribuição.");
      setSubmitted(true);
      setForm(INITIAL_FORM);
      setOpen(false);
    } catch {
      toast.error("Não foi possível enviar o feedback. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        title={submitted ? "Enviar novo feedback" : "Enviar feedback da fase de testes"}
        className="fixed bottom-24 right-[3vw] z-40 flex items-center gap-2 rounded-full bg-primary px-4 py-3 text-white shadow-xl hover:bg-[#0f4e87] transition-colors"
      >
        <MdOutlineFeedback className="size-6" />
        <span className="hidden sm:block text-sm font-medium">Feedback</span>
        {submitted && (
          <span className="absolute -top-1 -right-1 flex size-4 items-center justify-center rounded-full bg-green-400 text-[9px] font-bold text-white">
            ✓
          </span>
        )}
      </button>

      <Dialog
        open={open}
        onClose={() => {}}
        as="div"
        className="relative z-50 focus:outline-none"
      >
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <DialogPanel className="w-full max-w-lg rounded-xl bg-white shadow-2xl border">
            <div className="flex items-center justify-between border-b px-6 py-4">
              <div>
                <DialogTitle className="text-lg font-semibold">
                  Formulário de Feedback
                </DialogTitle>
                <p className="text-xs text-gray-500 mt-0.5">
                  Fase de testes — sua opinião é essencial
                </p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-md p-1 text-gray-400 hover:text-gray-600"
              >
                <IoClose className="size-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4 max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nome <span className="text-gray-400 font-normal">(opcional)</span>
                  </label>
                  <input
                    type="text"
                    name="nome"
                    value={form.nome}
                    onChange={handleChange}
                    placeholder="Seu nome"
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Setor <span className="text-gray-400 font-normal">(opcional)</span>
                  </label>
                  <input
                    type="text"
                    name="setor"
                    value={form.setor}
                    onChange={handleChange}
                    placeholder="Ex: Triagem, Cirurgia..."
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Avaliação geral <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-2">
                  {RATINGS.map((r) => (
                    <label key={r} className="flex-1 cursor-pointer">
                      <input
                        type="radio"
                        name="avaliacao"
                        value={String(r)}
                        checked={form.avaliacao === String(r)}
                        onChange={handleChange}
                        className="sr-only"
                      />
                      <div
                        className={clsx(
                          "flex flex-col items-center rounded-lg border-2 py-2 text-sm font-semibold transition-colors",
                          form.avaliacao === String(r)
                            ? RATING_COLORS[r].selected
                            : clsx("border-gray-200 text-gray-500", RATING_COLORS[r].hover)
                        )}
                      >
                        <span className="text-base">{r}</span>
                        <span className="text-[10px] font-normal text-center leading-tight">{RATING_LABELS[r]}</span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  O que funcionou bem{" "}
                  <span className="text-gray-400 font-normal">(opcional)</span>
                </label>
                <textarea
                  name="funcionou"
                  value={form.funcionou}
                  onChange={handleChange}
                  rows={2}
                  placeholder="Descreva os pontos positivos..."
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  O que precisa melhorar <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="melhorar"
                  value={form.melhorar}
                  onChange={handleChange}
                  rows={2}
                  placeholder="Descreva o que pode ser melhorado..."
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Problemas ou erros encontrados{" "}
                  <span className="text-gray-400 font-normal">(opcional)</span>
                </label>
                <textarea
                  name="problemas"
                  value={form.problemas}
                  onChange={handleChange}
                  rows={2}
                  placeholder="Descreva qualquer bug ou comportamento inesperado..."
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>

              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  disabled={loading}
                  className="rounded-md border border-gray-300 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="rounded-md bg-primary px-5 py-2 text-sm font-medium text-white hover:bg-[#0f4e87] disabled:opacity-60 transition-colors"
                >
                  {loading ? "Enviando..." : "Enviar feedback"}
                </button>
              </div>
            </form>
          </DialogPanel>
        </div>
      </Dialog>
    </>
  );
}
