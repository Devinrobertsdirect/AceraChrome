import React, { useState } from 'react';
import { OpenAI } from 'openai';
import { Howl } from 'howler';

const client = new OpenAI({ apiKey: 'sk-proj-Wcs06jGd17tgxAhXZtDfT3BlbkFJHkgNoI3Sc1y5OyfG38TQ' });
const assistantId = 'asst_A8FZLaHdpKmfcBwbkZFYgKxi';
const threadId = 'thread_PIrP1sZxymrec8H6nuJflxp7';

const App = () => {
    const [assistant, setAssistant] = useState(null);
    const [thread, setThread] = useState(null);

    const askQuestionMemory = async (question) => {
        try {
            await client.beta.threads.messages.create(thread.id, {
                role: 'user',
                content: question,
            });

            const run = await client.beta.threads.runs.create({
                threadId: thread.id,
                assistantId: assistant.id,
            });

            while (true) {
                const runStatus = await client.beta.threads.runs.retrieve({
                    threadId: thread.id,
                    runId: run.id,
                });

                if (runStatus.status === 'completed') {
                    break;
                } else if (runStatus.status === 'failed') {
                    return 'The run has failed';
                }

                await new Promise((resolve) => setTimeout(resolve, 500));
            }

            const messages = await client.beta.threads.messages.list({
                threadId: thread.id,
            });

            return messages.data[0].content[0].text.value;
        } catch (error) {
            console.error('Error asking question:', error);
            return null;
        }
    };

    const generateTTS = async (sentence, speechFilePath) => {
        try {
            const response = await client.audio.speech.create({
                model: 'tts-1',
                voice: 'nova',
                input: sentence,
            });

            return response.content;
        } catch (error) {
            console.error('Error generating TTS:', error);
            return null;
        }
    };

    const playSound = async (fileContent) => {
        try {
            const blob = new Blob([fileContent], { type: 'audio/mpeg' });
            const sound = new Howl({
                src: [URL.createObjectURL(blob)],
                format: ['mp3'],
            });

            sound.play();
        } catch (error) {
            console.error('Error playing sound:', error);
        }
    };

    const TTS = async (text) => {
        const fileContent = await generateTTS(text);
        if (fileContent) {
            await playSound(fileContent);
            return 'done';
        } else {
            return 'TTS generation failed';
        }
    };

    const initializeAssistantAndThread = async () => {
        try {
            const retrievedAssistant = await client.beta.assistants.retrieve(assistantId);
            const retrievedThread = await client.beta.threads.retrieve(threadId);
            setAssistant(retrievedAssistant);
            setThread(retrievedThread);
        } catch (error) {
            console.error('Error retrieving assistant or thread:', error);
        }
    };

    return (
        <div>
            <button onClick={initializeAssistantAndThread}>Initialize Assistant and Thread</button>
            {/* Your app components and logic */}
        </div>
    );
};

export default App;