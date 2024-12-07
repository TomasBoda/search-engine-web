import Layout from "@/components/layout";
import { SearchEngine } from "@/engine/search-engine";
import StyledComponentsRegistry from "@/lib/registry";
import "@/styles/globals.css";
import type { AppProps } from "next/app";

export const searchEngine: SearchEngine = new SearchEngine();

export default function App({ Component, pageProps }: AppProps) {
  return (
    <StyledComponentsRegistry>
      <Layout>
          <Component {...pageProps} dir={"ltr"} />
      </Layout>
    </StyledComponentsRegistry>
  )
}
