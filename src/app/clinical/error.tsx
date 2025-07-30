"use client";

import Button from "@/components/ui/button";

export default function Error({
  reset
}:{
  error: Error & { digest?: string };
  reset: ()=>void;
}){
  return(
    <main className="flex h-screen flex-col items-center justify-center">
      <h2>Desculpe, tivemos um erro!</h2>
      <Button onClick={reset}>Tente novamente</Button>
    </main>
  )
} 