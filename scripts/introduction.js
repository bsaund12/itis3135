const DEFAULTS = {
  firstName: "Brian",
  middleName: "Laval",
  nickName: "BJ",
  lastName: "Saunders",
  ackStatement: "I acknowledge this work is my own.",
  ackDate: new Date().toISOString().slice(0,10), // today
  mascotAdj: "Bashful",
  mascotAnimal: "Shark",
  divider: "|",
  pictureUrl: "https://webpages.charlotte.edu/bsaund12/itis3135/images/meonthebeach.jpg",
  pictureCaption: "Me at Hilton Head Beach, August 2025",
  personalStatement:
    "Hi, my name is Brian B.J. Saunders. I’m 20 years old from Roxboro, NC. I’m majoring in Computer Science with a concentration in Cybersecurity. After graduation, I plan to work as a Cybersecurity Analyst. My dog’s name is Charlie.",
  // 7 bullets mapping (we only need #2, #3, #5 for rendering to your exact layout)
  bullets: [
    "Personal Background: biracial NC native, middle child.",
    "Academic Background: Junior CS (Cybersecurity), graduate May 2027.",
    "Professional Background: Started with Python in 12th grade, career fairs, personal projects.",
    "Courses & Interest Areas: Web dev, OS, data structures, security.",
    "Hobbies/Interests: Going to the gym, Video games, Running",
    "Goals: Software/Security internship; strong portfolio.",
    "Unique: building multiple brand sites, learning by doing."
  ],
  quote: "The only way to do a great job is to love what you do.",
  quoteAuthor: "Steve Jobs",
  funny: "",
  // Shown in “Memorable Item” section (we use `share` field for this)
  memorableItem: "My cross pendant chain given to me by my grandmother. I wear it every day.",
  share: "My cross pendant chain given to me by my grandmother. I wear it every day.",
  links: [
    { text: "LinkedIn", url: "https://www.linkedin.com/in/your-handle" },
    { text: "GitHub", url: "https://github.com/bsaund12" },
    { text: "Portfolio", url: "https://bsaundersdesign.co" },
    { text: "Resume", url: "https://bsaundersdesign.co/resume.pdf" },
    { text: "UNCC Webspace", url: "https://webpages.charlotte.edu/bsaund12/" }
  ],
  // Primary Computer list (3 items)
  primaryComputer: ["HP Laptop", "Windows", "Used at the library and my apartment"],
  // Seed courses (format will be rendered exactly like your page)
  courses: [
    { dept: "ITIS", number: "3155", name: "Software Engineering", reason: "Wanted to see what software engineering was about." },
    { dept: "ITSC", number: "3146", name: "Intro Oper Syst & Networking", reason: "Wanted to see how operating systems work within a computer." },
    { dept: "ITSC", number: "3135", name: "Front-End Web Development", reason: "Wanted to see how front-end development worked." },
    { dept: "ITSC", number: "3688", name: "Comp and their Impact on Society", reason: "Interested in the way computers impact society." },
    { dept: "STAT", number: "2122", name: "Intro to Prob and Stat", reason: "Requirement for my program." }
  ]
};
// Back button helper: inserts a "Back to Introduction Form" button into the result area
(function () {
  function createBackButton() {
    if (document.getElementById("backToFormBtn")) return; // already added

    const btn = document.createElement("button");
    btn.type = "button";
    btn.id = "backToFormBtn";
    btn.className = "back-btn";
    btn.textContent = "Back to Introduction Form";

    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const form = document.getElementById("intro-form");
      const resultSection = document.getElementById("resultSection");
      const resultReset = document.getElementById("resultReset");

      if (resultSection) resultSection.classList.add("hidden");
      if (resultReset) resultReset.classList.add("hidden");
      if (form) {
        form.classList.remove("hidden");
        // keep current form values (do not prefill/reset)
        window.scrollTo({ top: form.offsetTop, behavior: "instant" });
      }
    });

    const rs = document.getElementById("resultSection");
    if (rs) {
      rs.insertAdjacentElement("afterbegin", btn);
    } else {
      // if resultSection not available yet, wait for DOMContentLoaded
      document.addEventListener("DOMContentLoaded", () => {
        const rs2 = document.getElementById("resultSection");
        if (rs2) rs2.insertAdjacentElement("afterbegin", btn);
      }, { once: true });
    }
  }

  // Whenever user clicks the submit/generate buttons, add the back button after the view switches.
  document.addEventListener("click", (e) => {
    const id = e.target?.id;
    if (id === "submitBtn" || id === "generateJsonBtn") {
      // allow existing handlers to run first (they hide/show sections), then insert the back button
      setTimeout(createBackButton, 40);
    }
  });

  // Also watch for the result area becoming visible (in case other code shows it)
  document.addEventListener("DOMContentLoaded", () => {
    const resultReset = document.getElementById("resultReset");
    const resultSection = document.getElementById("resultSection");
    if (!resultReset || !resultSection) return;

    const mo = new MutationObserver(() => {
      const visible = !resultSection.classList.contains("hidden") && getComputedStyle(resultSection).display !== "none";
      if (visible) createBackButton();
    });
    mo.observe(resultReset, { attributes: true, attributeFilter: ["class", "style"] });
  });
})();
/* ========= UTILITIES ========= */
const $ = sel => document.querySelector(sel);
const el = (tag, props = {}, ...children) => {
  const e = document.createElement(tag);
  Object.entries(props).forEach(([k, v]) => {
    if (k === "class") e.className = v;
    else if (k === "dataset") Object.assign(e.dataset, v);
    else if (k in e) e[k] = v;
    else e.setAttribute(k, v);
  });
  for (const c of children) e.append(c?.nodeType ? c : document.createTextNode(String(c)));
  return e;
};

