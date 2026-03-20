import * as dotenv from "dotenv";

dotenv.config();

import * as fs from "fs";
import * as path from "path";
import OpenAI from "openai";

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Map folders to their respective files
const STORE_CONFIG = [
  {
    name: "vs_case_studies",
    folder: "./data/store-3-case-studies",
  },
];

async function createOrGetVectorStore(name: string) {
  const vs = await openai.vectorStores.create({
    name,
  });

  console.log(`Vector store '${name}' is ready. (ID: ${vs.id})`);
  return vs.id;
}

async function uploadFolderToStore(vectorStoreId: string, folderPath: string) {
  const files = fs
    .readdirSync(folderPath)
    .filter((file: string) => file.endsWith(".txt"))
    .map((file: string) => fs.createReadStream(path.join(folderPath, file)));
  if (files.length === 0) {
    console.warn(`No .text files found in folder: ${folderPath}`);
    return;
  }
  await openai.vectorStores.fileBatches.uploadAndPoll(vectorStoreId, { files });

  console.log(`Uploaded files from ${folderPath}`);
}

async function setup() {
    for (const store of STORE_CONFIG) {
        const vectorStoreId = await createOrGetVectorStore(store.name);
        await uploadFolderToStore(vectorStoreId, store.folder);

        console.log("------------------------------");
    }
    console.log("All vector stores are ready!");
}

setup();
