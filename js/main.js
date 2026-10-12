/**
 * Project Suna - Main Application Script
 * Vanilla JS, no tracking, zero external dependencies.
 */

// Fallback data in case the site is opened via file:// protocol where fetch is blocked by browser CORS policy
const FALLBACK_WORDS_DATA = {
  categories: [
    {
      id: "starting-out",
      situation: "Starting a difficult conversation",
      description: "When you know something needs to be said, but starting feels overwhelming.",
      phrases: [
        {
          id: "start-1",
          text: "I’m having a hard time finding the right words, but I want to be honest about where I am today.",
          context: "Useful when you want to open up without feeling pressured to tell the story perfectly."
        },
        {
          id: "start-2",
          text: "There’s something weighing on me that I’d like to share, but I don’t need advice or answers right now.",
          context: "Helps set clear expectations before speaking."
        },
        {
          id: "start-3",
          text: "Do you have 10 quiet minutes? I don’t need you to fix anything, just to sit with me for a moment.",
          context: "A gentle invitation for someone’s calm attention."
        }
      ]
    },
    {
      id: "feeling-overwhelmed",
      situation: "Expressing overwhelm without a tidy conclusion",
      description: "When things feel disorganized or heavy inside and you can’t summarize it neatly.",
      phrases: [
        {
          id: "overwhelm-1",
          text: "Everything feels loud and slightly too much right now, and I’m having trouble sorting through it.",
          context: "Validates feelings of cognitive or sensory exhaustion."
        },
        {
          id: "overwhelm-2",
          text: "I’m not in immediate danger, but I feel empty and tired in a way sleep doesn’t seem to fix.",
          context: "Clarifies emotional exhaustion while distinguishing it from an acute crisis."
        },
        {
          id: "overwhelm-3",
          text: "I don’t fully understand why today feels so heavy, but pretending it doesn't is taking all my energy.",
          context: "Relieves the burden of needing an intellectual explanation for low mood."
        }
      ]
    },
    {
      id: "asking-for-presence",
      situation: "Asking for quiet presence instead of solutions",
      description: "When you need companionable silence or gentle listening rather than problem-solving.",
      phrases: [
        {
          id: "presence-1",
          text: "Could we just take a short walk or sit together without talking about solutions for a bit?",
          context: "Grounds the connection in physical calm without demand for performance."
        },
        {
          id: "presence-2",
          text: "If I get quiet or teary, it’s not because you did anything wrong; I just need space to breathe.",
          context: "Reassures the other person so you can both relax into the moment."
        }
      ]
    },
    {
      id: "gentle-boundaries",
      situation: "Setting a gentle boundary when depleted",
      description: "When you need to pause or step back without feeling cold or guilty.",
      phrases: [
        {
          id: "boundary-1",
          text: "I care about this conversation, but my cup is completely empty right now. Can we pick this up tomorrow?",
          context: "Protects your remaining reserves while honoring the relationship."
        },
        {
          id: "boundary-2",
          text: "I don’t have the emotional capacity to listen well right now, but I want to make time once I’ve recharged.",
          context: "Honest self-awareness that prevents resentment or burnout."
        }
      ]
    }
  ]
};

document.addEventListener("DOMContentLoaded", () => {
  initMobileNavigation();
  initWordsYouCanBorrow();
});

/**
 * 1. Mobile Navigation Toggle
 */
function initMobileNavigation() {
  const toggleBtn = document.querySelector(".nav-toggle");
  const navMenu = document.querySelector(".site-nav");

  if (!toggleBtn || !navMenu) return;

  toggleBtn.addEventListener("click", () => {
    const isExpanded = toggleBtn.getAttribute("aria-expanded") === "true";
    toggleBtn.setAttribute("aria-expanded", String(!isExpanded));
    navMenu.classList.toggle("is-open", !isExpanded);
  });

  // Close nav on escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && navMenu.classList.contains("is-open")) {
      navMenu.classList.remove("is-open");
      toggleBtn.setAttribute("aria-expanded", "false");
      toggleBtn.focus();
    }
  });
}

