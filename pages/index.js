import { useEffect, useState } from "react";

import Messages from "components/messages";
import PromptForm from "components/prompt-form";
import Head from "next/head";
import Footer from "components/footer";

import prepareAudioFileForUpload from "lib/prepare-audio-file-for-upload";
import { getRandomSeed } from "lib/seeds";

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export const appName = "Transform Your Conversation to a Blog";
export const appSubtitle = "Attach your audio file to generate a blog post about the conversation using AI.";
export const appMetaDescription = "Turn important conversations into blog posts, with the help of AI.";

export default function Home() {
  const [events, setEvents] = useState([]);
  const [predictions, setPredictions] = useState([]);
  const [error, setError] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [seed] = useState(getRandomSeed());
  const [initialPrompt, setInitialPrompt] = useState(seed.prompt);

  useEffect(() => {
    setEvents([{ audio: seed.audio }]);
  }, [seed.audio]);

  const handleAudioDropped = async (audio) => {
    try {
      audio = await prepareAudioFileForUpload(audio);
    } catch (error) {
      setError(error.message);
      return;
    }
    setEvents(events.concat([{ audio }]));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const prompt = e.target.prompt.value;
    const lastAudio = events.findLast((ev) => ev.audio)?.audio;

    setError(null);
    setIsProcessing(true);
    setInitialPrompt("");

    const myEvents = [...events, { prompt }];
    setEvents(myEvents);

    const body = {
      prompt,
      audio: lastAudio,
    };

    const response = await fetch("/api/predictions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    let prediction = await response.json();

    if (response.status !== 201) {
      setError(prediction.detail);
      return;
    }

    while (prediction.status !== "succeeded" && prediction.status !== "failed") {
      await sleep(500);
      const response = await fetch("/api/predictions/" + prediction.id);
      prediction = await response.json();
      if (response.status !== 200) {
        setError(prediction.detail);
        return;
      }

      setPredictions(predictions.concat([prediction]));

      if (prediction.status === "succeeded") {
        setEvents(
          myEvents.concat([
            { audio: prediction.output?.[prediction.output.length - 1] },
          ])
        );
      }
    }

    setIsProcessing(false);
  };

  const startOver = async (e) => {
    e.preventDefault();
    setEvents(events.slice(0, 1));
    setError(null);
    setIsProcessing(false);
    setInitialPrompt(seed.prompt);
  };

  return (
    <div>
      <Head>
        <title>{appName}</title>
        <meta name="description" content={appMetaDescription} />
        <meta property="og:title" content={appName} />
        <meta property="og:description" content={appMetaDescription} />
        <meta property="og:image" content="https://paintbytext.chat/opengraph.jpg" />
      </Head>

      <main className="container max-w-[700px] mx-auto p-5">
        <hgroup>
          <h1 className="text-center text-5xl font-bold m-6">{appName}</h1>
          <p className="text-center text-xl opacity-60 m-6">
            {appSubtitle}
          </p>
        </hgroup>

        <Messages
          events={events}
          isProcessing={isProcessing}
          onUndo={(index) => {
            setInitialPrompt(events[index - 1].prompt);
            setEvents(
              events.slice(0, index - 1).concat(events.slice(index + 1))
            );
          }}
        />

        <PromptForm
          initialPrompt={initialPrompt}
          isFirstPrompt={events.length === 1}
          onSubmit={handleSubmit}
          disabled={isProcessing}
        />

        <div className="mx-auto w-full">
          {error && <p className="bold text-red-500 pb-5">{error}</p>}
        </div>

        <Footer
          events={events}
          startOver={startOver}
          handleAudioDropped={handleAudioDropped}
        />
      </main>
    </div>
  );
}
