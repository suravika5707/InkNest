/**
 * InkNest — Client-Side Core Script (Phase 1)
 * Purpose: Vanilla JS enhancements for navigation and interactions.
 * Kept lightweight, modular, and framework-free.
 */

document.addEventListener("DOMContentLoaded", () => {
    // -------------------------------------------------------------------------
    // 1. Active Navigation Highlighting
    // -------------------------------------------------------------------------
    // Highlights the navigation link corresponding to the current URL pathname.
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll(".nav-link");

    navLinks.forEach((link) => {
        const linkPath = link.getAttribute("href");

        // Exact match or root match
        if (linkPath === currentPath) {
            link.classList.add("active");
        } else if (currentPath === "/" && linkPath === "/") {
            link.classList.add("active");
        }
    });

    console.log("InkNest Phase 1: Core client script initialized.");
});
