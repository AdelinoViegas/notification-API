"use client";

// FEEDBACK PHASE — remover após encerrar fase de testes
// Para remover: substituir por <LogoutButton> novamente no sidenav.tsx
import { BsPower } from "react-icons/bs";
import { logout } from "@/backend/api/admin";
import { toast } from "react-toastify";
import clsx from "clsx";

export default function FeedbackLogoutButton({
  className,
  goo = false,
  disabled
}: {
  className?: string;
  goo?: boolean;
  disabled?: boolean;
}) {
  const handleClick = () => {
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
      disabled={disabled}
      className={clsx(
        className ??
        "bg-red-500 hover:bg-red-400 text-white flex items-center gap-x-3 py-2 px-3 rounded-lg outline outline-1 outline-red-700",
        "disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed"
      )}
    >
      <BsPower className="w-5" />
      <div className="font-semibold text-sm">Terminar Sessão</div>
    </button>
  );
}
