from flask import Flask, render_template, Response, request, redirect, url_for, session, send_from_directory, jsonify
import threading
import requests
import json
import dm_wrapper

app = Flask(__name__)

@app.route("/")
def home():
    return render_template("home.html")
@app.route("/iframe.js")
def iframe():
    return render_template("iframe.js")
@app.route("/api/", methods=['GET'])
async def explorer():
    return send_from_directory("api", "explorer.html")

@app.route("/api/provision", methods=['POST', 'GET'])
def provision():
    if request.method == "POST":
        data = request.get_json(force=True)
        container = dm_wrapper.create(data.get('url'))

        if container is None:
            return jsonify({"error": "Failed to create container"}), 500

        payload = {
            "id": container.id,
            "novnc_port": container.novnc_port,
            "zrok_url": container.zrok_url
        }
        return jsonify(payload)

    elif request.method == "GET":
        return send_from_directory("api", "provision.html")

    else:
        return Response("Method Not Allowed", status=405)


@app.route("/api/stop", methods=['POST', 'GET'])
async def stop():
    if request.method == "POST":
        id = request.get_json(force=True).get('id')
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
        id = request.get_json(force=True).get('id')
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
        id = request.get_json(force=True).get('id')
        if not id:
            return Reponse('{"status":"Container Not Found"}', status=500)
        dm_wrapper.resume(id)
        return Response('{"status":"success"}', status=200)
    elif request.method == "GET":
        return send_from_directory("api", "resume.html")
    else:
        return Response("Method Not Allowed", status=405)


if __name__ == "__main__":
    app.run(port=9000, debug=True)

