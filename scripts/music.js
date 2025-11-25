/*
  File: scripts/main.js
  Author: B.J. Saunders
  Project: SoundStage Client Website

  Description:
  Shared JavaScript for all pages in the SoundStage site.

  Main features (3+ dynamic interactions):
    1) Active navigation highlighting on every page.
    2) Image lightbox widget for gallery thumbnails (Home + Gallery pages).
    3) Music Explorer search + audio preview player using the iTunes Search API (Music page).

  This file keeps behavior (JS) separate from structure (HTML) and style (CSS).
*/
console.log("SoundStage JS loaded");

"use strict";

// Run only after the DOM is fully loaded
document.addEventListener("DOMContentLoaded", () => {
  // ======================================================
  // 1. ACTIVE NAVIGATION HIGHLIGHT (all pages)
  //    - Adds .active class to the link that matches the
  //      current page URL.
  // ======================================================
  const navLinks = document.querySelectorAll(".site-nav a");

  // Get the file name part of the current path (e.g., "index.html")
  let currentPath = window.location.pathname.split("/").pop();

  // When the path is just a folder (""), treat it as index.html
  if (!currentPath || currentPath === "") {
    currentPath = "index.html";
  }

  navLinks.forEach((link) => {
    const href = link.getAttribute("href");

    // If the href matches the current path, mark it as active
    if (href === currentPath) {
      link.classList.add("active");
    }
  });

  // ======================================================
  // 2. IMAGE LIGHTBOX (Home + Gallery)
  //    - Clicking any .lb-thumb image opens a <dialog>
  //      showing a larger version and its caption.
  //    - Can be closed via button, clicking backdrop, or ESC.
  // ======================================================
  const lightbox = document.querySelector("#lightbox");
  const lightboxImg = document.querySelector("#lightbox-img");
  const lightboxCaption = document.querySelector("#lightbox-caption");
  const lightboxClose = document.querySelector(".lightbox-close");

  // Only attach handlers if the dialog exists on this page
  if (lightbox && lightboxImg && lightboxCaption && lightboxClose) {
    const thumbs = document.querySelectorAll(".lb-thumb");

    // Open lightbox when any thumbnail is clicked
    thumbs.forEach((img) => {
      img.addEventListener("click", () => {
        // Use the clicked image as the lightbox content
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt;
        lightboxCaption.textContent = img.alt || "";
        // Show modal dialog
        lightbox.showModal();
      });
    });

    // Close button inside the dialog
    lightboxClose.addEventListener("click", () => {
      lightbox.close();
    });

    // Clicking outside the dialog content closes it
    lightbox.addEventListener("click", (event) => {
      const rect = lightbox.getBoundingClientRect();
      const inDialogBounds =
        event.clientX >= rect.left &&
        event.clientX <= rect.right &&
        event.clientY >= rect.top &&
        event.clientY <= rect.bottom;

      // If click occurs outside the dialog box, close it
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
  //
  // Features:
  //  - Uses the public iTunes Search API to fetch tracks.
  //  - Renders search results dynamically to the page.
  //  - Clicking "Preview" plays a 30s preview in a shared
  //    sticky player bar with play/pause and progress.
  //
  // This block only runs when the search form exists
  // (i.e., on music.html).
  // ======================================================
  const searchForm = document.querySelector("#searchForm");

  if (searchForm) {
    // ----- Element references -----
    const searchInput = document.querySelector("#q");
    const resultsList = document.querySelector("#results");
    const srStatus = document.querySelector("#srStatus");
    const playPauseBtn = document.querySelector("#playPause");
    const progressEl = document.querySelector("#progress");
    const nowPlaying = document.querySelector("#nowPlaying");

    // Single shared Audio object for all previews
    let audio = new Audio();
    let currentPreviewUrl = "";
    let progressTimer = null;

    // Screen-reader status helper
    function setStatus(message) {
      if (srStatus) {
        srStatus.textContent = message;
      }
    }

    // Clear previous search results from the <ul>
    function clearResults() {
      if (resultsList) {
        resultsList.innerHTML = "";
      }
    }

    // Update text in the sticky player bar
    function updateNowPlaying(message) {
      if (nowPlaying) {
        nowPlaying.textContent = message;
      }
    }

    // Reset play button icon and progress bar
    function resetPlayerUI() {
      if (progressEl) {
        progressEl.value = 0;
      }
      if (playPauseBtn) {
        // Use the general play/pause symbol from the design
        playPauseBtn.textContent = "⏯";
      }
    }

    // --------------------------------------------------
    // Handle search form submission
    // --------------------------------------------------
    searchForm.addEventListener("submit", async (event) => {
      event.preventDefault(); // Stop form from reloading the page

      const term = searchInput.value.trim();
      if (!term) {
        return; // Do nothing on empty search
      }

      // Reset UI for new search
      clearResults();
      setStatus(`Searching for "${term}"…`);
      updateNowPlaying("Nothing playing");
      resetPlayerUI();
      audio.pause();
      audio.currentTime = 0;
      currentPreviewUrl = "";

      try {
        // Build iTunes Search API URL
        const url = `https://itunes.apple.com/search?media=music&limit=12&term=${encodeURIComponent(
          term
        )}`;

        // Fetch data from iTunes
        const response = await fetch(url);

        if (!response.ok) {
          throw new Error("Network error while contacting iTunes API");
        }

        // Parse JSON results
        const data = await response.json();
        const results = data.results || [];

        if (!results.length) {
          setStatus(`No results found for "${term}".`);
          return;
        }

        setStatus(
          `Found ${results.length} tracks. Select "Preview" to listen.`
        );

        // Render each track as a <li> inside #results
        results.forEach((item) => {
          const li = document.createElement("li");

          // Album art
          const img = document.createElement("img");
          img.src = item.artworkUrl100;
          img.alt = `${item.trackName} cover art`;

          // Track info (title + artist)
          const info = document.createElement("div");
          const title = document.createElement("strong");
          title.textContent = item.trackName || "Unknown track";
          const artist = document.createElement("div");
          artist.className = "muted";
          artist.textContent = item.artistName || "Unknown artist";
          info.appendChild(title);
          info.appendChild(artist);

          // Preview button
          const btn = document.createElement("button");
          btn.type = "button";
          btn.className = "icon-btn";
          btn.textContent = "Preview";
          btn.setAttribute(
            "aria-label",
            `Preview ${item.trackName} by ${item.artistName}`
          );

          // Clicking the button starts / changes the preview
          btn.addEventListener("click", () => {
            playPreview(item);
          });

          // Assemble the <li> and add to the results list
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

    // --------------------------------------------------
    // Play a selected track preview in the sticky player
    // --------------------------------------------------
    function playPreview(item) {
      const url = item.previewUrl;

      if (!url) {
        updateNowPlaying("Preview not available for this track.");
        return;
      }

      // If the same track is already playing, toggle pause
      if (currentPreviewUrl === url && !audio.paused) {
        audio.pause();
        if (playPauseBtn) {
          playPauseBtn.textContent = "▶";
        }
        return;
      }

      // New track selected: update source and play
      currentPreviewUrl = url;
      audio.src = url;

      audio
        .play()
        .then(() => {
          updateNowPlaying(`${item.trackName} — ${item.artistName}`);
          if (playPauseBtn) {
            playPauseBtn.textContent = "⏸";
          }

          // Clear any previous timer
          if (progressTimer) {
            clearInterval(progressTimer);
          }

          // Update the progress bar while audio is playing
          progressTimer = setInterval(() => {
            if (audio.duration && !isNaN(audio.duration)) {
              if (progressEl) {
                progressEl.value = audio.currentTime / audio.duration;
              }
            }

            // When audio finishes, reset UI
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

    // --------------------------------------------------
    // Global play/pause button in the player bar
    // --------------------------------------------------
    if (playPauseBtn) {
      playPauseBtn.addEventListener("click", () => {
        // If no track has been selected yet, do nothing
        if (!currentPreviewUrl) {
          return;
        }

        if (audio.paused) {
          // Resume playback
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
          // Pause playback
          audio.pause();
          playPauseBtn.textContent = "▶";
        }
      });
    }

    // When the audio ends naturally, reset UI state
    audio.addEventListener("ended", () => {
      resetPlayerUI();
      updateNowPlaying("Nothing playing");
    });
  }
});
