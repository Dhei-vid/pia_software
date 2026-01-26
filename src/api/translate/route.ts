// "use server";

// import OpenAI from "openai";
// import { NextResponse } from "next/server";

// /**
//  * Translate Text using Openai
//  */
// const client = new OpenAI({
//   apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
//   dangerouslyAllowBrowser: true,
// });

// export async function POST(req: Request) {
//   const { text, sourceLang, targetLang } = await req.json();

//   const response = await client.responses.create({
//     model: "gpt-5-nano",
//     input: `Translate the following text from ${sourceLang} to ${targetLang}:\n\n${text}`,
//   });

//   return NextResponse.json({
//     translation: response.output_text,
//   });
// }
