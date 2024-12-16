"use client";

import Button from "@/components/ui/button";

export default function Error({
  error,
  reset
}:{
  error: Error & { digest?: string };
  reset: ()=>void;
}){
  return(
    <main className="flex h-screen flex-col items-center justify-center">
      <p>{error.name}</p>
      <p>{error.message}</p>
      <p>{error?.cause as string}</p>
      <Button onClick={reset}>Tente novamente</Button>
    </main>
  )
} 