# NewPrixmix

NewPrixmix is made in an effort to stop using Kasm Workspaces and their closed-source Web UI and API. [NewPrixmixManager](https://github.com/ka-studios/NewPrixmixManager) creates, destroys, and suspends docker containers asynchronously while streaming them to the end user via [noVNC](https://github.com/noVNC/noVNC)

**This version of NewPrixmix has been discontinued, and no support will be provided other than this README. You can view and contribute to the rewrite which is on GitLab and found [here](https://gitlab.com/ka_studios/Prixmix).**

## Quickstart

**Please install [NewPrixmixManager](https://github.com/ka-studios/NewPrixmixManager) before setting up NewPrixmix.**

Install Dependencies:
```bash
pip3 install -r requirements.txt
```
Run the Quickstart script:
```bash
python3 quickstart.py
```
NewPrixmix runs on port 8000. You may change that in the main.py.\
**If using in prod environments, please remember to turn off debug mode (debug=False)!!!!**

## Skid area
- This **cannot** be deployed to a service like Github pages or Vercel.
- You will need to selfhost NewPrixmixManager no matter what.
- ~~Using `flask run` will not work. Use `python3 server/main.py`.~~Use `flask run` to run it because I had to change it to app.py
## License Notice
NewPrixmix and NewPrixmixManager are licensed under the GNU General Public License v3. By forking, modifying, or using this source code, you agree to comply with the terms of this license.

### Made with ❤️ by UltraBrowse (mostly KAS)
