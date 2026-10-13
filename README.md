# Project Suna ("You can talk about it.")

An accessible, mobile-first static website for **Project Suna**, an early research concept exploring pseudonymous, non-clinical conversation support for adults and teenagers.

> **Important Boundary & Status Notice:**  
> Suna is in early research and is **not live**, **not therapy**, and **not emergency help**. We never describe unbuilt features as available, never use the term "anonymous", and never promise absolute confidentiality.

---

## 1. Project Structure

```
project-suna/
├── index.html                   # Landing page (Hero, What Suna Is/Not, The Suna Pause, Words to Borrow, Form Spec)
├── about.html                   # About the research, core values, missing middle ground, founder placeholder
├── help-now.html                # Crisis support resources (verified directories + founder verification notice)
├── privacy.html                # Plain-language privacy principles (founder review draft, no tracking)
├── css/
│   └── style.css                # Design system tokens, responsive layout, accessible typography, reduced motion
├── js/
│   ├── main.js                  # Mobile navigation, JSON phrases loader, copy-to-clipboard with aria-live
│   └── pause-reflection.js      # Guided reflection stepper (4 screens, zero data stored, keyboard support)
├── content/
│   └── words-you-can-borrow.json# 10 authentic phrases across 4 situations
└── README.md                    # Setup, content editing guide, deployment notes, accessibility audit
```

---

## 2. Technical Stack & Design System

- **Stack:** Plain HTML5, CSS3, Vanilla JavaScript. Zero external frameworks, zero analytics trackers, zero cookies, zero database.
- **Color Palette (CSS Variables in `css/style.css`):**
  - Forest Green: `#183D34` (Primary brand / headings / strong accents)
  - Terracotta: `#CB8262` (Warm accent)
  - Accessible Terracotta Text: `#873F1F` (WCAG AAA contrast 6.86:1 against Cream background)
  - Warm Cream: `#F7F3E9` (Page background)
  - Soft Sage: `#DCE7D8` (Fills, cards, borders)
- **Typography:**
  - Serif Headings: `"Newsreader", "Fraunces", "Georgia", "Cambria", serif`
  - Sans Body: `"Plus Jakarta Sans", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`
- **Responsive Width:** Fluidly responsive down to 360px viewport width without horizontal scroll.

---

## 3. How to Edit Content

### Modifying "Words You Can Borrow"
All phrases are loaded from `content/words-you-can-borrow.json`. Each entry contains an `id`, `text`, and practical `context`:

```json
{
  "id": "presence-1",
  "text": "Could we just take a short walk or sit together without talking about solutions for a bit?",
  "context": "Grounds the connection in physical calm without demand for performance."
}
```
*Note: A synchronized fallback is also maintained in `js/main.js` so the quotes continue to render even if a user inspects the site locally using `file://` protocol where browser CORS blocks local fetch.*

### Modifying Page Text & Copy
- **Landing Page:** Edit `index.html` to update the hero statement, comparison columns, or feedback form details.
- **Crisis Directory:** Edit `help-now.html`. *Ensure the founder verifies all national numbers and directories before publishing.*
- **Privacy Policy:** Edit `privacy.html`. *Ensure legal/ethics review is completed before public launch.*
- **About the Project:** Edit `about.html` to update founder bios or research institutional affiliations.

---

## 4. How to Deploy

Because this site uses plain HTML/CSS/JS with zero build steps, it can be deployed immediately to any static hosting provider.

### Option A: GitHub Pages
1. Push this folder to a GitHub repository (e.g. `your-user/project-suna`).
2. In the repository settings, navigate to **Pages** (under Code and automation).
3. Under **Build and deployment**:
   - Source: `Deploy from a branch`
   - Branch: `main` (or `master`), Folder: `/ (root)`.
4. Click **Save**. Your site will be live at `https://<your-username>.github.io/project-suna/`.

### Option B: Netlify
1. Log in to [Netlify](https://www.netlify.com/).
2. Drag and drop the `project-suna` folder directly into the Netlify Drop area, OR connect your GitHub repository with:
   - Build command: *(leave blank)*
   - Publish directory: `.` (root directory)
3. Netlify will deploy your site in seconds with automatic SSL/HTTPS.

### Option C: Running Locally
You can preview the site locally using any lightweight static server:
```bash
# Using Python 3:
python -m http.server 8000

# Open in browser:
http://localhost:8000
```

---

## 5. Accessibility Self-Check List

| Checkpoint | Standard / Requirement | Status | Verification Detail |
| :--- | :--- | :--- | :--- |
| **Color Contrast** | WCAG AA &ge; 4.5:1 for body text | **Passed** | &bull; Forest (`#183D34`) on Cream (`#F7F3E9`): **10.79:1** (AAA)<br>&bull; Muted text (`#26433B`) on Cream (`#F7F3E9`): **9.73:1** (AAA)<br>&bull; Dark Terracotta (`#873F1F`) on Cream (`#F7F3E9`): **6.86:1** (AAA)<br>&bull; Forest (`#183D34`) on Sage (`#DCE7D8`): **9.38:1** (AAA)<br>&bull; Cream (`#F7F3E9`) on Forest (`#183D34`): **10.79:1** (AAA) |
| **Keyboard Navigation** | Visible focus & logical tab order | **Passed** | High-contrast `:focus-visible` ring (3px outline with 3px offset) on all interactive elements. Skip to main content link on every page. |
| **The Suna Pause** | Interactive keyboard flow | **Passed** | Next/Previous/Restart operable via buttons and Arrow keys. Auto-focuses heading on step transition. |
| **Zero Data Storage** | No tracking or persistence | **Passed** | Verified: zero calls to `localStorage`, `sessionStorage`, or `document.cookie`. No streak counters or reminder notifications. |
| **Screen Reader Support** | ARIA live region announcements | **Passed** | &bull; Stepper announces active step via `aria-live="polite"` (`#pause-status-announcer`).<br>&bull; Quote copy buttons announce copied state via `aria-live="polite"` (`#words-live-announcer`). |
| **Prefers Reduced Motion** | Respect user motion preferences | **Passed** | `@media (prefers-reduced-motion: reduce)` disables animations and smooth scrolling across all elements. |
| **Mobile Responsiveness** | Usable at 360px viewport width | **Passed** | Fluid typography using `clamp()`, flexible padding, and responsive single-column collapse tested down to 360px. |
| **Crisis Resource Links** | Present on every page | **Passed** | Every page contains a prominent footer link and callout leading to `help-now.html`. |