function setValue(id, value) { const n = $("#"+id); if (n) n.value = value ?? ""; }
function getValue(id) { const n = $("#"+id); return n ? n.value.trim() : ""; }
function requiredOk(v) { return v !== ""; }

/* ========= BULLETS ========= */
function getBullets() {
  const ids = ["bullet1","bullet2","bullet3","bullet4","bullet5","bullet6","bullet7"];
  return ids.map(id => getValue(id)).filter(v => v !== "");
}
function setBullets(vals) {
  const ids = ["bullet1","bullet2","bullet3","bullet4","bullet5","bullet6","bullet7"];
  ids.forEach((id, i) => setValue(id, vals[i] ?? ""));
}

/* ========= LINKS ========= */
function getLinks() {
  const pairs = [];
  for (let i = 1; i <= 5; i++) {
    const text = getValue(`link${i}Text`);
    const url = getValue(`link${i}Url`);
    pairs.push({ text, url });
  }
  return pairs;
}
function setLinks(arr) {
  for (let i = 1; i <= 5; i++) {
    setValue(`link${i}Text`, arr[i-1]?.text ?? "");
    setValue(`link${i}Url`, arr[i-1]?.url ?? "");
  }
}

/* ========= COURSES (dynamic add/remove) ========= */
const coursesList = () => $("#coursesList");

function addCourseRow(course = {dept:"", number:"", name:"", reason:""}) {
  const idx = crypto.randomUUID();
  const card = el("div", { class: "course-card", id: `course-${idx}` },
    el("div", { class: "topline" },
      el("strong", {}, "Course"),
      el("button", { type: "button", class: "danger", onclick: () => card.remove() }, "Remove")
    ),
    el("div", { class: "row" },
      el("div", {},
        el("label", { for: `dept-${idx}` }, "Department *"),
        el("input", { id: `dept-${idx}`, type: "text", required: true, placeholder: "e.g., ITIS", value: course.dept || "" })
      ),
      el("div", {},
        el("label", { for: `num-${idx}` }, "Number *"),
        el("input", { id: `num-${idx}`, type: "text", required: true, placeholder: "e.g., 3135", value: course.number || "" })
      ),
      el("div", {},
        el("label", { for: `name-${idx}` }, "Name *"),
        el("input", { id: `name-${idx}`, type: "text", required: true, placeholder: "Course title", value: course.name || "" })
      ),
      el("div", {},
        el("label", { for: `reason-${idx}` }, "Reason *"),
        el("input", { id: `reason-${idx}`, type: "text", required: true, placeholder: "Why you're taking it", value: course.reason || "" })
      )
    )
  );
  coursesList().append(card);
}
function getCourses() {
  const items = [];
  coursesList().querySelectorAll(".course-card").forEach(card => {
    const dept = card.querySelector("input[id^='dept-']").value.trim();
    const number = card.querySelector("input[id^='num-']").value.trim();
    const name = card.querySelector("input[id^='name-']").value.trim();
    const reason = card.querySelector("input[id^='reason-']").value.trim();
    items.push({ dept, number, name, reason });
  });
  return items;
}
function setCourses(arr) {
  coursesList().innerHTML = "";
  (arr || []).forEach(addCourseRow);
  if ((arr || []).length === 0) addCourseRow(); // ensure at least one row
}

/* ========= PRIMARY COMPUTER (optional 3 items) ========= */
function getPrimaryComputer() {
  return ["primary1","primary2","primary3"]
    .map(id => (document.getElementById(id)?.value || "").trim())
    .filter(Boolean);
}

