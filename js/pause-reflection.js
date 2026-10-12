/**
 * Project Suna - The Suna Pause (Guided Reflection)
 * 
 * Ethos & Constraints:
 * - 60-90 second calm reflection (4 gentle steps).
 * - Stores NOTHING: no localStorage, no sessionStorage, no cookies.
 * - No streaks, no score, no gamification, no push reminders.
 * - Keyboard accessible, announces changes to assistive tech.
 * - Final step explicitly encourages reaching out to a real human person.
 */

function initPauseReflection() {
  const container = document.getElementById("pause-reflection-widget");
  if (!container) return;

  const screens = container.querySelectorAll(".pause-screen");
  const prevBtn = document.getElementById("pause-btn-prev");
  const nextBtn = document.getElementById("pause-btn-next");
  const restartBtn = document.getElementById("pause-btn-restart");
  const progressText = document.getElementById("pause-progress-text");
  const statusAnnouncer = document.getElementById("pause-status-announcer");

  if (!screens.length || !prevBtn || !nextBtn || !restartBtn) return;

  let currentStep = 0;
  const totalSteps = screens.length;

  function updateUI() {
    // Show active screen, hide others
    screens.forEach((screen, index) => {
      const isActive = index === currentStep;
      screen.classList.toggle("active", isActive);
      screen.setAttribute("aria-hidden", !isActive);
      if (isActive) {
        screen.removeAttribute("hidden");
      } else {
        screen.setAttribute("hidden", "until-found");
      }
    });

    // Update progress indicator
    const currentNum = currentStep + 1;
    if (progressText) {
      progressText.textContent = `Step ${currentNum} of ${totalSteps}`;
    }

    // Button states
    if (currentStep === 0) {
      prevBtn.style.display = "none";
      restartBtn.style.display = "none";
      nextBtn.textContent = "Begin Pause";
      nextBtn.style.display = "inline-flex";
    } else if (currentStep === totalSteps - 1) {
      prevBtn.style.display = "inline-flex";
      nextBtn.style.display = "none";
      restartBtn.style.display = "inline-flex";
    } else {
      prevBtn.style.display = "inline-flex";
      restartBtn.style.display = "none";
      nextBtn.textContent = "Next Step";
      nextBtn.style.display = "inline-flex";
    }

    // Accessible screen reader announcement
    if (statusAnnouncer) {
      const activeTitle = screens[currentStep].querySelector("h3")?.textContent || "";
      statusAnnouncer.textContent = `Showing Step ${currentNum} of ${totalSteps}: ${activeTitle}`;
    }

    // Focus management: focus heading of newly revealed step
    const heading = screens[currentStep].querySelector("h3");
    if (heading && currentStep > 0) {
      heading.setAttribute("tabindex", "-1");
      heading.focus();
    }
  }

  nextBtn.addEventListener("click", () => {
    if (currentStep < totalSteps - 1) {
      currentStep++;
      updateUI();
    }
  });

  prevBtn.addEventListener("click", () => {
    if (currentStep > 0) {
      currentStep--;
      updateUI();
    }
  });

  restartBtn.addEventListener("click", () => {
    currentStep = 0;
    updateUI();
  });

  // Keyboard navigation within the reflection container
  container.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight" && currentStep < totalSteps - 1) {
      currentStep++;
      updateUI();
    } else if (e.key === "ArrowLeft" && currentStep > 0) {
      currentStep--;
      updateUI();
    }
  });

  // Initial render
  updateUI();
}

document.addEventListener("DOMContentLoaded", initPauseReflection);
