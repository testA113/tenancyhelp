import os
import shutil


def init_local_storage():
    # clear the docs directory if it exists
    if os.path.exists("docs"):
        shutil.rmtree("docs")

    # create the pdf directory
    os.mkdir("docs")


if __name__ == "__main__":
    init_local_storage()
