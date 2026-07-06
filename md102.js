/* =====================================================================
   IT Engineer Learning Hub — md102.js
   Editable MD-102 readiness tracker: log a practice-assessment score
   after each attempt; it updates the skill level, progress bar and a
   history log. Saved in localStorage (key ithub.md102.v1).
   ===================================================================== */
(function () {
  "use strict";

  var KEY = "ithub.md102.v1";
  var TARGET = 80;
  var SEED = [{ date: "2026-07-06", pct: 40, note: "cold baseline" }];

  function load() {
    try {
      var d = JSON.parse(localStorage.getItem(KEY));
      if (d && d.scores && d.scores.length) return d;
    } catch (e) {}
    return { scores: SEED.slice() };
  }
  function save(d) { try { localStorage.setItem(KEY, JSON.stringify(d)); } catch (e) {} }

  function level(pct) {
    if (pct >= TARGET) return { label: "Exam-ready — book it! 🎉", cls: "lvl-ready" };
    if (pct >= 70)     return { label: "Nearly exam-ready",         cls: "lvl-near" };
    if (pct >= 50)     return { label: "Building up",               cls: "lvl-mid" };
    return { label: "Getting started", cls: "lvl-low" };
  }

  function esc(s) {
    return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  function render() {
    var el = document.getElementById("md102-readiness");
    if (!el) return;

    var d = load();
    var scores = d.scores;
    var latest = scores[scores.length - 1];
    var lv = level(latest.pct);
    var today = new Date().toISOString().slice(0, 10);

    var rows = scores.slice().reverse().map(function (s, i, arr) {
      var prev = arr[i + 1];
      var delta = prev ? s.pct - prev.pct : null;
      var deltaHtml = delta === null ? ""
        : ' <span class="rd-delta ' + (delta >= 0 ? "up" : "down") + '">' +
          (delta >= 0 ? "▲ +" + delta : "▼ " + delta) + "</span>";
      return "<tr><td>" + esc(s.date) + "</td><td><b>" + s.pct + "%</b>" + deltaHtml +
             '</td><td class="rd-note">' + esc(s.note || "") + "</td></tr>";
    }).join("");

    el.innerHTML =
      '<div class="card rd-card">' +
        '<div class="rd-level ' + lv.cls + '">' + lv.label + "</div>" +
        '<div class="rd-score">' + latest.pct + "<span>%</span>" +
          " <small>latest &middot; target " + TARGET + "%</small></div>" +
        '<div class="progress rd-bar"><span style="width:' + Math.min(100, latest.pct) + '%"></span></div>' +
        '<form class="rd-form" id="rd-form">' +
          "<label>New score %<input type=\"number\" id=\"rd-pct\" min=\"0\" max=\"100\" required placeholder=\"e.g. 62\"></label>" +
          '<label>Date<input type="date" id="rd-date" value="' + today + '"></label>' +
          '<label>Note<input type="text" id="rd-note" maxlength="40" placeholder="optional"></label>' +
          '<button class="btn btn-primary" type="submit">Save score</button>' +
        "</form>" +
        '<table class="rd-hist"><thead><tr><th>Date</th><th>Score</th><th>Note</th></tr></thead>' +
          "<tbody>" + rows + "</tbody></table>" +
        '<button class="rd-reset" id="rd-reset" type="button">Reset history to baseline</button>' +
      "</div>";

    document.getElementById("rd-form").addEventListener("submit", function (e) {
      e.preventDefault();
      var pct = parseInt(document.getElementById("rd-pct").value, 10);
      if (isNaN(pct) || pct < 0 || pct > 100) return;
      var date = document.getElementById("rd-date").value || today;
      var note = document.getElementById("rd-note").value.trim();
      d.scores.push({ date: date, pct: pct, note: note });
      d.scores.sort(function (a, b) { return a.date < b.date ? -1 : a.date > b.date ? 1 : 0; });
      save(d);
      render();
    });

    document.getElementById("rd-reset").addEventListener("click", function () {
      if (window.confirm("Reset your practice-score history back to the 40% baseline?")) {
        save({ scores: SEED.slice() });
        render();
      }
    });
  }

  document.addEventListener("DOMContentLoaded", render);
})();
