import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { queryStore, builderPrompt } from './service';
import { openai } from './openai';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const VS_TECH = process.env.VS_TECH!;
const VS_PROJECT = process.env.VS_PROJECT!;
const VS_CASE = process.env.VS_CASE!;

app.post("/api/ask", async (req, res) => {
    try {
        const { question } = req.body;

        // Query all vector stores in parallel
        const [tech, templates, cases] = await Promise.all([
            queryStore(VS_TECH, question),
            queryStore(VS_PROJECT, question),
            queryStore(VS_CASE, question),
        ]);
        const final = await openai.responses.create({
            model: "gpt-4.1-mini",
            input: builderPrompt(question, tech, templates, cases),
        });
        res.json({ answer: final.output_text || "Sorry, I couldn't find an answer." });
    } catch (error) {
        console.error("Error occurred while processing the request:", error);
        res.status(500).json({ error: "An error occurred while processing the request." });
    }
});

app.listen(process.env.PORT || 5000, () => {
    console.log(`Server is running on port ${process.env.PORT || 5000}`);
});