# Import Python libraries
import logging
import json
import os
import hmac
import sys
from ipaddress import ip_network, ip_address

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
        logging.exception(
            "Request did not come from GitHub! IP: {}".format(request.remote_addr))
        abort(403)

    return "Running Karmanor!"


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

    # If already false, why check?
    if not isRequestFromGitHub:
        return isRequestFromGitHub
    # If not then check if the request came from GitHub server IPs or localhost
    else:
        verify_request_ip()

    return isRequestFromGitHub


def verify_request_ip():
    # Get IPs from GitHub API servers
    whitelist = requests.get("https://api.github.com/meta").json()["hooks"]

    # Add localhost to the valid IPs (for testing)
    whitelist.append("127.0.0.1")

    source_ip = ip_address(u'{}'.format(request.access_route[0]))

    # Check if the IP is in the whitelist
    for valid_ip in whitelist:
        if source_ip in ip_network(valid_ip):
            break
    else:
        logging.error("IP {} not allowed!".format(request.remote_addr))
        return False

    return True


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
