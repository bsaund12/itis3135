/*
  File: scripts/music.js
  Author: B.J. Saunders
  Project: SoundStage Client Website

  Description:
    Shared JavaScript for all pages in the SoundStage site.

    Dynamic features:
      1) Active navigation highlighting on every page.
      2) Image lightbox widget for gallery thumbnails (Home + Gallery pages).
      3) Music Explorer search + audio preview player using the iTunes Search API (Music page).

    Behavior (JS) is separated from structure (HTML) and style (CSS).
*/

"use strict";

console.log("SoundStage JS loaded");

/**
 * Finds all elements with data-include="some/path.html"
 * and replaces them with the fetched HTML.
 */
function includeLayout() {
  const hosts = document.querySelectorAll("[data-include]");
  const tasks = [];

  hosts.forEach((host) => {
    const url = host.getAttribute("data-include");
    if (!url) return;

    const task = fetch(url)
      .then((resp) => {
        if (!resp.ok) {
          throw new Error(`Failed to load component: ${url}`);
        }
        return resp.text();
      })
      .then((html) => {
        host.innerHTML = html;
      });

    tasks.push(task);
  });

  return Promise.all(tasks);
}

// ======================================================
// 1. ACTIVE NAVIGATION HIGHLIGHT (all pages)
// ======================================================
function initNavHighlight() {
  const navLinks = document.querySelectorAll(".site-nav a");
  if (!navLinks.length) return;

  let currentPath = window.location.pathname.split("/").pop();

  if (!currentPath || currentPath === "") {
    currentPath = "index.html";
  }

  navLinks.forEach((link) => {
    const href = link.getAttribute("href");
    if (href === currentPath) {
      link.classList.add("active");
    }
  });
}

// ======================================================
// 2. IMAGE LIGHTBOX (Home + Gallery)
// ======================================================
function initLightbox() {
  const lightbox = document.querySelector("#lightbox");
  const lightboxImg = document.querySelector("#lightbox-img");
  const lightboxCaption = document.querySelector("#lightbox-caption");
  const lightboxClose = document.querySelector(".lightbox-close");

  if (!lightbox || !lightboxImg || !lightboxCaption || !lightboxClose) {
    return; // No lightbox on this page
  }

  const thumbs = document.querySelectorAll(".lb-thumb");

  thumbs.forEach((img) => {
    img.addEventListener("click", () => {
      lightboxImg.src = img.src;
      lightboxImg.alt = img.alt;
      lightboxCaption.textContent = img.alt || "";
      lightbox.showModal();
    });
  });

  lightboxClose.addEventListener("click", () => {
    lightbox.close();
  });

  // Clicking outside dialog content closes it
  lightbox.addEventListener("click", (event) => {
    const rect = lightbox.getBoundingClientRect();
    const inDialogBounds =
      event.clientX >= rect.left &&
      event.clientX <= rect.right &&
      event.clientY <= rect.bottom &&
      event.clientY >= rect.top;

    if (!inDialogBounds) {
      lightbox.close();
    }
  });

  // ESC key closes the lightbox
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && lightbox.open) {
      lightbox.close();
    }
  });
}

