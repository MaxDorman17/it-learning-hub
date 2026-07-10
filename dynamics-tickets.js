/* =====================================================================
   Dynamics 365 course — Ticket Lab (dynamics-tickets.html)
   50 practice tickets. List + filters + hash-routed detail (#TCK-01).
   Each detail is a mini-test: pick priority + a quick check, then reveal
   the worked walkthrough, then mark as worked (tracked in Hub.Dynamics).
   ===================================================================== */
(function () {
  "use strict";

  var TICKETS = window.DYN_TICKETS || [];
  var CATS = window.DYN_TICKET_CATS || [];
  var Dyn = window.Hub && window.Hub.Dynamics;

  function esc(s) {
    return String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }
  var PRI_LABEL = { low: "Low", normal: "Normal", high: "High", critical: "Critical" };
  function priBadge(p) { return '<span class="badge-priority pri-' + p + '">' + PRI_LABEL[p] + "</span>"; }
  function done(id) { return Dyn ? Dyn.isTicketDone(id) : false; }

  var state = { cat: "All", diff: "All", q: "" };

  function ticketById(id) { return TICKETS.filter(function (t) { return t.id === id; })[0]; }

  function filtered() {
    return TICKETS.filter(function (t) {
      if (state.cat !== "All" && t.cat !== state.cat) return false;
      if (state.diff !== "All" && t.difficulty !== state.diff) return false;
      if (state.q) {
        var hay = (t.id + " " + t.cat + " " + t.ticket.org + " " + t.ticket.subject + " " + t.ticket.body).toLowerCase();
        if (hay.indexOf(state.q.toLowerCase()) === -1) return false;
      }
      return true;
    });
  }

  /* ---------- list ---------- */
  function renderControls() {
    var catChips = ['<button class="chip' + (state.cat === "All" ? " active" : "") + '" data-cat="All">All</button>']
      .concat(CATS.map(function (c) {
        return '<button class="chip' + (state.cat === c ? " active" : "") + '" data-cat="' + esc(c) + '">' + esc(c) + "</button>";
      })).join("");
    var diffChips = ["All", "Starter", "Core", "Advanced"].map(function (d) {
      return '<button class="chip' + (state.diff === d ? " active" : "") + '" data-diff="' + d + '">' + d + "</button>";
    }).join("");
    return '<div class="search" style="margin-bottom:14px"><span class="ico">🔍</span>' +
        '<input type="text" id="tck-search" placeholder="Search tickets by keyword, customer or symptom…" value="' + esc(state.q) + '" aria-label="Search tickets"></div>' +
      '<div class="chips" role="group" aria-label="Filter by category">' + catChips + "</div>" +
      '<div class="chips" style="margin-top:8px" role="group" aria-label="Filter by difficulty">' + diffChips + "</div>";
  }

  function renderList() {
    var host = document.getElementById("tck-app");
    var list = filtered();
    var worked = Dyn ? Dyn.ticketsWorked() : 0;
    var pct = Math.round((worked / TICKETS.length) * 100);

    var cards = list.map(function (t) {
      var d = done(t.id);
      return '<button class="tck-card' + (d ? " worked" : "") + '" data-id="' + t.id + '">' +
        '<div class="tck-card-top"><span class="tck-id">' + t.id + "</span>" + priBadge(t.priority) +
          (d ? '<span class="tck-tick" aria-label="worked">✓</span>' : "") + "</div>" +
        '<div class="tck-subj">' + esc(t.ticket.subject) + "</div>" +
        '<div class="tck-meta">' + esc(t.ticket.org) + " · " + esc(t.cat) + "</div>" +
        '<span class="tck-diff diff-' + t.difficulty.toLowerCase() + '">' + t.difficulty + "</span>" +
      "</button>";
    }).join("");
    if (!list.length) cards = '<p class="dyn-empty">No tickets match those filters.</p>';

    host.innerHTML =
      '<div class="tck-progress card"><div class="tck-progress-row"><b>' + worked + " / " + TICKETS.length +
        ' tickets worked</b><span class="muted">' + pct + '%</span></div>' +
        '<div class="progress" style="margin-top:10px"><span style="width:' + pct + '%"></span></div></div>' +
      renderControls() +
      '<div class="rb-count muted" style="margin:14px 0">Showing <b>' + list.length + "</b> of " + TICKETS.length + " tickets</div>" +
      '<div class="tck-grid">' + cards + "</div>";

    wireList(host);
  }

  function wireList(host) {
    host.querySelectorAll("[data-cat]").forEach(function (b) {
      b.addEventListener("click", function () { state.cat = b.getAttribute("data-cat"); renderList(); });
    });
    host.querySelectorAll("[data-diff]").forEach(function (b) {
      b.addEventListener("click", function () { state.diff = b.getAttribute("data-diff"); renderList(); });
    });
    var s = host.querySelector("#tck-search");
    if (s) s.addEventListener("input", function () {
      state.q = s.value;
      // re-render just the grid + count to keep focus in the box
      renderGridOnly();
    });
    host.querySelectorAll(".tck-card[data-id]").forEach(function (c) {
      c.addEventListener("click", function () { location.hash = c.getAttribute("data-id"); });
    });
  }

  function renderGridOnly() {
    var host = document.getElementById("tck-app");
    var list = filtered();
    var count = host.querySelector(".rb-count");
    var grid = host.querySelector(".tck-grid");
    if (count) count.innerHTML = "Showing <b>" + list.length + "</b> of " + TICKETS.length + " tickets";
    if (!grid) return;
    grid.innerHTML = list.length ? list.map(function (t) {
      var d = done(t.id);
      return '<button class="tck-card' + (d ? " worked" : "") + '" data-id="' + t.id + '">' +
        '<div class="tck-card-top"><span class="tck-id">' + t.id + "</span>" + priBadge(t.priority) +
          (d ? '<span class="tck-tick">✓</span>' : "") + "</div>" +
        '<div class="tck-subj">' + esc(t.ticket.subject) + "</div>" +
        '<div class="tck-meta">' + esc(t.ticket.org) + " · " + esc(t.cat) + "</div>" +
        '<span class="tck-diff diff-' + t.difficulty.toLowerCase() + '">' + t.difficulty + "</span></button>";
    }).join("") : '<p class="dyn-empty">No tickets match those filters.</p>';
    grid.querySelectorAll(".tck-card[data-id]").forEach(function (c) {
      c.addEventListener("click", function () { location.hash = c.getAttribute("data-id"); });
    });
  }

  /* ---------- detail ---------- */
  function renderDetail(t) {
    var host = document.getElementById("tck-app");
    var idx = TICKETS.indexOf(t);
    var prev = TICKETS[idx - 1], next = TICKETS[idx + 1];
    var isDone = done(t.id);

    var priBtns = ["low", "normal", "high", "critical"].map(function (lv) {
      return '<button type="button" class="dyn-pri-btn" data-lv="' + lv + '">' + PRI_LABEL[lv] + "</button>";
    }).join("");

    var checkOpts = t.check.options.map(function (o, i) {
      return '<label class="quiz-opt"><input type="radio" name="tck-check" value="' + i + '"> ' + esc(o) + "</label>";
    }).join("");

    host.innerHTML =
      '<button class="link-back" id="tck-back">← All tickets</button>' +
      '<div class="tck-detail">' +
        '<div class="tck-detail-head"><span class="tck-id big">' + t.id + "</span>" + priBadge(t.priority) +
          '<span class="tck-diff diff-' + t.difficulty.toLowerCase() + '">' + t.difficulty + "</span>" +
          '<span class="muted" style="font-size:13px">' + esc(t.cat) + "</span>" +
          (isDone ? '<span class="tck-worked-flag">✓ worked</span>' : "") + "</div>" +

        '<div class="sc-ticket"><div class="sc-from">🎫 ' + esc(t.ticket.from) + " · <b>" + esc(t.ticket.org) +
          '</b></div><div class="sc-subj">' + esc(t.ticket.subject) + '</div><p>' + esc(t.ticket.body) + "</p></div>" +

        '<div class="tck-task"><b>Your task:</b> ' + esc(t.task) + "</div>" +

        '<div class="dyn-sc-step"><h4><span class="n">1</span> What priority would you set?</h4>' +
          '<div class="dyn-pri-choices">' + priBtns + '</div><div class="dyn-pri-why" hidden data-pri-why></div></div>' +

        '<div class="dyn-sc-step"><h4><span class="n">2</span> Quick check</h4>' +
          '<p class="quiz-qtext">' + esc(t.check.q) + "</p>" + checkOpts +
          '<button class="btn btn-ghost" style="margin-top:6px" data-act="check">Check answer</button>' +
          '<div data-check-res></div></div>' +

        '<div class="dyn-sc-step"><h4><span class="n">3</span> How to work it</h4>' +
          '<p class="muted" style="font-size:13.5px">Try it in your head (or the <a href="dynamics-sim.html">simulator</a>) first, then reveal the walkthrough.</p>' +
          '<button class="btn btn-primary" data-act="reveal">Reveal the walkthrough</button>' +
          '<div class="tck-walk" data-walk hidden></div></div>' +

        '<div class="tck-mark"><button class="btn ' + (isDone ? "btn-ghost" : "btn-primary") + '" data-act="mark">' +
          (isDone ? "✓ Worked — mark as not done" : "Mark this ticket as worked") + "</button></div>" +

        '<div class="dyn-lessonnav">' +
          (prev ? '<a class="btn btn-ghost" href="#' + prev.id + '">← ' + prev.id + "</a>" : "<span></span>") +
          (next ? '<a class="btn btn-ghost" href="#' + next.id + '">' + next.id + " →</a>" : "<span></span>") +
        "</div>" +
      "</div>";

    wireDetail(t);
    window.scrollTo(0, 0);
  }

  function walkHtml(t) {
    function list(items) { return "<ul>" + items.map(function (x) { return "<li>" + esc(x) + "</li>"; }).join("") + "</ul>"; }
    return '<div class="tck-walk-sec"><h5>❓ Questions to ask / info to gather</h5>' + list(t.ask) + "</div>" +
      '<div class="tck-walk-sec"><h5>🛠️ Step by step</h5><ol class="tck-steps">' +
        t.steps.map(function (s) { return "<li>" + esc(s) + "</li>"; }).join("") + "</ol></div>" +
      '<div class="tck-walk-sec"><h5>📝 Model case note</h5><p class="tck-note">' + esc(t.note) + "</p></div>" +
      '<div class="callout warn" style="margin-top:12px"><b>When to escalate:</b> ' + esc(t.escalate) + "</div>";
  }

  function wireDetail(t) {
    var host = document.getElementById("tck-app");
    host.querySelector("#tck-back").addEventListener("click", function () { location.hash = ""; });

    // priority
    host.querySelectorAll(".dyn-pri-btn").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var lv = btn.getAttribute("data-lv");
        host.querySelectorAll(".dyn-pri-btn").forEach(function (x) { x.classList.remove("sel", "correct", "wrong"); });
        btn.classList.add("sel", lv === t.priority ? "correct" : "wrong");
        if (lv !== t.priority) host.querySelector('.dyn-pri-btn[data-lv="' + t.priority + '"]').classList.add("correct");
        var why = host.querySelector("[data-pri-why]");
        why.hidden = false;
        why.innerHTML = (lv === t.priority ? "✓ A sensible call. " : "A common answer is <b>" + PRI_LABEL[t.priority] +
          "</b>. ") + "Remember to apply your employer's priority matrix.";
      });
    });

    // quick check
    host.querySelector('[data-act=check]').addEventListener("click", function () {
      var chosen = host.querySelector('input[name="tck-check"]:checked');
      if (!chosen) return;
      var ci = +chosen.value;
      var opts = host.querySelectorAll('input[name="tck-check"]');
      opts.forEach(function (inp, i) {
        var lab = inp.closest(".quiz-opt");
        lab.classList.remove("correct", "wrong");
        if (i === t.check.answer) lab.classList.add("correct");
        else if (i === ci) lab.classList.add("wrong");
      });
      var res = host.querySelector("[data-check-res]");
      var ok = ci === t.check.answer;
      res.innerHTML = '<div class="quiz-explain ' + (ok ? "ok" : "no") + '" style="margin-top:8px">' +
        (ok ? "✓ Correct. " : "✗ ") + esc(t.check.explain) + "</div>";
    });

    // reveal
    host.querySelector('[data-act=reveal]').addEventListener("click", function () {
      var w = host.querySelector("[data-walk]");
      w.hidden = false; w.innerHTML = walkHtml(t);
      this.style.display = "none";
    });

    // mark worked
    host.querySelector('[data-act=mark]').addEventListener("click", function () {
      if (!Dyn) return;
      if (Dyn.isTicketDone(t.id)) Dyn.unmarkTicket(t.id);
      else Dyn.markTicket(t.id, t.ticket.subject);
      renderDetail(t); // re-render to reflect state
    });
  }

  /* ---------- routing ---------- */
  function route() {
    var host = document.getElementById("tck-app");
    if (!host) return;
    var id = (location.hash || "").replace(/^#/, "");
    var t = id ? ticketById(id) : null;
    if (t) renderDetail(t); else renderList();
  }

  document.addEventListener("DOMContentLoaded", function () {
    if (!document.getElementById("tck-app")) return;
    route();
    window.addEventListener("hashchange", route);
  });
})();
