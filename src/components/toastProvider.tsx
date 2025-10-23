"use client";

import { Bounce, ToastContainer } from "react-toastify";

export default function ToastProvider() {
  return (
    <ToastContainer
      position="top-right"
      autoClose={3500}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick={true}
      rtl={false}
      draggable
      pauseOnHover
      theme="light"
      transition={Bounce}
    />
  );
}