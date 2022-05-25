'''
PART ONE: SETTING UP THE DATABASE TO STORE SCRAPPED DATA
'''

import pyrebase

firebaseConfig = firebaseConfig = {
  'apiKey': "AIzaSyAQXxV4M7qVO9hcbbiTNMVmBlfXr62qQWg",
  'authDomain': "leetcode-contest-ranks-fc79d.firebaseapp.com",
  'databaseURL': "https://leetcode-contest-ranks-fc79d-default-rtdb.firebaseio.com",
  'projectId': "leetcode-contest-ranks-fc79d",
  'storageBucket': "leetcode-contest-ranks-fc79d.appspot.com",
  'messagingSenderId': "1095213176408",
  'appId': "1:1095213176408:web:59a38a46a3859a60fb5c2d"
}

firebase = pyrebase.initialize_app(firebaseConfig)
DB = firebase.database()
# data = {"name" : "rahul"}
# DB.push(data)

'''
PART TWO: SCRAPING THE DATA FROM LEETCODE AND STORING IT
'''

from selenium import webdriver
from selenium.webdriver.common.keys import Keys
import pandas as pd
import time, re

options = webdriver.ChromeOptions()
options.binary_location = r"C:\Program Files\BraveSoftware\Brave-Browser\Application\brave.exe"
chrome_driver_binary = r"../chromedriver_win32\chromedriver.exe"
driver = webdriver.Chrome(chrome_driver_binary, chrome_options=options)
contest_name = 'weekly-contest-293'

results = []
max_page = 250 # max pages to scrap
for pg in range(225, max_page):
  url = f"https://leetcode.com/contest/{contest_name}/ranking/{pg + 1}/"
  print(url)
  driver.get(url)
  time.sleep(1)
  users = driver.find_elements_by_xpath('//a[@class="ranking-username"]')
  for p in range(len(users)):
    id = users[p].text
    DB.child(contest_name).child(id).set({ "page": pg + 1 })