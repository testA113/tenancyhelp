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

13/04/24

- I got most of the above points done.
  - Updated the node postprocessor to have a relevant minimum, so less docs are sent for general questions
  - UI is nicer with a disclaimer, example questions and nice (although generic) styling
  - Rate limiting - done, per ip
- From the above list and new items, I want to do the following as a next step:
  - Save all gpt4 conversations, with docs for training gpt3 to fine tune gpt3
  - Allow login for accepted accounts
  - Deployment - quick and dirty initially (local manchine with tunnels?)
- After that:
  - Finetune gpt3 and offer it with a higher rate limit
  - Experiment with function calling (server to query and return indexed docs, then send to open ai assistant api). This gives cool options like:
    - react server components with structured output - e.g. email template, suggest follow up questions
  - Save chats

04/05/24

- I got all of the immediate items done! (save conversations, allow logins, and deployment with fly.io)
- To share, I need to do small fixes and tweaks, to have the existing functionality more usable:
  - Get privacy and terms pages made so that people can login with google
  - Fix iphone zoom in and submit behaviour
- I'm still keen to add the points from 13/04 after that. They are:
  - Finetune gpt3 and offer it with a higher rate limit
  - Experiment with function calling (server to query and return indexed docs, then send to open ai assistant api). This gives cool options like:
    - react server components with structured output - e.g. email template, suggest follow up questions
  - Save chats

25/05/24

- I got the small fixes done letting me share!
- gpt4o released meaning that it's much cheaper, so I just have a captcha and rate limit in place, without needing logins (yet)
- I'll still keep the converation saving going, so that I can train a gpt4 model when possible.
- Some of the next steps:
  - https://tenant.aratohu.nz/ - maybe add this as a source? the material is really good
  - experiment with adding the healthy homes standards source
  - Experiment with function calling (server to query and return indexed docs, then send to open ai assistant api). This gives cool options like:
    - react server components with structured output - e.g. email template, suggest follow up questions
  - Save chats
