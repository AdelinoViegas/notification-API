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
}: {
  baseUrl: string;
  className?: string;
}) {
  const { submitted } = useFeedback();

  const handleLogout = () => {
    logout()
      .then((ev) => toast.success(ev.message))
      .catch((e) => toast.error(e.response.data.message))
      .finally(() => {
        window.location.href = baseUrl ?? "/";
      });
  };

  const handleBlockedLogout = () => {
    toast.info(
      "Para sair, preencha primeiro o formulário de feedback. Clique no botão laranja 'Feedback' na tela.",
      { autoClose: 5000 }
    );
  };

  const baseClass =
    className ??
    "rounded-md flex w-full grow md:py-2 items-center justify-center gap-2 border-2 p-3 text-sm font-medium md:flex-none md:justify-start md:p-2 md:px-3";

  if (!submitted) {
    return (
      <button
        type="button"
        onClick={handleBlockedLogout}
        title="Preencha o formulário de feedback antes de sair"
        className={clsx(
          baseClass,
          "bg-gray-100 border-gray-300 text-gray-400 cursor-not-allowed"
        )}
      >
        <BsPower className="w-5" />
        <div className="hidden md:block">Sair</div>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      className={clsx(
        baseClass,
        "bg-red-100 border-red-300 hover:bg-red-200 text-red-500"
      )}
    >
      <BsPower className="w-5" />
      <div className="hidden md:block">Sair</div>
    </button>
  );
}
