var DEFAULTS = {
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
  memorableItem: "My cross pendant chain given to me by my grandmother. I wear it every day.",
  share: "My cross pendant chain given to me by my grandmother. I wear it every day.",
  links: [
    { text: "LinkedIn", url: "https://www.linkedin.com/in/your-handle" },
    { text: "GitHub", url: "https://github.com/bsaund12" },
    { text: "Portfolio", url: "https://bsaundersdesign.co" },
    { text: "Resume", url: "https://bsaundersdesign.co/resume.pdf" },
    { text: "UNCC Webspace", url: "https://webpages.charlotte.edu/bsaund12/" }
  ],
  primaryComputer: ["HP Laptop", "Windows", "Used at the library and my apartment"],
  courses: [
    { dept: "ITIS", number: "3155", name: "Software Engineering", reason: "Wanted to see what software engineering was about." },
    { dept: "ITSC", number: "3146", name: "Intro Oper Syst & Networking", reason: "Wanted to see how operating systems work within a computer." },
    { dept: "ITSC", number: "3135", name: "Front-End Web Development", reason: "Wanted to see how front-end development worked." },
    { dept: "ITSC", number: "3688", name: "Comp and their Impact on Society", reason: "Interested in the way computers impact society." },
    { dept: "STAT", number: "2122", name: "Intro to Prob and Stat", reason: "Requirement for my program." }
  ]
};

/* ========= BACK BUTTON HELPER ========= */
(function () {
  function createBackButton() {
    if (document.getElementById("backToFormBtn")) return;

    var btn = document.createElement("button");
    btn.type = "button";
    btn.id = "backToFormBtn";
    btn.className = "back-btn";
    btn.textContent = "Back to Introduction Form";

    btn.addEventListener("click", function (e) {
      e.preventDefault();
      var form = document.getElementById("intro-form");
      var resultSection = document.getElementById("resultSection");
      var resultReset = document.getElementById("resultReset");

      if (resultSection) resultSection.classList.add("hidden");
      if (resultReset) resultReset.classList.add("hidden");
      if (form) {
        form.classList.remove("hidden");
        try {
          window.scrollTo({ top: form.offsetTop, behavior: "instant" });
        } catch (err) {
          window.scrollTo(0, form.offsetTop || 0);
        }
      }
    });

    var rs = document.getElementById("resultSection");
    if (rs) {
      rs.insertAdjacentElement("afterbegin", btn);
    } else {
      document.addEventListener("DOMContentLoaded", function () {
        var rs2 = document.getElementById("resultSection");
        if (rs2) rs2.insertAdjacentElement("afterbegin", btn);
      }, false);
    }
  }

  document.addEventListener("click", function (e) {
    var target = e.target || e.srcElement;
    var id = target ? target.id : "";
    if (id === "submitBtn" || id === "generateJsonBtn") {
      setTimeout(function () {
        if (typeof createBackButton === "function") {
          createBackButton();
        }
      }, 40);
    }
  }, false);

  document.addEventListener("DOMContentLoaded", function () {
    var resultReset = document.getElementById("resultReset");
    var resultSection = document.getElementById("resultSection");
    if (!resultReset || !resultSection) return;

    var mo = new MutationObserver(function () {
      var visible = !resultSection.classList.contains("hidden") && (getComputedStyle(resultSection).display !== "none");
      if (visible) createBackButton();
    });
    mo.observe(resultReset, { attributes: true, attributeFilter: ["class", "style"] });
  }, false);
})();

/* ========= UTILITIES ========= */
function $(sel) { return document.querySelector(sel); }

// ES5-safe element factory: el(tag, props, child1, child2, ...)
function el(tag, props) {
  var e = document.createElement(tag);
  props = props || {};

  // set properties/attributes (no Object.entries)
  for (var k in props) {
    if (!props.hasOwnProperty(k)) continue;
    var v = props[k];
    if (k === "class") {
      e.className = v;
    } else if (k === "dataset" && v && typeof v === "object") {
      for (var dk in v) {
        if (v.hasOwnProperty(dk)) e.dataset[dk] = v[dk];
      }
    } else if (k in e) {
      try { e[k] = v; } catch (err) { e.setAttribute(k, v); }
    } else {
      e.setAttribute(k, v);
    }
  }

  // append children (no rest params, no optional chaining)
  for (var i = 2; i < arguments.length; i++) {
    var c = arguments[i];
    if (c && c.nodeType) {
      e.appendChild(c);
    } else if (c !== null && c !== undefined) {
      e.appendChild(document.createTextNode(String(c)));
    }
  }
  return e;
}

