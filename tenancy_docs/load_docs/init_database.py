import os
import sqlite3


def init_document_metadata_db() -> None:
    """
    Initializes the document_metadata database
    """
    # check if the database exists. if it doesn't, initialize it
    if not os.path.exists("document_metadata.db"):
        open("document_metadata.db", "w").close()

        # Connect to the database
        conn = sqlite3.connect("document_metadata.db")
        c = conn.cursor()

        # Create the document_metadata table
        c.execute(
            """
            CREATE TABLE IF NOT EXISTS document_metadata (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT NOT NULL,
                doc_type TEXT NOT NULL,
                doc_url TEXT NOT NULL,
                source TEXT NOT NULL,
                fetched_at TEXT NOT NULL,
                doc_sha256_hash TEXT NOT NULL
            )
            """
        )

        # Commit the changes
        conn.commit()

        # Close the connection to the database
        conn.close()


if __name__ == "__main__":
    init_document_metadata_db()