/* ========= PREFILL / RESET / CLEAR ========= */
function prefillWithDefaults() {
  setValue("firstName", DEFAULTS.firstName);
  setValue("middleName", DEFAULTS.middleName);
  setValue("nickName", DEFAULTS.nickName);
  setValue("lastName", DEFAULTS.lastName);

  setValue("ackStatement", DEFAULTS.ackStatement);
  setValue("ackDate", DEFAULTS.ackDate);

  setValue("mascotAdj", DEFAULTS.mascotAdj);
  setValue("mascotAnimal", DEFAULTS.mascotAnimal);
  setValue("divider", DEFAULTS.divider);

  setValue("pictureUrl", DEFAULTS.pictureUrl);
  setValue("pictureCaption", DEFAULTS.pictureCaption);

  setValue("personalStatement", DEFAULTS.personalStatement);

  setValue("quote", DEFAULTS.quote);
  setValue("quoteAuthor", DEFAULTS.quoteAuthor);
  setValue("funny", DEFAULTS.funny);
  setValue("share", DEFAULTS.share);

  // Primary Computer (optional)
  const [p1, p2, p3] = DEFAULTS.primaryComputer || [];
  const p1el = document.getElementById("primary1");
  const p2el = document.getElementById("primary2");
  const p3el = document.getElementById("primary3");
  if (p1el) p1el.value = p1 || "";
  if (p2el) p2el.value = p2 || "";
  if (p3el) p3el.value = p3 || "";

  setLinks(DEFAULTS.links);
  setBullets(DEFAULTS.bullets);
  setCourses(DEFAULTS.courses);
}

function clearAllFields() {
  document.querySelectorAll("#intro-form input[type='text'], #intro-form input[type='url'], #intro-form input[type='date'], #intro-form textarea").forEach(i => i.value = "");
  const file = $("#pictureFile"); if (file) file.value = "";
  coursesList().innerHTML = "";
  addCourseRow();
}

function validateRequired() {
  const requiredIds = [
    "firstName","lastName","ackStatement","ackDate",
    "mascotAdj","mascotAnimal","divider",
    "pictureUrl","pictureCaption",
    "personalStatement","quote","quoteAuthor",
    "bullet1","bullet2","bullet3","bullet4","bullet5","bullet6","bullet7",
    "link1Text","link1Url","link2Text","link2Url","link3Text","link3Url","link4Text","link4Url","link5Text","link5Url"
  ];
  for (const id of requiredIds) {
    const v = getValue(id);
    if (!requiredOk(v)) {
      alert(`Please complete the required field: ${id}`);
      $("#"+id)?.focus();
      return false;
    }
  }
  // Courses completeness
  const courses = getCourses();
  if (courses.length === 0) {
    alert("Please add at least one course.");
    return false;
  }
  for (const c of courses) {
    if (!(c.dept && c.number && c.name && c.reason)) {
      alert("Each course needs department, number, name, and reason.");
      return false;
    }
  }
  return true;
}

