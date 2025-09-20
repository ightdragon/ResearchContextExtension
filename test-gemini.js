import fetch from "node-fetch";

const API_KEY = "AIzaSyDUOWexCeiv7ST7TXNd99f8bTVHUmGMPC8";

const now = new Date();
const today = now.toISOString().split("T")[0];

  let userQuery = "I want official government climate change reports from 2020 onward";
async function testGemini() {


  const prompt = `
  You are a query builder for Google Search.  
  Your task is to rewrite user requests into clean, optimized Google search queries.  
  
  Rules:
  - Only output the query string (no explanations).  
  - Use quotes around key phrases.
  - Remove filler words like "show me", "I want to know", etc.
  - Keep important keywords, entities, and topics.
  
  Time:
  - If a time expression is mentioned (e.g., "last 24 hours", "past week", "since 2020"), convert it into absolute date filters using Google's syntax.
  - Use \`after:YYYY-MM-DD\` for open-ended ranges (last 24 hours, last week, past month, since 2020).
  - Only use \`before:YYYY-MM-DD\` if the user explicitly sets an upper bound (e.g., "between", "until", "before").
  - Never add \`before:\` equal to today's date, because it excludes today.

  FileType:
  If the user mentions a document type (PDF, PPT, Word, Excel, report, presentation, slides, data table, etc.), add the correct Google operator:
  - report, research paper, whitepaper → filetype:pdf  
  - presentation, slides, deck → filetype:ppt OR filetype:pptx  
  - word doc, draft, document → filetype:doc OR filetype:docx  
  - spreadsheet, table, data sheet → filetype:xls OR filetype:xlsx  
  If no file type is mentioned, do not add a filetype filter.

  Social bias:
  - If the request is about discussions, opinions, or social platforms, keep words like "Twitter", "Reddit", "YouTube" in the query (do not remove them).  
  - If the request is about official information, research, or factual data, remove social media platform names to prioritize authoritative sources.

  - Do not add explanations, extra words, or formatting — only return the query.
  - Follow this template: "<keywords/phrases>" <location terms> <social terms> filetype:<> after:<>/before:<> site:<>

  User request: "${userQuery}"
  Today's date: ${today}
`;

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    }
  );

  const data = await response.json();
  const refined =
  data?.candidates?.[0]?.content?.parts?.[0]?.text
    ?.trim()         // remove leading/trailing whitespace
    .replace(/\s+/g, " ");
  console.log("Gemini response:", JSON.stringify(data, null, 2));
  console.log("Refined query:", refined);

}

testGemini();
