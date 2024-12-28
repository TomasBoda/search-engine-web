import { SearchScreen } from "@/screens/search.screen";
import Head from "next/head";
import { searchEngine } from "./_app";
import { Document } from "@/engine/document";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/router";

export interface DocumentObject {
  id: number;
  content: string;
}

export default function SearchPage() {

  const router = useRouter();
  const params = useSearchParams();

  const [documents, setDocuments] = useState<DocumentObject[]>([]);

  useEffect(() => {
    const query = params.get("query") ?? "";

    const documentData: DocumentObject[] = searchEngine.search(query, 5).map(document => ({
      id: document.id,
      content: document.content
    }));

    setDocuments(documentData);
  }, [router]);

  return (
    <>
      <Head>
        <title>Search Engine</title>
      </Head>
      
      <SearchScreen documents={documents} />
    </>
  );
}