/* ========= RENDER RESULT: replicates your Introduction page structure ========= */
function buildOutputHTML(data) {
  const tpl = document.querySelector("#intro-template");
  if (!tpl) {
    // build a minimal fallback if template missing
    return el("div", {}, "Template not found.");
  }
  const frag = tpl.content.cloneNode(true);

  // Insert the exact inline style block your page uses (kept in template for fidelity)

  // H2 title
  // Your real page shows "Introduction", so we use that here
  const title = frag.querySelector("#out-title");
  if (title) title.textContent = "Introduction";

  // Figure (image + caption)
  const img = frag.querySelector("#out-picture");
  if (img) {
    const fileInput = $("#pictureFile");
    const file = fileInput?.files?.[0];
    const objectUrl = file ? URL.createObjectURL(file) : "";
    img.src = objectUrl || data.pictureUrl;
    img.alt = data.pictureCaption || "Profile photo";
    if (objectUrl) img.dataset.objectUrl = objectUrl; // so we could revoke later if needed
  }
  const cap = frag.querySelector("#out-picture-caption");
  if (cap) cap.textContent = data.pictureCaption;

  // About Me (use Personal Statement)
  const about = frag.querySelector("#out-about");
  if (about) about.textContent = data.personalStatement;

  // Personal Background list (use bullet5: hobbies/interests)
  const hobbiesSrc = data.bullets?.[4] || "";
  const hobbies = hobbiesSrc.split(/[,|\n]/).map(s => s.trim()).filter(Boolean);
  const pbList = frag.querySelector("#out-personal-list");
  if (pbList) {
    pbList.innerHTML = "";
    if (hobbies.length) hobbies.forEach(h => pbList.append(el("li", {}, h)));
  }

  // Professional Background (bullet3)
  const prof = frag.querySelector("#out-professional");
  if (prof) prof.textContent = data.bullets?.[2] || "";

  // Academic Background (bullet2)
  const acad = frag.querySelector("#out-academic");
  if (acad) acad.textContent = data.bullets?.[1] || "";

  // Primary Computer (either inputs, or defaults)
  const primary = (data.primaryComputer && data.primaryComputer.length)
    ? data.primaryComputer
    : DEFAULTS.primaryComputer;
  const pcUl = frag.querySelector("#out-primary-computer");
  if (pcUl) {
    pcUl.innerHTML = "";
    primary.forEach(item => pcUl.append(el("li", {}, item)));
  }

  // Courses — format exactly like your page:
  // <strong>ITSC-3146 (Intro Oper Syst & Networking):</strong> Reason
  const coursesUl = frag.querySelector("#out-courses");
  if (coursesUl) {
    coursesUl.innerHTML = "";
    data.courses.forEach(c => {
      const code = `${c.dept}-${c.number}`;
      const strong = el("strong", {}, `${code} (${c.name}):`);
      coursesUl.append(el("li", {}, strong, " ", c.reason));
    });
  }

  // Memorable Item — from "share" (or default memorableItem)
  const mem = frag.querySelector("#out-memorable");
  if (mem) mem.textContent = data.share || DEFAULTS.memorableItem;

  // Quote
  const quoteP = frag.querySelector("#out-quote");
  const quoteCite = frag.querySelector("#out-quote-author");
  if (quoteP) quoteP.textContent = `“${data.quote.replace(/^["“]|["”]$/g, "")}”`;
  if (quoteCite) quoteCite.textContent = data.quoteAuthor;

  return frag;
}

/* ========= GATHER FORM DATA ========= */
function gatherFormData() {
  const fileInput = $("#pictureFile");
  const file = fileInput?.files?.[0];
  const objectUrl = file ? URL.createObjectURL(file) : "";

  return {
    firstName: getValue("firstName"),
    middleName: getValue("middleName"),
    nickName: getValue("nickName"),
    lastName: getValue("lastName"),
    ackStatement: getValue("ackStatement"),
    ackDate: getValue("ackDate"),
    mascotAdj: getValue("mascotAdj"),
    mascotAnimal: getValue("mascotAnimal"),
    divider: getValue("divider"),
    pictureUrl: getValue("pictureUrl"),
    pictureObjectURL: objectUrl,
    pictureCaption: getValue("pictureCaption"),
    personalStatement: getValue("personalStatement"),
    bullets: getBullets(),
    courses: getCourses(),
    quote: getValue("quote"),
    quoteAuthor: getValue("quoteAuthor"),
    funny: getValue("funny"),
    share: getValue("share"),
    links: getLinks(),
    primaryComputer: getPrimaryComputer()
  };
}

/* ========= INIT ========= */
document.addEventListener("DOMContentLoaded", () => {
  const form = $("#intro-form");
  const addCourseBtn = $("#addCourseBtn");
  const clearBtn = $("#clearBtn");
  const resultSection = $("#resultSection");
  const resultReset = $("#resultReset");
  const doReset = $("#doReset");

  // Prefill with your defaults
  prefillWithDefaults();

  // Seed at least one course row
  if (!coursesList().children.length) addCourseRow();

  // Add course rows dynamically
  addCourseBtn.addEventListener("click", () => addCourseRow());

  // Prevent default page reload on submit
  form.addEventListener("submit", (e) => e.preventDefault());

  // Submit -> validate -> render exact intro layout -> hide form
  $("#submitBtn").addEventListener("click", () => {
    if (!validateRequired()) return;
    const data = gatherFormData();

    form.classList.add("hidden");
    resultSection.innerHTML = "";

    // Inject EXACT intro markup (from template)
    const frag = buildOutputHTML(data);
    resultSection.append(frag);
    resultSection.classList.remove("hidden");
    resultReset.classList.remove("hidden");
  });

  // Reset -> return to defaults
  $("#resetBtn").addEventListener("click", () => {
    setTimeout(() => {
      prefillWithDefaults();
    }, 0);
  });

  // Clear -> blank everything and one empty course row
  clearBtn.addEventListener("click", () => {
    clearAllFields();
  });

  // Reset link -> show form again and prefill defaults
  doReset.addEventListener("click", (e) => {
    e.preventDefault();
    resultSection.classList.add("hidden");
    resultReset.classList.add("hidden");
    form.classList.remove("hidden");
    prefillWithDefaults();
    window.scrollTo({ top: form.offsetTop, behavior: "instant" });
  });
});
