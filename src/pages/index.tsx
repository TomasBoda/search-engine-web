import { IndexScreen } from "@/screens/index.screen";
import Head from "next/head";

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
  return { props: {} }
}