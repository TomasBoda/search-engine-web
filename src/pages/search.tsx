import { SearchScreen } from "@/screens/search.screen";
import Head from "next/head";
import { searchEngine } from "./_app";
import { Document } from "@/engine/document";

export interface DocumentObject {
  id: number;
  content: string;
}

export default function SearchPage({ documents }: { documents: DocumentObject[]; }) {
  return (
    <>
      <Head>
        <title>Search Engine</title>
      </Head>
      
      <SearchScreen documents={documents} />
    </>
  );
}

export async function getServerSideProps({ req, res, query, resolvedUrl }) {
  const protocol = req.headers["x-forwarded-proto"] || (req.connection.encrypted ? "https" : "http");
  const host = req.headers.host;
  const currentUrl = `${protocol}://${host}${req.url}`;

  if (!searchEngine.isLoaded()) {
      //await searchEngine.loadCsvDataset(currentUrl + "dataset.csv");
      await searchEngine.loadCsvDataset("https://synergyagency.sk/assets/dataset.csv");
      searchEngine.processDocuments(); 
  }

  const documents: Document[] = searchEngine.search(query.query, 5);
  const documentData: DocumentObject[] = documents.map(document => ({
    id: document.id,
    content: document.content
  }));
 
  return { props: { documents: documentData } }
}