// ======================================================
// 3. MUSIC EXPLORER (music.html)
// ======================================================
function initMusicExplorer() {
  const searchForm = document.querySelector("#searchForm");
  if (!searchForm) return; // Only run on Music Explorer page

  const searchInput = document.querySelector("#q");
  const resultsList = document.querySelector("#results");
  const srStatus = document.querySelector("#srStatus");
  const playPauseBtn = document.querySelector("#playPause");
  const progressEl = document.querySelector("#progress");
  const nowPlaying = document.querySelector("#nowPlaying");

  // Shared Audio object
  let audio = new Audio();
  let currentPreviewUrl = "";
  let progressTimer = null;

  function setStatus(message) {
    if (srStatus) {
      srStatus.textContent = message;
    }
  }

  function clearResults() {
    if (resultsList) {
      resultsList.innerHTML = "";
    }
  }

  function updateNowPlaying(message) {
    if (nowPlaying) {
      nowPlaying.textContent = message;
    }
  }

  function resetPlayerUI() {
    if (progressEl) {
      progressEl.value = 0;
    }
    if (playPauseBtn) {
      playPauseBtn.textContent = "⏯";
    }
  }

  function playPreview(item) {
    const url = item.previewUrl;

    if (!url) {
      updateNowPlaying("Preview not available for this track.");
      return;
    }

    // Toggle pause if same track is playing
    if (currentPreviewUrl === url && !audio.paused) {
      audio.pause();
      if (playPauseBtn) {
        playPauseBtn.textContent = "▶";
      }
      return;
    }

    // New track
    currentPreviewUrl = url;
    audio.src = url;

    audio
      .play()
      .then(() => {
        updateNowPlaying(`${item.trackName} — ${item.artistName}`);
        if (playPauseBtn) {
          playPauseBtn.textContent = "⏸";
        }

        if (progressTimer) {
          clearInterval(progressTimer);
        }

        progressTimer = setInterval(() => {
          if (audio.duration && !isNaN(audio.duration)) {
            if (progressEl) {
              progressEl.value = audio.currentTime / audio.duration;
            }
          }

          if (audio.ended) {
            if (progressTimer) {
              clearInterval(progressTimer);
            }
            resetPlayerUI();
            updateNowPlaying("Nothing playing");
          }
        }, 250);
      })
      .catch((err) => {
        console.error(err);
        setStatus("Unable to play preview.");
      });
  }

  // Handle search submit
  searchForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const term = searchInput.value.trim();
    if (!term) return;

    clearResults();
    setStatus(`Searching for "${term}"…`);
    updateNowPlaying("Nothing playing");
    resetPlayerUI();
    audio.pause();
    audio.currentTime = 0;
    currentPreviewUrl = "";

    try {
      const url = `https://itunes.apple.com/search?media=music&limit=12&term=${encodeURIComponent(
        term
      )}`;

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Network error while contacting iTunes API");
      }

      const data = await response.json();
      const results = data.results || [];

      if (!results.length) {
        setStatus(`No results found for "${term}".`);
        return;
      }

      setStatus(`Found ${results.length} tracks. Select "Preview" to listen.`);

      results.forEach((item) => {
        const li = document.createElement("li");

        const img = document.createElement("img");
        img.src = item.artworkUrl100;
        img.alt = `${item.trackName} cover art`;

        const info = document.createElement("div");
        const title = document.createElement("strong");
        title.textContent = item.trackName || "Unknown track";
        const artist = document.createElement("div");
        artist.className = "muted";
        artist.textContent = item.artistName || "Unknown artist";
        info.appendChild(title);
        info.appendChild(artist);

        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "icon-btn";
        btn.textContent = "Preview";
        btn.setAttribute(
          "aria-label",
          `Preview ${item.trackName} by ${item.artistName}`
        );

        btn.addEventListener("click", () => {
          playPreview(item);
        });

        li.appendChild(img);
        li.appendChild(info);
        li.appendChild(btn);
        resultsList.appendChild(li);
      });
    } catch (error) {
      console.error(error);
      setStatus("Sorry, something went wrong. Please try again.");
    }
  });

  // Global play/pause toggle
  if (playPauseBtn) {
    playPauseBtn.addEventListener("click", () => {
      if (!currentPreviewUrl) return;

      if (audio.paused) {
        audio
          .play()
          .then(() => {
            playPauseBtn.textContent = "⏸";
          })
          .catch((err) => {
            console.error(err);
            setStatus("Unable to resume preview.");
          });
      } else {
        audio.pause();
        playPauseBtn.textContent = "▶";
      }
    });
  }

  audio.addEventListener("ended", () => {
    resetPlayerUI();
    updateNowPlaying("Nothing playing");
  });
}

/* ===== LAST THING IN FILE: DOMContentLoaded ===== */

document.addEventListener("DOMContentLoaded", () => {
  includeLayout()
    .then(() => {
      // Once components are loaded, initialize all interactive features
      initNavHighlight();
      initLightbox();
      initMusicExplorer();
    })
    .catch((err) => {
      console.error("Error including layout components:", err);
      // Even if includes fail, still try to initialize features
      initNavHighlight();
      initLightbox();
      initMusicExplorer();
    });
});
