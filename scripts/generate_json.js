(function () {
  // small helpers (work even if your main file isn't loaded yet)
  const $ = (sel) => document.querySelector(sel);
  const textVal = (id) => (document.getElementById(id)?.value || "").trim();
  const byId = (id) => document.getElementById(id);

  // Strip a leading label like "Academic Background:" if it exists
  const stripLabel = (s) => s.replace(/^\s*[^:]+:\s*/i, "").trim();

  // Safe gather: prefer your gatherFormData(); otherwise read from DOM directly
  function gatherSafe() {
    if (typeof gatherFormData === "function") {
      return gatherFormData();
    }
    // Fallback minimal read matching your ids
    const bullets = [];
    for (let i = 1; i <= 7; i++) bullets.push(textVal(`bullet${i}`));

    const links = [];
    for (let i = 1; i <= 5; i++) {
      links.push({ text: textVal(`link${i}Text`), url: textVal(`link${i}Url`) });
    }

    // Courses fallback: if your dynamic helpers aren't present, try scanning
    const courseCards = Array.from(document.querySelectorAll(".course-card"));
    const courses = courseCards.map(card => ({
      dept: card.querySelector("input[id^='dept-']")?.value?.trim() || "",
      number: card.querySelector("input[id^='num-']")?.value?.trim() || "",
      name: card.querySelector("input[id^='name-']")?.value?.trim() || "",
      reason: card.querySelector("input[id^='reason-']")?.value?.trim() || ""
    })).filter(c => c.dept || c.number || c.name || c.reason);

    const primaryComputer = ["primary1", "primary2", "primary3"]
      .map(id => textVal(id))
      .filter(Boolean);

    const file = byId("pictureFile")?.files?.[0];
    const objectUrl = file ? URL.createObjectURL(file) : "";

    return {
      firstName: textVal("firstName"),
      middleName: textVal("middleName"),
      nickName: textVal("nickName"),
      lastName: textVal("lastName"),
      mascotAdj: textVal("mascotAdj"),
      mascotAnimal: textVal("mascotAnimal"),
      divider: textVal("divider"),
      pictureUrl: textVal("pictureUrl"),
      pictureObjectURL: objectUrl,
      pictureCaption: textVal("pictureCaption"),
      personalStatement: textVal("personalStatement"),
      bullets,
      courses,
      links,
      primaryComputer
    };
  }

  // Build the TA-required JSON object using your current schema
  function buildRequiredJson(data) {
    const bullets = data.bullets || [];

    const personalBackground    = stripLabel(bullets[0] || "");
    const academicBackground    = stripLabel(bullets[1] || "");
    const professionalBackground= stripLabel(bullets[2] || "");
    const subjectBackground     = stripLabel(bullets[3] || ""); // best available mapping

    // Prefer a real URL string for image (TA example uses a relative/absolute path)
    const imageSrc = (data.pictureUrl && data.pictureUrl.trim())
      ? data.pictureUrl.trim()
      : (data.pictureObjectURL || "");

    // primaryComputer wants a string. Join your 1–3 bullets into a sentence.
    const primaryComputer = (data.primaryComputer && data.primaryComputer.length)
      ? data.primaryComputer.join(", ")
      : "";

    // Courses: dept -> department, rest same
    const courses = (data.courses || []).map(c => ({
      department: c.dept || "",
      number:     c.number || "",
      name:       c.name || "",
      reason:     c.reason || ""
    }));

    // Links: text/url -> name/href
    const links = (data.links || []).map(l => ({
      name: l.text || "",
      href: l.url || ""
    }));

    return {
      firstName: data.firstName || "",
      preferredName: data.nickName || "",
      middleInitial: (data.middleName || "").slice(0, 1).toUpperCase(),
      lastName: data.lastName || "",
      divider: data.divider || "",
      mascotAdjective: data.mascotAdj || "",
      mascotAnimal: data.mascotAnimal || "",
      image: imageSrc,
      imageCaption: data.pictureCaption || "",
      personalStatement: data.personalStatement || "",
      personalBackground,
      professionalBackground,
      academicBackground,
      subjectBackground,
      primaryComputer,
      courses,
      links
    };
  }

  function showJson(jsonObj) {
    const form = document.querySelector("#intro-form") || document.querySelector("form");
    const main = document.querySelector("main") || document.body;
    const h2   = main.querySelector("h2") || document.querySelector("h2");

    const jsonText = JSON.stringify(jsonObj, null, 2);

    const section = document.createElement("section");
    section.setAttribute("aria-label", "Introduction JSON Output");

    const pre = document.createElement("pre");
    const code = document.createElement("code");
    code.className = "language-json";
    code.textContent = jsonText;

    pre.appendChild(code);
    section.appendChild(pre);

    if (form) form.replaceWith(section);
    else main.appendChild(section);

    if (h2) h2.textContent = "Introduction HTML";

    // Trigger highlight.js if present
    if (window.hljs?.highlightElement) {
      window.hljs.highlightElement(code);
    } else if (window.hljs?.highlightAll) {
      window.hljs.highlightAll();
    }
  }

  document.addEventListener("DOMContentLoaded", () => {
    const btn = document.getElementById("generateJsonBtn");
    if (!btn) return;

    btn.addEventListener("click", () => {
      // Prefer your gatherers if available to ensure consistency
      const raw = gatherSafe();
      const jsonOut = buildRequiredJson(raw);
      showJson(jsonOut);
    });
  });
})();(function () {
  // small helpers (work even if your main file isn't loaded yet)
  const $ = (sel) => document.querySelector(sel);
  const textVal = (id) => (document.getElementById(id)?.value || "").trim();
  const byId = (id) => document.getElementById(id);

  // Strip a leading label like "Academic Background:" if it exists
  const stripLabel = (s) => s.replace(/^\s*[^:]+:\s*/i, "").trim();

  // Safe gather: prefer your gatherFormData(); otherwise read from DOM directly
  function gatherSafe() {
    if (typeof gatherFormData === "function") {
      return gatherFormData();
    }
    // Fallback minimal read matching your ids
    const bullets = [];
    for (let i = 1; i <= 7; i++) bullets.push(textVal(`bullet${i}`));

    const links = [];
    for (let i = 1; i <= 5; i++) {
      links.push({ text: textVal(`link${i}Text`), url: textVal(`link${i}Url`) });
    }

    // Courses fallback: if your dynamic helpers aren't present, try scanning
    const courseCards = Array.from(document.querySelectorAll(".course-card"));
    const courses = courseCards.map(card => ({
      dept: card.querySelector("input[id^='dept-']")?.value?.trim() || "",
      number: card.querySelector("input[id^='num-']")?.value?.trim() || "",
      name: card.querySelector("input[id^='name-']")?.value?.trim() || "",
      reason: card.querySelector("input[id^='reason-']")?.value?.trim() || ""
    })).filter(c => c.dept || c.number || c.name || c.reason);

    const primaryComputer = ["primary1", "primary2", "primary3"]
      .map(id => textVal(id))
      .filter(Boolean);

    const file = byId("pictureFile")?.files?.[0];
    const objectUrl = file ? URL.createObjectURL(file) : "";

    return {
      firstName: textVal("firstName"),
      middleName: textVal("middleName"),
      nickName: textVal("nickName"),
      lastName: textVal("lastName"),
      mascotAdj: textVal("mascotAdj"),
      mascotAnimal: textVal("mascotAnimal"),
      divider: textVal("divider"),
      pictureUrl: textVal("pictureUrl"),
      pictureObjectURL: objectUrl,
      pictureCaption: textVal("pictureCaption"),
      personalStatement: textVal("personalStatement"),
      bullets,
      courses,
      links,
      primaryComputer
    };
  }

  // Build the TA-required JSON object using your current schema
  function buildRequiredJson(data) {
    const bullets = data.bullets || [];

    const personalBackground    = stripLabel(bullets[0] || "");
    const academicBackground    = stripLabel(bullets[1] || "");
    const professionalBackground= stripLabel(bullets[2] || "");
    const subjectBackground     = stripLabel(bullets[3] || ""); // best available mapping

    // Prefer a real URL string for image (TA example uses a relative/absolute path)
    const imageSrc = (data.pictureUrl && data.pictureUrl.trim())
      ? data.pictureUrl.trim()
      : (data.pictureObjectURL || "");

    // primaryComputer wants a string. Join your 1–3 bullets into a sentence.
    const primaryComputer = (data.primaryComputer && data.primaryComputer.length)
      ? data.primaryComputer.join(", ")
      : "";

    // Courses: dept -> department, rest same
    const courses = (data.courses || []).map(c => ({
      department: c.dept || "",
      number:     c.number || "",
      name:       c.name || "",
      reason:     c.reason || ""
    }));

    // Links: text/url -> name/href
    const links = (data.links || []).map(l => ({
      name: l.text || "",
      href: l.url || ""
    }));

    return {
      firstName: data.firstName || "",
      preferredName: data.nickName || "",
      middleInitial: (data.middleName || "").slice(0, 1).toUpperCase(),
      lastName: data.lastName || "",
      divider: data.divider || "",
      mascotAdjective: data.mascotAdj || "",
      mascotAnimal: data.mascotAnimal || "",
      image: imageSrc,
      imageCaption: data.pictureCaption || "",
      personalStatement: data.personalStatement || "",
      personalBackground,
      professionalBackground,
      academicBackground,
      subjectBackground,
      primaryComputer,
      courses,
      links
    };
  }

  function showJson(jsonObj) {
    const form = document.querySelector("#intro-form") || document.querySelector("form");
    const main = document.querySelector("main") || document.body;
    const h2   = main.querySelector("h2") || document.querySelector("h2");

    const jsonText = JSON.stringify(jsonObj, null, 2);

    const section = document.createElement("section");
    section.setAttribute("aria-label", "Introduction JSON Output");

    const pre = document.createElement("pre");
    const code = document.createElement("code");
    code.className = "language-json";
    code.textContent = jsonText;

    pre.appendChild(code);
    section.appendChild(pre);

    if (form) form.replaceWith(section);
    else main.appendChild(section);

    if (h2) h2.textContent = "Introduction HTML";

    // Trigger highlight.js if present
    if (window.hljs?.highlightElement) {
      window.hljs.highlightElement(code);
    } else if (window.hljs?.highlightAll) {
      window.hljs.highlightAll();
    }
  }

  document.addEventListener("DOMContentLoaded", () => {
    const btn = document.getElementById("generateJsonBtn");
    if (!btn) return;

    btn.addEventListener("click", () => {
      // Prefer your gatherers if available to ensure consistency
      const raw = gatherSafe();
      const jsonOut = buildRequiredJson(raw);
      showJson(jsonOut);
    });
  });
})();