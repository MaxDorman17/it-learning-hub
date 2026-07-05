/* =====================================================================
   IT Engineer Learning Hub — glossary.js
   Renders a searchable, category-filterable glossary from GLOSSARY data.
   ===================================================================== */
(function () {
  "use strict";

  var DATA = (window.GLOSSARY || []).slice().sort(function (a, b) {
    return a.term.toLowerCase().localeCompare(b.term.toLowerCase());
  });

  var listEl, searchEl, chipsEl, countEl;
  var state = { q: "", cat: "All" };

  function esc(s) {
    return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  function categories() {
    var seen = {}, out = ["All"];
    DATA.forEach(function (t) { if (!seen[t.cat]) { seen[t.cat] = 1; out.push(t.cat); } });
    return out;
  }

  function matches(t) {
    if (state.cat !== "All" && t.cat !== state.cat) return false;
    if (!state.q) return true;
    var hay = (t.term + " " + (t.full || "") + " " + t.def + " " + t.cat).toLowerCase();
    return state.q.split(/\s+/).every(function (w) { return hay.indexOf(w) !== -1; });
  }

  function renderChips() {
    chipsEl.innerHTML = categories().map(function (c) {
      return '<button class="chip' + (c === state.cat ? " active" : "") +
        '" data-cat="' + esc(c) + '">' + esc(c) + "</button>";
    }).join("");
  }

  function itemHTML(t) {
    return '' +
      '<div class="gl-item">' +
        '<div class="gl-term">' + esc(t.term) +
          (t.full ? ' <span class="gl-full">' + esc(t.full) + "</span>" : "") +
          ' <span class="gl-cat">' + esc(t.cat) + "</span>" +
        "</div>" +
        '<p class="gl-def">' + esc(t.def) + "</p>" +
      "</div>";
  }

  function render() {
    var results = DATA.filter(matches);
    countEl.textContent = results.length + (results.length === 1 ? " term" : " terms");
    listEl.innerHTML = results.length
      ? results.map(itemHTML).join("")
      : '<div class="no-results">No terms match “' + esc(state.q) + '”.</div>';
  }

  document.addEventListener("DOMContentLoaded", function () {
    listEl   = document.getElementById("gl-list");
    searchEl = document.getElementById("gl-search");
    chipsEl  = document.getElementById("gl-chips");
    countEl  = document.getElementById("gl-count");
    if (!listEl) return;

    renderChips();
    render();

    searchEl.addEventListener("input", function () {
      state.q = searchEl.value.trim().toLowerCase();
      render();
    });
    chipsEl.addEventListener("click", function (e) {
      var b = e.target.closest(".chip");
      if (!b) return;
      state.cat = b.getAttribute("data-cat");
      renderChips();
      render();
    });
  });
})();
