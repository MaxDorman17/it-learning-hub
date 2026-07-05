/* =====================================================================
   IT Engineer Learning Hub — runbooks.js
   Renders the runbook list (search + category filter), the detail view
   (hash-routed, deep-linkable), and mark-as-read wired to Hub.Progress.
   Depends on runbooks-data.js (window.RUNBOOKS) and main.js (window.Hub).
   ===================================================================== */
(function () {
  "use strict";

  var DATA = window.RUNBOOKS || [];
  var P = window.Hub && window.Hub.Progress;

  var listEl, listViewEl, detailEl, searchEl, chipsEl, countEl;
  var state = { q: "", category: "All" };

  /* ---------- tiny safe formatter: escape then **bold** and `code` ---------- */
  function esc(s) {
    return String(s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }
  function fmt(s) {
    return esc(s)
      .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
      .replace(/`(.+?)`/g, "<code>$1</code>");
  }

  /* ---------- read-state helpers (toggle needs direct access) ---------- */
  function isRead(id) { return P && !!P.load().readRunbooks[id]; }
  function toggleRead(id) {
    if (!P) return false;
    var d = P.load();
    if (d.readRunbooks[id]) { delete d.readRunbooks[id]; P.save(); return false; }
    d.readRunbooks[id] = Date.now(); P.save(); return true;
  }

  function byId(id) {
    for (var i = 0; i < DATA.length; i++) if (DATA[i].id === id) return DATA[i];
    return null;
  }

  /* ---------- categories ---------- */
  function categories() {
    var seen = {}, out = ["All"];
    DATA.forEach(function (r) { if (!seen[r.category]) { seen[r.category] = 1; out.push(r.category); } });
    return out;
  }

  /* ---------- filtering ---------- */
  function matches(r) {
    if (state.category !== "All" && r.category !== state.category) return false;
    if (!state.q) return true;
    var hay = (r.title + " " + r.summary + " " + r.category + " " + (r.tags || []).join(" ") +
               " " + r.symptom).toLowerCase();
    return state.q.split(/\s+/).every(function (t) { return hay.indexOf(t) !== -1; });
  }

  /* ---------- list rendering ---------- */
  function renderChips() {
    chipsEl.innerHTML = categories().map(function (c) {
      var active = c === state.category ? " active" : "";
      return '<button class="chip' + active + '" data-cat="' + esc(c) + '">' + esc(c) + "</button>";
    }).join("");
  }

  function cardHTML(r) {
    var read = isRead(r.id);
    return '' +
      '<a class="rb-card' + (read ? " read" : "") + '" href="#' + r.id + '">' +
        '<div class="rb-card-top">' +
          '<span class="rb-icon">' + r.icon + "</span>" +
          (read ? '<span class="rb-read-dot" title="Read">✓</span>' : "") +
        "</div>" +
        "<h3>" + esc(r.title) + "</h3>" +
        '<p class="muted">' + esc(r.summary) + "</p>" +
        '<div class="rb-meta">' +
          '<span class="rb-cat">' + esc(r.category) + "</span>" +
          '<span class="rb-badge">⏱ ' + esc(r.time) + "</span>" +
          '<span class="rb-badge diff-' + r.difficulty.toLowerCase() + '">' + esc(r.difficulty) + "</span>" +
        "</div>" +
      "</a>";
  }

  function renderList() {
    var results = DATA.filter(matches);
    countEl.textContent = results.length + (results.length === 1 ? " runbook" : " runbooks");
    if (!results.length) {
      listEl.innerHTML = '<div class="no-results">No runbooks match “' + esc(state.q) +
        '”. Try a different word or clear the filters.</div>';
      return;
    }
    listEl.innerHTML = results.map(cardHTML).join("");
  }

  /* ---------- detail rendering ---------- */
  function block(title, cls, items, icon) {
    if (!items || !items.length) return "";
    var lis = items.map(function (s) { return "<li>" + fmt(s) + "</li>"; }).join("");
    return '' +
      '<section class="rb-block ' + cls + '">' +
        '<h2><span class="rb-block-ico">' + icon + "</span>" + esc(title) + "</h2>" +
        (cls === "b-fix" ? "<ol>" + lis + "</ol>" : "<ul>" + lis + "</ul>") +
      "</section>";
  }

  function relatedHTML(ids) {
    if (!ids || !ids.length) return "";
    var links = ids.map(function (id) {
      var r = byId(id);
      return r ? '<a class="rb-rel" href="#' + id + '">' + r.icon + " " + esc(r.title) + "</a>" : "";
    }).join("");
    return '<section class="rb-block"><h2><span class="rb-block-ico">🔗</span>Related runbooks</h2>' +
           '<div class="rb-rel-row">' + links + "</div></section>";
  }

  function renderDetail(r) {
    var read = isRead(r.id);
    detailEl.innerHTML = '' +
      '<a class="rb-back" href="#">← All runbooks</a>' +
      '<div class="rb-detail-head">' +
        '<div class="rb-detail-title">' +
          '<span class="rb-detail-icon">' + r.icon + "</span>" +
          "<div><h1>" + esc(r.title) + "</h1>" +
          '<div class="rb-meta">' +
            '<span class="rb-cat">' + esc(r.category) + "</span>" +
            '<span class="rb-badge">⏱ ' + esc(r.time) + "</span>" +
            '<span class="rb-badge diff-' + r.difficulty.toLowerCase() + '">' + esc(r.difficulty) + "</span>" +
          "</div></div>" +
        "</div>" +
        '<button class="rb-read-btn' + (read ? " done" : "") + '" id="rb-read-btn">' +
          (read ? "✓ Read" : "Mark as read") + "</button>" +
      "</div>" +
      '<p class="rb-summary">' + esc(r.summary) + "</p>" +
      block("Symptom", "b-symptom", [r.symptom], "🩺") +
      block("Questions to ask the user", "b-ask", r.askUser, "❓") +
      block("Diagnosis", "b-diag", r.diagnose, "🔎") +
      block("The fix", "b-fix", r.fix, "🛠️") +
      block("Escalate if…", "b-esc", r.escalate, "⬆️") +
      relatedHTML(r.related);

    var btn = document.getElementById("rb-read-btn");
    if (btn) btn.addEventListener("click", function () {
      var now = toggleRead(r.id);
      btn.classList.toggle("done", now);
      btn.textContent = now ? "✓ Read" : "Mark as read";
    });
  }

  /* ---------- routing ---------- */
  function route() {
    var id = (location.hash || "").replace(/^#/, "");
    var r = id && byId(id);
    if (r) {
      listViewEl.style.display = "none";
      detailEl.style.display = "block";
      renderDetail(r);
      window.scrollTo(0, 0);
    } else {
      detailEl.style.display = "none";
      listViewEl.style.display = "";
      renderList(); // refresh read badges on return
    }
  }

  /* ---------- boot ---------- */
  document.addEventListener("DOMContentLoaded", function () {
    listEl     = document.getElementById("rb-list");
    listViewEl = document.getElementById("rb-list-view");
    detailEl   = document.getElementById("rb-detail");
    searchEl = document.getElementById("rb-search");
    chipsEl  = document.getElementById("rb-chips");
    countEl  = document.getElementById("rb-count");
    if (!listEl) return;

    renderChips();

    searchEl.addEventListener("input", function () {
      state.q = searchEl.value.trim().toLowerCase();
      renderList();
    });
    chipsEl.addEventListener("click", function (e) {
      var b = e.target.closest(".chip");
      if (!b) return;
      state.category = b.getAttribute("data-cat");
      renderChips();
      renderList();
    });

    window.addEventListener("hashchange", route);
    route();
  });
})();
