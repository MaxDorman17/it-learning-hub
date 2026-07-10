/* =====================================================================
   Dynamics 365 course — dashboard (dynamics.html)
   Renders overview (progress ring + stats), module cards with lock/score
   states, badge shelf, recent activity, and the completion certificate.
   ===================================================================== */
(function () {
  "use strict";

  var COURSE = window.DYN_COURSE;
  var Dyn = window.Hub && window.Hub.Dynamics;
  if (!COURSE || !Dyn) return;
  Dyn.setCourse(COURSE);

  function esc(s) {
    return String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }
  function timeAgo(ts) {
    var s = Math.floor((Date.now() - ts) / 1000);
    if (s < 60) return "just now";
    if (s < 3600) return Math.floor(s / 60) + "m ago";
    if (s < 86400) return Math.floor(s / 3600) + "h ago";
    return Math.floor(s / 86400) + "d ago";
  }

  function ring(pct) {
    var r = 56, c = 2 * Math.PI * r, off = c * (1 - pct / 100);
    return '<div class="dyn-ring"><svg width="132" height="132" viewBox="0 0 132 132">' +
      '<defs><linearGradient id="dynGrad" x1="0" y1="0" x2="1" y2="1">' +
        '<stop offset="0" stop-color="#b3199e"/><stop offset="0.5" stop-color="#ec2b9c"/><stop offset="1" stop-color="#ff5fa2"/>' +
      '</linearGradient></defs>' +
      '<circle class="ring-bg" cx="66" cy="66" r="' + r + '" fill="none" stroke-width="12"/>' +
      '<circle class="ring-fg" cx="66" cy="66" r="' + r + '" fill="none" stroke-width="12" ' +
        'stroke-dasharray="' + c.toFixed(1) + '" stroke-dashoffset="' + off.toFixed(1) + '"/>' +
      '</svg><div class="ring-label"><span class="ring-pct">' + pct + '%</span><span class="ring-sub">complete</span></div></div>';
  }

  function firstIncompleteModule(prog) {
    for (var i = 0; i < COURSE.modules.length; i++) {
      var st = prog.moduleState[COURSE.modules[i].id];
      if (st.unlocked && !st.complete) return COURSE.modules[i];
    }
    // all complete → last; or first locked's predecessor
    return COURSE.modules[0];
  }

  function renderOverview(prog) {
    var d = Dyn.load();
    var quizVals = Object.keys(d.quizScores).map(function (k) { return d.quizScores[k]; });
    var avg = quizVals.length ? Math.round(quizVals.reduce(function (a, b) { return a + b; }, 0) / quizVals.length) : 0;
    var cont = firstIncompleteModule(prog);
    var allDone = prog.pct === 100;
    var finalTxt = d.finalScore === null ? "—" : d.finalScore + "%";

    return '<div class="dyn-overview">' +
      ring(prog.pct) +
      '<div class="dyn-ov-stats">' +
        stat(prog.modulesComplete + '<small>/' + prog.modulesTotal + "</small>", "Modules complete") +
        stat(avg + "%", "Avg quiz score") +
        stat(finalTxt, "Final exam (best)") +
        stat("🔥 " + d.streak.count, "Day streak") +
        stat(d.xp, "XP earned") +
        stat(Object.keys(d.badges).length + '<small>/' + COURSE.modules.length + "</small>", "Badges") +
        stat("~" + COURSE.estMinutes + "m", "Est. total time") +
        stat(d.completedAt ? "Yes ✓" : "No", "Course complete") +
      "</div>" +
      '<div class="dyn-ov-cta">' +
        '<a class="btn btn-primary" href="dynamics-module.html#' + cont.id + '">' +
          (prog.pct === 0 ? "Start the course →" : allDone ? "Review modules →" : "Continue: M" + cont.num + " " + esc(cont.title) + " →") + "</a>" +
        '<a class="btn btn-ghost" href="dynamics-tickets.html">Ticket Lab (50)</a>' +
        '<a class="btn btn-ghost" href="dynamics-sim.html">Open the simulator</a>' +
      "</div></div>";
  }
  function stat(n, l) { return '<div class="dyn-ov-stat"><div class="n">' + n + '</div><div class="l">' + esc(l) + "</div></div>"; }

  function renderModules(prog) {
    return COURSE.modules.map(function (m) {
      var st = prog.moduleState[m.id];
      var d = Dyn.load();
      // best quiz score in this module (if any)
      var scores = m.blocks.filter(function (b) { return b.t === "quiz" && d.quizScores[b.id] !== undefined; })
        .map(function (b) { return d.quizScores[b.id]; });
      var bestTxt = scores.length ? '<span class="dyn-mod-score">quiz ' + Math.max.apply(null, scores) + "%</span>" : "";
      var pctModule = st.total ? Math.round((st.done / st.total) * 100) : 0;
      var cls = "dyn-mod" + (st.complete ? " is-complete" : "") + (!st.unlocked ? " is-locked" : "");
      var tag = !st.unlocked ? '<span class="dyn-lock" aria-hidden="true">🔒</span>'
        : st.complete ? '<span class="dyn-mod-done-tick" aria-hidden="true">✓</span>' : "";
      var href = st.unlocked ? 'onclick="location.href=\'dynamics-module.html#' + m.id + '\'"' : 'disabled aria-disabled="true"';
      return '<button class="' + cls + '" ' + href + ' aria-label="Module ' + m.num + ": " + esc(m.title) +
        (st.unlocked ? "" : " (locked)") + '">' + tag +
        '<div class="dyn-mod-top"><div class="dyn-mod-ico" aria-hidden="true">' + m.icon + "</div>" +
          '<div><div class="dyn-mod-num">Module ' + m.num + "</div><h3>" + esc(m.title) + "</h3></div></div>" +
        "<p>" + esc(m.summary) + "</p>" +
        '<div class="dyn-mod-foot"><div class="mini-progress"><span style="width:' + pctModule + '%"></span></div>' +
          (bestTxt || '<span class="dyn-mod-meta">' + (st.unlocked ? "~" + m.estMin + " min" : "Locked") + "</span>") + "</div>" +
        "</button>";
    }).join("");
  }

  function renderBadges() {
    return COURSE.modules.map(function (m) {
      var got = Dyn.hasBadge(m.badge.id);
      return '<div class="dyn-badge' + (got ? " earned" : "") + '" title="' + esc(m.badge.label) + (got ? " (earned)" : " (locked)") + '">' +
        '<span class="b-ico" aria-hidden="true">' + m.badge.icon + '</span>' +
        '<span class="b-lbl">' + esc(m.badge.label) + "</span></div>";
    }).join("");
  }

  function renderActivity() {
    var acts = Dyn.load().activity;
    if (!acts.length) return '<p class="dyn-empty">No activity yet — start Module 1 and it’ll show up here.</p>';
    return '<ul class="dyn-activity">' + acts.map(function (a) {
      return "<li><span>" + esc(a.label) + '</span><span class="when">' + timeAgo(a.t) + "</span></li>";
    }).join("") + "</ul>";
  }

  function renderCertificate(prog) {
    var d = Dyn.load();
    var passed = d.finalScore !== null && d.finalScore >= COURSE.passMark;
    var eligible = passed && prog.pct === 100;
    if (!eligible) {
      var need = [];
      if (prog.pct < 100) need.push("finish all module activities (" + prog.pct + "% done)");
      if (!passed) need.push("pass the final exam with " + COURSE.passMark + "%+" + (d.finalScore !== null ? " (best " + d.finalScore + "%)" : ""));
      return '<div class="dyn-cert-locked"><div style="font-size:34px">🔒</div>' +
        "<p>Your certificate unlocks when you " + esc(need.join(" and ")) + ".</p></div>";
    }
    if (!d.completedAt) Dyn.markCourseComplete();
    var date = new Date(d.completedAt || Date.now()).toLocaleDateString("en-GB", { year: "numeric", month: "long", day: "numeric" });
    return '<div class="dyn-cert" id="dyn-cert">' +
      '<div class="c-eyebrow">Certificate of Completion</div>' +
      '<div class="c-seal" aria-hidden="true">🎓</div>' +
      "<h2>" + esc(COURSE.title) + "</h2>" +
      '<div class="c-name">MaxNova Learning Hub</div>' +
      '<p class="c-meta">Awarded for completing all 16 modules and passing the final assessment (' + d.finalScore + '%) · ' + esc(date) + "</p>" +
      '<div class="btn-row" style="justify-content:center"><button class="btn btn-primary" onclick="window.print()">Print / save as PDF</button></div>' +
      "</div>";
  }

  function render() {
    var host = document.getElementById("dyn-dashboard");
    if (!host) return;
    var prog = Dyn.progress();

    host.innerHTML =
      '<div class="dyn-disclaimer"><b>Note:</b> ' + esc(COURSE.disclaimer) + "</div>" +

      '<section class="section">' + renderOverview(prog) + "</section>" +

      '<section class="section"><div class="section-title"><h2>Modules</h2>' +
        '<span class="hint">' + prog.modulesComplete + "/" + prog.modulesTotal + " complete · unlock in order</span></div>" +
        '<div class="dyn-modules">' + renderModules(prog) + "</div></section>" +

      '<section class="section"><div class="section-title"><h2>Achievements</h2>' +
        '<span class="hint">Earn a badge for each module</span></div>' +
        '<div class="dyn-badges">' + renderBadges() + "</div></section>" +

      '<div class="grid grid-2" style="align-items:start">' +
        '<section class="section"><div class="section-title"><h2>Recently completed</h2></div>' +
          '<div class="card">' + renderActivity() + "</div></section>" +
        '<section class="section"><div class="section-title"><h2>Certificate</h2></div>' +
          renderCertificate(prog) + "</section>" +
      "</div>";
  }

  document.addEventListener("DOMContentLoaded", render);
})();
