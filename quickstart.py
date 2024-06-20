import requests
import json
from pathlib import Path
import sys
import os

class Color:
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

def print_info(message):
    print(Color.BLUE + Color.BOLD + "[INFO] " + message + Color.END)

def print_error(message):
    print(Color.RED + Color.BOLD + "[ERR] " + message + Color.END)

if "ixmix" not in os.path.basename(os.getcwd()):
    print_error("Please only run the file from its directory.")
    sys.exit(1)
config = Path("server/config.json")
if config.is_file():
    print_error("The configuration file already exists. Delete server/config.json if you are reconfiguring.")
    sys.exit(1)

def get_url():
    return input("Enter the URL of your NewPrixmixManager instance (with port): ")

def check_health(url):
    try:
        response = requests.get(f"{url}/_healthcheck")
        if response.status_code == 200:
            return True
    except requests.exceptions.ConnectionError:
        pass
    except requests.exceptions.InvalidSchema:
        pass
    return False

def get_auth():
    return input("Enter the authorization token for your NewPrixmixManager instance: ")

def check_auth(url, auth):
    payload = {"auth": auth}
    try:
        response = requests.post(f"{url}/_authcheck", json=payload)
        if response.status_code == 200:
            return True
    except requests.exceptions.ConnectionError:
        pass
    return False

def save_config(data):
    with open("server/config.json", "w") as c:
        json.dump(data, c)

def main():
    print_info("Welcome to NewPrixmix setup.")
    print()

    url = get_url()
    while not check_health(url):
        print_error("Your NewPrixmixManager instance failed the healthcheck (is it running?)\n[NOTE] Make sure to include http:// or https://")
        url = get_url()

    auth = get_auth()
    while not check_auth(url, auth):
        print_error("Incorrect auth token, try again")
        auth = get_auth()

    data = {"url": url, "auth": auth}
    save_config(data)

    print(Color.GREEN + Color.BOLD + "[INFO] Successfully configured NewPrixmix! Run python3 server/main.py to start the server." + Color.END)

if __name__ == "__main__":
    main()
