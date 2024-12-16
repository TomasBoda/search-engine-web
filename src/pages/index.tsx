import { IndexScreen } from "@/screens/index.screen";
import Head from "next/head";
import { searchEngine } from "./_app";

export default function IndexPage() {
  return (
    <>
      <Head>
        <title>Search Engine</title>
      </Head>
      
      <IndexScreen />
    </>
  );
}

export async function getServerSideProps({ req, res }) {
  const protocol = req.headers["x-forwarded-proto"] || (req.connection.encrypted ? "https" : "http");
  const host = req.headers.host;
  const currentUrl = `${protocol}://${host}${req.url}`;

  if (!searchEngine.isLoaded()) {
      await searchEngine.loadCsvDataset(currentUrl + "dataset.csv");
      await searchEngine.processDocuments(); 
  }
 
  return { props: {} }
}