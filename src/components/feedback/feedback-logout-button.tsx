"use client";

// FEEDBACK PHASE — remover após encerrar fase de testes
// Para remover: substituir por <LogoutButton> novamente no sidenav.tsx
import { BsPower } from "react-icons/bs";
import { logout } from "@/backend/api/admin";
import { toast } from "react-toastify";
import clsx from "clsx";
import { useFeedback } from "@/components/feedback/feedback-context";

export default function FeedbackLogoutButton({
  baseUrl,
  className,
  goo
}: {
  baseUrl: string;
  className?: string;
  goo: boolean;
}) {
  const { submitted } = useFeedback();

  const handleClick = () => {
    if (!submitted && goo) {
      toast.info(
        "Para sair, preencha primeiro o formulário de feedback. Clique no botão azul 'Feedback' na tela.",
        { autoClose: 5000 }
      );
      return;
    }
    logout()
      .then((ev) => toast.success(ev.message))
      .catch((e) => toast.error(e.response.data.message))
      .finally(() => {
        window.location.href = baseUrl ?? "/";
      });
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      title={(!submitted && goo) ? "Preencha o formulário de feedback antes de sair" : undefined}
      className={clsx(
        className ??
          "rounded-md flex w-full grow md:py-2 items-center justify-center gap-2 bg-red-100 border-red-300 border-2 hover:bg-red-200 p-3 text-sm font-medium md:flex-none md:justify-start md:p-2 md:px-3 text-red-500",
        (!submitted && goo) && "opacity-50 cursor-not-allowed hover:bg-red-100"
      )}
    >
      <BsPower className="w-5" />
      <div className="hidden md:block">Sair</div>
    </button>
  );
}
