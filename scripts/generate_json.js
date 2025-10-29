(function () {
  // ---- Small helpers (ES5-safe) ----
  function $(sel) { return document.querySelector(sel); }
  function byId(id) { return document.getElementById(id); }
  function textVal(id) {
    var n = byId(id);
    return n && typeof n.value === "string" ? n.value.trim() : "";
  }
  function stripLabel(s) {
    s = s || "";
    return s.replace(/^\s*[^:]+:\s*/i, "").trim();
  }

  // ---- Safe gather: prefer your gatherFormData(); else DOM fallback ----
  function gatherSafe() {
    if (typeof window.gatherFormData === "function") {
      return window.gatherFormData();
    }

    // Fallback minimal read matching your ids
    var bullets = [];
    for (var i = 1; i <= 7; i++) {
      bullets.push(textVal("bullet" + i));
    }

    var links = [];
    for (var j = 1; j <= 5; j++) {
      links.push({ text: textVal("link" + j + "Text"), url: textVal("link" + j + "Url") });
    }

    // Courses fallback: scan .course-card blocks
    var courses = [];
    var cards = document.querySelectorAll(".course-card");
    for (var k = 0; k < cards.length; k++) {
      var card = cards[k];
      var dept = (card.querySelector("input[id^='dept-']") || {}).value || "";
      var number = (card.querySelector("input[id^='num-']") || {}).value || "";
      var name = (card.querySelector("input[id^='name-']") || {}).value || "";
      var reason = (card.querySelector("input[id^='reason-']") || {}).value || "";
      dept = (dept + "").trim();
      number = (number + "").trim();
      name = (name + "").trim();
      reason = (reason + "").trim();
      if (dept || number || name || reason) {
        courses.push({ dept: dept, number: number, name: name, reason: reason });
      }
    }

    // Primary computer (1–3 optional lines)
    var primaryComputer = [];
    var pids = ["primary1", "primary2", "primary3"];
    for (var m = 0; m < pids.length; m++) {
      var v = textVal(pids[m]);
      if (v) primaryComputer.push(v);
    }

    // Image file object URL if present
    var pf = byId("pictureFile");
    var file = (pf && pf.files && pf.files[0]) ? pf.files[0] : null;
    var objectUrl = file ? URL.createObjectURL(file) : "";

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
      bullets: bullets,
      courses: courses,
      links: links,
      primaryComputer: primaryComputer
    };
  }

  // ---- Build TA-required JSON object from your schema ----
  function buildRequiredJson(data) {
    data = data || {};
    var bullets = data.bullets || [];

    var personalBackground     = stripLabel(bullets[0] || "");
    var academicBackground     = stripLabel(bullets[1] || "");
    var professionalBackground = stripLabel(bullets[2] || "");
    var subjectBackground      = stripLabel(bullets[3] || "");

    // Prefer a real URL string for image; fallback to object URL if uploaded
    var imageSrc = "";
    if (data.pictureUrl && (data.pictureUrl + "").trim() !== "") {
      imageSrc = (data.pictureUrl + "").trim();
    } else if (data.pictureObjectURL) {
      imageSrc = data.pictureObjectURL;
    }

    // primaryComputer should be a single string
    var primaryComputer = "";
    if (data.primaryComputer && data.primaryComputer.length) {
      primaryComputer = data.primaryComputer.join(", ");
    }

    // Courses: dept -> department
    var coursesArr = [];
    if (data.courses && data.courses.length) {
      for (var i = 0; i < data.courses.length; i++) {
        var c = data.courses[i] || {};
        coursesArr.push({
          department: c.dept || "",
          number:     c.number || "",
          name:       c.name || "",
          reason:     c.reason || ""
        });
      }
    }

    // Links: text/url -> name/href
    var linksArr = [];
    if (data.links && data.links.length) {
      for (var j = 0; j < data.links.length; j++) {
        var l = data.links[j] || {};
        linksArr.push({
          name: l.text || "",
          href: l.url || ""
        });
      }
    }

    // Middle initial from middleName
    var middleInitial = "";
    if (data.middleName && data.middleName.length) {
      middleInitial = (data.middleName.charAt(0) || "").toUpperCase();
    }

    return {
      firstName:           data.firstName || "",
      preferredName:       data.nickName || "",
      middleInitial:       middleInitial,
      lastName:            data.lastName || "",
      divider:             data.divider || "",
      mascotAdjective:     data.mascotAdj || "",
      mascotAnimal:        data.mascotAnimal || "",
      image:               imageSrc,
      imageCaption:        data.pictureCaption || "",
      personalStatement:   data.personalStatement || "",
      personalBackground:  personalBackground,
      professionalBackground: professionalBackground,
      academicBackground:  academicBackground,
      subjectBackground:   subjectBackground,
      primaryComputer:     primaryComputer,
      courses:             coursesArr,
      links:               linksArr
    };
  }

  // ---- Replace form with highlighted JSON block & update H2 ----
  function showJson(jsonObj) {
    var form = byId("intro-form") || document.querySelector("form");
    var main = document.querySelector("main") || document.body;
    var h2   = main.querySelector("h2") || document.querySelector("h2");

    var jsonText = JSON.stringify(jsonObj, null, 2);

    var section = document.createElement("section");
    section.setAttribute("aria-label", "Introduction JSON Output");

    var pre = document.createElement("pre");
    var code = document.createElement("code");
    code.className = "language-json";
    code.textContent = jsonText;

    pre.appendChild(code);
    section.appendChild(pre);

    if (form && form.parentNode) {
      form.parentNode.replaceChild(section, form);
    } else {
      main.appendChild(section);
    }

    if (h2) {
      h2.textContent = "Introduction HTML";
    }

    // Highlight.js kick
    if (window.hljs && typeof window.hljs.highlightElement === "function") {
      window.hljs.highlightElement(code);
    } else if (window.hljs && typeof window.hljs.highlightAll === "function") {
      window.hljs.highlightAll();
    }
  }

  // ---- Wire the button ----
  document.addEventListener("DOMContentLoaded", function () {
    var btn = byId("generateJsonBtn");
    if (!btn) return;

    btn.addEventListener("click", function () {
      var raw = gatherSafe();
      var jsonOut = buildRequiredJson(raw);
      showJson(jsonOut);
    });

    // If your environment complained about optional chaining earlier,
    // here is an ES5-safe click relay example (optional; not required):
    document.addEventListener("click", function (e) {
      var target = e.target || e.srcElement;
      var id = target ? target.id : "";
      // If you want to hook a "back" button insertion after certain clicks, do it here.
      // Example:
      // if (id === "submitBtn" || id === "generateJsonBtn") {
      //   setTimeout(createBackButton, 40);
      // }
    });
  });
})();