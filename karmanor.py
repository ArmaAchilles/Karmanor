# Import Python libraries
import logging
import json
import hashlib
import os
import hmac

# Import 3rd party libraries
from flask import Flask, request, Response
import requests

# Import project libraries
import settings

app = Flask(__name__)


@app.route("/", methods=["POST"])
def index():

    GITHUB_TOKEN = os.getenv('GITHUB_TOKEN')

    mac = hmac.new(bytes(GITHUB_TOKEN, 'utf-8'),
                   msg=request.data, digestmod='sha1')

    signature = request.headers.get('X-Hub-Signature')

    print(mac.hexdigest())
    print(signature.split('=')[1])

    isRequestFromGitHub = hmac.compare_digest(
        str(mac.hexdigest()), str(signature.split('=')[1]))

    data = request.get_json()

    return str(isRequestFromGitHub)


@app.errorhandler(500)
def server_error(e):
    logging.exception("Internal Server Error")

    return
    """
    500, Internal Server Error
    <pre>{}</pre>
    """.format(e), 500


if __name__ == "__main__":
    app.run(debug=True)
