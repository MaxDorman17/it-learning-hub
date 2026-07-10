/* =====================================================================
   Dynamics 365 course — progress + scoring layer
   Namespaced store (key: ithub.dynamics.v1) exposed as window.Hub.Dynamics.
   Kept separate from the site's main progress (ithub.progress.v1) so the
   existing L1/MD-102 progress is never touched.

   Also exports two PURE, side-effect-free functions used by the lesson
   engine AND by the Node test (dynamics-progress.test.js):
     - scoreText(text, rubric)  → keyword scoring for free-text answers
     - courseProgress(store, course) → overall % + module completion
   Both are attached to window.DynLogic (browser) and module.exports (node).
   ===================================================================== */
(function (root) {
  "use strict";

  /* ---------------------------------------------------------------
     PURE LOGIC (unit-tested)
     --------------------------------------------------------------- */

  /* Normalise text for keyword matching: lowercase, collapse whitespace. */
  function norm(s) {
    return String(s == null ? "" : s).toLowerCase().replace(/\s+/g, " ").trim();
  }

  /* Does the haystack contain ANY spelling in `variants` (array or string)? */
  function hasAny(hay, variants) {
    var list = Array.isArray(variants) ? variants : [variants];
    for (var i = 0; i < list.length; i++) {
      if (hay.indexOf(norm(list[i])) !== -1) return true;
    }
    return false;
  }

  /* Word count of a free-text answer. */
  function wordCount(s) {
    var t = norm(s);
    return t ? t.split(" ").length : 0;
  }

  /*
     scoreText — grade a free-text answer against a rubric.
     rubric = {
       required: [ {label, any:[...spellings]} | "keyword" ],  // each worth a point
       bonus:    [ ... ],                                       // extra credit
       forbidden:[ {label, any:[...]} ],                        // security violations → penalty + flag
       minWords: number                                         // effort gate
     }
     Returns { score 0..100, hits[], misses[], bonusHits[], violations[], feedback[] }.
  */
  function scoreText(text, rubric) {
    rubric = rubric || {};
    var hay = norm(text);
    var required = rubric.required || [];
    var bonus = rubric.bonus || [];
    var forbidden = rubric.forbidden || [];
    var minWords = rubric.minWords || 0;

    var hits = [], misses = [], bonusHits = [], violations = [];

    function item(x) { return typeof x === "string" ? { label: x, any: [x] } : x; }

    required.forEach(function (r) {
      r = item(r);
      (hasAny(hay, r.any) ? hits : misses).push(r.label);
    });
    bonus.forEach(function (b) {
      b = item(b);
      if (hasAny(hay, b.any)) bonusHits.push(b.label);
    });
    forbidden.forEach(function (f) {
      f = item(f);
      if (hasAny(hay, f.any)) violations.push(f.label);
    });

    var reqTotal = required.length || 1;
    var base = Math.round((hits.length / reqTotal) * 100);

    // bonus lifts the score a little, capped at 100
    var withBonus = Math.min(100, base + bonusHits.length * 5);

    // effort gate: too short can't score full marks
    var tooShort = minWords > 0 && wordCount(text) < minWords;
    if (tooShort) withBonus = Math.min(withBonus, 40);

    // security violations are serious — hard cap + clear flag
    if (violations.length) withBonus = Math.min(withBonus, 30);

    var feedback = [];
    if (violations.length) {
      feedback.push({
        kind: "security",
        text: "Security issue: never record " + violations.join(", ") +
          " in a case. Remove it and follow your identity-verification policy."
      });
    }
    if (tooShort) {
      feedback.push({ kind: "warn", text: "Add more detail — a good note usually needs at least " + minWords + " words." });
    }
    hits.forEach(function (h) { feedback.push({ kind: "good", text: "Included: " + h }); });
    misses.forEach(function (m) { feedback.push({ kind: "miss", text: "Missing: " + m }); });
    bonusHits.forEach(function (b) { feedback.push({ kind: "bonus", text: "Nice extra: " + b }); });

    return {
      score: withBonus,
      hits: hits, misses: misses, bonusHits: bonusHits,
      violations: violations, feedback: feedback,
      tooShort: tooShort
    };
  }

  /*
     courseProgress — compute completion from a store + the course definition.
     A module is "complete" when every one of its trackable blocks is done.
     Returns { pct, modulesComplete, modulesTotal, moduleState:{id:{done,total,complete,unlocked}} }.
     Modules unlock sequentially: m1 always open; mN opens when m(N-1) complete.
  */
  function courseProgress(store, course) {
    store = store || {};
    var done = store.lessonsDone || {};
    var mods = (course && course.modules) || [];
    var moduleState = {};
    var totalBlocks = 0, totalDone = 0, modulesComplete = 0;
    var prevComplete = true; // gate for sequential unlock

    mods.forEach(function (m) {
      var trackable = (m.blocks || []).filter(function (b) { return isTrackable(b); });
      var d = 0;
      trackable.forEach(function (b) { if (done[b.id]) d++; });
      var complete = trackable.length > 0 && d === trackable.length;
      moduleState[m.id] = {
        done: d, total: trackable.length,
        complete: complete,
        unlocked: prevComplete
      };
      totalBlocks += trackable.length;
      totalDone += d;
      if (complete) modulesComplete++;
      prevComplete = complete; // next module needs this one done
    });

    return {
      pct: totalBlocks ? Math.round((totalDone / totalBlocks) * 100) : 0,
      modulesComplete: modulesComplete,
      modulesTotal: mods.length,
      moduleState: moduleState
    };
  }

  /* A block counts toward progress if it has an id and is interactive/content. */
  function isTrackable(b) {
    return !!(b && b.id && b.t !== "prose" && b.t !== "callout" && b.t !== "sim");
  }

  var Logic = {
    norm: norm, hasAny: hasAny, wordCount: wordCount,
    scoreText: scoreText, courseProgress: courseProgress, isTrackable: isTrackable
  };

  /* ---------------------------------------------------------------
     BROWSER STORE (localStorage) — skipped under Node
     --------------------------------------------------------------- */
  if (typeof window !== "undefined" && typeof localStorage !== "undefined") {
    var KEY = "ithub.dynamics.v1";

    function defaults() {
      return {
        lessonsDone: {},   // blockId -> ts
        quizScores: {},    // blockId -> best %
        notes: {},         // blockId -> last free-text answer
        scenarios: {},     // scenarioId -> { score, decision }
        ticketsDone: {},   // ticketId -> ts (Ticket Lab)
        finalScore: null,  // best final-assessment %
        completedAt: null, // ISO date when course first passed
        xp: 0,
        badges: {},        // badgeId -> ts
        streak: { last: null, count: 0 },
        activity: []       // [{ t, label }] recent, newest first, capped
      };
    }

    var Dynamics = {
      _data: null,
      _course: null,
      setCourse: function (c) { this._course = c; return this; },
      load: function () {
        if (this._data) return this._data;
        try { this._data = JSON.parse(localStorage.getItem(KEY)) || defaults(); }
        catch (e) { this._data = defaults(); }
        var d = defaults();
        for (var k in d) if (!(k in this._data)) this._data[k] = d[k];
        return this._data;
      },
      save: function () {
        try { localStorage.setItem(KEY, JSON.stringify(this._data)); } catch (e) {}
        return this;
      },

      /* --- activity + streak --- */
      _logActivity: function (label) {
        var d = this.load();
        d.activity.unshift({ t: Date.now(), label: label });
        d.activity = d.activity.slice(0, 12);
      },
      touchStreak: function () {
        var d = this.load();
        var today = new Date().toISOString().slice(0, 10);
        var last = d.streak.last;
        if (last === today) return d.streak.count;
        var yesterday = new Date(Date.now() - 864e5).toISOString().slice(0, 10);
        d.streak.count = (last === yesterday) ? (d.streak.count + 1) : 1;
        d.streak.last = today;
        this.save();
        return d.streak.count;
      },

      /* --- XP + badges --- */
      addXp: function (n) { var d = this.load(); d.xp += n; this.save(); return d.xp; },
      awardBadge: function (id, label) {
        var d = this.load();
        if (d.badges[id]) return false;       // already earned
        d.badges[id] = Date.now();
        this.addXp(50);
        this._logActivity("🏅 Earned badge: " + (label || id));
        this.save();
        return true;                          // newly earned (caller may celebrate)
      },
      hasBadge: function (id) { return !!this.load().badges[id]; },

      /* --- lesson / activity completion --- */
      markLesson: function (blockId, label) {
        var d = this.load();
        if (!d.lessonsDone[blockId]) {
          d.lessonsDone[blockId] = Date.now();
          this.addXp(10);
          if (label) this._logActivity("✓ " + label);
        }
        this.touchStreak();
        this.save();
      },
      isLessonDone: function (blockId) { return !!this.load().lessonsDone[blockId]; },

      recordQuiz: function (blockId, pct, label) {
        var d = this.load();
        var prev = d.quizScores[blockId];
        if (prev === undefined || pct > prev) d.quizScores[blockId] = pct;
        this.markLesson(blockId, label);      // completing the check counts as done
        this.save();
        return d.quizScores[blockId];
      },
      quizScore: function (blockId) { return this.load().quizScores[blockId]; },

      saveNote: function (blockId, text) { this.load().notes[blockId] = text; this.save(); },
      getNote: function (blockId) { return this.load().notes[blockId] || ""; },

      recordScenario: function (id, score, decision, label) {
        var d = this.load();
        var prev = d.scenarios[id];
        if (!prev || score > prev.score) d.scenarios[id] = { score: score, decision: decision };
        this.markLesson(id, label);
        this.save();
      },
      scenario: function (id) { return this.load().scenarios[id]; },

      /* --- Ticket Lab --- */
      markTicket: function (id, label) {
        var d = this.load();
        if (!d.ticketsDone[id]) {
          d.ticketsDone[id] = Date.now();
          this.addXp(5);
          this._logActivity("🎫 Worked ticket " + id + (label ? " — " + label : ""));
        }
        this.touchStreak();
        this.save();
      },
      unmarkTicket: function (id) { var d = this.load(); delete d.ticketsDone[id]; this.save(); },
      isTicketDone: function (id) { return !!this.load().ticketsDone[id]; },
      ticketsWorked: function () { return Object.keys(this.load().ticketsDone).length; },

      recordFinal: function (pct) {
        var d = this.load();
        if (d.finalScore === null || pct > d.finalScore) d.finalScore = pct;
        this.save();
        return d.finalScore;
      },
      markCourseComplete: function () {
        var d = this.load();
        if (!d.completedAt) {
          d.completedAt = new Date().toISOString();
          this._logActivity("🎓 Completed the course");
        }
        this.save();
        return d.completedAt;
      },

      /* --- derived --- */
      progress: function () { return courseProgress(this.load(), this._course); },
      scoreText: scoreText,

      reset: function () { this._data = defaults(); this.save(); }
    };

    root.Hub = root.Hub || {};
    root.Hub.Dynamics = Dynamics;
    root.DynLogic = Logic;
  }

  /* Node export for tests */
  if (typeof module !== "undefined" && module.exports) {
    module.exports = Logic;
  }
})(typeof window !== "undefined" ? window : this);