function setValue(id, value) {
  var n = $("#" + id);
  if (n) n.value = (value !== undefined && value !== null) ? value : "";
}

function getValue(id) {
  var n = $("#" + id);
  return n ? (n.value || "").trim() : "";
}

function requiredOk(v) { return v !== ""; }

/* ========= BULLETS ========= */
function getBullets() {
  var ids = ["bullet1","bullet2","bullet3","bullet4","bullet5","bullet6","bullet7"];
  var out = [];
  for (var i = 0; i < ids.length; i++) {
    var val = getValue(ids[i]);
    if (val !== "") out.push(val);
  }
  return out;
}

function setBullets(vals) {
  vals = vals || [];
  var ids = ["bullet1","bullet2","bullet3","bullet4","bullet5","bullet6","bullet7"];
  for (var i = 0; i < ids.length; i++) {
    setValue(ids[i], (vals[i] !== undefined && vals[i] !== null) ? vals[i] : "");
  }
}

/* ========= LINKS ========= */
function getLinks() {
  var pairs = [];
  for (var i = 1; i <= 5; i++) {
    var text = getValue("link" + i + "Text");
    var url = getValue("link" + i + "Url");
    pairs.push({ text: text, url: url });
  }
  return pairs;
}

function setLinks(arr) {
  arr = arr || [];
  for (var i = 1; i <= 5; i++) {
    var obj = arr[i - 1] || {};
    setValue("link" + i + "Text", obj.text || "");
    setValue("link" + i + "Url", obj.url || "");
  }
}

/* ========= COURSES ========= */
function coursesList() { return $("#coursesList"); }

function _uid() {
  return "id" + (new Date().getTime()) + "_" + Math.floor(Math.random() * 1000000);
}

function addCourseRow(course) {
  course = course || { dept: "", number: "", name: "", reason: "" };
  var idx = _uid();

  var card = el("div", { "class": "course-card", id: "course-" + idx },
    el("div", { "class": "topline" },
      el("strong", {}, "Course"),
      el("button", {
        type: "button",
        "class": "danger",
        onclick: function () {
          var p = card.parentNode;
          if (p) p.removeChild(card);
        }
      }, "Remove")
    ),
    el("div", { "class": "row" },
      el("div", {},
        el("label", { "for": "dept-" + idx }, "Department *"),
        el("input", { id: "dept-" + idx, type: "text", required: true, placeholder: "e.g., ITIS", value: course.dept || "" })
      ),
      el("div", {},
        el("label", { "for": "num-" + idx }, "Number *"),
        el("input", { id: "num-" + idx, type: "text", required: true, placeholder: "e.g., 3135", value: course.number || "" })
      ),
      el("div", {},
        el("label", { "for": "name-" + idx }, "Name *"),
        el("input", { id: "name-" + idx, type: "text", required: true, placeholder: "Course title", value: course.name || "" })
      ),
      el("div", {},
        el("label", { "for": "reason-" + idx }, "Reason *"),
        el("input", { id: "reason-" + idx, type: "text", required: true, placeholder: "Why you're taking it", value: course.reason || "" })
      )
    )
  );

  var cl = coursesList();
  if (cl) cl.appendChild(card);
}

function getCourses() {
  var items = [];
  var cl = coursesList();
  if (!cl) return items;
  var cards = cl.querySelectorAll(".course-card");
  for (var i = 0; i < cards.length; i++) {
    var card = cards[i];
    var deptEl = card.querySelector("input[id^='dept-']");
    var numEl = card.querySelector("input[id^='num-']");
    var nameEl = card.querySelector("input[id^='name-']");
    var reasonEl = card.querySelector("input[id^='reason-']");
    var dept = deptEl ? (deptEl.value || "").trim() : "";
    var number = numEl ? (numEl.value || "").trim() : "";
    var name = nameEl ? (nameEl.value || "").trim() : "";
    var reason = reasonEl ? (reasonEl.value || "").trim() : "";
    items.push({ dept: dept, number: number, name: name, reason: reason });
  }
  return items;
}

