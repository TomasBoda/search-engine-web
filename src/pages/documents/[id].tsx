import Head from "next/head";
import { searchEngine } from "../_app";
import { DocumentObject } from "../search";
import { DocumentScreen } from "@/screens/document.screen";
import { useEffect, useState } from "react";
import { DocumentID } from "@/engine/lib";

export default function DocumentPage({ id }: { id: DocumentID; }) {

  const [document, setDocument] = useState<DocumentObject | undefined>(undefined);

  useEffect(() => {
    const { text } = searchEngine.getDocumentById(id);
    setDocument({ id, text });
  }, [id]);

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
  return { props: { id: params.id } }
}
