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
  pictureCaption: "Brian 'BJ' Saunders Jr.",
  personalStatement:
    "Junior CS major focusing on cybersecurity. I love building, breaking, and fixing systems, and I’m growing through projects, classes, and work.",
  bullets: [
    "Personal Background: biracial NC native, middle child, gym and climbing.",
    "Academic Background: UNCC CS, Cybersecurity concentration.",
    "Professional Background: Server/trainer at Church & Union; construction at Classic Industrial.",
    "Courses & Interest Areas: Web dev, OS, data structures, security labs.",
    "Hobbies/Interests: rock climbing, music, lifting.",
    "Goals: land software/security internship; ship polished portfolio.",
    "Unique: building multiple brand sites, learning by doing."
  ],
  quote: "Stay hungry, stay foolish.",
  quoteAuthor: "Steve Jobs",
  funny: "I name my side projects like bands.",
  share: "Ask me about my Bashful Shark site.",
  links: [
    { text: "LinkedIn", url: "https://www.linkedin.com/in/your-handle" },
    { text: "GitHub", url: "https://github.com/bsaund12" },
    { text: "Portfolio", url: "https://bsaundersdesign.co" },
    { text: "Resume", url: "https://bsaundersdesign.co/resume.pdf" },
    { text: "UNCC Webspace", url: "https://webpages.charlotte.edu/UNCCID/" }
  ],
  courses: [
    { dept: "ITIS", number: "3135", name: "Web App Design/Dev", reason: "Portfolio and real UX." },
    { dept: "ITIS", number: "3146", name: "Operating Systems", reason: "Processes, threads, memory." },
    { dept: "ITIS", number: "2214", name: "Data Structures & Algos (Java)", reason: "Core CS skills." },
    { dept: "ITIS", number: "3136", name: "Design Firm", reason: "Client-style delivery." },
    { dept: "STAT", number: "2122", name: "Statistics", reason: "Data intuition." }
  ]
};

// ====== UTIL ======
const $ = sel => document.querySelector(sel);
const el = (tag, props = {}, ...children) => {
  const e = document.createElement(tag);
  Object.entries(props).forEach(([k, v]) => {
    if (k === "class") e.className = v;
    else if (k === "dataset") Object.assign(e.dataset, v);
    else if (k in e) e[k] = v;
    else e.setAttribute(k, v);
  });
  for (const c of children) e.append(c.nodeType ? c : document.createTextNode(c));
  return e;
};

function setValue(id, value) { const n = $("#"+id); if (n) n.value = value ?? ""; }
function getValue(id) { const n = $("#"+id); return n ? n.value.trim() : ""; }
function requiredOk(v) { return v !== ""; }

// Gather textareas bullets
function getBullets() {
  const ids = ["bullet1","bullet2","bullet3","bullet4","bullet5","bullet6","bullet7"];
  return ids.map(id => getValue(id)).filter(Boolean);
}
function setBullets(vals) {
  const ids = ["bullet1","bullet2","bullet3","bullet4","bullet5","bullet6","bullet7"];
  ids.forEach((id, i) => setValue(id, vals[i] ?? ""));
}

// Links
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

// ====== COURSES DYNAMIC ======
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

// ====== PREFILL / RESET / CLEAR ======
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
  // Basic check
  for (const id of requiredIds) {
    const v = getValue(id);
    if (!requiredOk(v)) {
      alert(`Please complete the required field: ${id}`);
      $("#"+id)?.focus();
      return false;
    }
  }
  // Courses: ensure each row is complete
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

