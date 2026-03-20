import {openai} from "./openai";

// Query a single store
export async function queryStore(vectorStoreId: string, question: string) {
    const res = await openai.responses.create({
        model: "gpt-4.1-mini",
        input: question,
        tools: [{
            type: "file_search",
            vector_store_ids: [vectorStoreId],
        }]
    })
    return res.output_text || "";
}

export function builderPrompt(question: string, tech: string, templates: string, cases: string){
    return `
    You are a DevStack Advisor, an expert software architect.

    Provide actionable recommendations.

    - Use ALL sources
    - Recommend a clear stack
    - Reference real-world cases
    - Mention trade-offs

    ---

    User Question:
    ${question}

    ---

    Technology Profiles:
    ${tech}

    Project Templates:
    ${templates}

    Case Studies:
    ${cases}
    `;
}