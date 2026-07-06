/* =====================================================================
   IT Engineer Learning Hub — main.js
   Phase 1: shared header/footer injection, active-nav highlighting,
   mobile menu, localStorage progress layer, home dashboard renderer.
   ===================================================================== */
(function () {
  "use strict";

  /* ---------- Site nav definition (single source of truth) ---------- */
  var NAV = [
    { href: "index.html",         label: "Home" },
    { href: "md102.html",         label: "MD-102" },
    { href: "runbooks.html",      label: "Runbooks" },
    { href: "ms365.html",         label: "MS365 Admin" },
    { href: "voip.html",          label: "VoIP" },
    { href: "ai-automation.html", label: "AI & Automation" },
    { href: "cheatsheets.html",   label: "Cheat Sheets" },
    { href: "glossary.html",      label: "Glossary" },
    { href: "practice.html",      label: "Practice" }
  ];

  /* Totals used for progress %. Kept in step with the content that exists:
     19 runbooks (12 core L1 + 7 Endpoint/Intune), 8 quizzes, ~53 flashcards. */
  var TARGETS = { runbooks: 19, quizzes: 8, flashcards: 40 };

  /* ---------- localStorage progress layer ---------- */
  var KEY = "ithub.progress.v1";
  var Progress = {
    _data: null,
    _defaults: function () {
      return { readRunbooks: {}, quizScores: {}, knownCards: {}, lastVisit: null };
    },
    load: function () {
      if (this._data) return this._data;
      try { this._data = JSON.parse(localStorage.getItem(KEY)) || this._defaults(); }
      catch (e) { this._data = this._defaults(); }
      // backfill any missing keys
      var d = this._defaults();
      for (var k in d) if (!(k in this._data)) this._data[k] = d[k];
      return this._data;
    },
    save: function () {
      try { localStorage.setItem(KEY, JSON.stringify(this._data)); } catch (e) {}
    },
    markRunbookRead: function (id) { this.load().readRunbooks[id] = Date.now(); this.save(); },
    recordQuiz: function (id, pct) { this.load().quizScores[id] = pct; this.save(); },
    markCard: function (id, known) {
      var d = this.load();
      if (known) d.knownCards[id] = true; else delete d.knownCards[id];
      this.save();
    },
    stats: function () {
      var d = this.load();
      var quizVals = Object.keys(d.quizScores).map(function (k) { return d.quizScores[k]; });
      var quizAvg = quizVals.length
        ? Math.round(quizVals.reduce(function (a, b) { return a + b; }, 0) / quizVals.length) : 0;
      return {
        runbooksRead: Object.keys(d.readRunbooks).length,
        quizzesTaken: quizVals.length,
        quizAvg: quizAvg,
        cardsKnown: Object.keys(d.knownCards).length
      };
    },
    reset: function () { this._data = this._defaults(); this.save(); }
  };

  /* ---------- Header / footer injection ---------- */
  function currentPage() {
    var path = location.pathname.split("/").pop();
    return path === "" ? "index.html" : path;
  }

  function buildHeader() {
    var here = currentPage();
    var links = NAV.map(function (item) {
      var active = item.href === here ? " active" : "";
      return '<a href="' + item.href + '" class="' + active.trim() + '">' + item.label + "</a>";
    }).join("");

    return '' +
      '<header class="site-header"><div class="wrap">' +
        '<a class="brand" href="index.html">' +
          '<span class="logo">IT</span>' +
          '<span><b>Learning Hub</b> <span class="sub">L1 Engineer</span></span>' +
        '</a>' +
        '<button class="nav-toggle" aria-label="Toggle menu">&#9776;</button>' +
        '<nav class="nav">' + links + '</nav>' +
      '</div></header>';
  }

  function buildFooter() {
    var year = new Date().getFullYear();
    return '' +
      '<footer class="site-footer"><div class="wrap">' +
        '<span>IT Engineer Learning Hub &middot; built as a study &amp; reference tool</span>' +
        '<span class="dim">Progress saved locally in your browser &middot; &copy; ' + year + '</span>' +
      '</div></footer>';
  }

  function mountChrome() {
    var h = document.getElementById("app-header");
    var f = document.getElementById("app-footer");
    if (h) h.outerHTML = buildHeader();
    if (f) f.outerHTML = buildFooter();

    // mobile menu toggle (element now in DOM)
    var toggle = document.querySelector(".nav-toggle");
    var nav = document.querySelector(".nav");
    if (toggle && nav) {
      toggle.addEventListener("click", function () { nav.classList.toggle("open"); });
      nav.addEventListener("click", function (e) {
        if (e.target.tagName === "A") nav.classList.remove("open");
      });
    }
  }

  /* ---------- Home dashboard renderer ---------- */
  function pct(n, total) { return total ? Math.min(100, Math.round((n / total) * 100)) : 0; }

  function renderDashboard() {
    var el = document.getElementById("dashboard");
    if (!el) return;
    var s = Progress.stats();

    var cards = [
      { num: s.runbooksRead, of: TARGETS.runbooks, label: "Runbooks read", bar: pct(s.runbooksRead, TARGETS.runbooks) },
      { num: s.quizzesTaken, of: TARGETS.quizzes,  label: "Quizzes taken",  bar: pct(s.quizzesTaken, TARGETS.quizzes) },
      { num: s.quizAvg,      of: null, suffix: "%", label: "Average quiz score", bar: s.quizAvg },
      { num: s.cardsKnown,   of: TARGETS.flashcards, label: "Flashcards mastered", bar: pct(s.cardsKnown, TARGETS.flashcards) }
    ];

    el.innerHTML = cards.map(function (c) {
      var ofTxt = c.of ? ' <span class="of">/ ' + c.of + "</span>" : (c.suffix || "");
      return '' +
        '<div class="stat">' +
          '<div class="num">' + c.num + ofTxt + "</div>" +
          '<div class="label">' + c.label + "</div>" +
          '<div class="progress"><span style="width:' + c.bar + '%"></span></div>' +
        "</div>";
    }).join("");
  }

  /* ---------- Boot ---------- */
  document.addEventListener("DOMContentLoaded", function () {
    mountChrome();
    Progress.load().lastVisit = Date.now();
    Progress.save();
    renderDashboard();
  });

  /* expose for later phases / debugging */
  window.Hub = { Progress: Progress, NAV: NAV, TARGETS: TARGETS };
})();
