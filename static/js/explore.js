/**
 * InkNest — Explore Feed Client Script (Phase 1, Step 4)
 * Purpose: Interactive category filtering, combined live search,
 * and prototype reading view feedback.
 * Pure Vanilla JavaScript — zero external dependencies.
 */

document.addEventListener("DOMContentLoaded", () => {
    // -------------------------------------------------------------------------
    // 1. DOM Elements
    // -------------------------------------------------------------------------
    const searchInput = document.getElementById("storySearchInput");
    const categoryButtons = document.querySelectorAll(".category-pill-btn");
    const storyCards = document.querySelectorAll(".story-card");
    const storyCountDisplay = document.getElementById("storyCountDisplay");
    const activeFilterIndicator = document.getElementById("activeFilterIndicator");
    const emptyState = document.getElementById("exploreEmptyState");
    const emptyStateDetail = document.getElementById("emptyStateDetail");
    const resetFiltersBtn = document.getElementById("resetFiltersBtn");

    // Modal elements
    const readerModal = document.getElementById("readerNoticeModal");
    const modalStoryTitle = document.getElementById("modalStoryTitleDisplay");
    const modalStoryAuthor = document.getElementById("modalStoryAuthorDisplay");
    const closeModalCrossBtn = document.getElementById("closeModalCrossBtn");
    const modalUnderstoodBtn = document.getElementById("modalUnderstoodBtn");
    const readStoryTriggers = document.querySelectorAll(".read-story-trigger");

    let currentCategory = "All Stories";
    let searchQuery = "";

    // -------------------------------------------------------------------------
    // 2. Filter Logic (Combined Category + Live Search)
    // -------------------------------------------------------------------------
    function applyFilters() {
        let visibleCount = 0;
        const normalizedQuery = searchQuery.trim().toLowerCase();

        storyCards.forEach((card) => {
            const cardCategory = card.getAttribute("data-category") || "";
            const cardTitle = card.getAttribute("data-title") || "";
            const cardAuthor = card.getAttribute("data-author") || "";
            const cardExcerpt = card.getAttribute("data-excerpt") || "";

            // Check category match
            const matchesCategory = 
                currentCategory === "All Stories" || 
                cardCategory.toLowerCase() === currentCategory.toLowerCase();

            // Check search query match across title, author, excerpt, and category
            const matchesSearch = 
                normalizedQuery === "" ||
                cardTitle.includes(normalizedQuery) ||
                cardAuthor.includes(normalizedQuery) ||
                cardExcerpt.includes(normalizedQuery) ||
                cardCategory.toLowerCase().includes(normalizedQuery);

            if (matchesCategory && matchesSearch) {
                card.style.display = "";
                visibleCount++;
            } else {
                card.style.display = "none";
            }
        });

        // Update count text
        if (visibleCount === 1) {
            storyCountDisplay.textContent = "Showing 1 story";
        } else {
            storyCountDisplay.textContent = `Showing ${visibleCount} stories`;
        }

        // Update active filter indicator
        let indicatorText = `Category: ${currentCategory}`;
        if (normalizedQuery !== "") {
            indicatorText += ` · Search: "${searchQuery}"`;
        }
        activeFilterIndicator.textContent = indicatorText;

        // Toggle Empty State
        if (visibleCount === 0) {
            emptyState.style.display = "block";
            if (normalizedQuery !== "") {
                emptyStateDetail.textContent = `No stories found in "${currentCategory}" matching "${searchQuery}".`;
            } else {
                emptyStateDetail.textContent = `No stories found in the "${currentCategory}" category.`;
            }
        } else {
            emptyState.style.display = "none";
        }
    }

    // -------------------------------------------------------------------------
    // 3. Category Filter Navigation Event Listeners
    // -------------------------------------------------------------------------
    categoryButtons.forEach((btn) => {
        btn.addEventListener("click", () => {
            categoryButtons.forEach((b) => {
                b.classList.remove("active");
                b.setAttribute("aria-selected", "false");
            });

            btn.classList.add("active");
            btn.setAttribute("aria-selected", "true");
            currentCategory = btn.getAttribute("data-category") || "All Stories";
            
            applyFilters();
        });
    });

    // -------------------------------------------------------------------------
    // 4. Live Search Event Listener
    // -------------------------------------------------------------------------
    if (searchInput) {
        searchInput.addEventListener("input", (e) => {
            searchQuery = e.target.value;
            applyFilters();
        });
    }

    // -------------------------------------------------------------------------
    // 5. Reset Filters
    // -------------------------------------------------------------------------
    if (resetFiltersBtn) {
        resetFiltersBtn.addEventListener("click", () => {
            searchQuery = "";
            currentCategory = "All Stories";

            if (searchInput) {
                searchInput.value = "";
            }

            categoryButtons.forEach((btn, index) => {
                if (index === 0) {
                    btn.classList.add("active");
                    btn.setAttribute("aria-selected", "true");
                } else {
                    btn.classList.remove("active");
                    btn.setAttribute("aria-selected", "false");
                }
            });

            applyFilters();
        });
    }

    // -------------------------------------------------------------------------
    // 6. Reading View Prototype Dialog / Modal
    // -------------------------------------------------------------------------
    function openReaderModal(title, author) {
        if (!readerModal) return;
        modalStoryTitle.textContent = `"${title}"`;
        modalStoryAuthor.textContent = author ? `by ${author}` : "";
        readerModal.style.display = "flex";
        document.body.style.overflow = "hidden"; // Prevent background scroll
    }

    function closeReaderModal() {
        if (!readerModal) return;
        readerModal.style.display = "none";
        document.body.style.overflow = ""; // Restore background scroll
    }

    readStoryTriggers.forEach((trigger) => {
        trigger.addEventListener("click", () => {
            const title = trigger.getAttribute("data-story-title") || "Selected Story";
            const author = trigger.getAttribute("data-story-author") || "";
            openReaderModal(title, author);
        });
    });

    if (closeModalCrossBtn) {
        closeModalCrossBtn.addEventListener("click", closeReaderModal);
    }
    if (modalUnderstoodBtn) {
        modalUnderstoodBtn.addEventListener("click", closeReaderModal);
    }

    // Close when clicking overlay backdrop
    if (readerModal) {
        readerModal.addEventListener("click", (e) => {
            if (e.target === readerModal) {
                closeReaderModal();
            }
        });
    }

    // Close on Escape key press
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && readerModal && readerModal.style.display === "flex") {
            closeReaderModal();
        }
    });

    // Run initial filter check
    applyFilters();
});