function setCourses(arr) {
  var cl = coursesList();
  if (!cl) return;
  cl.innerHTML = "";
  arr = arr || [];
  for (var i = 0; i < arr.length; i++) addCourseRow(arr[i]);
  if (arr.length === 0) addCourseRow(); // ensure one row
}

/* ========= PRIMARY COMPUTER ========= */
function getPrimaryComputer() {
  var out = [];
  var ids = ["primary1","primary2","primary3"];
  for (var i = 0; i < ids.length; i++) {
    var elInput = document.getElementById(ids[i]);
    var val = elInput ? (elInput.value || "").trim() : "";
    if (val) out.push(val);
  }
  return out;
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

  var p1 = DEFAULTS.primaryComputer[0] || "";
  var p2 = DEFAULTS.primaryComputer[1] || "";
  var p3 = DEFAULTS.primaryComputer[2] || "";
  var p1el = document.getElementById("primary1");
  var p2el = document.getElementById("primary2");
  var p3el = document.getElementById("primary3");
  if (p1el) p1el.value = p1;
  if (p2el) p2el.value = p2;
  if (p3el) p3el.value = p3;

  setLinks(DEFAULTS.links);
  setBullets(DEFAULTS.bullets);
  setCourses(DEFAULTS.courses);
}

function clearAllFields() {
  var nodes = document.querySelectorAll("#intro-form input[type='text'], #intro-form input[type='url'], #intro-form input[type='date'], #intro-form textarea");
  for (var i = 0; i < nodes.length; i++) nodes[i].value = "";
  var file = $("#pictureFile"); if (file) file.value = "";
  var cl = coursesList();
  if (cl) cl.innerHTML = "";
  addCourseRow();
}

function validateRequired() {
  var requiredIds = [
    "firstName","lastName","ackStatement","ackDate",
    "mascotAdj","mascotAnimal","divider",
    "pictureUrl","pictureCaption",
    "personalStatement","quote","quoteAuthor",
    "bullet1","bullet2","bullet3","bullet4","bullet5","bullet6","bullet7",
    "link1Text","link1Url","link2Text","link2Url","link3Text","link3Url","link4Text","link4Url","link5Text","link5Url"
  ];
  for (var i = 0; i < requiredIds.length; i++) {
    var id = requiredIds[i];
    var v = getValue(id);
    if (!requiredOk(v)) {
      alert("Please complete the required field: " + id);
      var n = $("#" + id);
      if (n && typeof n.focus === "function") n.focus();
      return false;
    }
  }
  var courses = getCourses();
  if (courses.length === 0) {
    alert("Please add at least one course.");
    return false;
  }
  for (var j = 0; j < courses.length; j++) {
    var c = courses[j];
    if (!(c.dept && c.number && c.name && c.reason)) {
      alert("Each course needs department, number, name, and reason.");
      return false;
    }
  }
  return true;
}

