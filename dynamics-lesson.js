/* =====================================================================
   Dynamics 365 course — lesson viewer engine (dynamics-module.html)
   Renders one module by walking its blocks. Each block type has a
   render()/wire() pair in TYPES. Completion persists via Hub.Dynamics.

   Deep-linkable: #m3 (or ?m=m3) opens module 3.
   ===================================================================== */
(function () {
  "use strict";

  var COURSE = window.DYN_COURSE;
  var Dyn = window.Hub && window.Hub.Dynamics;
  if (!COURSE || !Dyn) return;
  Dyn.setCourse(COURSE);

  /* ---------- helpers ---------- */
  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }
  function el(html) { var d = document.createElement("div"); d.innerHTML = html.trim(); return d.firstChild; }
  function moduleIdFromUrl() {
    var h = (location.hash || "").replace(/^#/, "");
    if (h) return h;
    var m = location.search.match(/[?&]m=([^&]+)/);
    return m ? decodeURIComponent(m[1]) : (COURSE.modules[0].id);
  }
  function findModule(id) {
    for (var i = 0; i < COURSE.modules.length; i++) if (COURSE.modules[i].id === id) return COURSE.modules[i];
    return COURSE.modules[0];
  }
  function shuffle(a) {
    a = a.slice();
    for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; }
    return a;
  }

  /* ---------- confetti (meaningful milestones only) ---------- */
  function confetti() {
    if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    var wrap = el('<div class="dyn-confetti" aria-hidden="true"></div>');
    var colours = ["#ec2b9c", "#ffce1f", "#2563eb", "#16a34a", "#ff5fa2"];
    for (var i = 0; i < 90; i++) {
      var p = document.createElement("i");
      p.style.left = Math.random() * 100 + "vw";
      p.style.background = colours[i % colours.length];
      p.style.animationDuration = (2 + Math.random() * 1.8) + "s";
      p.style.animationDelay = (Math.random() * 0.5) + "s";
      wrap.appendChild(p);
    }
    document.body.appendChild(wrap);
    setTimeout(function () { wrap.remove(); }, 4200);
  }

  /* live region for screen-reader feedback */
  var live;
  function announce(msg) { if (live) { live.textContent = ""; setTimeout(function () { live.textContent = msg; }, 30); } }

  /* mark a block container as done + fire progress side-effects */
  function markBlockDone(block, container, label) {
    Dyn.markLesson(block.id, label || block.title);
    if (container && !container.querySelector(".act-done-flag")) {
      var t = container.querySelector(".act-title") || container.querySelector("h2");
      if (t) t.insertAdjacentHTML("beforeend", ' <span class="act-done-flag">✓ done</span>');
    }
    refreshProgress();
    maybeCompleteModule();
  }

  /* build a score panel (shared by notes/scenarios) */
  function scorePanel(result, sample) {
    var cls = result.score >= 80 ? "pass" : result.score >= 50 ? "partial" : "fail";
    var head = result.score >= 80 ? "Strong answer — " + result.score + "%"
      : result.score >= 50 ? "Good start — " + result.score + "%"
      : "Needs more — " + result.score + "%";
    var items = result.feedback.map(function (f) {
      var c = f.kind === "good" ? "good" : f.kind === "bonus" ? "bonus" : f.kind === "security" ? "security" : f.kind === "warn" ? "warn" : "miss";
      return '<li class="' + c + '">' + esc(f.text) + "</li>";
    }).join("");
    var html = '<div class="dyn-scorepanel ' + cls + '" role="status">' +
      '<div class="dyn-score-head">' + esc(head) + "</div>" +
      '<ul class="dyn-fb-list">' + items + "</ul>";
    if (sample) {
      html += '<details class="dyn-sample"><summary>Show a model answer</summary><p>' + esc(sample) + "</p></details>";
    }
    html += "</div>";
    return html;
  }

  /* =====================================================================
     BLOCK TYPES
     ===================================================================== */
  var TYPES = {};

  /* ---- prose ---- */
  TYPES.prose = {
    render: function (b) {
      return '<div class="dyn-block prose-block"><div class="dyn-prose">' +
        (b.h ? "<h2>" + esc(b.h) + "</h2>" : "") + (b.body || "") + "</div></div>";
    }
  };

  /* ---- callout ---- */
  TYPES.callout = {
    render: function (b) {
      var ico = b.kind === "security" ? "🔒" : b.kind === "warn" ? "⚠️" : b.kind === "good" ? "💡" : "ℹ️";
      return '<div class="dyn-block prose-block"><div class="callout ' + (b.kind || "info") + ' dyn-callout">' +
        '<span class="c-ico" aria-hidden="true">' + ico + "</span><div><b>" + esc(b.title || "") + "</b><br>" + (b.body || "") + "</div></div></div>";
    }
  };

  /* ---- quiz (multi-question, scored, keeps best) ---- */
  TYPES.quiz = {
    render: function (b) {
      var prev = Dyn.quizScore(b.id);
      var prevTxt = prev === undefined ? "" : ' <span class="act-done-flag">best ' + prev + "%</span>";
      var qs = b.questions.map(function (item, qi) {
        return '<div class="quiz-q"><p class="quiz-qtext"><b>Q' + (qi + 1) + ".</b> " + esc(item.q) + "</p>" +
          item.options.map(function (opt, oi) {
            return '<label class="quiz-opt"><input type="radio" name="' + b.id + "-" + qi + '" value="' + oi + '"> ' + esc(opt) + "</label>";
          }).join("") + "</div>";
      }).join("");
      return '<div class="dyn-block" data-block="' + b.id + '"><span class="act-tag">Knowledge check</span>' +
        '<h3 class="act-title">' + esc(b.title) + prevTxt + "</h3>" + qs +
        '<button class="btn btn-primary" data-act="submit">Submit answers</button>' +
        '<div class="q-result" aria-live="polite"></div></div>';
    },
    wire: function (b, root) {
      var answers = {};
      root.querySelectorAll("input[type=radio]").forEach(function (r) {
        r.addEventListener("change", function () { answers[r.name] = parseInt(r.value, 10); });
      });
      root.querySelector('[data-act=submit]').addEventListener("click", function () {
        var correct = 0;
        b.questions.forEach(function (item, qi) {
          var blocks = root.querySelectorAll(".quiz-q");
          var opts = blocks[qi].querySelectorAll(".quiz-opt");
          var chosen = answers[b.id + "-" + qi];
          opts.forEach(function (o, oi) {
            o.classList.remove("correct", "wrong");
            if (oi === item.answer) o.classList.add("correct");
            else if (chosen === oi) o.classList.add("wrong");
          });
          if (!blocks[qi].querySelector(".quiz-explain")) {
            var ex = document.createElement("div");
            ex.className = "quiz-explain " + (chosen === item.answer ? "ok" : "no");
            ex.innerHTML = (chosen === item.answer ? "✓ Correct. " : "✗ ") + esc(item.explain);
            blocks[qi].appendChild(ex);
          }
          if (chosen === item.answer) correct++;
        });
        var pct = Math.round((correct / b.questions.length) * 100);
        Dyn.recordQuiz(b.id, pct, b.title);
        var res = root.querySelector(".q-result");
        res.innerHTML = '<div class="quiz-score s-' + (pct >= 60 ? "pass" : "fail") + '">You scored ' +
          correct + "/" + b.questions.length + " (" + pct + "%). Best kept.</div>";
        announce("You scored " + pct + " percent.");
        markBlockDone(b, root, "Quiz: " + b.title);
        if (b.isFinal) { Dyn.recordFinal(pct); }
      });
    }
  };

  /* ---- match ---- */
  TYPES.match = {
    render: function (b) {
      var defs = shuffle(b.pairs);
      var terms = b.pairs.map(function (p, i) {
        return '<button type="button" class="dyn-match-term" data-term="' + i + '">' + esc(p.term) + "</button>";
      }).join("");
      var defsH = defs.map(function (p) {
        var idx = b.pairs.indexOf(p);
        return '<button type="button" class="dyn-match-def" data-def="' + idx + '">' + esc(p.def) + "</button>";
      }).join("");
      return '<div class="dyn-block" data-block="' + b.id + '"><span class="act-tag">Matching</span>' +
        '<h3 class="act-title">' + esc(b.title) + '</h3><p class="act-instr">' + esc(b.instructions || "Click a term, then its match.") + "</p>" +
        '<div class="dyn-match"><div class="dyn-match-col">' + terms + '</div><div class="dyn-match-col">' + defsH + "</div></div>" +
        '<div class="q-result" style="margin-top:14px" aria-live="polite"></div></div>';
    },
    wire: function (b, root) {
      var selTerm = null, made = 0;
      function clear() { root.querySelectorAll(".sel").forEach(function (e) { e.classList.remove("sel"); }); }
      root.querySelectorAll(".dyn-match-term").forEach(function (t) {
        t.addEventListener("click", function () {
          if (t.classList.contains("matched")) return;
          clear(); selTerm = t; t.classList.add("sel");
        });
      });
      root.querySelectorAll(".dyn-match-def").forEach(function (d) {
        d.addEventListener("click", function () {
          if (!selTerm || d.classList.contains("matched")) return;
          var ti = selTerm.getAttribute("data-term"), di = d.getAttribute("data-def");
          var ok = ti === di;
          if (ok) {
            selTerm.classList.add("matched", "correct"); d.classList.add("matched", "correct");
            made++;
            if (made === b.pairs.length) {
              root.querySelector(".q-result").innerHTML = '<div class="quiz-score s-pass">All matched! ✓</div>';
              announce("All pairs matched correctly.");
              markBlockDone(b, root, "Matched: " + b.title);
            }
          } else {
            selTerm.classList.add("wrong"); d.classList.add("wrong");
            var st = selTerm, dd = d;
            setTimeout(function () { st.classList.remove("wrong", "sel"); dd.classList.remove("wrong"); }, 650);
            announce("Not a match, try again.");
          }
          clear(); selTerm = null;
        });
      });
    }
  };

  /* ---- order ---- */
  TYPES.order = {
    render: function (b) {
      var shuffled = shuffle(b.items.map(function (t, i) { return { t: t, i: i }; }));
      var lis = shuffled.map(function (o) {
        return '<li class="dyn-order-item" draggable="true" data-i="' + o.i + '">' +
          '<span class="dyn-order-handle" aria-hidden="true">⋮⋮</span>' +
          '<span class="dyn-order-num"></span><span class="oi-text">' + esc(o.t) + "</span>" +
          '<span class="dyn-order-btns"><button type="button" data-up aria-label="Move up">▲</button>' +
          '<button type="button" data-down aria-label="Move down">▼</button></span></li>';
      }).join("");
      return '<div class="dyn-block" data-block="' + b.id + '"><span class="act-tag">Ordering</span>' +
        '<h3 class="act-title">' + esc(b.title) + '</h3><p class="act-instr">' + esc(b.instructions || "Arrange into the correct order.") + "</p>" +
        '<ul class="dyn-order-list">' + lis + "</ul>" +
        '<button class="btn btn-primary" data-act="check">Check order</button>' +
        '<div class="q-result" aria-live="polite"></div></div>';
    },
    wire: function (b, root) {
      var list = root.querySelector(".dyn-order-list");
      function renumber() {
        var items = list.querySelectorAll(".dyn-order-item");
        items.forEach(function (it, idx) {
          it.querySelector(".dyn-order-num").textContent = (idx + 1) + ".";
          it.querySelector("[data-up]").disabled = idx === 0;
          it.querySelector("[data-down]").disabled = idx === items.length - 1;
        });
      }
      list.addEventListener("click", function (e) {
        var btn = e.target.closest("button"); if (!btn) return;
        var li = btn.closest(".dyn-order-item");
        if (btn.hasAttribute("data-up") && li.previousElementSibling) list.insertBefore(li, li.previousElementSibling);
        if (btn.hasAttribute("data-down") && li.nextElementSibling) list.insertBefore(li.nextElementSibling, li);
        renumber();
      });
      // drag & drop
      var dragEl = null;
      list.addEventListener("dragstart", function (e) { dragEl = e.target.closest(".dyn-order-item"); if (dragEl) dragEl.classList.add("dragging"); });
      list.addEventListener("dragend", function () { if (dragEl) dragEl.classList.remove("dragging"); dragEl = null; renumber(); });
      list.addEventListener("dragover", function (e) {
        e.preventDefault(); if (!dragEl) return;
        var after = null, items = list.querySelectorAll(".dyn-order-item:not(.dragging)");
        for (var i = 0; i < items.length; i++) {
          var box = items[i].getBoundingClientRect();
          if (e.clientY < box.top + box.height / 2) { after = items[i]; break; }
        }
        if (after) list.insertBefore(dragEl, after); else list.appendChild(dragEl);
      });
      root.querySelector('[data-act=check]').addEventListener("click", function () {
        var items = list.querySelectorAll(".dyn-order-item");
        var right = 0;
        items.forEach(function (it, idx) {
          it.classList.remove("correct", "wrong");
          var ok = parseInt(it.getAttribute("data-i"), 10) === idx;
          it.classList.add(ok ? "correct" : "wrong");
          if (ok) right++;
        });
        var res = root.querySelector(".q-result");
        if (right === items.length) {
          res.innerHTML = '<div class="quiz-score s-pass">Correct order! ✓</div>';
          announce("Correct order.");
          markBlockDone(b, root, "Ordered: " + b.title);
        } else {
          res.innerHTML = '<div class="quiz-score s-fail">' + right + "/" + items.length + " in place. Adjust the red rows and check again.</div>";
          announce(right + " of " + items.length + " in the right place.");
        }
      });
      renumber();
    }
  };

  /* ---- sort (into buckets; click-to-place + drag) ---- */
  TYPES.sort = {
    render: function (b) {
      var pool = shuffle(b.items.map(function (it, i) { return { i: i, text: it.text }; }));
      var chips = pool.map(function (o) {
        return '<button type="button" class="dyn-chip-item" draggable="true" data-i="' + o.i + '">' + esc(o.text) + "</button>";
      }).join("");
      var buckets = b.buckets.map(function (bk) {
        return '<div class="dyn-bucket" data-bucket="' + bk.id + '"><div class="dyn-bucket-h">' + esc(bk.label) +
          '</div><div class="dyn-bucket-items"></div></div>';
      }).join("");
      return '<div class="dyn-block" data-block="' + b.id + '"><span class="act-tag">Sort</span>' +
        '<h3 class="act-title">' + esc(b.title) + '</h3><p class="act-instr">' + esc(b.instructions || "") +
        ' <em>(Tip: click an item then click a bucket, or drag it.)</em></p>' +
        '<div class="dyn-sort-pool">' + chips + "</div>" +
        '<div class="dyn-buckets">' + buckets + "</div>" +
        '<button class="btn btn-primary" style="margin-top:14px" data-act="check">Check</button>' +
        '<div class="q-result" aria-live="polite"></div></div>';
    },
    wire: function (b, root) {
      var selected = null;
      function select(chip) {
        if (selected) selected.classList.remove("sel");
        selected = chip; chip.classList.add("sel");
      }
      root.querySelectorAll(".dyn-chip-item").forEach(function (c) {
        c.addEventListener("click", function () { select(c); });
        c.addEventListener("dragstart", function (e) { select(c); c.classList.add("dragging"); });
        c.addEventListener("dragend", function () { c.classList.remove("dragging"); });
      });
      function place(chip, bucketEl) {
        bucketEl.querySelector(".dyn-bucket-items").appendChild(chip);
        chip.classList.remove("sel"); selected = null;
      }
      root.querySelectorAll(".dyn-bucket").forEach(function (bk) {
        bk.addEventListener("click", function () { if (selected) place(selected, bk); });
        bk.addEventListener("dragover", function (e) { e.preventDefault(); bk.classList.add("over"); });
        bk.addEventListener("dragleave", function () { bk.classList.remove("over"); });
        bk.addEventListener("drop", function (e) { e.preventDefault(); bk.classList.remove("over"); if (selected) place(selected, bk); });
      });
      root.querySelector('[data-act=check]').addEventListener("click", function () {
        var right = 0, placed = 0;
        root.querySelectorAll(".dyn-bucket").forEach(function (bk) {
          var bid = bk.getAttribute("data-bucket");
          bk.querySelectorAll(".dyn-chip-item").forEach(function (chip) {
            placed++;
            var correctBucket = b.items[parseInt(chip.getAttribute("data-i"), 10)].bucket;
            chip.classList.remove("correct", "wrong");
            var ok = correctBucket === bid;
            chip.classList.add(ok ? "correct" : "wrong");
            if (ok) right++;
          });
        });
        var res = root.querySelector(".q-result");
        if (placed < b.items.length) {
          res.innerHTML = '<div class="quiz-score s-fail">Place all items first (' + placed + "/" + b.items.length + ").</div>";
          return;
        }
        if (right === b.items.length) {
          res.innerHTML = '<div class="quiz-score s-pass">All sorted correctly! ✓</div>';
          announce("All items sorted correctly.");
          markBlockDone(b, root, "Sorted: " + b.title);
        } else {
          res.innerHTML = '<div class="quiz-score s-fail">' + right + "/" + b.items.length + " correct. Fix the red items.</div>";
          announce(right + " of " + b.items.length + " correct.");
        }
      });
    }
  };

  /* ---- pick (single/multi choice) ---- */
  TYPES.pick = {
    render: function (b) {
      var type = b.multi ? "checkbox" : "radio";
      var opts = b.options.map(function (o, i) {
        return '<label class="dyn-pick-opt"><input type="' + type + '" name="' + b.id + '" value="' + i + '"> <span>' + esc(o.label) + "</span></label>";
      }).join("");
      return '<div class="dyn-block" data-block="' + b.id + '"><span class="act-tag">' + (b.multi ? "Select all that apply" : "Choose one") + "</span>" +
        '<h3 class="act-title">' + esc(b.title) + '</h3><p class="act-instr">' + esc(b.prompt || "") + "</p>" +
        opts + '<button class="btn btn-primary" style="margin-top:6px" data-act="check">Check answer</button>' +
        '<div class="q-result" aria-live="polite"></div></div>';
    },
    wire: function (b, root) {
      root.querySelector('[data-act=check]').addEventListener("click", function () {
        var labels = root.querySelectorAll(".dyn-pick-opt");
        var allRight = true, anyChosen = false;
        labels.forEach(function (lab, i) {
          var input = lab.querySelector("input");
          var chosen = input.checked; if (chosen) anyChosen = true;
          var correct = !!b.options[i].correct;
          lab.classList.remove("correct", "wrong");
          var oldFb = lab.parentNode.querySelector('[data-fb="' + i + '"]');
          if (oldFb) oldFb.remove();
          if (chosen && correct) lab.classList.add("correct");
          else if (chosen && !correct) { lab.classList.add("wrong"); allRight = false; }
          else if (!chosen && correct) { allRight = false; if (b.multi) lab.classList.add("wrong"); }
          if (chosen || correct) {
            var fb = document.createElement("div");
            fb.className = "dyn-pick-fb " + (correct ? "ok" : "no");
            fb.setAttribute("data-fb", i);
            fb.textContent = b.options[i].feedback || "";
            lab.insertAdjacentElement("afterend", fb);
          }
        });
        if (!anyChosen) { return; }
        var res = root.querySelector(".q-result");
        if (allRight) {
          res.innerHTML = '<div class="quiz-score s-pass">Correct! ✓</div>';
          announce("Correct.");
          markBlockDone(b, root, "Answered: " + b.title);
        } else {
          res.innerHTML = '<div class="quiz-score s-fail">Not quite — read the feedback and try again. (Attempt saved.)</div>';
          announce("Not quite, see feedback.");
          markBlockDone(b, root, "Attempted: " + b.title); // completion credited on attempt
        }
      });
    }
  };

  /* ---- priority selector ---- */
  TYPES.priority = {
    render: function (b) {
      var levels = [["low", "Low"], ["normal", "Normal"], ["high", "High"], ["critical", "Critical"]];
      var cases = b.cases.map(function (c, ci) {
        var btns = levels.map(function (lv) {
          return '<button type="button" class="dyn-pri-btn" data-case="' + ci + '" data-lv="' + lv[0] + '">' + lv[1] + "</button>";
        }).join("");
        return '<div class="dyn-pri-case" data-case="' + ci + '"><p>' + esc(c.text) + '</p><div class="dyn-pri-choices">' + btns +
          '</div><div class="dyn-pri-why" hidden></div></div>';
      }).join("");
      return '<div class="dyn-block" data-block="' + b.id + '"><span class="act-tag">Set priority</span>' +
        '<h3 class="act-title">' + esc(b.title) + '</h3><p class="act-instr">' + esc(b.instructions || "") + "</p>" + cases +
        '<div class="q-result" aria-live="polite"></div></div>';
    },
    wire: function (b, root) {
      var answered = {};
      root.querySelectorAll(".dyn-pri-btn").forEach(function (btn) {
        btn.addEventListener("click", function () {
          var ci = +btn.getAttribute("data-case"), lv = btn.getAttribute("data-lv");
          var caseEl = root.querySelector('.dyn-pri-case[data-case="' + ci + '"]');
          caseEl.querySelectorAll(".dyn-pri-btn").forEach(function (x) { x.classList.remove("sel", "correct", "wrong"); });
          var correct = b.cases[ci].correct;
          btn.classList.add("sel");
          btn.classList.add(lv === correct ? "correct" : "wrong");
          if (lv !== correct) caseEl.querySelector('.dyn-pri-btn[data-lv="' + correct + '"]').classList.add("correct");
          var why = caseEl.querySelector(".dyn-pri-why");
          why.hidden = false;
          why.innerHTML = (lv === correct ? "✓ " : "A common answer is <b>" + correct + "</b>. ") + esc(b.cases[ci].why);
          answered[ci] = true;
          if (Object.keys(answered).length === b.cases.length) {
            root.querySelector(".q-result").innerHTML = '<div class="quiz-score s-pass">Priorities set — remember to follow your employer’s matrix.</div>';
            markBlockDone(b, root, "Prioritised: " + b.title);
          }
        });
      });
    }
  };

  /* ---- note / clear / handoff (free-text, keyword-scored) ---- */
  function noteComponent(tag) {
    return {
      render: function (b) {
        var chips = (b.blocks || []).map(function (nb, i) {
          return '<button type="button" class="dyn-note-chip" data-snippet="' + i + '">+ ' + esc(nb.label) + "</button>";
        }).join("");
        var prev = Dyn.getNote(b.id);
        return '<div class="dyn-block" data-block="' + b.id + '"><span class="act-tag">' + tag + "</span>" +
          '<h3 class="act-title">' + esc(b.title) + "</h3>" +
          '<div class="dyn-note-brief">' + esc(b.brief) + "</div>" +
          (b.hint ? '<p class="dyn-note-hint">Hint: ' + esc(b.hint) + "</p>" : "") +
          (chips ? '<p class="dyn-note-hint">Build blocks (optional — click to insert, then edit):</p><div class="dyn-note-blocks">' + chips + "</div>" : "") +
          '<textarea class="dyn-note-ta" data-note aria-label="Your answer" placeholder="Write your note here…">' + esc(prev) + "</textarea>" +
          '<div class="dyn-note-count"><span data-count>0</span> words</div>' +
          '<button class="btn btn-primary" style="margin-top:10px" data-act="score">Submit for feedback</button>' +
          '<div class="q-result" aria-live="polite"></div></div>';
      },
      wire: function (b, root) {
        var ta = root.querySelector("[data-note]");
        var count = root.querySelector("[data-count]");
        function upd() { var t = ta.value.trim(); count.textContent = t ? t.split(/\s+/).length : 0; }
        ta.addEventListener("input", function () { upd(); Dyn.saveNote(b.id, ta.value); });
        upd();
        root.querySelectorAll("[data-snippet]").forEach(function (chip) {
          chip.addEventListener("click", function () {
            var nb = b.blocks[+chip.getAttribute("data-snippet")];
            ta.value = (ta.value.trim() ? ta.value.trim() + " " : "") + nb.text;
            chip.classList.add("used"); upd(); Dyn.saveNote(b.id, ta.value); ta.focus();
          });
        });
        root.querySelector('[data-act=score]').addEventListener("click", function () {
          var result = Dyn.scoreText(ta.value, b.rubric || {});
          var res = root.querySelector(".q-result");
          res.innerHTML = scorePanel(result, b.sample);
          announce("Scored " + result.score + " percent. " +
            (result.violations.length ? "Security issue flagged." : ""));
          markBlockDone(b, root, tag + ": " + b.title);
        });
      }
    };
  }
  TYPES.note = noteComponent("Write a case note");
  TYPES.clear = noteComponent("CLEAR note");
  TYPES.handoff = noteComponent("HANDOFF escalation");

  /* ---- triage (guided fields with model answers) ---- */
  TYPES.triage = {
    render: function (b) {
      var steps = b.steps.map(function (s, i) {
        return '<div class="dyn-sc-step"><h4><span class="n">' + s.key + "</span> " + esc(s.label) + "</h4>" +
          '<p class="act-instr" style="margin-bottom:8px">' + esc(s.prompt) + "</p>" +
          '<textarea class="dyn-note-ta" style="min-height:60px" data-step="' + i + '" aria-label="' + esc(s.label) + '"></textarea>' +
          '<div class="dyn-pri-why" hidden data-model="' + i + '"></div></div>';
      }).join("");
      return '<div class="dyn-block" data-block="' + b.id + '"><span class="act-tag">TRIAGE assessment</span>' +
        '<h3 class="act-title">' + esc(b.title) + "</h3>" +
        '<div class="dyn-note-brief">' + esc(b.caseText) + "</div>" + steps +
        '<button class="btn btn-primary" data-act="reveal">Reveal model assessment</button>' +
        '<div class="q-result" aria-live="polite"></div></div>';
    },
    wire: function (b, root) {
      root.querySelector('[data-act=reveal]').addEventListener("click", function () {
        b.steps.forEach(function (s, i) {
          var m = root.querySelector('[data-model="' + i + '"]');
          m.hidden = false; m.innerHTML = "<b>Model " + esc(s.label) + ":</b> " + esc(s.model);
        });
        root.querySelector(".q-result").innerHTML = '<div class="quiz-score s-pass">Compare your assessment with the model above. ✓</div>';
        markBlockDone(b, root, "TRIAGE: " + b.title);
      });
    }
  };

  /* ---- SLA countdown ---- */
  TYPES.sla = {
    render: function (b) {
      return '<div class="dyn-block" data-block="' + b.id + '"><span class="act-tag">SLA simulation</span>' +
        '<h3 class="act-title">' + esc(b.title) + '</h3><p class="act-instr">' + esc(b.instructions || "") + "</p>" +
        '<div class="dyn-sla ok"><div class="dyn-sla-dial"><svg width="88" height="88" viewBox="0 0 88 88">' +
          '<circle class="dyn-sla-bg" cx="44" cy="44" r="38" fill="none" stroke-width="8"></circle>' +
          '<circle class="dyn-sla-fg" cx="44" cy="44" r="38" fill="none" stroke-width="8" stroke-linecap="round" pathLength="100" stroke-dasharray="100" stroke-dashoffset="0"></circle>' +
          '</svg><div class="dyn-sla-time">--:--</div></div>' +
          '<div class="dyn-sla-body"><div class="dyn-sla-state">Ready</div>' +
          '<p class="act-instr" style="margin:4px 0 0">High-priority response target. Watch the dial approach breach.</p>' +
          '<div class="dyn-sla-controls"><button class="btn btn-primary" data-act="start">Start SLA timer</button></div></div></div>' +
        '<div class="q-result"></div></div>';
    },
    wire: function (b, root) {
      var totalMs = 18000; // compressed demo window (~18s)
      var wrap = root.querySelector(".dyn-sla");
      var fg = root.querySelector(".dyn-sla-fg");
      var timeEl = root.querySelector(".dyn-sla-time");
      var stateEl = root.querySelector(".dyn-sla-state");
      var displayMin = (b.minutes || 4);
      root.querySelector('[data-act=start]').addEventListener("click", function () {
        var start = Date.now();
        markBlockDone(b, root, "SLA sim: " + b.title);
        root.querySelector('[data-act=start]').disabled = true;
        var timer = setInterval(function () {
          var frac = Math.min(1, (Date.now() - start) / totalMs);
          var remain = 1 - frac;
          fg.setAttribute("stroke-dashoffset", (frac * 100).toFixed(1));
          var mins = Math.floor(remain * displayMin);
          var secs = Math.floor((remain * displayMin - mins) * 60);
          timeEl.textContent = mins + ":" + (secs < 10 ? "0" : "") + secs;
          wrap.classList.remove("ok", "warn", "breach");
          if (remain <= 0) {
            wrap.classList.add("breach"); stateEl.textContent = b.breachLabel || "SLA breached — escalate";
            timeEl.textContent = "0:00"; clearInterval(timer);
          } else if (remain <= (b.warnAt || 0.5)) {
            wrap.classList.add("warn"); stateEl.textContent = "Approaching breach — act or escalate";
          } else {
            wrap.classList.add("ok"); stateEl.textContent = "On track";
          }
        }, 120);
      });
    }
  };

  /* ---- hotspot ---- */
  TYPES.hotspot = {
    render: function (b) {
      // fixed positions for the five standard regions over the mock UI
      var pos = {
        nav:   { top: "34px", left: "0",     w: "128px", h: "180px", label: "1" },
        view:  { top: "42px", left: "138px", w: "120px", h: "26px",  label: "2" },
        cmd:   { top: "6px",  left: "70px",  w: "150px", h: "24px",  label: "3" },
        grid:  { top: "80px", left: "138px", w: "58%",   h: "120px", label: "4" },
        search:{ top: "6px",  right: "10px", w: "120px", h: "24px",  label: "5" }
      };
      var spots = b.regions.map(function (r) {
        var p = pos[r.key] || { top: "10px", left: "10px", w: "60px", h: "24px", label: "?" };
        var style = "top:" + p.top + ";" + (p.left ? "left:" + p.left + ";" : "right:" + p.right + ";") + "width:" + p.w + ";height:" + p.h + ";";
        return '<button type="button" class="dyn-hotspot" data-key="' + r.key + '" style="' + style + '" aria-label="' + esc(r.label) + '">' + p.label + "</button>";
      }).join("");
      var mock =
        '<div class="dyn-mockui"><div class="mu-topbar"><div class="mu-cmd"><span>＋ New</span><span>Save</span><span>Assign</span><span>Resolve</span></div>' +
        '<div class="mu-search">🔍 Search</div></div>' +
        '<div class="mu-main"><div class="mu-nav"><span class="on">Dashboards</span><span>Cases</span><span>Accounts</span><span>Contacts</span><span>Queues</span><span>Knowledge</span></div>' +
        '<div class="mu-body"><span class="mu-viewsel">My Active Cases ▾</span>' +
        '<div class="mu-grid"><div class="row"><span>Case #</span><span>Title</span><span>Priority</span></div>' +
        '<div class="row"><span>MN-1042</span><span>Scanner won’t scan to email</span><span>Normal</span></div>' +
        '<div class="row"><span>MN-1043</span><span>Outlook disconnecting</span><span>Normal</span></div>' +
        '<div class="row"><span>MN-1044</span><span>VPN certificate warning</span><span>High</span></div></div></div></div>' + spots + "</div>";
      return '<div class="dyn-block" data-block="' + b.id + '"><span class="act-tag">Interface explorer</span>' +
        '<h3 class="act-title">' + esc(b.title) + '</h3><p class="act-instr">' + esc(b.instructions || "") + "</p>" + mock +
        '<div class="dyn-hotspot-info"><span data-info>Click a numbered area above to learn what it does.</span> <span data-progress></span></div>' +
        '<div class="q-result" aria-live="polite"></div></div>';
    },
    wire: function (b, root) {
      var seen = {};
      root.querySelectorAll(".dyn-hotspot").forEach(function (hs) {
        hs.addEventListener("click", function () {
          var key = hs.getAttribute("data-key");
          var r = b.regions.filter(function (x) { return x.key === key; })[0];
          root.querySelectorAll(".dyn-hotspot").forEach(function (x) { x.classList.remove("on"); });
          hs.classList.add("on", "found");
          root.querySelector("[data-info]").innerHTML = "<b>" + esc(r.label) + ":</b> " + esc(r.text);
          seen[key] = true;
          root.querySelector("[data-progress]").textContent = "(" + Object.keys(seen).length + "/" + b.regions.length + " explored)";
          if (Object.keys(seen).length === b.regions.length) {
            root.querySelector(".q-result").innerHTML = '<div class="quiz-score s-pass">You’ve explored every area. ✓</div>';
            markBlockDone(b, root, "Explored: " + b.title);
          }
        });
      });
    }
  };

  /* ---- search exercise ---- */
  TYPES.search = {
    render: function (b) {
      var rows = b.cases.map(function (c) {
        return '<button type="button" class="dyn-caserow" data-num="' + esc(c.num) + '" data-text="' +
          esc((c.num + " " + c.org + " " + c.subject).toLowerCase()) + '"><span class="cr-num">' + esc(c.num) +
          '</span><span class="cr-org">' + esc(c.org) + '</span><span class="cr-subj">' + esc(c.subject) + "</span></button>";
      }).join("");
      return '<div class="dyn-block" data-block="' + b.id + '"><span class="act-tag">Search & filter</span>' +
        '<h3 class="act-title">' + esc(b.title) + '</h3><p class="act-instr">' + esc(b.prompt || "") + "</p>" +
        '<div class="dyn-searchbar">🔍 <input type="text" data-q aria-label="Search cases" placeholder="Search by number, customer or keyword…"></div>' +
        '<div class="dyn-caselist">' + rows + "</div>" +
        '<div class="q-result" aria-live="polite"></div></div>';
    },
    wire: function (b, root) {
      var q = root.querySelector("[data-q]");
      q.addEventListener("input", function () {
        var term = q.value.trim().toLowerCase();
        root.querySelectorAll(".dyn-caserow").forEach(function (row) {
          row.style.display = (!term || row.getAttribute("data-text").indexOf(term) !== -1) ? "" : "none";
        });
      });
      root.querySelectorAll(".dyn-caserow").forEach(function (row) {
        row.addEventListener("click", function () {
          var ok = row.getAttribute("data-num") === b.targetId;
          root.querySelectorAll(".dyn-caserow").forEach(function (r) { r.classList.remove("hit", "miss"); });
          row.classList.add(ok ? "hit" : "miss");
          var res = root.querySelector(".q-result");
          if (ok) {
            res.innerHTML = '<div class="quiz-score s-pass">Found it — ' + esc(b.targetId) + ". ✓</div>";
            announce("Correct case found.");
            markBlockDone(b, root, "Search: " + b.title);
          } else {
            res.innerHTML = '<div class="quiz-score s-fail">That’s not the one — check the customer/keyword and try again.</div>';
          }
        });
      });
    }
  };

  /* ---- knowledge article select (reuses pick styling) ---- */
  TYPES.knowledge = {
    render: function (b) {
      var opts = b.articles.map(function (a, i) {
        return '<label class="dyn-pick-opt"><input type="radio" name="' + b.id + '" value="' + i + '"> <span><b>' + esc(a.title) +
          "</b><br><span class='muted' style='font-size:12.5px'>" + esc(a.reviewed || "") + "</span></span></label>";
      }).join("");
      return '<div class="dyn-block" data-block="' + b.id + '"><span class="act-tag">Knowledge article</span>' +
        '<h3 class="act-title">' + esc(b.title) + '</h3><p class="act-instr">' + esc(b.prompt || "") + "</p>" + opts +
        '<button class="btn btn-primary" style="margin-top:6px" data-act="check">Check</button>' +
        '<div class="q-result" aria-live="polite"></div></div>';
    },
    wire: function (b, root) {
      root.querySelector('[data-act=check]').addEventListener("click", function () {
        var labels = root.querySelectorAll(".dyn-pick-opt");
        var chosen = -1;
        labels.forEach(function (l, i) { if (l.querySelector("input").checked) chosen = i; });
        if (chosen === -1) return;
        labels.forEach(function (l, i) {
          l.classList.remove("correct", "wrong");
          var old = l.parentNode.querySelector('[data-fb="' + i + '"]'); if (old) old.remove();
          if (b.articles[i].correct) l.classList.add("correct");
          else if (i === chosen) l.classList.add("wrong");
          if (i === chosen || b.articles[i].correct) {
            var fb = document.createElement("div");
            fb.className = "dyn-pick-fb " + (b.articles[i].correct ? "ok" : "no");
            fb.setAttribute("data-fb", i); fb.textContent = b.articles[i].why || "";
            l.insertAdjacentElement("afterend", fb);
          }
        });
        var ok = b.articles[chosen].correct;
        root.querySelector(".q-result").innerHTML = ok ?
          '<div class="quiz-score s-pass">Right article. ✓</div>' :
          '<div class="quiz-score s-fail">Not the best fit — read the notes and see which article matches and is current.</div>';
        markBlockDone(b, root, "KB: " + b.title);
      });
    }
  };

  /* ---- scenario (composite lab case) ---- */
  TYPES.scenario = {
    render: function (b) {
      var t = b.ticket;
      var qOpts = b.questions.options.map(function (o, i) {
        return '<label class="dyn-pick-opt"><input type="checkbox" value="' + i + '"> <span>' + esc(o.label) + "</span></label>";
      }).join("");
      var levels = [["low", "Low"], ["normal", "Normal"], ["high", "High"], ["critical", "Critical"]];
      var priBtns = levels.map(function (lv) {
        return '<button type="button" class="dyn-pri-btn" data-lv="' + lv[0] + '">' + lv[1] + "</button>";
      }).join("");
      var decOpts = b.decision.options.map(function (o, i) {
        return '<label class="dyn-pick-opt"><input type="radio" name="' + b.id + '-dec" value="' + i + '"> <span>' + esc(o.label) + "</span></label>";
      }).join("");
      return '<div class="dyn-block dyn-scenario" data-block="' + b.id + '"><span class="act-tag">Scenario lab</span>' +
        '<h3 class="act-title">' + esc(b.title) + "</h3>" +
        '<div class="sc-ticket"><div class="sc-from">🎫 New case · <b>' + esc(t.from) + "</b> · " + esc(t.org) +
          '</div><div class="sc-subj">' + esc(t.subject) + '</div><p>' + esc(t.body) + "</p></div>" +

        '<div class="dyn-sc-step"><h4><span class="n">1</span> Set a provisional priority</h4>' +
          '<div class="dyn-pri-choices">' + priBtns + '</div><div class="dyn-pri-why" hidden data-pri-why></div></div>' +

        '<div class="dyn-sc-step"><h4><span class="n">2</span> Choose the questions to ask</h4>' +
          '<p class="act-instr">' + esc(b.questions.prompt) + "</p>" + qOpts +
          '<button class="btn btn-ghost" style="margin-top:4px" data-act="q-check">Check questions</button><div data-q-res></div></div>' +

        '<div class="dyn-sc-step"><h4><span class="n">3</span> Write a CLEAR case note</h4>' +
          (b.note.hint ? '<p class="dyn-note-hint">Hint: ' + esc(b.note.hint) + "</p>" : "") +
          '<textarea class="dyn-note-ta" data-note aria-label="Case note" placeholder="Write your CLEAR note…"></textarea>' +
          '<button class="btn btn-ghost" style="margin-top:8px" data-act="note-score">Score my note</button><div data-note-res></div></div>' +

        '<div class="dyn-sc-step"><h4><span class="n">4</span> Decide the next move</h4>' + decOpts +
          '<button class="btn btn-primary" style="margin-top:6px" data-act="finish">Submit scenario</button></div>' +

        '<div class="q-result" aria-live="polite"></div></div>';
    },
    wire: function (b, root) {
      var state = { pri: null, qPct: null, noteScore: null, dec: null };

      // priority
      root.querySelectorAll(".dyn-pri-btn").forEach(function (btn) {
        btn.addEventListener("click", function () {
          var lv = btn.getAttribute("data-lv");
          root.querySelectorAll(".dyn-pri-btn").forEach(function (x) { x.classList.remove("sel", "correct", "wrong"); });
          btn.classList.add("sel", lv === b.priority.correct ? "correct" : "wrong");
          if (lv !== b.priority.correct) {
            var c = root.querySelector('.dyn-pri-btn[data-lv="' + b.priority.correct + '"]'); if (c) c.classList.add("correct");
          }
          var why = root.querySelector("[data-pri-why]");
          why.hidden = false;
          why.innerHTML = (lv === b.priority.correct ? "✓ " : "A common answer is <b>" + b.priority.correct + "</b>. ") + esc(b.priority.why);
          state.pri = (lv === b.priority.correct);
        });
      });

      // questions
      root.querySelector('[data-act=q-check]').addEventListener("click", function () {
        var labels = root.querySelectorAll('.dyn-sc-step:nth-of-type(2) .dyn-pick-opt');
        // safer: select checkboxes within the questions step
        var step = root.querySelectorAll(".dyn-sc-step")[1];
        var opts = step.querySelectorAll(".dyn-pick-opt");
        var right = 0, total = b.questions.options.length;
        opts.forEach(function (lab, i) {
          var chosen = lab.querySelector("input").checked;
          var correct = !!b.questions.options[i].correct;
          lab.classList.remove("correct", "wrong");
          var old = step.querySelector('[data-qfb="' + i + '"]'); if (old) old.remove();
          if (chosen === correct) right++;
          if (chosen && correct) lab.classList.add("correct");
          else if (chosen && !correct) lab.classList.add("wrong");
          else if (!chosen && correct) lab.classList.add("wrong");
          if (chosen || correct) {
            var fb = document.createElement("div");
            fb.className = "dyn-pick-fb " + (correct ? "ok" : "no");
            fb.setAttribute("data-qfb", i);
            fb.textContent = b.questions.options[i].feedback || "";
            lab.insertAdjacentElement("afterend", fb);
          }
        });
        state.qPct = Math.round((right / total) * 100);
        step.querySelector("[data-q-res]").innerHTML = '<div class="dyn-pick-fb ' + (right === total ? "ok" : "no") +
          '">' + right + "/" + total + " correct.</div>";
      });

      // note
      root.querySelector('[data-act=note-score]').addEventListener("click", function () {
        var ta = root.querySelector("[data-note]");
        var result = Dyn.scoreText(ta.value, b.note.rubric || {});
        state.noteScore = result.score;
        root.querySelector("[data-note-res]").innerHTML = scorePanel(result, null);
      });

      // finish
      root.querySelector('[data-act=finish]').addEventListener("click", function () {
        var decInput = root.querySelector('input[name="' + b.id + '-dec"]:checked');
        if (!decInput) { announce("Choose your next move first."); return; }
        var di = +decInput.value;
        state.dec = !!b.decision.options[di].correct;

        var parts = [];
        parts.push(state.pri === null ? 0 : (state.pri ? 100 : 40));
        parts.push(state.qPct === null ? 0 : state.qPct);
        parts.push(state.noteScore === null ? 0 : state.noteScore);
        parts.push(state.dec ? 100 : 30);
        var overall = Math.round(parts.reduce(function (a, x) { return a + x; }, 0) / parts.length);

        Dyn.recordScenario(b.id, overall, b.decision.options[di].label, "Scenario: " + b.title);

        var decMsg = state.dec ? "✓ Good call. " : "The stronger move here: ";
        var res = root.querySelector(".q-result");
        var cls = overall >= 80 ? "pass" : overall >= 50 ? "partial" : "fail";
        res.innerHTML = '<div class="dyn-scorepanel ' + cls + '">' +
          '<div class="dyn-score-head">Scenario score: ' + overall + '%</div>' +
          '<ul class="dyn-fb-list">' +
            '<li class="' + (state.pri ? "good" : "miss") + '">Priority: ' + (state.pri ? "matched the model" : "review the reasoning above") + "</li>" +
            '<li class="' + (state.qPct >= 67 ? "good" : "miss") + '">Questions: ' + (state.qPct === null ? "not checked" : state.qPct + "% relevant") + "</li>" +
            '<li class="' + (state.noteScore >= 60 ? "good" : "miss") + '">Case note: ' + (state.noteScore === null ? "not scored" : state.noteScore + "%") + "</li>" +
            '<li class="' + (state.dec ? "good" : "miss") + '">' + decMsg + esc(b.decision.why) + "</li>" +
          "</ul></div>";
        announce("Scenario scored " + overall + " percent.");
        markBlockDone(b, root, "Scenario: " + b.title);
      });
    }
  };

  /* ---- final result + certificate gate ---- */
  TYPES.final = {
    render: function (b) {
      return '<div class="dyn-block" data-block="' + b.id + '"><span class="act-tag">Result</span>' +
        '<h3 class="act-title">' + esc(b.title) + '</h3><div data-final-body></div>' +
        '<button class="btn btn-primary" data-act="refresh">Check my result</button></div>';
    },
    wire: function (b, root) {
      function draw() {
        var final = Dyn.load().finalScore;
        var prog = Dyn.progress();
        var body = root.querySelector("[data-final-body]");
        var passed = final !== null && final >= b.passMark;
        var courseDone = prog.pct === 100;
        var html = "";
        if (final === null) {
          html = '<p class="act-instr">Take the 20-question exam above, then check your result here.</p>';
        } else {
          html = '<div class="dyn-scorepanel ' + (passed ? "pass" : "fail") + '">' +
            '<div class="dyn-score-head">Final exam: ' + final + "% (pass mark " + b.passMark + "%)</div>" +
            "<p>" + (passed ? "You passed the exam. " : "Not yet — review the modules and retake the exam. ") +
            "Course activities completed: " + prog.pct + "% (" + prog.modulesComplete + "/" + prog.modulesTotal + " modules).</p></div>";
          if (passed && courseDone) {
            Dyn.markCourseComplete();
            html += '<p style="margin-top:14px" class="act-instr">🎉 You’ve met the requirements. Your certificate is on the ' +
              '<a href="dynamics.html">course dashboard</a>.</p>';
          } else if (passed && !courseDone) {
            html += '<p style="margin-top:14px" class="act-instr">Exam passed. Finish the remaining module activities (' +
              prog.pct + '% done) to unlock your certificate on the dashboard.</p>';
          }
        }
        body.innerHTML = html;
      }
      root.querySelector('[data-act=refresh]').addEventListener("click", draw);
      draw();
    }
  };

  /* ---- sim embed ---- */
  TYPES.sim = {
    render: function () {
      return '<div class="dyn-block prose-block"><p class="act-instr">Practise freely in the interactive ' +
        '<a href="dynamics-sim.html">Dynamics simulator sandbox →</a></p></div>';
    }
  };

  /* =====================================================================
     MODULE RENDER + PROGRESS + NAV
     ===================================================================== */
  var currentModule;

  function renderModule(mod) {
    currentModule = mod;
    var host = document.getElementById("lesson");
    if (!host) return;

    // locked guard
    var state = Dyn.progress().moduleState[mod.id];
    if (state && !state.unlocked) {
      host.innerHTML = '<div class="dyn-cert-locked"><h2>🔒 Module locked</h2>' +
        '<p>Finish the previous module to unlock <b>' + esc(mod.title) + '</b>.</p>' +
        '<a class="btn btn-primary" href="dynamics.html">Back to course dashboard</a></div>';
      document.title = "Locked — " + mod.title;
      return;
    }

    var idx = COURSE.modules.indexOf(mod);
    document.title = "M" + mod.num + " · " + mod.title + " — Dynamics 365 course";

    var head =
      '<div class="dyn-lesson-head"><div>' +
        '<a class="dyn-crumb" href="dynamics.html">← Course dashboard</a>' +
        '<div class="l-num">Module ' + mod.num + " of " + COURSE.modules.length + "</div>" +
        "<h1>" + mod.icon + " " + esc(mod.title) + "</h1>" +
        '<p class="muted">' + esc(mod.summary) + "</p>" +
      "</div></div>" +
      '<div class="dyn-lesson-progress"><div class="dyn-steps" id="dyn-steps"></div><div class="dyn-step-count" id="dyn-step-count"></div></div>';

    var blocksHtml = mod.blocks.map(function (b) {
      var type = TYPES[b.t];
      if (!type) return "";
      return type.render(b);
    }).join("");

    // module nav
    var prev = COURSE.modules[idx - 1], next = COURSE.modules[idx + 1];
    var nav = '<div class="dyn-lessonnav">' +
      (prev ? '<a class="btn btn-ghost" href="#' + prev.id + '">← M' + prev.num + "</a>" : "<span></span>") +
      (next ? '<a class="btn btn-primary" href="#' + next.id + '" id="dyn-next">M' + next.num + " · " + esc(next.title) + " →</a>"
            : '<a class="btn btn-primary" href="dynamics.html">Finish → dashboard</a>') +
      "</div>";

    host.innerHTML = head + blocksHtml + nav;

    // wire interactive blocks
    var containers = host.querySelectorAll("[data-block]");
    mod.blocks.forEach(function (b) {
      if (!b.id) return;
      var type = TYPES[b.t]; if (!type || !type.wire) return;
      var c = host.querySelector('[data-block="' + b.id + '"]');
      if (c) {
        type.wire(b, c);
        if (Dyn.isLessonDone(b.id)) flagAlreadyDone(c);
      }
    });

    refreshProgress();
    window.scrollTo(0, 0);
  }

  function flagAlreadyDone(container) {
    var t = container.querySelector(".act-title");
    if (t && !container.querySelector(".act-done-flag")) {
      t.insertAdjacentHTML("beforeend", ' <span class="act-done-flag">✓ done</span>');
    }
  }

  function trackableBlocks(mod) {
    return mod.blocks.filter(function (b) { return window.DynLogic.isTrackable(b); });
  }

  function refreshProgress() {
    if (!currentModule) return;
    var tb = trackableBlocks(currentModule);
    var done = tb.filter(function (b) { return Dyn.isLessonDone(b.id); }).length;
    var steps = document.getElementById("dyn-steps");
    var count = document.getElementById("dyn-step-count");
    if (steps) {
      steps.innerHTML = tb.map(function (b) {
        return '<span class="dyn-step-dot' + (Dyn.isLessonDone(b.id) ? " done" : "") + '"></span>';
      }).join("");
    }
    if (count) count.textContent = done + " of " + tb.length + " activities complete in this module";
  }

  var celebrated = {};
  function maybeCompleteModule() {
    if (!currentModule) return;
    var tb = trackableBlocks(currentModule);
    var allDone = tb.length > 0 && tb.every(function (b) { return Dyn.isLessonDone(b.id); });
    if (allDone && !celebrated[currentModule.id] && !Dyn.hasBadge(currentModule.badge.id)) {
      celebrated[currentModule.id] = true;
      var newly = Dyn.awardBadge(currentModule.badge.id, currentModule.badge.label);
      if (newly) {
        confetti();
        var host = document.getElementById("lesson");
        var banner = el('<div class="dyn-scorepanel pass" role="status" style="margin-top:20px">' +
          '<div class="dyn-score-head">' + currentModule.badge.icon + " Module complete — badge earned: " + esc(currentModule.badge.label) + "!</div>" +
          '<p>Nice work. Your progress is saved. Move on when you’re ready.</p></div>');
        var nav = host.querySelector(".dyn-lessonnav");
        if (nav) host.insertBefore(banner, nav);
        announce("Module complete. Badge earned: " + currentModule.badge.label);
      }
    } else if (allDone) {
      celebrated[currentModule.id] = true;
    }
  }

  /* ---------- boot + hash routing ---------- */
  function route() {
    var mod = findModule(moduleIdFromUrl());
    celebrated = {};
    renderModule(mod);
  }

  document.addEventListener("DOMContentLoaded", function () {
    if (!document.getElementById("lesson")) return;
    live = el('<div class="sr-only" aria-live="polite" style="position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0)"></div>');
    document.body.appendChild(live);
    route();
    window.addEventListener("hashchange", route);
  });
})();
