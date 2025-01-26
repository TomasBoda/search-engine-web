import { SearchScreen } from "@/screens/search.screen";
import Head from "next/head";
import { searchEngine } from "./_app";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/router";
import { DocumentID } from "@/search-engine";

export interface DocumentObject {
  id: DocumentID;
  text: string;
}

export default function SearchPage() {

  const router = useRouter();
  const params = useSearchParams();

  const [documents, setDocuments] = useState<DocumentObject[]>([]);

  useEffect(() => {
    const query = params.get("query") ?? "";
    const documentData: DocumentObject[] = searchEngine.search(query, 5).map(({ id, text }) => ({ id, text }));
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