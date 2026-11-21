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

# Editorial sample content for the Explore / Blog Feed (Step 4)
FEATURED_STORY = {
    "id": 101,
    "title": "The Lost Art of Unhurried Reading",
    "excerpt": "In an era of endless scrolling and thirty-second dopamine loops, sitting with an unbroken long-form essay is an act of quiet rebellion. What happens to our minds when we reclaim the luxury of patience?",
    "author": "Elena Vance",
    "category": "Reflections",
    "published_at": "November 18, 2026",
    "reading_time": "7 min read",
}

EXPLORE_STORIES = [
    {
        "id": 201,
        "title": "The Architecture of Quiet Mornings",
        "excerpt": "Before the city wakes, there exists an unbroken window of silence where thoughts arrange themselves without the pressure of performance.",
        "author": "Julian Hayes",
        "category": "Personal",
        "published_at": "November 16, 2026",
        "reading_time": "5 min read",
    },
    {
        "id": 202,
        "title": "On Choosing Simplicity in Software",
        "excerpt": "Why do modern digital tools insist on growing until they resemble cockpits? A case for software that honors human attention rather than demanding it.",
        "author": "Marcus Sterling",
        "category": "Technology",
        "published_at": "November 14, 2026",
        "reading_time": "6 min read",
    },
    {
        "id": 203,
        "title": "The Notebook as a Thinking Laboratory",
        "excerpt": "Joan Didion once observed that we write to find out what we are thinking. Physical pages and uncluttered digital spaces offer the same sanctuary.",
        "author": "Clara Bennett",
        "category": "Creativity",
        "published_at": "November 11, 2026",
        "reading_time": "4 min read",
    },
    {
        "id": 204,
        "title": "Learning in Public: The Power of Honest Notes",
        "excerpt": "You do not need to be an authority to share what you have learned. Documenting your stumbling journey creates more genuine connection than polished mastery.",
        "author": "Devon Miller",
        "category": "Learning",
        "published_at": "November 08, 2026",
        "reading_time": "5 min read",
    },
    {
        "id": 205,
        "title": "The Quiet Drama of Evening Commutes",
        "excerpt": "Faces illuminated by passing streetlamps, umbrellas dripping on subway floors. Fleeting moments that slip through our fingers unless we record them.",
        "author": "Siddharth Rao",
        "category": "Personal",
        "published_at": "November 05, 2026",
        "reading_time": "3 min read",
    },
    {
        "id": 206,
        "title": "Tools for the Solitary Mind",
        "excerpt": "An exploration of the instruments writers have trusted across centuries, from fountain pens and typewriter ribbons to minimal web canvases.",
        "author": "Miriam Frost",
        "category": "Reflections",
        "published_at": "November 02, 2026",
        "reading_time": "8 min read",
    },
]

EXPLORE_CATEGORIES = [
    "All Stories",
    "Personal",
    "Technology",
    "Creativity",
    "Learning",
    "Reflections",
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
    """
    Renders the Explore / Blog Feed (Step 4).
    Passes curated featured story, story collection, and categories.
    """
    return render_template(
        "explore.html",
        featured_story=FEATURED_STORY,
        stories=EXPLORE_STORIES,
        categories=EXPLORE_CATEGORIES,
    )


@app.route("/auth")
@app.route("/login")
def auth():
    """
    Renders the Authentication interface (Step 5) in Sign In mode.
    """
    return render_template("auth.html", mode="login")


@app.route("/register")
def register():
    """
    Renders the Authentication interface (Step 5) in Registration mode.
    """
    return render_template("auth.html", mode="register")


# ------------------------------------------------------------------------------
# 4. Local Development Server Execution
# ------------------------------------------------------------------------------
if __name__ == "__main__":
    app.run(debug=True)
