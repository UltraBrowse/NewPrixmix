############################################
# Python API Wrapper for NewPrixmixManager #
############################################

import requests
from pathlib import Path
import sys
import json
import logging

class Container:
    def __init__(self, json):
        self._json = json
    @property
    def id(self):
        return self._json.get('container')
    @property
    def novnc_port(self):
        return self._json.get('novnc_port')
    @property
    def status(self):
        return self._json.get('status')
    @property
    def error(self):
        return self._json.get('error')
config = Path("config.json")
if not config.is_file():
    logging.error("Please create a config.json file with the URL of your NewPrixmixManager instance.")
    sys.exit(127)
with open("config.json") as c:
    data = c.read()
    dm_url = json.loads(data).get('url')
    auth = json.loads(data).get('auth')
    try:
        r = requests.get(f"{dm_url}/_healthcheck")
    except requests.exceptions.ConnectionError:
        logging.error(f"NewPrixmixManager instance at {dm_url} failed healthcheck (is it running?)")
        sys.exit(141)
    logging.info(f"Using NewPrixmixManager instance at {dm_url}")
    payload = {
        "auth":auth
        }
    r = requests.post(f"{dm_url}/_authcheck", json=payload)
    if r.status_code == 200:
       logging.info("Passed authorization token check")
    else:
        logging.error("Authorization check failed (check auth in the config.json)" )
        sys.exit(401)

def create(url, prem = None, username = None):
    payload = {
            "auth":auth,
            "url":url,
            "premium": prem,
            "username": False if not username else username
            }
    try:
        r = requests.post(f"{dm_url}/containers/create", json=payload)
        r.raise_for_status()
        return Container(r.json())
    except requests.exceptions.HTTPError as http_err:
        logging.error(f"HTTP error occurred: {http_err}")
    except requests.exceptions.RequestException as req_err:
        logging.error(f"Request error occurred: {req_err}")
    except ValueError as json_err:
        logging.error(f"JSON decoding error occurred: {json_err}")
    return None  

def destroy(id):
    payload = {
            "auth":auth,
            "id":id
            }
    try:
        r = requests.post(f"{dm_url}/containers/destroy", json=payload)
        r.raise_for_status() 
        return Container(r.json())
    except requests.exceptions.HTTPError as http_err:
        logging.error(f"HTTP error occurred: {http_err}")
    except requests.exceptions.RequestException as req_err:
        logging.error(f"Request error occurred: {req_err}")
    except ValueError as json_err:
        logging.error(f"JSON decoding error occurred: {json_err}")
    return None 

def suspend(id):
    payload = {
            "auth":auth,
            "id":id
            }
    try:
        r = requests.post(f"{dm_url}/containers/suspend", json=payload)
        r.raise_for_status() 
        return Container(r.json())
    except requests.exceptions.HTTPError as http_err:
        logging.error(f"HTTP error occurred: {http_err}")
    except requests.exceptions.RequestException as req_err:
        logging.error(f"Request error occurred: {req_err}")
    except ValueError as json_err:
        logging.error(f"JSON decoding error occurred: {json_err}")
    return None 

def resume(id):
    payload = {
            "auth":auth,
            "id":id
            }
    try:
        r = requests.post(f"{dm_url}/containers/resume", json=payload)
        r.raise_for_status() 
        return Container(r.json())
    except requests.exceptions.HTTPError as http_err:
        logging.error(f"HTTP error occurred: {http_err}")
    except requests.exceptions.RequestException as req_err:
        logging.error(f"Request error occurred: {req_err}")
    except ValueError as json_err:
        logging.error(f"JSON decoding error occurred: {json_err}")
    return None

def getSessions(user):
    payload = "a"     