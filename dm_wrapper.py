############################################
# Python API Wrapper for NewPrixmixManager #
############################################

import requests
from pathlib import Path
import sys
import json

class color:
   PURPLE = '\033[95m'
   CYAN = '\033[96m'
   DARKCYAN = '\033[36m'
   BLUE = '\033[94m'
   GREEN = '\033[92m'
   YELLOW = '\033[93m'
   RED = '\033[91m'
   BOLD = '\033[1m'
   UNDERLINE = '\033[4m'
   END = '\033[0m'

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
    def zrok_url(self):
        return self._json.get('zrok_url')
    @property
    def status(self):
        return self._json.get('status')

config = Path("config.json")
if not config.is_file():
    print(color.RED + color.BOLD + "[ERR] Please create a config.json file with the URL of your NewPrixmixManager instance." + color.END)
    sys.exit(127)
with open("config.json") as c:
    data = c.read()
    dm_url = json.loads(data).get('url')
    auth = json.loads(data).get('auth')
    try:
        r = requests.get(f"{dm_url}/_healthcheck")
    except requests.exceptions.ConnectionError:
        print(color.RED + color.BOLD + f"[ERR] NewPrixmixManager instance at {dm_url} failed healthcheck (is it running?)" + color.END)
        sys.exit(141)
    print(color.BOLD + f"[INFO] Using NewPrixmixManager instance at {dm_url}" + color.END)
    payload = {
        "auth":auth
        }
    r = requests.post(f"{dm_url}/_authcheck", json=payload)
    if r.status_code == 200:
        print(color.BOLD + "[INFO] Passed authorization token check" + color.END)
    else:
        print(color.RED + color.BOLD + "[ERR] Authorization check failed (check auth in the config.json)" + color.END)
        sys.exit(401)

def create(url):
    payload = {
            "auth":auth,
            "url":url
            }
    try:
        r = requests.post(f"{dm_url}/containers/create", json=payload)
        r.raise_for_status()  # Raise HTTPError for bad responses
        return Container(r.json())
    except requests.exceptions.HTTPError as http_err:
        print(color.RED + color.BOLD + f"[ERR] HTTP error occurred: {http_err}" + color.END)
    except requests.exceptions.RequestException as req_err:
        print(color.RED + color.BOLD + f"[ERR] Request error occurred: {req_err}" + color.END)
    except ValueError as json_err:
        print(color.RED + color.BOLD + f"[ERR] JSON decoding error occurred: {json_err}" + color.END)
    return None  # Return None if there was an error

def destroy(id):
    payload = {
            "auth":auth,
            "id":id
            }
    try:
        r = requests.post(f"{dm_url}/containers/destroy", json=payload)
        r.raise_for_status()  # Raise HTTPError for bad responses
        return Container(r.json())
    except requests.exceptions.HTTPError as http_err:
        print(color.RED + color.BOLD + f"[ERR] HTTP error occurred: {http_err}" + color.END)
    except requests.exceptions.RequestException as req_err:
        print(color.RED + color.BOLD + f"[ERR] Request error occurred: {req_err}" + color.END)
    except ValueError as json_err:
        print(color.RED + color.BOLD + f"[ERR] JSON decoding error occurred: {json_err}" + color.END)
    return None  # Return None if there was an error

def suspend(id):
    payload = {
            "auth":auth,
            "id":id
            }
    try:
        r = requests.post(f"{dm_url}/containers/suspend", json=payload)
        r.raise_for_status()  # Raise HTTPError for bad responses
        return Container(r.json())
    except requests.exceptions.HTTPError as http_err:
        print(color.RED + color.BOLD + f"[ERR] HTTP error occurred: {http_err}" + color.END)
    except requests.exceptions.RequestException as req_err:
        print(color.RED + color.BOLD + f"[ERR] Request error occurred: {req_err}" + color.END)
    except ValueError as json_err:
        print(color.RED + color.BOLD + f"[ERR] JSON decoding error occurred: {json_err}" + color.END)
    return None  # Return None if there was an error

def resume(id):
    payload = {
            "auth":auth,
            "id":id
            }
    try:
        r = requests.post(f"{dm_url}/containers/resume", json=payload)
        r.raise_for_status()  # Raise HTTPError for bad responses
        return Container(r.json())
    except requests.exceptions.HTTPError as http_err:
        print(color.RED + color.BOLD + f"[ERR] HTTP error occurred: {http_err}" + color.END)
    except requests.exceptions.RequestException as req_err:
        print(color.RED + color.BOLD + f"[ERR] Request error occurred: {req_err}" + color.END)
    except ValueError as json_err:
        print(color.RED + color.BOLD + f"[ERR] JSON decoding error occurred: {json_err}" + color.END)
    return None  # Return None if there was an error
