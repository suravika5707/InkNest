"""
InkNest — Phase 0 Application Entry Point

This file initializes the Flask WSGI application, sets up our homepage
route, and runs the local development web server.
"""

from flask import Flask, render_template

# ------------------------------------------------------------------------------
# 1. Application Initialization
# ------------------------------------------------------------------------------
# We create an instance of the Flask class.
# The argument __name__ is a special Python built-in variable that tells Flask
# where this file is located in the filesystem. Flask uses this location to find
# associated folders like 'templates/' and 'static/'.
app = Flask(__name__)


# ------------------------------------------------------------------------------
# 2. Route Definition
# ------------------------------------------------------------------------------
# The @app.route decorator binds a URL path to a Python function (called a view function).
# Whenever a browser requests the root URL ("/"), Flask calls home().
@app.route("/")
def home():
    """
    View function for the InkNest homepage.
    
    render_template() looks inside the 'templates/' directory for 'index.html',
    processes any Jinja2 template tags, and returns the final HTML string to the browser.
    """
    return render_template("index.html")


# ------------------------------------------------------------------------------
# 3. Development Server Execution
# ------------------------------------------------------------------------------
# The check below ensures that app.run() is only called if this script is run
# directly (e.g. `python app.py`), and NOT if it is imported into another file.
if __name__ == "__main__":
    # debug=True provides two powerful features during development:
    # 1. Live Reload: The server restarts automatically when you save code changes.
    # 2. Interactive Debugger: Displays detailed error tracebacks in the browser.
    # Note: debug mode should NEVER be enabled in production environments.
    app.run(debug=True)
