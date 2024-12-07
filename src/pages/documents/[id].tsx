import { IndexScreen } from "@/screens/index.screen";
import { SearchScreen } from "@/screens/search.screen";
import Head from "next/head";
import { searchEngine } from "../_app";
import { Document } from "@/engine/document";
import { DocumentObject } from "../search";
import { DocumentScreen } from "@/screens/document.screen";

export default function DocumentPage({ document }: { document: DocumentObject; }) {
  return (
    <>
      <Head>
        <title>Document</title>
      </Head>
      
      <DocumentScreen document={document} />
    </>
  );
}

export async function getServerSideProps({ req, res, params }) {
  if (!searchEngine.isLoaded()) {
    await searchEngine.loadCsvDataset("http://localhost:3000/dataset.csv");
    await searchEngine.processDocuments(); 
  }

  const documents: Document[] = searchEngine.getDocuments();
  const document: Document = documents.find(document => document.id === parseInt(params.id));

  const parsed: DocumentObject = {
    id: document.id,
    label: document.label,
    content: document.content
  };
 
  return { props: { document: parsed } }
}
