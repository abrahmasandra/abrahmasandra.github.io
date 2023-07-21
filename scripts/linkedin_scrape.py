from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from bs4 import BeautifulSoup as bs
import re as re
import time
import pandas as pd
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
import getpass
import json

def scrape_linkedin_profile(EMAIL, USERNAME, PASSWORD):
    chrome_options = Options()
    chrome_options.add_argument("--headless")  # Run Chrome in headless mode (no visible browser window)
    service_object = Service("/usr/local/bin/chromedriver")

    driver = webdriver.Chrome(service=service_object, options=chrome_options)

    driver.get("https://www.linkedin.com/uas/login")
    time.sleep(3)

    def login_linkedin():
        email = driver.find_element(By.ID,"username")
        email.send_keys(EMAIL)
        password = driver.find_element(By.ID,"password")
        password.send_keys(PASSWORD)

        time.sleep(3)
        password.send_keys(Keys.RETURN)

    login_linkedin()

    # Send an HTTP GET request to the LinkedIn experiences page
    driver.get(f"https://www.linkedin.com/in/{USERNAME}/details/experience/")
    time.sleep(5)

    def extract_work_exp():
        # Find the section that contains work experiences
        work_experiences_section = driver.find_element(By.CLASS_NAME, "pvs-list__container")

        # Initialize an empty list to store work experiences
        work_experiences = []

        # Iterate through each work experience entry
        work_entries = work_experiences_section.find_elements(By.CLASS_NAME, "artdeco-list__item")

        for work_entry in work_entries:
            # Extract the relevant information from the elements
            place = work_entry.find_element(By.CLASS_NAME, "justify-space-between")
            data = place.find_elements(By.CSS_SELECTOR,"span[aria-hidden]")

            description = work_entry.find_elements(By.CSS_SELECTOR, ".pvs-list__outer-container span[aria-hidden]")

            data.extend(description)
            data = [d.text for d in data]

            # create a dictionary to store the extracted data
            work_experience = {}
            work_experience["position"] = data[0]
            work_experience["company"] = data[1].split("·")[0].strip()
            work_experience["duration"] = data[2].split("·")[0].strip()
            work_experience["location"] = data[3].split("·")[0].strip()
            work_experience["description"] = data[4].split('\n\n')

            work_experiences.append(work_experience)
        
        return work_experiences

    return extract_work_exp()

if __name__ == "__main__":
    EMAIL = input("Enter your LinkedIn email: ")
    USERNAME = input("Enter your LinkedIn username: ")
    PASSWORD = getpass.getpass("Enter your LinkedIn password: ")

    try:
        work_experiences = scrape_linkedin_profile(EMAIL, USERNAME, PASSWORD)
        
        # Save the scraped data to a JSON file
        with open("data.json", "w") as json_file:
            json.dump(work_experiences, json_file)

        print("Scraped Work Experiences:")
        for experience in work_experiences:
            print(experience)
    except Exception as e:
        print("Error:", str(e))