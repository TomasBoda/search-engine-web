import Head from "next/head";
import { searchEngine } from "../_app";
import { Document } from "@/engine/document";
import { DocumentObject } from "../search";
import { DocumentScreen } from "@/screens/document.screen";
import { useEffect, useState } from "react";

export default function DocumentPage({ id }: { id: number; }) {

  const [document, setDocument] = useState<DocumentObject | undefined>(undefined);

  useEffect(() => {
    const documents: Document[] = searchEngine.getDocuments();
    const doc: Document = documents.find(document => document.id === id);

    const parsed: DocumentObject = {
      id: doc.id,
      content: doc.content
    };

    setDocument(parsed);
  }, []);

  return (
    <>
      <Head>
        <title>Document</title>
      </Head>
      
      <DocumentScreen document={document} />
    </>
  );
}

export async function getServerSideProps({ params }) {
  return { props: { id: parseInt(params.id) } }
}
