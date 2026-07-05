/* =====================================================================
   IT Engineer Learning Hub — practice.js
   Three tools: Quizzes (scored → Hub.Progress.recordQuiz),
   Flashcards (built from GLOSSARY → Hub.Progress.markCard),
   Ticket Simulator (branching node graph).
   ===================================================================== */
(function () {
  "use strict";

  var P = window.Hub && window.Hub.Progress;
  function esc(s) {
    return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  /* ==================== Tabs ==================== */
  function initTabs() {
    var tabs = document.querySelectorAll(".tab");
    var panels = document.querySelectorAll(".tab-panel");
    tabs.forEach(function (t) {
      t.addEventListener("click", function () {
        tabs.forEach(function (x) { x.classList.remove("active"); });
        panels.forEach(function (p) { p.classList.remove("active"); });
        t.classList.add("active");
        var panel = document.getElementById(t.getAttribute("data-tab"));
        if (panel) panel.classList.add("active");
      });
    });
  }

  /* ==================== Quizzes ==================== */
  var QUIZ = window.QUIZZES || [];

  function renderQuizList() {
    var wrap = document.getElementById("quiz-list");
    if (!wrap) return;
    wrap.innerHTML = QUIZ.map(function (q) {
      var prev = P ? P.load().quizScores[q.id] : undefined;
      var badge = (prev === undefined) ? '<span class="q-prev">Not taken</span>'
        : '<span class="q-prev done">Best: ' + prev + "%</span>";
      return '<button class="q-card" data-quiz="' + q.id + '">' +
        '<span class="q-icon">' + q.icon + "</span>" +
        "<span class='q-title'>" + esc(q.title) + "</span>" +
        "<span class='q-meta'>" + q.questions.length + " questions " + badge + "</span>" +
      "</button>";
    }).join("");
    wrap.querySelectorAll(".q-card").forEach(function (b) {
      b.addEventListener("click", function () { startQuiz(b.getAttribute("data-quiz")); });
    });
  }

  function startQuiz(id) {
    var quiz = QUIZ.filter(function (q) { return q.id === id; })[0];
    if (!quiz) return;
    var host = document.getElementById("quiz-host");
    document.getElementById("quiz-list").style.display = "none";
    host.style.display = "block";

    var answers = new Array(quiz.questions.length).fill(null);

    function draw() {
      host.innerHTML =
        '<button class="link-back" id="quiz-exit">← All quizzes</button>' +
        "<h3 class='quiz-h'>" + quiz.icon + " " + esc(quiz.title) + "</h3>" +
        quiz.questions.map(function (item, qi) {
          return '<div class="quiz-q"><p class="quiz-qtext"><b>Q' + (qi + 1) + ".</b> " + esc(item.q) + "</p>" +
            item.options.map(function (opt, oi) {
              var checked = answers[qi] === oi ? " checked" : "";
              return '<label class="quiz-opt"><input type="radio" name="q' + qi + '" value="' + oi + '"' + checked + "> " + esc(opt) + "</label>";
            }).join("") + "</div>";
        }).join("") +
        '<button class="btn btn-primary" id="quiz-submit">Submit answers</button>' +
        '<div id="quiz-result"></div>';

      host.querySelectorAll("input[type=radio]").forEach(function (r) {
        r.addEventListener("change", function () {
          var qi = parseInt(r.name.slice(1), 10);
          answers[qi] = parseInt(r.value, 10);
        });
      });
      document.getElementById("quiz-exit").addEventListener("click", exitQuiz);
      document.getElementById("quiz-submit").addEventListener("click", grade);
    }

    function grade() {
      var correct = 0;
      quiz.questions.forEach(function (item, qi) {
        if (answers[qi] === item.answer) correct++;
      });
      var pct = Math.round((correct / quiz.questions.length) * 100);
      if (P) {
        var prev = P.load().quizScores[quiz.id];
        if (prev === undefined || pct > prev) P.recordQuiz(quiz.id, pct); // keep best
      }
      // annotate each question
      var blocks = host.querySelectorAll(".quiz-q");
      quiz.questions.forEach(function (item, qi) {
        var block = blocks[qi];
        var opts = block.querySelectorAll(".quiz-opt");
        opts.forEach(function (o, oi) {
          o.classList.remove("correct", "wrong");
          if (oi === item.answer) o.classList.add("correct");
          else if (answers[qi] === oi) o.classList.add("wrong");
        });
        var ex = document.createElement("div");
        ex.className = "quiz-explain" + (answers[qi] === item.answer ? " ok" : " no");
        ex.innerHTML = (answers[qi] === item.answer ? "✓ Correct. " : "✗ ") + esc(item.explain);
        block.appendChild(ex);
      });
      var res = document.getElementById("quiz-result");
      var msg = pct === 100 ? "Perfect! 🎉" : pct >= 60 ? "Good — review the misses below." : "Keep studying — check the explanations.";
      res.innerHTML = '<div class="quiz-score s-' + (pct >= 60 ? "pass" : "fail") + '">You scored ' +
        correct + "/" + quiz.questions.length + " (" + pct + "%). " + msg +
        '</div><button class="btn btn-ghost" id="quiz-retry">Try again</button>';
      document.getElementById("quiz-submit").style.display = "none";
      document.getElementById("quiz-retry").addEventListener("click", function () {
        answers = new Array(quiz.questions.length).fill(null); draw();
      });
      res.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }

    function exitQuiz() {
      host.style.display = "none";
      host.innerHTML = "";
      document.getElementById("quiz-list").style.display = "";
      renderQuizList(); // refresh best-score badges
    }

    draw();
  }

  /* ==================== Flashcards (from GLOSSARY) ==================== */
  var CARDS = (window.GLOSSARY || []).map(function (t) {
    return { id: t.term, front: t.term, sub: t.full, back: t.def, cat: t.cat };
  });
  var deck = { order: [], i: 0, flipped: false };

  function shuffle(a) {
    a = a.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }

  function knownCount() { return P ? Object.keys(P.load().knownCards).length : 0; }

  function drawCard() {
    var host = document.getElementById("fc-host");
    if (!host || !CARDS.length) return;
    if (deck.i >= deck.order.length) {
      host.innerHTML = '<div class="fc-done"><h3>Deck complete 🎉</h3>' +
        "<p class='muted'>You've mastered <b>" + knownCount() + "</b> of " + CARDS.length + " cards.</p>" +
        '<button class="btn btn-primary" id="fc-restart">Shuffle &amp; go again</button></div>';
      document.getElementById("fc-restart").addEventListener("click", newDeck);
      updateFcProgress();
      return;
    }
    var card = deck.order[deck.i];
    var isKnown = P && P.load().knownCards[card.id];
    host.innerHTML =
      '<div class="fc-counter muted">Card ' + (deck.i + 1) + " / " + deck.order.length +
        (isKnown ? ' · <span class="fc-known-tag">known ✓</span>' : "") + "</div>" +
      '<div class="flashcard' + (deck.flipped ? " flipped" : "") + '" id="fc-card">' +
        '<div class="fc-face fc-front"><span class="fc-cat">' + esc(card.cat) + "</span>" +
          "<div class='fc-term'>" + esc(card.front) + "</div>" +
          (card.sub ? "<div class='fc-sub'>" + esc(card.sub) + "</div>" : "") +
          "<div class='fc-hint muted'>tap to reveal</div></div>" +
        '<div class="fc-face fc-back"><p>' + esc(card.back) + "</p></div>" +
      "</div>" +
      '<div class="fc-controls">' +
        '<button class="btn btn-ghost" id="fc-still">Still learning</button>' +
        '<button class="btn btn-primary" id="fc-know">I knew it ✓</button>' +
      "</div>";

    document.getElementById("fc-card").addEventListener("click", function () {
      deck.flipped = !deck.flipped;
      document.getElementById("fc-card").classList.toggle("flipped", deck.flipped);
    });
    document.getElementById("fc-know").addEventListener("click", function () {
      if (P) P.markCard(card.id, true); next();
    });
    document.getElementById("fc-still").addEventListener("click", function () {
      if (P) P.markCard(card.id, false); next();
    });
    updateFcProgress();
  }

  function next() { deck.i++; deck.flipped = false; drawCard(); }

  function updateFcProgress() {
    var el = document.getElementById("fc-progress");
    if (!el) return;
    var known = knownCount();
    var pct = Math.round((known / CARDS.length) * 100);
    el.innerHTML = "Mastered <b>" + known + "</b> / " + CARDS.length + " cards" +
      '<div class="progress" style="max-width:320px;margin-top:8px"><span style="width:' + pct + '%"></span></div>';
  }

  function newDeck() {
    deck.order = shuffle(CARDS); deck.i = 0; deck.flipped = false; drawCard();
  }

  /* ==================== Ticket Simulator ==================== */
  var SIMS = window.SIMULATOR || [];

  function renderSimList() {
    var wrap = document.getElementById("sim-list");
    if (!wrap) return;
    wrap.innerHTML = SIMS.map(function (s) {
      return '<button class="q-card" data-sim="' + s.id + '">' +
        '<span class="q-icon">' + s.icon + "</span>" +
        "<span class='q-title'>" + esc(s.title) + "</span>" +
        "<span class='q-meta'>" + esc(s.difficulty) + " scenario</span>" +
      "</button>";
    }).join("");
    wrap.querySelectorAll(".q-card").forEach(function (b) {
      b.addEventListener("click", function () { startSim(b.getAttribute("data-sim")); });
    });
  }

  function startSim(id) {
    var sim = SIMS.filter(function (s) { return s.id === id; })[0];
    if (!sim) return;
    var host = document.getElementById("sim-host");
    document.getElementById("sim-list").style.display = "none";
    host.style.display = "block";
    var steps = 0;

    function drawNode(nodeId) {
      var node = sim.nodes[nodeId];
      if (!node) return;
      var head =
        '<button class="link-back" id="sim-exit">← All scenarios</button>' +
        '<div class="sim-ticket"><div class="sim-ticket-head">🎫 New ticket · <b>' + esc(sim.ticket.from) +
          "</b></div><div class='sim-subj'>" + esc(sim.ticket.subject) + "</div>" +
          "<p class='sim-body'>" + esc(sim.ticket.body) + "</p></div>";

      if (node.ending) {
        host.innerHTML = head +
          '<div class="sim-end end-' + node.ending + '">' +
            "<div class='sim-end-badge'>" + (node.ending === "good" ? "✓ Great outcome" : node.ending === "ok" ? "◑ Resolved, but…" : "✗ That went wrong") + "</div>" +
            "<p>" + esc(node.text) + "</p>" +
            "<p class='muted sim-steps'>Decisions made: " + steps + "</p>" +
          "</div>" +
          '<div class="btn-row"><button class="btn btn-primary" id="sim-again">Try this scenario again</button>' +
          '<button class="btn btn-ghost" id="sim-back">Other scenarios</button></div>';
        document.getElementById("sim-exit").addEventListener("click", exitSim);
        document.getElementById("sim-again").addEventListener("click", function () { steps = 0; drawNode(sim.start); });
        document.getElementById("sim-back").addEventListener("click", exitSim);
        return;
      }

      host.innerHTML = head +
        '<div class="sim-node"><p class="sim-prompt">' + esc(node.text) + "</p>" +
        '<div class="sim-choices">' +
          node.choices.map(function (c, i) {
            return '<button class="sim-choice" data-to="' + esc(c.to) + '">' + esc(c.label) + "</button>";
          }).join("") +
        "</div></div>";

      document.getElementById("sim-exit").addEventListener("click", exitSim);
      host.querySelectorAll(".sim-choice").forEach(function (b) {
        b.addEventListener("click", function () {
          steps++;
          drawNode(b.getAttribute("data-to"));
          host.scrollIntoView({ behavior: "smooth", block: "start" });
        });
      });
    }

    function exitSim() {
      host.style.display = "none"; host.innerHTML = "";
      document.getElementById("sim-list").style.display = "";
    }

    drawNode(sim.start);
  }

  /* ==================== Boot ==================== */
  document.addEventListener("DOMContentLoaded", function () {
    if (!document.querySelector(".tabs")) return;
    initTabs();
    renderQuizList();
    renderSimList();
    newDeck();
  });
})();
