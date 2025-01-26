import Layout from "@/components/layout";
import StyledComponentsRegistry from "@/lib/registry";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { useEffect, useState } from "react";
import { Overlay } from "@/components/overlay";
import { DocumentSearchEngine } from "@/search-engine/document-search-engine";

export const searchEngine: DocumentSearchEngine = new DocumentSearchEngine();

export default function App({ Component, pageProps }: AppProps) {

  const [loaded, setLoaded] = useState<boolean>(false);

  useEffect(() => {
    async function init() {
      if (!searchEngine.isLoaded()) {
        await searchEngine.process("/dataset.csv");
        setLoaded(true);
      }
    }

    init();
  }, []);

  return (
    <StyledComponentsRegistry>
      <Layout>
          <Overlay showing={!loaded} />
          <Component {...pageProps} dir={"ltr"} />
      </Layout>
    </StyledComponentsRegistry>
  )
}
