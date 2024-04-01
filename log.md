14/01/24

- I'm currently trying out the fusion retriever to query the tenancy docs.
  The fusion retriever didn't work, but RouterRetriever did. It decides one or many retrievers to use for a chat_engine. For example it will only include cases if I ask for cases that relate to the problem that I'm facing as a tenant.
- Next I need to add the residential tenancy act to the index, and also the remaining tenancy tribunal docs

18/1/24

- The residential tenancy act is now in the index, along with the remainin tenancy tribunal docs.
- The answers are good, but sometimes the tenancy services forms aren't relevant. There is a document summary function that I'll look into to hopefully give better results for this source.

13/03/24

- I got the summaries added to each tenancy service form, which improves how relevant the docs are.

02/04/24

- The backend streaming text response is similar (a subset) to the chat completions response for open ai. It uses server side events too, so the client can get a continuous stream of text. https://platform.openai.com/docs/api-reference/chat/streaming
- From trying the vercel ai sdk, there wasn't much option to get objects in the streaming response, so I did a bad hack that concatenates the documents and the message with a delimiter. https://sdk.vercel.ai/docs/api-reference/providers/openai-stream. There might be an option to get the documents into the 'data' field for a single message, but it wasn't obvious.
- The basic frontend works with this workaround which is really cool
- Next tasks are:
  - Allow the llamaindex agent to not fetch any documents for questions that don't need any references e.g. "Hi"
  - Make the frontend experience nicer
    - General styling
    - Suggested starter questions
    - Guide / disclaimer on what the app is good for
  - Rate limiting
  - MVP deployment
  - Login to allow saving chats
  - File upload
