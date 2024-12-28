import Layout from "@/components/layout";
import { SearchEngine } from "@/engine/search-engine";
import StyledComponentsRegistry from "@/lib/registry";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { useEffect, useState } from "react";
import { Document } from "@/engine/document";
import { Overlay } from "@/components/overlay";

export const searchEngine: SearchEngine = new SearchEngine();

export default function App({ Component, pageProps }: AppProps) {

  const [loaded, setLoaded] = useState<boolean>(false);

  useEffect(() => {
    async function init() {
      if (!searchEngine.isLoaded()) {
        await searchEngine.loadCsvDataset("/dataset.csv");
        searchEngine.processDocuments();
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
