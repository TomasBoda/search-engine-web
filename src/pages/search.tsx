import { IndexScreen } from "@/screens/index.screen";
import { SearchScreen } from "@/screens/search.screen";
import Head from "next/head";
import { searchEngine } from "./_app";
import { Document } from "@/engine/document";

export interface DocumentObject {
  id: number;
  label: number;
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

export async function getServerSideProps({ req, res, query }) {
  if (!searchEngine.isLoaded()) {
    await searchEngine.loadCsvDataset("http://localhost:3000/dataset.csv");
    await searchEngine.processDocuments(); 
  }

  const documents: Document[] = searchEngine.search(query.query, 5);
  const documentData: DocumentObject[] = documents.map(document => ({
    id: document.id,
    label: document.label,
    content: document.content
  }));
 
  return { props: { documents: documentData } }
}
