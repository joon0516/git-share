import Head from "next/head";
import Link from "next/link";
import FileTree from "~/components/fileTree";
import { None } from "~/utils/option";

export default function Home() {
  return (
    <>
      <Head>
        <title>Create T3 App</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center bg-slate-900">
        <FileTree owner="neskech" repository="uniBot" path="" branch={None()} onItemSelected={console.log}/> 
      </main>
    </>
  );
}
