# Getting started

Get Poetry: https://python-poetry.org/docs/#installation

```bash
curl -sSL https://install.python-poetry.org | python3 -
```

Install dependencies:

```bash
poetry install
```

Use Poetry as the default interpreter for your project in VSCode

- Open the command palette (Ctrl+Shift+P)
- Type "Python: Select Interpreter"
- Select "Poetry Environment" or enter the path to the virtual environment created by Poetry in the tenancy_docs directory
- Restart VSCode

Set the PYTHONPATH to the root of the project

```bash
export PYTHONPATH=$(pwd) # tenancyhelp directory
```

Use the make file to run the project:

1. load the docs
