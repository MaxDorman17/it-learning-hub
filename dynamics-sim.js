/* =====================================================================
   Dynamics 365 course — CRM simulator (dynamics-sim.html + embeds)
   A simplified, FICTIONAL Customer Service-style interface. Not a copy of
   Microsoft branding. All organisations, people and emails are invented.

   In-memory sandbox: assign / escalate / resolve / add-note mutate a local
   copy and re-render. Nothing here writes real data anywhere.
   ===================================================================== */
(function () {
  "use strict";

  var Dyn = window.Hub && window.Hub.Dynamics;

  /* ---------- fictional dataset ---------- */
  var QUEUES = ["First Line Support", "Second Line Support", "Microsoft 365", "Networking", "Security", "Hardware", "New Starters & Leavers"];

  var KB = [
    { id: "KB-204", title: "Outlook desktop can't connect (webmail OK) — client checks", tag: "email" },
    { id: "KB-311", title: "Account keeps re-locking after unlock — find the caching device", tag: "identity" },
    { id: "KB-118", title: "Printer jobs stuck in queue on shared printers", tag: "print" },
    { id: "KB-402", title: "VPN certificate expired — renew/replace procedure", tag: "vpn" },
    { id: "KB-155", title: "New starter setup checklist", tag: "onboarding" },
    { id: "KB-090", title: "Message trace: proving delivered / blocked / quarantined", tag: "email" }
  ];

  function seed() {
    return [
      { num: "MN-1042", title: "Reception scanner won't scan to email", org: "Harbour Dental", contact: "Ruth Bell",
        email: "ruth.bell@harbourdental.example", queue: "Hardware", owner: "(unassigned)", status: "Active", reason: "In Progress",
        priority: "normal", sla: "On track", kb: ["print"],
        desc: "The reception scanner completes a scan but the 'scan to email' never arrives. Started yesterday. One device.",
        timeline: [
          { t: "Case created from portal", when: "Yesterday 15:04", kind: "note" },
          { t: "Confirmed scanner powers on and scans to USB", when: "Yesterday 15:40", kind: "note" }
        ], related: ["MN-1039"] },

      { num: "MN-1039", title: "Till printer offline", org: "Northstar Retail", contact: "Sam Doyle",
        email: "sam.doyle@northstar.example", queue: "Hardware", owner: "You", status: "Active", reason: "In Progress",
        priority: "normal", sla: "On track", kb: ["print"],
        desc: "Till receipt printer PRN-TILL-01 shows offline again. Third time this month.",
        timeline: [ { t: "Cleared queue, printed test — OK", when: "Today 09:12", kind: "note" } ], related: ["MN-1042"] },

      { num: "MN-1044", title: "VPN certificate warning for remote users", org: "Guardian Risk Ltd", contact: "Aziz Khan",
        email: "aziz.khan@guardianrisk.example", queue: "Networking", owner: "(unassigned)", status: "Active", reason: "Researching",
        priority: "high", sla: "Due in 40 min", kb: ["vpn"],
        desc: "Several remote users get a 'certificate expired' warning connecting to VPN since 09:00. Webmail still works.",
        timeline: [
          { t: "Case created — 6 users report the same", when: "Today 09:10", kind: "note" },
          { t: "Confirmed office users unaffected", when: "Today 09:25", kind: "note" }
        ], related: [] },

      { num: "MN-1050", title: "Suspicious MFA prompts not initiated by user", org: "Caledonia Legal", contact: "Ellie Grant",
        email: "ellie.grant@caledonialegal.example", queue: "Security", owner: "(unassigned)", status: "Active", reason: "Investigating",
        priority: "critical", sla: "Due in 15 min", kb: ["identity"],
        desc: "User reports repeated MFA approval prompts they did not start. Possible account compromise.",
        timeline: [ { t: "Flagged by team lead as possible incident", when: "Today 10:15", kind: "note" } ], related: [] },

      { num: "MN-1041", title: "New starter account + kit for Monday", org: "MaxNova Tech", contact: "Nadia Rees (HR)",
        email: "hr@maxnova.example", queue: "New Starters & Leavers", owner: "You", status: "Active", reason: "In Progress",
        priority: "normal", sla: "Due in 3 days", kb: ["onboarding"],
        desc: "New employee starts Monday. Needs account, licence, email, group access and a laptop.",
        timeline: [ { t: "Requested role/department from HR", when: "Today 08:50", kind: "note" } ], related: [] },

      { num: "MN-1043", title: "Outlook desktop disconnecting; webmail fine", org: "Bright Roots Learning", contact: "Morgan Lee",
        email: "morgan.lee@brightroots.example", queue: "Microsoft 365", owner: "(unassigned)", status: "Active", reason: "In Progress",
        priority: "normal", sla: "On track", kb: ["email"],
        desc: "Outlook desktop shows 'Disconnected' several times a day. Outlook on the web is fine. One user, new laptop.",
        timeline: [ { t: "Confirmed webmail works", when: "Today 11:02", kind: "note" } ], related: [] }
    ];
  }

  var cases, current, activeQueue, view, search, mount, toastTimer;

  function esc(s) { return String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"); }
  function priBadge(p) {
    var lbl = { low: "Low", normal: "Normal", high: "High", critical: "Critical" }[p] || p;
    return '<span class="badge-priority pri-' + p + '">' + lbl + "</span>";
  }
  function toast(msg) {
    var t = document.getElementById("crm-toast");
    if (!t) { t = document.createElement("div"); t.id = "crm-toast"; t.className = "crm-toast"; document.body.appendChild(t); }
    t.textContent = msg; t.style.display = "block";
    clearTimeout(toastTimer); toastTimer = setTimeout(function () { t.style.display = "none"; }, 2200);
  }

  function filtered() {
    return cases.filter(function (c) {
      if (activeQueue !== "All queues" && c.queue !== activeQueue) return false;
      if (view === "My Active Cases" && c.owner !== "You") return false;
      if (view === "Resolved" && c.status !== "Resolved") return false;
      if (view !== "Resolved" && c.status === "Resolved") return false;
      if (search) {
        var hay = (c.num + " " + c.org + " " + c.contact + " " + c.title).toLowerCase();
        if (hay.indexOf(search.toLowerCase()) === -1) return false;
      }
      return true;
    });
  }

  function renderList() {
    var rows = filtered().map(function (c) {
      return '<div class="crm-row" data-num="' + c.num + '"><span class="cnum">' + c.num + "</span>" +
        "<span><b>" + esc(c.title) + "</b><br><span class='muted' style='font-size:12px'>" + esc(c.org) + " · " + esc(c.contact) + "</span></span>" +
        "<span>" + priBadge(c.priority) + "</span>" +
        "<span class='c-owner muted' style='font-size:12.5px'>" + esc(c.owner) + "</span></div>";
    }).join("");
    if (!rows) rows = '<div class="crm-empty">No cases match this queue/view/search.<br><span class="muted">Tip: “My Active Cases” only shows cases you own — try “All Open Cases”.</span></div>';

    var qOpts = ["All queues"].concat(QUEUES).map(function (q) {
      return '<option' + (q === activeQueue ? " selected" : "") + ">" + esc(q) + "</option>";
    }).join("");
    var vOpts = ["All Open Cases", "My Active Cases", "Resolved"].map(function (v) {
      return '<option' + (v === view ? " selected" : "") + ">" + esc(v) + "</option>";
    }).join("");

    return '<div class="crm-toolbar">' +
        '<label class="crm-field"><span class="k">Queue</span><select class="crm-queue-sel" data-queue>' + qOpts + "</select></label>" +
        '<label class="crm-field"><span class="k">View</span><select class="crm-view-sel" data-view>' + vOpts + "</select></label>" +
      "</div>" +
      '<div class="crm-list"><div class="crm-row head"><span>Case</span><span>Title</span><span>Priority</span><span class="c-owner">Owner</span></div>' +
      rows + "</div>";
  }

  function renderDash() {
    var open = cases.filter(function (c) { return c.status !== "Resolved"; });
    var mine = open.filter(function (c) { return c.owner === "You"; });
    var crit = open.filter(function (c) { return c.priority === "critical" || c.priority === "high"; });
    var res = cases.filter(function (c) { return c.status === "Resolved"; });
    return '<div class="crm-dash-tiles">' +
      tile(open.length, "Open cases") + tile(mine.length, "My active") +
      tile(crit.length, "High / Critical") + tile(res.length, "Resolved") + "</div>" +
      '<p class="muted" style="font-size:13.5px">This is a practice sandbox. Open <b>Cases</b> to work a case: assign it to yourself, add a note, escalate or resolve. Everything is fictional and resets on reload.</p>';
  }
  function tile(n, l) { return '<div class="crm-tile"><div class="n">' + n + '</div><div class="l">' + esc(l) + "</div></div>"; }

  function renderKnowledge() {
    return '<h4 style="margin-top:0">Knowledge base (fictional)</h4><div class="crm-kb">' +
      KB.map(function (k) { return '<div class="crm-kb-item"><b>' + k.id + "</b> — " + esc(k.title) + "</div>"; }).join("") + "</div>";
  }

  function renderRecord(c) {
    var kbItems = KB.filter(function (k) { return c.kb.indexOf(k.tag) !== -1; });
    var timeline = c.timeline.map(function (a) {
      return "<li><div>" + esc(a.t) + '</div><div class="t-when">' + esc(a.when) + "</div></li>";
    }).join("");
    var related = c.related.length ? c.related.map(function (r) {
      return '<a href="#" data-open="' + r + '">' + r + " →</a>";
    }).join("") : '<span class="muted" style="font-size:13px">None</span>';
    var kbHtml = kbItems.length ? kbItems.map(function (k) {
      return '<div class="crm-kb-item"><b>' + k.id + "</b> — " + esc(k.title) + "</div>";
    }).join("") : '<div class="crm-kb-item muted">No suggested articles</div>';

    return '<button class="btn btn-ghost crm-back" data-act="back">← Case list</button>' +
      '<div class="crm-record"><div>' +
        '<div class="crm-form-h"><span class="cnum">' + c.num + "</span><h3>" + esc(c.title) + "</h3>" + priBadge(c.priority) + "</div>" +
        '<div class="crm-fields">' +
          field("Customer (account)", c.org) + field("Contact", c.contact + " · " + c.email) +
          field("Owner", c.owner) + field("Queue", c.queue) +
          field("Status", c.status) + field("Status reason", c.reason) +
          field("Priority", c.priority) + field("SLA", c.sla) +
          '<div class="crm-desc"><b>Description:</b> ' + esc(c.desc) + "</div>" +
        "</div>" +
        '<div class="crm-cmd" style="margin-top:14px">' +
          '<button data-act="assign"' + (c.owner === "You" ? " disabled" : "") + '>Assign to me</button>' +
          '<button data-act="escalate">Escalate…</button>' +
          '<button class="primary" data-act="resolve"' + (c.status === "Resolved" ? " disabled" : "") + '>Resolve</button>' +
        "</div>" +
        '<h4 style="margin:18px 0 6px">Add an internal note</h4>' +
        '<textarea class="crm-note-add" data-note placeholder="Write a CLEAR note…"></textarea>' +
        '<button class="btn btn-ghost" style="margin-top:8px" data-act="addnote">Add note to timeline</button>' +
      "</div>" +
      '<div class="crm-side">' +
        "<h4>Timeline</h4><ul class='crm-timeline'>" + timeline + "</ul>" +
        "<h4>Suggested knowledge</h4><div class='crm-kb'>" + kbHtml + "</div>" +
        "<h4 style='margin-top:14px'>Related cases</h4><div class='crm-related'>" + related + "</div>" +
      "</div></div>";
  }
  function field(k, v) { return '<div class="crm-field"><div class="k">' + esc(k) + '</div><div class="v">' + esc(v) + "</div></div>"; }

  var page = "cases";
  function render() {
    var content = mount.querySelector(".crm-content");
    var nav = mount.querySelectorAll(".crm-nav button");
    nav.forEach(function (b) { b.classList.toggle("on", b.getAttribute("data-page") === page); });

    if (current) { content.innerHTML = renderRecord(current); wireRecord(content); return; }
    if (page === "dashboard") content.innerHTML = renderDash();
    else if (page === "knowledge") content.innerHTML = renderKnowledge();
    else { content.innerHTML = renderList(); wireList(content); }
  }

  function wireList(content) {
    var q = content.querySelector("[data-queue]"); if (q) q.addEventListener("change", function () { activeQueue = q.value; render(); });
    var v = content.querySelector("[data-view]"); if (v) v.addEventListener("change", function () { view = v.value; render(); });
    content.querySelectorAll(".crm-row[data-num]").forEach(function (row) {
      row.addEventListener("click", function () {
        current = cases.filter(function (c) { return c.num === row.getAttribute("data-num"); })[0];
        render();
      });
    });
  }

  function wireRecord(content) {
    content.querySelector('[data-act=back]').addEventListener("click", function () { current = null; render(); });
    content.querySelectorAll("[data-open]").forEach(function (a) {
      a.addEventListener("click", function (e) {
        e.preventDefault();
        var r = cases.filter(function (c) { return c.num === a.getAttribute("data-open"); })[0];
        if (r) { current = r; render(); }
      });
    });
    var assign = content.querySelector('[data-act=assign]');
    if (assign) assign.addEventListener("click", function () {
      current.owner = "You"; current.timeline.unshift({ t: "Assigned to You", when: "Now", kind: "note" });
      toast("Case " + current.num + " assigned to you"); render();
    });
    content.querySelector('[data-act=escalate]').addEventListener("click", function () {
      var target = prompt("Escalate / route " + current.num + " to which queue?\n\n" + QUEUES.join("\n"), "Second Line Support");
      if (!target) return;
      current.queue = target; current.owner = "(unassigned)";
      current.timeline.unshift({ t: "Routed to " + target, when: "Now", kind: "note" });
      toast("Routed to " + target); render();
    });
    var resolve = content.querySelector('[data-act=resolve]');
    if (resolve) resolve.addEventListener("click", function () {
      current.status = "Resolved"; current.reason = "Problem Solved";
      current.timeline.unshift({ t: "Case resolved", when: "Now", kind: "note" });
      toast(current.num + " resolved"); render();
    });
    content.querySelector('[data-act=addnote]').addEventListener("click", function () {
      var ta = content.querySelector("[data-note]");
      var txt = ta.value.trim();
      if (!txt) { toast("Write a note first"); return; }
      current.timeline.unshift({ t: txt, when: "Now", kind: "note" });
      ta.value = ""; toast("Note added to timeline"); render();
    });
  }

  function build() {
    mount = document.getElementById("crm-sim");
    if (!mount) return;
    cases = seed(); current = null; activeQueue = "All queues"; view = "All Open Cases"; search = "";
    mount.innerHTML =
      '<div class="dyn-crm"><div class="crm-top"><span class="crm-brand">◆ ServiceDesk (practice)</span>' +
        '<div class="crm-cmd"><button data-top="new">＋ New case</button></div>' +
        '<div class="crm-search">🔍 <input type="text" data-search placeholder="Search case #, customer, contact…" aria-label="Search cases"></div>' +
      "</div><div class='crm-main'>" +
        '<nav class="crm-nav" aria-label="Simulator navigation">' +
          '<button data-page="dashboard">Dashboard</button>' +
          '<button data-page="cases">Cases</button>' +
          '<button data-page="knowledge">Knowledge</button>' +
        "</nav>" +
        '<div class="crm-content"></div>' +
      "</div></div>";

    mount.querySelector("[data-search]").addEventListener("input", function (e) {
      search = e.target.value; current = null; if (page !== "cases") page = "cases"; render();
    });
    mount.querySelector('[data-top=new]').addEventListener("click", function () { toast("New-case form is out of scope in this sandbox"); });
    mount.querySelectorAll(".crm-nav button").forEach(function (b) {
      b.addEventListener("click", function () { page = b.getAttribute("data-page"); current = null; render(); });
    });

    render();
    if (Dyn) Dyn.load(); // no-op safety; sandbox doesn't persist case edits
  }

  document.addEventListener("DOMContentLoaded", build);
})();
