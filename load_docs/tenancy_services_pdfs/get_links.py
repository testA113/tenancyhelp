from datetime import datetime
import json
import logging
from bs4 import BeautifulSoup
from load_docs.tenancy_services_pdfs.utils import save_cookies
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver import WebDriver

skipTerms = [
    "hindi",
    "korean",
    "samoan",
    "simplified-chinese",
    "tongan",
    "maori",
    "chinese-simplified",
]


def get_web_page() -> None:
    """
    Retrieves the web page content, saves the cookies, and saves the page source to a file.

    This function uses Selenium WebDriver to open a Firefox browser, navigate to a specific webpage,
    and click the 'Show more' button until it is no longer visible. It then saves the page source to
    a file named 'links.html' and saves the cookies to a JSON file.

    Note: This function requires the Selenium WebDriver and Firefox browser to be installed.

    Returns:
        None
    """
    # Create a new instance of the Firefox driver
    driver = webdriver.Firefox()

    # Go to the webpage
    driver.get("https://www.tenancy.govt.nz/forms-and-resources")

    # Save the cookies to a json file
    save_cookies(driver)

    # Wait for the page to load
    WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.TAG_NAME, "tr")))

    # Click the 'Show more' button until it is no longer visible
    prev_num_rows = len(driver.find_elements(By.TAG_NAME, "tr"))
    while True:
        try:
            # Find the 'Show more' button and click it
            show_more_button = WebDriverWait(driver, 10).until(
                EC.visibility_of_element_located((By.CLASS_NAME, "btn__showmore"))
            )
            show_more_button.click()

            # Wait for more rows to load
            WebDriverWait(driver, 10).until(
                lambda _: len(driver.find_elements(By.TAG_NAME, "tr")) > prev_num_rows
            )

            prev_num_rows = len(driver.find_elements(By.TAG_NAME, "tr"))
        except Exception as e:
            # If the 'Show more' button is no longer visible, finish the loop
            print("No more 'Show more' button. Exiting loop.")
            break

    # Save the page source to 'links.html'
    with open("links.html", "w") as f:
        f.write(driver.page_source)

    # Close the driver
    driver.quit()


def get_links_from_html() -> None:
    """
    Extracts links from an HTML file and saves them to a CSV file.

    Reads the content of an HTML file, finds all table rows containing anchor tags with the class 'pdf',
    extracts the document title and URL, and saves them to a CSV file along with the current timestamp.

    Args:
        None

    Returns:
        None
    """
    # Rest of the code...


def get_links_from_html() -> None:
    # Open the HTML file and read its content
    with open("links.html", "r") as f:
        html_doc = f.read()

    soup = BeautifulSoup(html_doc, "html.parser")

    # get all tr that contain an anchor tag with the class 'pdf'
    pdf_rows = soup.find_all("tr")
    logging.debug(f"Found {len(pdf_rows)} rows")

    # get the fetched_at date time from the current time (utc timezone)
    fetched_at = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    count_saved = 0
    doc_type = "pdf"
    with open("links.csv", "w") as f:
        # Write the header row (title, doc_type, doc_url, fetched_at, doc_sha256_hash)
        f.write("title,doc_type,doc_url,fetched_at\n")
        for pdf_row in pdf_rows:
            # Get the url from the 'a' tag
            anchor_element = pdf_row.find("a", class_="pdf")
            if not anchor_element:
                continue
            doc_url = "https://www.tenancy.govt.nz" + anchor_element.get("href")
            # Skip the file if it contains any of the skip terms
            if any(term in doc_url for term in skipTerms):
                continue

            # Get the title of the document (class 'listing_result_title')
            title_element = pdf_row.find("p", class_="listing_result_title")
            if not title_element:
                continue
            title = title_element.text.strip()

            # Write the row to the file
            f.write(f"{title},{doc_type},{doc_url},{fetched_at}\n")
            count_saved += 1

    logging.debug(f"Saved {count_saved} rows to links.csv")


# Get the cooke with a name including 'incap_ses_' save it to a json file
def save_tenancy_cookies(driver: WebDriver) -> None:
    """
    Save the tenancy cookies from the WebDriver session.

    Args:
        driver (WebDriver): The WebDriver session.

    Returns:
        None
    """
    all_cookies = driver.get_cookies()
    cookie_name = ""
    cookie_value = ""
    for cookie in all_cookies:
        if "incap_ses_" in cookie["name"]:
            cookie_name = cookie["name"]
            cookie_value = cookie["value"]
            break
    save_cookies(cookie_name, cookie_value)


if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO)
    get_web_page()
    get_links_from_html()
