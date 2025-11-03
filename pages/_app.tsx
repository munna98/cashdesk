// pages/_app.tsx
import { useEffect } from "react";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import QueryProvider from "@/components/providers/QueryProvider";

export default function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    fetch("/api/init-accounts").catch(console.error);
  }, []);

  return (
    <QueryProvider>
      <Component {...pageProps} />
    </QueryProvider>
  );
}
