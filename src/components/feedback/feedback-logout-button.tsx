"use client";

// FEEDBACK PHASE — remover após encerrar fase de testes
// Para remover: substituir por <LogoutButton> novamente no sidenav.tsx
import { BsPower } from "react-icons/bs";
import { logout } from "@/backend/api/admin";
import { toast } from "react-toastify";
import clsx from "clsx";
import { useFeedback } from "@/components/feedback/feedback-context";

export default function FeedbackLogoutButton({
  className,
  goo = false,
  disabled
}: {
  className?: string;
  goo?: boolean;
  disabled?: boolean;
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
        window.location.href = process.env.NEXT_LOGIN_PAGE_URL ?? "/";
      });
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      title={(!submitted && goo) ? "Preencha o formulário de feedback antes de sair" : undefined}
      disabled={disabled}
      className={clsx(
        className ??
        "bg-red-500 text-white flex items-center gap-x-3 py-2 px-3 rounded-lg hover:bg-red-400 outline outline-1 outline-red-700",
        (!submitted && goo) && "opacity-50 cursor-not-allowed hover:bg-red-100",
        "disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed"
      )}
    >
      <BsPower className="w-5" />
      <div className="font-semibold text-sm">Terminar Sessão</div>
    </button>
  );
}
