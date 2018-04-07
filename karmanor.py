# Import Python libraries
import logging
import json
import os
import hmac

# Import 3rd party libraries
from flask import Flask, request, abort
import requests

# Import project libraries
import settings

app = Flask(__name__)


@app.route("/", methods=["POST"])
def index():
    isRequestFromGitHub = verify_signatures()
    # Don't abort if the request came from localhost (for testing purposes)
    if ((not isRequestFromGitHub) and (request.remote_addr != "127.0.0.1")):
        abort(403)

    return "It's working!"


def verify_signatures():
    # Get enviornment variable, GITHUB_TOKEN. Used for verification of GitHub's signature
    GITHUB_TOKEN = os.getenv('GITHUB_TOKEN')

    # No signature has been configured
    if GITHUB_TOKEN is None:
        abort(500)

    # Get the passed header signature
    header_signature = request.headers.get('X-Hub-Signature')

    # If the header hasn't been passed
    if header_signature is None:
        abort(403)

    # If the signature is not a SHA1 type
    sha_name, signature = header_signature.split('=')
    if sha_name != 'sha1':
        abort(501)

    # Create our side of the HMAC digest
    mac = hmac.new(bytes(GITHUB_TOKEN, 'utf-8'),
                   request.data, 'sha1').hexdigest()

    # Compare the digests
    isRequestFromGitHub = hmac.compare_digest(
        str(mac), str(signature))

    return isRequestFromGitHub


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
