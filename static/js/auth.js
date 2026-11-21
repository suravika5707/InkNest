/**
 * InkNest — Authentication Client Script (Phase 1 Refinement)
 * Purpose: Accessible tab switching, show/hide password toggles,
 * robust client-side form validation, and prototype state feedback.
 * Pure Vanilla JavaScript — zero external dependencies.
 */

document.addEventListener("DOMContentLoaded", () => {
    // -------------------------------------------------------------------------
    // 1. DOM Elements
    // -------------------------------------------------------------------------
    // Tabs and Panels
    const loginTabBtn = document.getElementById("loginTabBtn");
    const registerTabBtn = document.getElementById("registerTabBtn");
    const loginPanel = document.getElementById("loginPanel");
    const registerPanel = document.getElementById("registerPanel");
    const switchToRegisterBtns = document.querySelectorAll(".switch-to-register");
    const switchToLoginBtns = document.querySelectorAll(".switch-to-login");

    // Forms
    const loginForm = document.getElementById("loginForm");
    const registerForm = document.getElementById("registerForm");

    // Login Fields
    const loginEmailInput = document.getElementById("loginEmail");
    const loginEmailError = document.getElementById("loginEmailError");
    const loginPasswordInput = document.getElementById("loginPassword");
    const loginPasswordError = document.getElementById("loginPasswordError");
    const forgotPasswordBtn = document.getElementById("forgotPasswordBtn");

    // Register Fields
    const registerNameInput = document.getElementById("registerName");
    const registerNameError = document.getElementById("registerNameError");
    const registerEmailInput = document.getElementById("registerEmail");
    const registerEmailError = document.getElementById("registerEmailError");
    const registerPasswordInput = document.getElementById("registerPassword");
    const registerPasswordError = document.getElementById("registerPasswordError");
    const registerConfirmPasswordInput = document.getElementById("registerConfirmPassword");
    const registerConfirmPasswordError = document.getElementById("registerConfirmPasswordError");

    // Password Toggles
    const passwordToggleBtns = document.querySelectorAll(".password-toggle-btn");

    // Feedback Banner
    const feedbackBanner = document.getElementById("authFeedbackBanner");
    const bannerHeadline = document.getElementById("authBannerHeadline");
    const bannerMessage = document.getElementById("authBannerMessage");
    const bannerIcon = document.getElementById("authBannerIcon");
    const closeBannerBtn = document.getElementById("closeAuthBannerBtn");

    // -------------------------------------------------------------------------
    // 2. Tab Switching Logic
    // -------------------------------------------------------------------------
    function showTab(targetTab) {
        hideFeedbackBanner();
        clearAllErrors();

        if (targetTab === "register") {
            loginTabBtn.classList.remove("active");
            loginTabBtn.setAttribute("aria-selected", "false");
            loginPanel.classList.add("is-hidden");

            registerTabBtn.classList.add("active");
            registerTabBtn.setAttribute("aria-selected", "true");
            registerPanel.classList.remove("is-hidden");

            document.title = "Create Account — InkNest";
            if (registerNameInput) registerNameInput.focus();
        } else {
            registerTabBtn.classList.remove("active");
            registerTabBtn.setAttribute("aria-selected", "false");
            registerPanel.classList.add("is-hidden");

            loginTabBtn.classList.add("active");
            loginTabBtn.setAttribute("aria-selected", "true");
            loginPanel.classList.remove("is-hidden");

            document.title = "Sign In — InkNest";
            if (loginEmailInput) loginEmailInput.focus();
        }
    }

    if (loginTabBtn) {
        loginTabBtn.addEventListener("click", () => showTab("login"));
    }

    if (registerTabBtn) {
        registerTabBtn.addEventListener("click", () => showTab("register"));
    }

    switchToRegisterBtns.forEach((btn) => {
        btn.addEventListener("click", (e) => {
            e.preventDefault();
            showTab("register");
        });
    });

    switchToLoginBtns.forEach((btn) => {
        btn.addEventListener("click", (e) => {
            e.preventDefault();
            showTab("login");
        });
    });

    // Handle deep linking via hash (#register or #login) or path (/register)
    if (window.location.hash === "#register" || window.location.pathname === "/register") {
        showTab("register");
    } else if (window.location.hash === "#login" || window.location.pathname === "/login") {
        showTab("login");
    }

    // -------------------------------------------------------------------------
    // 3. Show / Hide Password Toggles
    // -------------------------------------------------------------------------
    passwordToggleBtns.forEach((btn) => {
        btn.addEventListener("click", () => {
            const targetId = btn.getAttribute("data-target");
            const targetInput = document.getElementById(targetId);

            if (!targetInput) return;

            if (targetInput.type === "password") {
                targetInput.type = "text";
                btn.textContent = "Hide";
                btn.setAttribute("aria-label", "Hide password");
            } else {
                targetInput.type = "password";
                btn.textContent = "Show";
                btn.setAttribute("aria-label", "Show password as plain text");
            }
        });
    });

    // -------------------------------------------------------------------------
    // 4. Robust Validation Helpers
    // -------------------------------------------------------------------------

    /**
     * Full Name Validation:
     * - Rejects empty names and names with only whitespace.
     * - Requires at least 2 characters.
     * - Rejects purely numeric names (e.g. '12345').
     * - Rejects names with only symbols (e.g. '!@#$%').
     * - Supports international characters (Unicode \p{L}), spaces, hyphens, and apostrophes.
     */
    function validateName(name) {
        if (!name || !name.trim()) {
            return { valid: false, message: "Please enter your full name." };
        }
        const trimmed = name.trim();
        if (trimmed.length < 2) {
            return { valid: false, message: "Name must be at least 2 characters long." };
        }
        // Must contain at least one letter
        if (!/\p{L}/u.test(trimmed)) {
            return { valid: false, message: "Name must contain letters. Numbers and symbols alone are not allowed." };
        }
        // Allow only letters, spaces, hyphens, apostrophes, and periods
        if (!/^[\p{L}\s'\-.]+$/u.test(trimmed)) {
            return { valid: false, message: "Name can only contain letters, spaces, hyphens, and apostrophes." };
        }
        return { valid: true };
    }

    /**
     * Email Validation:
     * - Rejects empty addresses.
     * - Rejects missing username, missing domain, missing dot, or missing TLD.
     * - Rejects examples: 'hello', 'hello@gmail', '@gmail.com', 'test@domain.'
     * - Accepts valid format: 'hello@gmail.com', 'user.name+tag@sub.domain.co.uk'
     */
    function validateEmail(email) {
        if (!email || !email.trim()) {
            return { valid: false, message: "Please enter your email address." };
        }
        const trimmed = email.trim();
        // RFC-compliant email pattern requiring username, '@', valid domain, and a 2+ letter TLD
        const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(trimmed)) {
            return { valid: false, message: "Please enter a valid email address (e.g., name@domain.com)." };
        }
        return { valid: true };
    }

    function setFieldError(input, errorElement, message) {
        input.classList.add("input-error");
        errorElement.textContent = message;
    }

    function clearFieldError(input, errorElement) {
        input.classList.remove("input-error");
        errorElement.textContent = "";
    }

    function clearAllErrors() {
        const errorInputs = document.querySelectorAll(".input-error");
        errorInputs.forEach((input) => input.classList.remove("input-error"));

        const errorMessages = document.querySelectorAll(".field-error");
        errorMessages.forEach((msg) => (msg.textContent = ""));
    }

    // Dynamic field clearing as user types
    const inputsWithErrors = [
        { input: loginEmailInput, error: loginEmailError },
        { input: loginPasswordInput, error: loginPasswordError },
        { input: registerNameInput, error: registerNameError },
        { input: registerEmailInput, error: registerEmailError },
        { input: registerPasswordInput, error: registerPasswordError },
        { input: registerConfirmPasswordInput, error: registerConfirmPasswordError }
    ];

    inputsWithErrors.forEach(({ input, error }) => {
        if (input && error) {
            input.addEventListener("input", () => {
                if (input.classList.contains("input-error")) {
                    clearFieldError(input, error);
                }
            });
        }
    });

    // -------------------------------------------------------------------------
    // 5. Prototype Feedback Banner Handler
    // -------------------------------------------------------------------------
    function showFeedbackBanner(headline, message, icon = "✦") {
        bannerHeadline.textContent = headline;
        bannerMessage.textContent = message;
        bannerIcon.textContent = icon;
        feedbackBanner.style.display = "flex";
        feedbackBanner.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }

    function hideFeedbackBanner() {
        if (feedbackBanner) {
            feedbackBanner.style.display = "none";
        }
    }

    if (closeBannerBtn) {
        closeBannerBtn.addEventListener("click", hideFeedbackBanner);
    }

    // -------------------------------------------------------------------------
    // 6. Login Form Validation & Prototype Submission
    // -------------------------------------------------------------------------
    if (loginForm) {
        loginForm.addEventListener("submit", (e) => {
            e.preventDefault();
            hideFeedbackBanner();
            clearAllErrors();

            let isValid = true;
            let firstInvalidField = null;

            // Validate Email
            const emailValidation = validateEmail(loginEmailInput.value);
            if (!emailValidation.valid) {
                setFieldError(loginEmailInput, loginEmailError, emailValidation.message);
                isValid = false;
                if (!firstInvalidField) firstInvalidField = loginEmailInput;
            }

            // Validate Password
            const passwordValue = loginPasswordInput.value;
            if (!passwordValue) {
                setFieldError(loginPasswordInput, loginPasswordError, "Please enter your password.");
                isValid = false;
                if (!firstInvalidField) firstInvalidField = loginPasswordInput;
            } else if (passwordValue.length < 6) {
                setFieldError(loginPasswordInput, loginPasswordError, "Password must be at least 6 characters.");
                isValid = false;
                if (!firstInvalidField) firstInvalidField = loginPasswordInput;
            }

            if (!isValid) {
                if (firstInvalidField) firstInvalidField.focus();
                return;
            }

            // Prototype Validation Success Demonstration
            const emailValue = loginEmailInput.value.trim();
            showFeedbackBanner(
                "Sign-In Prototype Validation Passed",
                `Form validation passed successfully for ${emailValue}! In Phase 2, this will authenticate against the MySQL database and create a persistent user session. No actual login occurred in this frontend phase.`
            );
        });
    }

    // -------------------------------------------------------------------------
    // 7. Registration Form Validation & Prototype Submission
    // -------------------------------------------------------------------------
    if (registerForm) {
        registerForm.addEventListener("submit", (e) => {
            e.preventDefault();
            hideFeedbackBanner();
            clearAllErrors();

            let isValid = true;
            let firstInvalidField = null;

            // Validate Full Name
            const nameValidation = validateName(registerNameInput.value);
            if (!nameValidation.valid) {
                setFieldError(registerNameInput, registerNameError, nameValidation.message);
                isValid = false;
                if (!firstInvalidField) firstInvalidField = registerNameInput;
            }

            // Validate Email
            const emailValidation = validateEmail(registerEmailInput.value);
            if (!emailValidation.valid) {
                setFieldError(registerEmailInput, registerEmailError, emailValidation.message);
                isValid = false;
                if (!firstInvalidField) firstInvalidField = registerEmailInput;
            }

            // Validate Password
            const passwordValue = registerPasswordInput.value;
            if (!passwordValue) {
                setFieldError(registerPasswordInput, registerPasswordError, "Please choose a password.");
                isValid = false;
                if (!firstInvalidField) firstInvalidField = registerPasswordInput;
            } else if (passwordValue.length < 8) {
                setFieldError(registerPasswordInput, registerPasswordError, "Password must be at least 8 characters long.");
                isValid = false;
                if (!firstInvalidField) firstInvalidField = registerPasswordInput;
            }

            // Validate Confirm Password
            const confirmPasswordValue = registerConfirmPasswordInput.value;
            if (!confirmPasswordValue) {
                setFieldError(registerConfirmPasswordInput, registerConfirmPasswordError, "Please confirm your password.");
                isValid = false;
                if (!firstInvalidField) firstInvalidField = registerConfirmPasswordInput;
            } else if (confirmPasswordValue !== passwordValue) {
                setFieldError(registerConfirmPasswordInput, registerConfirmPasswordError, "Passwords do not match. Please re-enter.");
                isValid = false;
                if (!firstInvalidField) firstInvalidField = registerConfirmPasswordInput;
            }

            if (!isValid) {
                if (firstInvalidField) firstInvalidField.focus();
                return;
            }

            // Prototype Registration Success Demonstration
            const cleanName = registerNameInput.value.trim();
            const cleanEmail = registerEmailInput.value.trim();
            showFeedbackBanner(
                "Registration Prototype Validation Passed",
                `Account details for ${cleanName} (${cleanEmail}) validated successfully! In Phase 2, this will securely hash your password, insert your record into MySQL, and redirect to your dashboard. No account was stored in this frontend phase.`
            );
        });
    }

    // -------------------------------------------------------------------------
    // 8. Forgot Password Action Demonstration
    // -------------------------------------------------------------------------
    if (forgotPasswordBtn) {
        forgotPasswordBtn.addEventListener("click", () => {
            showFeedbackBanner(
                "Password Recovery Demonstration",
                "In Phase 2, this will prompt for your email address and dispatch a secure, time-limited password reset link."
            );
        });
    }
});