// ====== RENDER RESULT ======
function buildOutputHTML(data) {
  // Use the <template> if provided, else build a default layout (already in template).
  const tpl = $("#intro-template");
  const frag = tpl.content.cloneNode(true);

  // Title: match your original H2 text if needed; rubric says only H2 differs by “Introduction Form”
  frag.querySelector("#out-title").textContent = "Introduction";

  // Picture: prefer uploaded file if provided
  const imgEl = frag.querySelector("#out-picture");
  if (data.pictureObjectURL) {
    imgEl.src = data.pictureObjectURL;
  } else {
    imgEl.src = data.pictureUrl;
  }

  frag.querySelector("#out-picture-caption").textContent = data.pictureCaption;

  // Acknowledgment
  frag.querySelector("#out-ack").textContent = `${data.ackStatement} (${data.ackDate})`;

  // Name
  const fullName = [data.firstName, data.middleName, data.lastName].filter(Boolean).join(" ");
  const nameLine = data.nickName ? `${fullName} (${data.nickName})` : fullName;
  frag.querySelector("#out-name").textContent = nameLine;

  // Mascot
  frag.querySelector("#out-mascot").textContent = `${data.mascotAdj} ${data.mascotAnimal} ${data.divider}`;

  // Personal statement
  frag.querySelector("#out-personal").textContent = data.personalStatement;

  // 7 bullets
  const bulletsUl = frag.querySelector("#out-main-bullets");
  data.bullets.forEach(b => bulletsUl.append(el("li", {}, b)));

  // Courses
  const coursesUl = frag.querySelector("#out-courses");
  data.courses.forEach(c => {
    coursesUl.append(el("li", {}, `${c.dept} ${c.number} – ${c.name}: ${c.reason}`));
  });

  // Quote
  frag.querySelector("#out-quote").textContent = data.quote;
  frag.querySelector("#out-quote-author").textContent = data.quoteAuthor;

  // Optionals
  if (data.funny) frag.querySelector("#out-funny").textContent = data.funny;
  else frag.querySelector("#out-funny").remove();

  if (data.share) frag.querySelector("#out-share").textContent = data.share;
  else frag.querySelector("#out-share").remove();

  // Links
  const linksUl = frag.querySelector("#out-links");
  data.links.forEach(({text, url}) => {
    const a = el("a", { href: url, target: "_blank", rel: "noopener" }, text);
    linksUl.append(el("li", {}, a));
  });

  return frag;
}

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
    links: getLinks()
  };
}

// ====== INIT ======
document.addEventListener("DOMContentLoaded", () => {
  const form = $("#intro-form");
  const addCourseBtn = $("#addCourseBtn");
  const clearBtn = $("#clearBtn");
  const resultSection = $("#resultSection");
  const resultReset = $("#resultReset");
  const doReset = $("#doReset");

  prefillWithDefaults();

  // Add course button
  addCourseBtn.addEventListener("click", () => addCourseRow());

  // Prevent default page reload on submit
  form.addEventListener("submit", (e) => e.preventDefault());

  // Submit: validate, then render result and hide form
  $("#submitBtn").addEventListener("click", () => {
    if (!validateRequired()) return;
    const data = gatherFormData();

    // Replace the form with the rendered content (but keep reset link)
    form.classList.add("hidden");
    resultSection.innerHTML = ""; // clear any prior render
    resultSection.append(buildOutputHTML(data));
    resultSection.classList.remove("hidden");
    resultReset.classList.remove("hidden");
  });

  // Reset: return to DEFAULTS (browser reset restores value= attributes only, so we do both)
  $("#resetBtn").addEventListener("click", () => {
    // Allow default reset first, then reapply our DEFAULTS for dynamic sections
    setTimeout(() => {
      prefillWithDefaults();
    }, 0);
  });

  // “Clear” empties every field including courses
  clearBtn.addEventListener("click", () => {
    clearAllFields();
  });

  // Reset link shown under results restores the form so visitors can try again
  doReset.addEventListener("click", (e) => {
    e.preventDefault();
    resultSection.classList.add("hidden");
    resultReset.classList.add("hidden");
    form.classList.remove("hidden");
    prefillWithDefaults();
    window.scrollTo({ top: form.offsetTop, behavior: "instant" });
  });
});