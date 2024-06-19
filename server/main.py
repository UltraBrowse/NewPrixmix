from flask import Flask, render_template, Response, request, redirect, url_for, session, send_from_directory, jsonify
import threading
import requests
import json
import dm_wrapper

app = Flask(__name__)

@app.route("/")
def home():
    return send_from_directory("frontend", "home.html")

@app.route("/api/", methods=['GET'])
async def explorer():
    return send_from_directory("api", "explorer.html")

@app.route("/api/provision", methods=['POST', 'GET'])
async def provision():
    if request.method == "POST":
        container = dm_wrapper.create()
        payload = {
            "id":container.id,
            "novnc_port":container.novnc_port,
            "zrok_url":container.zrok_url
        }
        return jsonify(payload)
    elif request.method == "GET":
        return send_from_directory("api", "provision.html")
    else:
        return Response("Method Not Allowed", status=405)

@app.route("/api/stop", methods=['POST', 'GET'])
async def stop():
    if request.method == "POST":
        id = await request.json().get('id')
        if not id:
            return Reponse('{"status":"Container Not Found"}', status=500)
        dm_wrapper.destroy(id)
        return Response('{"status":"success"}', status=200)
    elif request.method == "GET":
        return send_from_directory("api", "stop.html")
    else:
        return Response("Method Not Allowed", status=405)

@app.route("/api/suspend", methods=['POST', 'GET'])
async def suspend():
    if request.method == "POST":
        id = await request.json().get('id')
        if not id:
            return Reponse('{"status":"Container Not Found"}', status=500)
        dm_wrapper.suspend(id)
        return Response('{"status":"success"}', status=200)
    elif request.method == "GET":
        return send_from_directory("api", "suspend.html")
    else:
        return Response("Method Not Allowed", status=405)

@app.route("/api/resume", methods=['POST', 'GET'])
async def resume():
    if request.method == "POST":
        id = await request.json().get('id')
        if not id:
            return Reponse('{"status":"Container Not Found"}', status=500)
        dm_wrapper.resume(id)
        return Response('{"status":"success"}', status=200)
    elif request.method == "GET":
        return send_from_directory("api", "resume.html")
    else:
        return Response("Method Not Allowed", status=405)


if __name__ == "__main__":
    app.run(port=8000, debug=True)

