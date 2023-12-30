.PHONY: all load_docs index_docs query_docs

load_docs: load_docs/tenancy_services_pdfs/load_docs.py
	cd load_docs/tenancy_services_pdfs && poetry run python load_docs.py

index_docs: index_docs/index_docs.py
	cd index_docs/ && poetry run python index_docs.py

query_docs: query_docs/query_docs.py
	cd query_docs/ && poetry run python query_docs.py
