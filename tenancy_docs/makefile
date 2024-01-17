.PHONY: load_docs index_docs query_docs load_tenancy_pdfs load_tribunal_cases

# Loading docs
load_docs: 
	make initialise_db
	make initiialise_storage
	make load_tenancy_pdfs
	make load_tribunal_cases
	make load_residential_tenancies_act
initialise_db: load_docs/init_database.py
	cd load_docs/ && poetry run python init_database.py
initiialise_storage: load_docs/init_storage.py
	cd load_docs/ && poetry run python init_storage.py
load_tenancy_pdfs: load_docs/tenancy_services_pdfs/load_tenancy_services_pdfs.py
	cd load_docs/tenancy_services_pdfs && poetry run python load_tenancy_services_pdfs.py
load_tribunal_cases: load_docs/tribunal_cases/load_tribunal_cases.py
	cd load_docs/tribunal_cases && poetry run python load_tribunal_cases.py
load_residential_tenancies_act: load_docs/residential_tenancies_act/load_residential_tenancies_act.py
	cd load_docs/residential_tenancies_act && poetry run python load_residential_tenancies_act.py

# Indexing docs
index_docs: index_docs/index_docs.py
	cd index_docs/ && poetry run python index_docs.py

# Querying docs
query_docs: query_docs/query_docs.py
	cd query_docs/ && poetry run python query_docs.py
