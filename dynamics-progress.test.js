/* =====================================================================
   Tests for the pure course logic (scoreText + courseProgress).
   Dependency-free — run with:  node dynamics-progress.test.js
   Exits non-zero if any assertion fails.
   ===================================================================== */
var L = require("./dynamics-progress.js");

var pass = 0, fail = 0;
function check(name, cond) {
  if (cond) { pass++; console.log("  ok   " + name); }
  else { fail++; console.error("  FAIL " + name); }
}
function approx(name, got, want) {
  check(name + " (got " + got + ", want " + want + ")", got === want);
}

console.log("scoreText:");

/* empty answer against a 3-point rubric → 0 and all missing */
(function () {
  var r = L.scoreText("", { required: ["alpha", "beta", "gamma"] });
  approx("empty scores 0", r.score, 0);
  check("empty lists 3 misses", r.misses.length === 3);
})();

/* full match → 100 */
(function () {
  var r = L.scoreText("alpha beta gamma present", { required: ["alpha", "beta", "gamma"] });
  approx("all keywords → 100", r.score, 100);
  check("no misses", r.misses.length === 0);
})();

/* partial (2 of 4) → 50 */
(function () {
  var r = L.scoreText("alpha and beta only", { required: ["alpha", "beta", "gamma", "delta"] });
  approx("2 of 4 → 50", r.score, 50);
})();

/* variants array matches any spelling */
(function () {
  var r = L.scoreText("the user cannot log in", {
    required: [{ label: "sign-in issue", any: ["sign in", "sign-in", "log in", "login"] }]
  });
  approx("variant 'log in' matches", r.score, 100);
})();

/* minWords gate caps a short answer at 40 even if keywords present */
(function () {
  var r = L.scoreText("alpha beta gamma", { required: ["alpha", "beta", "gamma"], minWords: 20 });
  check("too-short flagged", r.tooShort === true);
  check("short answer capped at <=40", r.score <= 40);
})();

/* forbidden security terms hard-cap at 30 and flag a violation */
(function () {
  var r = L.scoreText("user's password is hunter2 and it works", {
    required: [{ label: "issue", any: ["password"] }],
    forbidden: [{ label: "passwords", any: ["password is"] }]
  });
  check("violation detected", r.violations.length === 1);
  check("security answer capped at <=30", r.score <= 30);
  check("security feedback present", r.feedback.some(function (f) { return f.kind === "security"; }));
})();

/* bonus lifts score but never exceeds 100 */
(function () {
  var r = L.scoreText("alpha beta gamma extra1 extra2", {
    required: ["alpha", "beta", "gamma"],
    bonus: ["extra1", "extra2"]
  });
  check("bonus capped at 100", r.score === 100);
  check("bonus hits recorded", r.bonusHits.length === 2);
})();

console.log("courseProgress:");

var fakeCourse = {
  modules: [
    { id: "m1", blocks: [ { t: "prose" }, { t: "quiz", id: "m1q" }, { t: "match", id: "m1m" } ] }, // 2 trackable
    { id: "m2", blocks: [ { t: "quiz", id: "m2q" }, { t: "callout" } ] },                          // 1 trackable
    { id: "m3", blocks: [ { t: "note", id: "m3n" } ] }                                             // 1 trackable
  ]
};

(function () {
  var p = L.courseProgress({ lessonsDone: {} }, fakeCourse);
  approx("empty progress 0%", p.pct, 0);
  approx("modules total", p.modulesTotal, 3);
  approx("modules complete 0", p.modulesComplete, 0);
  check("m1 unlocked", p.moduleState.m1.unlocked === true);
  check("m2 locked when m1 incomplete", p.moduleState.m2.unlocked === false);
})();

(function () {
  // finish all of m1 → m1 complete, m2 unlocks
  var p = L.courseProgress({ lessonsDone: { m1q: 1, m1m: 1 } }, fakeCourse);
  check("m1 complete", p.moduleState.m1.complete === true);
  check("m2 unlocks after m1", p.moduleState.m2.unlocked === true);
  check("m3 still locked", p.moduleState.m3.unlocked === false);
  approx("2 of 4 blocks → 50%", p.pct, 50);
})();

(function () {
  var p = L.courseProgress({ lessonsDone: { m1q: 1, m1m: 1, m2q: 1, m3n: 1 } }, fakeCourse);
  approx("all done → 100%", p.pct, 100);
  approx("all modules complete", p.modulesComplete, 3);
})();

console.log("\nisTrackable:");
check("prose not trackable", L.isTrackable({ t: "prose", id: "x" }) === false);
check("callout not trackable", L.isTrackable({ t: "callout", id: "x" }) === false);
check("sim not trackable", L.isTrackable({ t: "sim", id: "x" }) === false);
check("quiz trackable", L.isTrackable({ t: "quiz", id: "x" }) === true);
check("block without id not trackable", L.isTrackable({ t: "quiz" }) === false);

console.log("\n" + pass + " passed, " + fail + " failed.");
process.exit(fail ? 1 : 0);
