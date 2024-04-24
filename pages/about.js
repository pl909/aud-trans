import Head from "next/head";
import Link from "next/link";
import { ArrowLeft as ArrowLeftIcon } from "lucide-react";

import appName from "./index";

export default function About() {
  return (
    <div>
      <Head>
        <title>{appName}</title>
      </Head>

      <main className="container max-w-[600px] mx-auto p-5">
        <h1 className="text-center text-5xl font-bold m-6">{appName}</h1>

        <p className="prose">
          This open-source website provides a simple interface for transcibing audio to a transcript, 
          making speaker encodings, and finally generating a blog post about the conversation with as Large Language Model. 
          You can upload an audio file to retrieve the end post.
        </p>

        <p className="prose">
          The speech to text transcription powered by{" "}
          <Link href="https://aws.amazon.com/transcribe/">
            Amazon Transcribe
          </Link>
          and we use{" "}
          <Link href="https://aws.amazon.com/transcribe/">
            Amazon Bedrock
          </Link>
          to generate the blog.

          This project was created at the Duke by Peter Liu, Sanjeev Chauhan, Benjamin Chauhan, Hadi Chaudri.
        </p>

        

        <div className="text-center mt-10">
          <Link
            href="/"
            className="bg-black text-white rounded-md text-small inline-block p-3 flex-none">

            <ArrowLeftIcon className="icon" />Back to transcription.
          </Link>
        </div>
      </main>
    </div>
  );
}
