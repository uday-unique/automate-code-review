import { ChatOpenAI } from "@langchain/openai";
import {
  LangChainStream,
  Message as VercelChatMessage,
  OpenAIStream,
  StreamingTextResponse,
} from "ai";
import { ChatCompletionMessageParam } from "ai/prompts";
import {
  ChatPromptTemplate,
  PromptTemplate,
  MessagesPlaceholder,
} from "@langchain/core/prompts";
import OpenAI from "openai";
import { createStuffDocumentsChain } from "langchain/chains/combine_documents";
import { getVectorStore } from "@/lib/astradb";
import { createRetrievalChain } from "langchain/chains/retrieval";
import { AIMessage, HumanMessage } from "@langchain/core/messages";
import { createHistoryAwareRetriever } from "langchain/chains/history_aware_retriever";
import { UpstashRedisCache } from "langchain/cache/upstash_redis";
import { Redis } from "@upstash/redis";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const messages = body.messages;

    const chatHistory = messages
      .slice(0, -1)
      .map((m: VercelChatMessage) =>
        m.role === "user"
          ? new HumanMessage(m.content)
          : new AIMessage(m.content),
      );

    const currentMessageContent = messages[messages.length - 1].content;

    const cache = new UpstashRedisCache({
      client: Redis.fromEnv(),
    });

    const { stream, handlers } = LangChainStream();

    const chatModel = new ChatOpenAI({
      modelName: "gpt-3.5-turbo",
      streaming: true,
      callbacks: [handlers],
      verbose: true,
      cache,
    });

    const rephrasingModel = new ChatOpenAI({
      modelName: "gpt-3.5-turbo",
      verbose: true,
      cache,
    });

    const retriever = (await getVectorStore()).asRetriever();

    const rephrasePrompt = ChatPromptTemplate.fromMessages([
      new MessagesPlaceholder("chat_history"),
      ["user", "{input}"],
      [
        "user",
        "Given the above conversation, generate a search query to look up in order to get information relevant to the current question. " +
          "Don't leave out any relevant keywords. only return the query and no other text.",
      ],
    ]);

    const historyAwareRetrieverChain = await createHistoryAwareRetriever({
      llm: rephrasingModel,
      retriever,
      rephrasePrompt,
    });

    const prompt = ChatPromptTemplate.fromMessages([
      [
        "system",
        "you are a chatbot for a personal portfolio website. You impersonate the website's owner. " +
          "answer the user's questions based on the below context. " +
          "whenever it makes sense, provide links to pages that contain more information about the topic from the given content. " +
          "Format your messages in markdown format.\n\n" +
          "Context:\n{context}",
      ],
      new MessagesPlaceholder("chat_history"),
      ["user", "{input}"],
    ]);

    const combineDocsChain = await createStuffDocumentsChain({
      llm: chatModel,
      prompt,
      documentPrompt: PromptTemplate.fromTemplate(
        "Page URL: {url}\n\nPage content:\n{page_content}",
      ),
      documentSeparator: "\n-------\n",
    });

    const retrievalChain = await createRetrievalChain({
      combineDocsChain,
      retriever: historyAwareRetrieverChain,
    });

    retrievalChain.invoke({
      input: currentMessageContent,
      chat_history: chatHistory,
    });

    return new StreamingTextResponse(stream);
  } catch (error) {
    console.log(error);

    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

// chat direct using openAI API's

// import { OpenAIStream, StreamingTextResponse } from "ai";
// import { ChatCompletionMessageParam } from "ai/prompts";
// import OpenAI from "openai";

// export async function POST(req: Request) {
//   try {
//     const body = await req.json();
//     const messages = body.messages;

//     const openai = new OpenAI();

//     const systemMessage: ChatCompletionMessageParam = {
//       role: "system",
//       content:
//         "you are a sarcasm bot. you answer all user questions in a sarcastic way.",
//     };

//     const response = await openai.chat.completions.create({
//       model: "gpt-3.5-turbo",
//       stream: true,
//       messages: [systemMessage, ...messages],
//     });

//     const stream = OpenAIStream(response);
//     return new StreamingTextResponse(stream);
//   } catch (error) {
//     console.log(error);

//     return Response.json({ error: "Internal server error" }, { status: 500 });
//   }
// }
