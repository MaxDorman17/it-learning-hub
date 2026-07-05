/* =====================================================================
   IT Engineer Learning Hub — cheatsheets.js
   Renders cheat sheets with one-click copy on every command.
   ===================================================================== */
(function () {
  "use strict";
  var DATA = window.CHEATSHEETS || [];

  function esc(s) {
    return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function sheetHTML(sheet) {
    var rows = sheet.items.map(function (it) {
      return '' +
        '<div class="cs-row">' +
          '<div class="cs-cmd-wrap">' +
            '<code class="cs-cmd">' + esc(it.cmd) + "</code>" +
            '<button class="cs-copy" data-cmd="' + esc(it.cmd) + '" title="Copy">Copy</button>' +
          "</div>" +
          '<div class="cs-desc">' + esc(it.desc) + "</div>" +
        "</div>";
    }).join("");

    return '' +
      '<section class="cs-sheet" id="' + esc(sheet.id) + '">' +
        '<div class="cs-head">' +
          '<span class="cs-icon">' + sheet.icon + "</span>" +
          "<div><h2>" + esc(sheet.title) + "</h2>" +
          '<p class="muted">' + esc(sheet.desc) + "</p></div>" +
        "</div>" +
        '<div class="cs-rows">' + rows + "</div>" +
      "</section>";
  }

  function copy(text, btn) {
    function done() {
      var old = btn.textContent;
      btn.textContent = "Copied ✓";
      btn.classList.add("copied");
      setTimeout(function () { btn.textContent = old; btn.classList.remove("copied"); }, 1400);
    }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(done).catch(function () { fallback(text); done(); });
    } else { fallback(text); done(); }
  }
  function fallback(text) {
    var ta = document.createElement("textarea");
    ta.value = text; ta.style.position = "fixed"; ta.style.opacity = "0";
    document.body.appendChild(ta); ta.select();
    try { document.execCommand("copy"); } catch (e) {}
    document.body.removeChild(ta);
  }

  document.addEventListener("DOMContentLoaded", function () {
    var wrap = document.getElementById("cs-wrap");
    if (!wrap) return;
    wrap.innerHTML = DATA.map(sheetHTML).join("");

    // jump-links
    var nav = document.getElementById("cs-nav");
    if (nav) nav.innerHTML = DATA.map(function (s) {
      return '<a class="chip" href="#' + esc(s.id) + '">' + s.icon + " " + esc(s.title) + "</a>";
    }).join("");

    wrap.addEventListener("click", function (e) {
      var btn = e.target.closest(".cs-copy");
      if (!btn) return;
      copy(btn.getAttribute("data-cmd"), btn);
    });
  });
})();
