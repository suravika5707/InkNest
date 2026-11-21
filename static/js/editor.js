/**
 * InkNest — Writing Editor Client Script (Phase 1, Step 3)
 * Purpose: Live writing statistics, unsaved-change tracking,
 * and temporary local browser storage demonstrations.
 * Pure Vanilla JavaScript — zero external dependencies.
 */

document.addEventListener("DOMContentLoaded", () => {
    // -------------------------------------------------------------------------
    // 1. DOM Elements
    // -------------------------------------------------------------------------
    const titleInput = document.getElementById("editorTitle");
    const bodyTextarea = document.getElementById("editorBody");
    const wordCountDisplay = document.getElementById("wordCount");
    const charCountDisplay = document.getElementById("charCount");
    const readingTimeDisplay = document.getElementById("readingTimeDisplay");
    
    const statusDot = document.getElementById("statusDot");
    const statusText = document.getElementById("statusText");
    
    const saveDraftBtn = document.getElementById("saveDraftBtn");
    const publishBtn = document.getElementById("publishBtn");
    
    const feedbackBanner = document.getElementById("feedbackBanner");
    const bannerMessage = document.getElementById("bannerMessage");
    const bannerIcon = document.getElementById("bannerIcon");
    const closeBannerBtn = document.getElementById("closeBannerBtn");
    const currentDateDisplay = document.getElementById("currentDateDisplay");

    // LocalStorage key for Phase 1 temporary client-side persistence
    const STORAGE_KEY = "inknest_prototype_draft";

    let hasUnsavedChanges = false;

    // -------------------------------------------------------------------------
    // 2. Initialize Date Display
    // -------------------------------------------------------------------------
    const today = new Date();
    const dateOptions = { year: "numeric", month: "long", day: "numeric" };
    if (currentDateDisplay) {
        currentDateDisplay.textContent = today.toLocaleDateString("en-US", dateOptions);
    }

    // -------------------------------------------------------------------------
    // 3. Word & Character Counting Logic
    // -------------------------------------------------------------------------
    function updateStatistics() {
        const titleText = titleInput.value.trim();
        const bodyText = bodyTextarea.value.trim();
        
        // Combine title and body for overall statistics
        const fullText = (titleText + " " + bodyText).trim();
        
        // Calculate words: split on consecutive whitespace
        const words = fullText === "" ? 0 : fullText.split(/\s+/).length;
        
        // Calculate characters (excluding leading/trailing combined whitespace)
        const characters = bodyText.length + titleText.length;

        // Calculate estimated reading time (approx. 200 words per minute)
        const readingMinutes = Math.ceil(words / 200);
        const readingTimeText = words < 10 
            ? "Less than 1 min read" 
            : `${readingMinutes} min read`;

        // Update DOM
        wordCountDisplay.textContent = words.toLocaleString();
        charCountDisplay.textContent = characters.toLocaleString();
        if (readingTimeDisplay) {
            readingTimeDisplay.textContent = readingTimeText;
        }
    }

    // -------------------------------------------------------------------------
    // 4. Save Status Indicators
    // -------------------------------------------------------------------------
    function setSaveStatus(state) {
        statusDot.className = "status-dot";

        switch (state) {
            case "unsaved":
                statusDot.classList.add("status-unsaved");
                statusText.textContent = "Unsaved changes";
                hasUnsavedChanges = true;
                break;
            case "saving":
                statusDot.classList.add("status-saving");
                statusText.textContent = "Saving...";
                break;
            case "saved":
                statusDot.classList.add("status-saved");
                statusText.textContent = "Saved locally (Prototype)";
                hasUnsavedChanges = false;
                break;
            case "published":
                statusDot.classList.add("status-published-state");
                statusText.textContent = "Published (Prototype Preview)";
                hasUnsavedChanges = false;
                break;
            default:
                statusDot.classList.add("status-ready");
                statusText.textContent = "New Draft";
                hasUnsavedChanges = false;
        }
    }

    // -------------------------------------------------------------------------
    // 5. Input Listeners (Detect Changes)
    // -------------------------------------------------------------------------
    function handleContentChange() {
        updateStatistics();
        setSaveStatus("unsaved");
    }

    titleInput.addEventListener("input", handleContentChange);
    bodyTextarea.addEventListener("input", handleContentChange);

    // Auto-expand textarea height as user writes
    function autoResizeTextarea() {
        bodyTextarea.style.height = "auto";
        bodyTextarea.style.height = Math.max(bodyTextarea.scrollHeight, 400) + "px";
    }
    bodyTextarea.addEventListener("input", autoResizeTextarea);

    // -------------------------------------------------------------------------
    // 6. Feedback Banner
    // -------------------------------------------------------------------------
    function showNotification(message, icon = "✦", autoHideMs = 6000) {
        bannerMessage.textContent = message;
        bannerIcon.textContent = icon;
        feedbackBanner.style.display = "flex";

        if (autoHideMs > 0) {
            clearTimeout(feedbackBanner._timer);
            feedbackBanner._timer = setTimeout(() => {
                feedbackBanner.style.display = "none";
            }, autoHideMs);
        }
    }

    if (closeBannerBtn) {
        closeBannerBtn.addEventListener("click", () => {
            feedbackBanner.style.display = "none";
        });
    }

    // -------------------------------------------------------------------------
    // 7. Save Draft Action (Local Browser Storage Prototype)
    // -------------------------------------------------------------------------
    function saveDraft() {
        const title = titleInput.value.trim();
        const body = bodyTextarea.value.trim();

        if (!title && !body) {
            showNotification("Your draft is currently empty. Write a thought before saving.", "ℹ");
            return;
        }

        setSaveStatus("saving");

        // Simulate a brief, realistic saving pause
        setTimeout(() => {
            const draftData = {
                title: title,
                body: body,
                savedAt: new Date().toISOString()
            };

            try {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(draftData));
                setSaveStatus("saved");
                showNotification(
                    "Draft saved to your browser's local storage. (Prototype notice: This is stored on this device only; database persistence will arrive in Phase 2).",
                    "✓"
                );
            } catch (err) {
                console.error("Local storage error:", err);
                setSaveStatus("unsaved");
                showNotification("Could not save to browser storage. Local storage might be disabled.", "!");
            }
        }, 300);
    }

    saveDraftBtn.addEventListener("click", saveDraft);

    // Keyboard shortcut: Ctrl+S / Cmd+S to save draft
    document.addEventListener("keydown", (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === "s") {
            e.preventDefault();
            saveDraft();
        }
    });

    // -------------------------------------------------------------------------
    // 8. Publish Action (Frontend Demonstration Only)
    // -------------------------------------------------------------------------
    function handlePublish() {
        const title = titleInput.value.trim();
        const body = bodyTextarea.value.trim();

        if (!title && !body) {
            showNotification("Cannot publish an empty page. Please add a title and some sentences.", "ℹ");
            return;
        }

        setSaveStatus("saving");

        setTimeout(() => {
            setSaveStatus("published");
            showNotification(
                "Publishing Prototype Demonstration: In Phase 2, this will validate your article, save it into MySQL, and generate a live public URL for readers. For now, your writing is safely preserved in local browser storage.",
                "✦",
                10000
            );
        }, 400);
    }

    publishBtn.addEventListener("click", handlePublish);

    // -------------------------------------------------------------------------
    // 9. Load Saved Draft on Startup (If Available)
    // -------------------------------------------------------------------------
    function loadSavedDraft() {
        try {
            const savedRaw = localStorage.getItem(STORAGE_KEY);
            if (savedRaw) {
                const draft = JSON.parse(savedRaw);
                if (draft.title || draft.body) {
                    titleInput.value = draft.title || "";
                    bodyTextarea.value = draft.body || "";
                    updateStatistics();
                    autoResizeTextarea();
                    setSaveStatus("saved");
                    showNotification("Restored your previous draft from browser storage.", "✦", 4000);
                }
            }
        } catch (err) {
            console.warn("Could not retrieve saved draft from localStorage:", err);
        }
    }

    // Run initial load
    loadSavedDraft();
    updateStatistics();
});

