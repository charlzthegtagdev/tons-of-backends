import requests
import random
from flask import Flask, jsonify, request

class GameInfo:

    def __init__(self):
        self.TitleId: str = "3E875"
        self.SecretKey: str = "N5NTKHXEBMQ736KJASQ4PUEMW5CEIROOKF9Y9CKPHRP7B3M9I9"

    def get_auth_headers(self):
        return {
            "content-type": "application/json",
            "X-SecretKey": self.SecretKey
        }


settings = GameInfo()
app = Flask(__name__)

@app.route("/", methods=["POST", "GET"])
def titledata():
    response = requests.post(
        url=f"https://{settings.TitleId}.playfabapi.com/Server/GetTitleData",
        headers=settings.get_auth_headers())

    if response.status_code == 200:
        return jsonify(response.json().get('data').get('Data'))
    else:
        return jsonify({}), response.status_code

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8080)
