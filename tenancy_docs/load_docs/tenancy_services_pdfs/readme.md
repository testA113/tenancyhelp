This module gets the pdf documents from the nz tenancy website and saves their metadata in sqlite database.

If there is data already saved in the database, it will:

- add new documents that aren't in the database.
- remove documents that are no longer available.
- update the metadata of documents that have changed (based on the sha_256_hash).
