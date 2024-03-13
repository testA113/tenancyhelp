14/01/24

- I'm currently trying out the fusion retriever to query the tenancy docs.
  The fusion retriever didn't work, but RouterRetriever did. It decides one or many retrievers to use for a chat_engine. For example it will only include cases if I ask for cases that relate to the problem that I'm facing as a tenant.
- Next I need to add the residential tenancy act to the index, and also the remaining tenancy tribunal docs

18/1/24

- The residential tenancy act is now in the index, along with the remainin tenancy tribunal docs.
- The answers are good, but sometimes the tenancy services forms aren't relevant. There is a document summary function that I'll look into to hopefully give better results for this source.

13/03/24

- I got the summaries added to each tenancy service form, which improves how relevant the docs are.