/**
 * 2. Words You Can Borrow Loader & Copy-to-Clipboard
 */
async function initWordsYouCanBorrow() {
  const container = document.getElementById("words-container");
  if (!container) return;

  let data = null;

  try {
    // Try fetching from JSON endpoint (relative and absolute fallbacks)
    const res = await fetch("content/words-you-can-borrow.json");
    if (res.ok) {
      data = await res.json();
    } else {
      throw new Error(`HTTP ${res.status}`);
    }
  } catch (err) {
    // Graceful fallback when running locally under file:// or offline
    console.info("Using embedded fallback phrases data (safe local mode):", err.message);
    data = FALLBACK_WORDS_DATA;
  }

  if (!data || !data.categories) {
    container.innerHTML = `<p class="container-error">Unable to load phrases at this moment.</p>`;
    return;
  }

  renderWords(data.categories, container);
}

function renderWords(categories, container) {
  container.innerHTML = "";

  categories.forEach((cat) => {
    const groupEl = document.createElement("article");
    groupEl.className = "situation-group";
    groupEl.setAttribute("aria-labelledby", `heading-${cat.id}`);

    const headerEl = document.createElement("header");
    headerEl.className = "situation-header";
    headerEl.innerHTML = `
      <h3 id="heading-${cat.id}">${escapeHtml(cat.situation)}</h3>
      <p>${escapeHtml(cat.description)}</p>
    `;
    groupEl.appendChild(headerEl);

    const listEl = document.createElement("ul");
    listEl.className = "phrases-list";
    listEl.setAttribute("role", "list");

    cat.phrases.forEach((phrase) => {
      const itemEl = document.createElement("li");
      itemEl.className = "phrase-card";

      const quoteEl = document.createElement("blockquote");
      quoteEl.className = "phrase-quote";
      quoteEl.textContent = phrase.text;

      const contextEl = document.createElement("p");
      contextEl.className = "phrase-context";
      contextEl.textContent = phrase.context;

      const footerEl = document.createElement("div");
      footerEl.className = "phrase-footer";

      const copyBtn = document.createElement("button");
      copyBtn.type = "button";
      copyBtn.className = "btn-copy";
      copyBtn.setAttribute("aria-label", `Copy phrase: "${phrase.text}"`);
      copyBtn.innerHTML = `
        <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
        </svg>
        <span>Copy phrase</span>
      `;

      copyBtn.addEventListener("click", () => handleCopyPhrase(phrase.text, copyBtn));

      footerEl.appendChild(copyBtn);
      itemEl.appendChild(quoteEl);
      itemEl.appendChild(contextEl);
      itemEl.appendChild(footerEl);
      listEl.appendChild(itemEl);
    });

    groupEl.appendChild(listEl);
    container.appendChild(groupEl);
  });
}

function handleCopyPhrase(text, buttonEl) {
  const announcer = document.getElementById("words-live-announcer");
  const span = buttonEl.querySelector("span");

  function onSuccess() {
    buttonEl.setAttribute("data-copied", "true");
    if (span) span.textContent = "Copied to clipboard!";
    if (announcer) {
      announcer.textContent = `Copied phrase: "${text}" to clipboard.`;
    }

    setTimeout(() => {
      buttonEl.removeAttribute("data-copied");
      if (span) span.textContent = "Copy phrase";
    }, 2500);
  }

  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(onSuccess).catch(() => fallbackCopy(text, onSuccess));
  } else {
    fallbackCopy(text, onSuccess);
  }
}

function fallbackCopy(text, callback) {
  const tempInput = document.createElement("textarea");
  tempInput.value = text;
  tempInput.setAttribute("readonly", "");
  tempInput.style.position = "absolute";
  tempInput.style.left = "-9999px";
  document.body.appendChild(tempInput);
  tempInput.select();
  try {
    document.execCommand("copy");
    callback();
  } catch (e) {
    console.error("Unable to copy to clipboard", e);
  }
  document.body.removeChild(tempInput);
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}
