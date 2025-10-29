(function () {
  function $(sel) { return document.querySelector(sel); }
  function byId(id) { return document.getElementById(id); }
  function escapeHtml(s) {
    s = s == null ? "" : String(s);
    return s
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }
  function trim(s) { return (s || "").replace(/^\s+|\s+$/g, ""); }

  function buildHtmlLiteralFromData(data) {
    data = data || {};

    // Name line: First M. "Preferred" Last ★ Adjective Animal
    var first = trim(data.firstName);
    var middle = trim(data.middleName);
    var mi = middle ? (middle.charAt(0).toUpperCase() + ".") : "";
    var pref = trim(data.nickName);
    var last = trim(data.lastName);
    var star = "★";
    var adj = trim(data.mascotAdj || data.mascotAdjective);
    var animal = trim(data.mascotAnimal);

    var nameLine = "";
    nameLine += (first ? first : "");
    nameLine += (mi ? (" " + mi) : "");
    nameLine += (pref ? (' "' + pref + '"') : "");
    nameLine += (last ? (" " + last) : "");
    if (adj || animal) {
      nameLine += " " + star + " " + (adj || "") + (adj && animal ? " " : "") + (animal || "");
    }

    // Image src
    var imgSrc = trim(data.pictureUrl || data.image || "");
    if (!imgSrc && data.pictureObjectURL) imgSrc = data.pictureObjectURL;
    var alt = "Headshot of " + (first || "") + (last ? (" " + last) : "");
    var figcap = trim(data.pictureCaption || data.imageCaption);

    // Backgrounds (prefer bullets)
    var bullets = data.bullets || [];
    var personal = trim(data.personalBackground || bullets[0] || "");
    var academic = trim(data.academicBackground || bullets[1] || "");
    var professional = trim(data.professionalBackground || bullets[2] || "");
    var subject = trim(data.subjectBackground || bullets[3] || "");

    // Primary computer
    var primary = data.primaryComputer || [];
    var primaryLine = "";
    if (primary && primary.length) {
      primaryLine =
        "    <li><strong>Primary Computer:</strong> " +
        escapeHtml(primary.join(", ")) +
        "</li>\n";
    }

    // Courses list
    var courses = data.courses || [];
    var courseLis = [];
    for (var i = 0; i < courses.length; i++) {
      var c = courses[i] || {};
      var code = (c.dept || c.department || "");
      if (c.number) code += "-" + c.number;
      var cname = c.name || "";
      var reason = c.reason || "";
      var line =
        "            <li><strong>" +
        escapeHtml(code) +
        (cname ? (" (" + escapeHtml(cname) + ")") : "") +
        ":</strong> " +
        escapeHtml(reason) +
        "</li>";
      courseLis.push(line);
    }
    var coursesBlock = "";
    if (courseLis.length) {
      coursesBlock =
        "    <li>\n" +
        "        <strong>Courses:</strong>\n" +
        "        <ul>\n" +
        courseLis.join("\n") + "\n" +
        "        </ul>\n" +
        "    </li>\n";
    }

    // Build literal HTML (do NOT escape tags here; code.textContent handles that)
    var out = "";
    out += "<h2>Introduction HTML</h2>\n";
    out += "<h3>" + escapeHtml(nameLine) + "</h3>\n";
    out += "<figure>\n";
    out += "    <img\n";
    out += "        src=\"" + escapeHtml(imgSrc) + "\"\n";
    out += "        alt=\"" + escapeHtml(alt) + "\"\n";
    out += "    />\n";
    out += "    <figcaption>" + escapeHtml(figcap) + "</figcaption>\n";
    out += "</figure>\n";
    out += "<ul>\n";
    if (personal) {
      out += "    <li><strong>Personal Background:</strong> " + escapeHtml(personal.replace(/^\s*Personal Background:\s*/i, "")) + "</li>\n";
    }
    if (professional) {
      out += "    <li><strong>Professional Background:</strong> " + escapeHtml(professional.replace(/^\s*Professional Background:\s*/i, "")) + "</li>\n";
    }
    if (academic) {
      out += "    <li><strong>Academic Background:</strong> " + escapeHtml(academic.replace(/^\s*Academic Background:\s*/i, "")) + "</li>\n";
    }
    if (subject) {
      out += "    <li><strong>Subject Background:</strong> " + escapeHtml(subject.replace(/^\s*Subject Background:\s*/i, "")) + "</li>\n";
    }
    if (primaryLine) out += primaryLine;
    if (coursesBlock) out += coursesBlock;
    out += "</ul>\n";

    return out;
  }

  function showHtmlLiteral(htmlLiteral) {
    var form = byId("intro-form") || document.querySelector("form");
    var main = document.querySelector("main") || document.body;
    var h2 = (main && main.querySelector("h2")) || document.querySelector("h2");

    var section = document.createElement("section");
    section.setAttribute("aria-label", "Introduction HTML Output");

    var pre = document.createElement("pre");
    var code = document.createElement("code");
    code.className = "language-html";
    code.textContent = htmlLiteral; // shows tags as text

    pre.appendChild(code);
    section.appendChild(pre);

    if (form && form.parentNode) {
      form.parentNode.replaceChild(section, form);
    } else {
      main.appendChild(section);
    }

    if (h2) h2.textContent = "Introduction HTML";

    if (window.hljs && typeof window.hljs.highlightElement === "function") {
      window.hljs.highlightElement(code);
    } else if (window.hljs && typeof window.hljs.highlightAll === "function") {
      window.hljs.highlightAll();
    }
  }

  document.addEventListener("DOMContentLoaded", function () {
    var btn = byId("generateHtmlBtn");
    if (!btn) return;

    btn.addEventListener("click", function () {
      var data = (typeof window.gatherFormData === "function")
        ? window.gatherFormData()
        : {};
      var literal = buildHtmlLiteralFromData(data);
      showHtmlLiteral(literal);
    });
  });
})();