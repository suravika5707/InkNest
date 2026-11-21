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
# Sample Prototype Data for Phase 1
# (Used strictly for frontend demonstration before database integration in Phase 2)
# ------------------------------------------------------------------------------
SAMPLE_ENTRIES = [
    {
        "id": 1,
        "title": "The Architecture of Quiet Mornings",
        "excerpt": "There is a brief window before the city wakes when thought is unbroken. In that stillness, sentences form without the urgency to impress.",
        "updated_at": "November 14, 2026",
        "status": "Published",
        "type": "Public Essay",
    },
    {
        "id": 2,
        "title": "Notes on Solitude and City Streets",
        "excerpt": "Walking through crowded train stations with a pocket notebook. The paradox of feeling most deeply reflective while surrounded by thousands of strangers.",
        "updated_at": "November 12, 2026",
        "status": "Draft",
        "type": "Private Journal",
    },
    {
        "id": 3,
        "title": "On Choosing Simplicity in Software",
        "excerpt": "Why do tools insist on growing until they resemble airplanes? Reflections on building quiet software that respects human attention.",
        "updated_at": "November 08, 2026",
        "status": "Published",
        "type": "Public Essay",
    },
    {
        "id": 4,
        "title": "Reflections on November Rain",
        "excerpt": "A private reflection on seasonal transitions, unfinished projects, and the patience required to let ideas mature on their own schedule.",
        "updated_at": "November 03, 2026",
        "status": "Draft",
        "type": "Private Journal",
    },
]


# ------------------------------------------------------------------------------
# 2. Routes
# ------------------------------------------------------------------------------
@app.route("/")
def home():
    """Renders the InkNest editorial landing page (Step 1)."""
    return render_template("index.html")


@app.route("/dashboard")
def dashboard():
    """
    Renders the Writer's Dashboard (Step 2).
    Passes prototype sample entries and summary counts to the template.
    """
    total_count = len(SAMPLE_ENTRIES)
    published_count = sum(1 for e in SAMPLE_ENTRIES if e["status"] == "Published")
    draft_count = sum(1 for e in SAMPLE_ENTRIES if e["status"] == "Draft")

    stats = {
        "total": total_count,
        "published": published_count,
        "drafts": draft_count,
    }

    return render_template("dashboard.html", entries=SAMPLE_ENTRIES, stats=stats)


# ------------------------------------------------------------------------------
# 3. Phase 1 Placeholder Route Stubs
# (Ensures url_for() calls resolve cleanly until Steps 3–5 are implemented)
# ------------------------------------------------------------------------------
@app.route("/editor")
def editor():
    """
    Renders the Distraction-Free Writing Editor (Step 3).
    Provides the writing canvas, live word counting, and draft controls.
    """
    return render_template("editor.html")


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
