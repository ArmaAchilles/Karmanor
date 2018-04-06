import logging

from flask import Flask, request, Response
import requests

app = Flask(__name__)


@app.route("/", methods=["GET"])
def index():
    return "Hello World!"


@app.errorhandler(500)
def server_error(e):
    logging.exception("Internal Server Error")

    return
    """
    500, Internal Server Error
    <pre>{}</pre>
    """.format(e), 500


if __name__ == "__main__":
    app.run()