/* ========= RENDER RESULT ========= */
function buildOutputHTML(data) {
  var tpl = document.querySelector("#intro-template");
  if (!tpl) {
    return el("div", {}, "Template not found.");
  }
  var frag = tpl.content.cloneNode(true);

  var title = frag.querySelector("#out-title");
  if (title) title.textContent = "Introduction";

  var img = frag.querySelector("#out-picture");
  if (img) {
    var fileInput = $("#pictureFile");
    var file = (fileInput && fileInput.files && fileInput.files[0]) ? fileInput.files[0] : null;
    var objectUrl = file ? URL.createObjectURL(file) : "";
    img.src = objectUrl || data.pictureUrl;
    img.alt = data.pictureCaption || "Profile photo";
    if (objectUrl) img.dataset.objectUrl = objectUrl;
  }
  var cap = frag.querySelector("#out-picture-caption");
  if (cap) cap.textContent = data.pictureCaption;

  var about = frag.querySelector("#out-about");
  if (about) about.textContent = data.personalStatement;

  var hobbiesSrc = (data.bullets && data.bullets.length > 4) ? data.bullets[4] : "";
  var hobbies = [];
  if (hobbiesSrc) {
    var parts = hobbiesSrc.split(/[,|\n]/);
    for (var i = 0; i < parts.length; i++) {
      var s = (parts[i] || "").trim();
      if (s) hobbies.push(s);
    }
  }
  var pbList = frag.querySelector("#out-personal-list");
  if (pbList) {
    pbList.innerHTML = "";
    if (hobbies.length) {
      for (var h = 0; h < hobbies.length; h++) {
        pbList.appendChild(el("li", {}, hobbies[h]));
      }
    }
  }

  var prof = frag.querySelector("#out-professional");
  if (prof) prof.textContent = (data.bullets && data.bullets[2]) ? data.bullets[2] : "";

  var acad = frag.querySelector("#out-academic");
  if (acad) acad.textContent = (data.bullets && data.bullets[1]) ? data.bullets[1] : "";

  var primary = (data.primaryComputer && data.primaryComputer.length)
    ? data.primaryComputer
    : DEFAULTS.primaryComputer;
  var pcUl = frag.querySelector("#out-primary-computer");
  if (pcUl) {
    pcUl.innerHTML = "";
    for (var p = 0; p < primary.length; p++) {
      pcUl.appendChild(el("li", {}, primary[p]));
    }
  }

  var coursesUl = frag.querySelector("#out-courses");
  if (coursesUl) {
    coursesUl.innerHTML = "";
    for (var ci = 0; ci < data.courses.length; ci++) {
      var c = data.courses[ci];
      var code = (c.dept || "") + "-" + (c.number || "");
      var strong = el("strong", {}, code + " (" + (c.name || "") + "):");
      coursesUl.appendChild(el("li", {}, strong, " " + (c.reason || "")));
    }
  }

  var mem = frag.querySelector("#out-memorable");
  if (mem) mem.textContent = data.share || DEFAULTS.memorableItem;

  var quoteP = frag.querySelector("#out-quote");
  var quoteCite = frag.querySelector("#out-quote-author");
  if (quoteP) quoteP.textContent = "“" + (data.quote ? data.quote.replace(/^["“]|["”]$/g, "") : "") + "”";
  if (quoteCite) quoteCite.textContent = data.quoteAuthor || "";

  return frag;
}

/* ========= GATHER FORM DATA ========= */
function gatherFormData() {
  var fileInput = $("#pictureFile");
  var file = (fileInput && fileInput.files && fileInput.files[0]) ? fileInput.files[0] : null;
  var objectUrl = file ? URL.createObjectURL(file) : "";

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
document.addEventListener("DOMContentLoaded", function () {
  var form = $("#intro-form");
  var addCourseBtn = $("#addCourseBtn");
  var clearBtn = $("#clearBtn");
  var resultSection = $("#resultSection");
  var resultReset = $("#resultReset");
  var doReset = $("#doReset");

  prefillWithDefaults();

  var cl = coursesList();
  if (cl && !cl.children.length) addCourseRow();

  if (addCourseBtn) {
    addCourseBtn.addEventListener("click", function () { addCourseRow(); });
  }

  if (form) {
    form.addEventListener("submit", function (e) { e.preventDefault(); });
  }

  var submitBtn = $("#submitBtn");
  if (submitBtn) {
    submitBtn.addEventListener("click", function () {
      if (!validateRequired()) return;
      var data = gatherFormData();

      if (form) form.classList.add("hidden");
      if (resultSection) resultSection.innerHTML = "";

      var frag = buildOutputHTML(data);
      if (resultSection) {
        resultSection.appendChild(frag);
        resultSection.classList.remove("hidden");
      }
      if (resultReset) resultReset.classList.remove("hidden");
    });
  }

  var resetBtn = $("#resetBtn");
  if (resetBtn) {
    resetBtn.addEventListener("click", function () {
      setTimeout(function () { prefillWithDefaults(); }, 0);
    });
  }

  if (clearBtn) {
    clearBtn.addEventListener("click", function () { clearAllFields(); });
  }

  if (doReset) {
    doReset.addEventListener("click", function (e) {
      e.preventDefault();
      if (resultSection) resultSection.classList.add("hidden");
      if (resultReset) resultReset.classList.add("hidden");
      if (form) form.classList.remove("hidden");
      prefillWithDefaults();
      try {
        window.scrollTo({ top: form ? form.offsetTop : 0, behavior: "instant" });
      } catch (err) {
        window.scrollTo(0, form ? form.offsetTop : 0);
      }
    });
  }
}, false);