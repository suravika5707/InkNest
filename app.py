"""
InkNest — Application Entry Point & Route Definitions

This file initializes the Flask WSGI application, defines our routes,
and starts the local development server.
"""

from flask import Flask, render_template

# ------------------------------------------------------------------------------
# 1. Application Initialization
# ------------------------------------------------------------------------------
app = Flask(__name__)


# ------------------------------------------------------------------------------
# 2. Primary Route: Step 1 Landing Page
# ------------------------------------------------------------------------------
@app.route("/")
def home():
    """
    Renders the InkNest editorial homepage.
    Uses templates/index.html (which inherits from templates/base.html).
    """
    return render_template("index.html")


# ------------------------------------------------------------------------------
# 3. Phase 1 Route Stubs
# ------------------------------------------------------------------------------
# These placeholder view functions ensure that Jinja2's url_for() calls in
# base.html resolve cleanly without BuildError exceptions.
# Full page templates and logic will be implemented sequentially in Steps 2–5.
# ------------------------------------------------------------------------------

@app.route("/dashboard")
def dashboard():
    """Placeholder for Step 2: Writer's Dashboard."""
    return render_template("index.html")


@app.route("/editor")
def editor():
    """Placeholder for Step 3: Distraction-Free Editor."""
    return render_template("index.html")


@app.route("/explore")
def explore():
    """Placeholder for Step 4: Explore & Reading Feed."""
    return render_template("index.html")


@app.route("/auth")
def auth():
    """Placeholder for Step 5: Authentication (Login / Register)."""
    return render_template("index.html")


# ------------------------------------------------------------------------------
# 4. Local Development Server Execution
# ------------------------------------------------------------------------------
if __name__ == "__main__":
    app.run(debug=True)
