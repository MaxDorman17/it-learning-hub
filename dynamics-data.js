/* =====================================================================
   Dynamics 365 Customer Service: IT Support Technician
   Course content (data only — presentation lives in dynamics*.js).

   window.DYN_COURSE = { meta + modules[] }
   window.DYN_SIM    = simulator dataset (cases, contacts, KB articles…)

   Block types consumed by dynamics-lesson.js:
     prose | callout | quiz | match | order | sort | pick | clear |
     handoff | triage | priority | note | scenario | sla | hotspot |
     search | knowledge | sim | mockday | final

   A block is "trackable" (counts toward progress) if it has an `id` and
   is not prose/callout/sim. Ids must be unique across the whole course.

   Fictional data only. No real customer information.
   ===================================================================== */

/* ---- named badges (module → badge) ---------------------------------- */
var DYN_BADGES = {
  m1:  { id: "b-orientation", icon: "🧭", label: "Orientation" },
  m2:  { id: "b-navigator",   icon: "🗺️", label: "Navigator" },
  m3:  { id: "b-detective",   icon: "🔎", label: "Case Detective" },
  m4:  { id: "b-triage",      icon: "🚦", label: "Triage Ready" },
  m5:  { id: "b-context",     icon: "🗂️", label: "Context Keeper" },
  m6:  { id: "b-docpro",      icon: "📝", label: "Documentation Pro" },
  m7:  { id: "b-queue",       icon: "🎛️", label: "Queue Controller" },
  m8:  { id: "b-priority",    icon: "⚖️", label: "Priority Pro" },
  m9:  { id: "b-search",      icon: "🔦", label: "Search Sleuth" },
  m10: { id: "b-method",      icon: "🧪", label: "Methodical Troubleshooter" },
  m11: { id: "b-escalation",  icon: "📣", label: "Escalation Expert" },
  m12: { id: "b-closer",      icon: "✅", label: "Closer" },
  m13: { id: "b-knowledge",   icon: "📚", label: "Knowledge Curator" },
  m14: { id: "b-scenario",    icon: "🎯", label: "Scenario Ace" },
  m15: { id: "b-firstday",    icon: "🌅", label: "First Day Ready" },
  m16: { id: "b-certified",   icon: "🎓", label: "Certified" }
};

/* Reusable CLEAR rubric fragment for security (used in many note exercises) */
var SEC_FORBIDDEN = [
  { label: "passwords",       any: ["password is", "password:", "their password", "pw is", "passw0rd"] },
  { label: "MFA / OTP codes", any: ["mfa code", "otp", "one-time code", "one time code", "123456", "authenticator code"] },
  { label: "recovery secrets", any: ["recovery key", "recovery code", "private key", "secret key", "seed phrase"] }
];

window.DYN_COURSE = {
  id: "dyn365-cs",
  title: "Microsoft Dynamics 365 Customer Service: IT Support Technician",
  subtitle: "From zero to confident on the service desk",
  description: "A complete beginner's course in using Dynamics 365 Customer Service to work IT support cases — navigation, cases, queues, priority, SLAs, documentation, escalation, closure and realistic scenario practice.",
  estMinutes: 320,
  passMark: 80,
  disclaimer: "This course teaches standard Microsoft Dynamics 365 Customer Service concepts and common IT support workflows. Employers can customise forms, fields, queues, routing, permissions, status reasons, automation and service processes. Always follow your employer's documented procedures, security policies and training.",

  modules: [
    /* ============================================================ M1 */
    {
      id: "m1", num: 1, icon: "🧭",
      title: "Dynamics 365 and the Support Desk",
      summary: "What Dynamics 365 is, what Customer Service does, and the language of cases, accounts, contacts, activities and queues.",
      estMin: 18, badge: DYN_BADGES.m1,
      blocks: [
        { t: "callout", kind: "info", title: "Before you start",
          body: "This course uses a fictional practice environment. Real employers customise Dynamics heavily — treat everything here as the standard shape of the tool, then learn your own company's version on top of it." },
        { t: "prose", h: "What is Microsoft Dynamics 365?",
          body: "<p><b>Dynamics 365</b> is Microsoft's family of business applications — sales, marketing, finance, field service and more. Each 'app' shares the same underlying data platform (<b>Dataverse</b>) and the same look and feel. You don't need to know all of them; as an IT support technician you live in one of them.</p>" },
        { t: "prose", h: "What is Dynamics 365 Customer Service?",
          body: "<p><b>Customer Service</b> is the Dynamics app built for handling support. Its core job is turning every request for help into a trackable <b>case</b> (also called a ticket), routing it to the right person, and keeping a complete history of what happened until it's resolved.</p><p>An IT support company uses it as its <b>service desk</b>: when a user emails, phones or fills in a portal form, a case is created. You pick it up, investigate, record what you did, and resolve or escalate it — all inside Customer Service.</p>" },
        { t: "prose", h: "The five words you'll use every day",
          body: "<ul><li><b>Case</b> — one request for help, from open to closed. The unit of work.</li><li><b>Account</b> — the <i>organisation</i> the case belongs to (e.g. a client company).</li><li><b>Contact</b> — the <i>person</i> who reported it (name, email, phone).</li><li><b>Activity</b> — a thing that happened on the case: an email, a phone call, a note, a task.</li><li><b>Queue</b> — a shared list of cases waiting to be picked up by a team.</li></ul>" },
        { t: "callout", kind: "security", title: "Security runs through everything",
          body: "Never record passwords, MFA codes, recovery keys or private keys in a case. Verify identity using your company's procedure before making changes. Escalate anything that looks like a security incident. This course will remind you often — because employers do too." },
        { t: "match", id: "m1-match", title: "Match the term to its meaning",
          instructions: "Pair each Dynamics term with the correct definition.",
          pairs: [
            { term: "Case", def: "One request for help, tracked from open to closed" },
            { term: "Account", def: "The organisation the case belongs to" },
            { term: "Contact", def: "The individual person who reported the issue" },
            { term: "Activity", def: "An email, call, note or task recorded on a case" },
            { term: "Queue", def: "A shared list of cases waiting to be picked up" }
          ] },
        { t: "prose", h: "A typical support-case lifecycle",
          body: "<p>Almost every case follows the same shape. Learning it now means you'll always know 'what comes next'.</p>" },
        { t: "order", id: "m1-lifecycle", title: "Put the case lifecycle in order",
          instructions: "Drag (or use the arrows) to arrange the stages a case moves through.",
          items: [
            "Case created (email, call or portal form)",
            "Triaged — priority set and routed to a queue",
            "Picked up by a technician (owner assigned)",
            "Investigated — activities and notes recorded",
            "Resolved or escalated",
            "Confirmed with the customer and closed"
          ] },
        { t: "quiz", id: "m1-check", title: "Module 1 knowledge check",
          questions: [
            { q: "What is a 'case' in Dynamics 365 Customer Service?",
              options: ["A customer's billing record", "One request for help, tracked open to closed", "A saved report", "A user's mailbox"],
              answer: 1, explain: "A case is the single unit of support work — one request, tracked from creation to closure." },
            { q: "Which record represents the ORGANISATION a case belongs to?",
              options: ["Contact", "Activity", "Account", "Queue"],
              answer: 2, explain: "The Account is the organisation; the Contact is the individual person." },
            { q: "A note, an email and a phone call logged on a case are all examples of…",
              options: ["Accounts", "Activities", "Queues", "Cases"],
              answer: 1, explain: "Activities are the things that happen on a case and appear on its timeline." },
            { q: "What is a queue?",
              options: ["A priority level", "A shared list of cases waiting to be picked up", "A closed case", "A type of report"],
              answer: 1, explain: "A queue is a shared holding list a team pulls work from." },
            { q: "Which of these should NEVER be written into a case?",
              options: ["The error message shown", "The steps you tried", "The user's password", "The time the issue started"],
              answer: 2, explain: "Never record passwords, MFA codes or recovery secrets — a case history is not a safe place for them." }
          ] }
      ]
    },

    /* ============================================================ M2 */
    {
      id: "m2", num: 2, icon: "🗺️",
      title: "Getting Around the Interface",
      summary: "The Customer Service Hub, the Copilot Service workspace, navigation, dashboards, views, command bars, case forms and timelines.",
      estMin: 22, badge: DYN_BADGES.m2,
      blocks: [
        { t: "prose", h: "Two ways in: Hub vs workspace",
          body: "<p>Most companies give you one of two apps:</p><ul><li><b>Customer Service Hub</b> — a focused, single-case-at-a-time app. Clean and simple. Great for learning.</li><li><b>Customer Service workspace</b> (sometimes 'Copilot Service workspace') — a multi-session, tabbed app where you can have several cases open at once, with an AI Copilot side panel.</li></ul><p>They show the <i>same data</i> — the difference is layout. Learn the pieces here and you'll recognise them in either app, and in your employer's customised version.</p>" },
        { t: "prose", h: "The parts of the screen",
          body: "<ul><li><b>Left navigation (site map)</b> — jump between Dashboards, Cases, Accounts, Contacts, Queues, Knowledge.</li><li><b>Dashboards</b> — at-a-glance charts and lists (e.g. 'My Active Cases').</li><li><b>Record lists (grids)</b> — tables of records you can sort and filter.</li><li><b>Views</b> — saved filters over a list, e.g. 'My Active Cases' vs 'All Open Cases'.</li><li><b>Command bar</b> — the row of buttons across the top: Save, Assign, Resolve, Create, etc.</li><li><b>Case form</b> — the record itself: fields on the left, <b>timeline</b> on the right.</li><li><b>Timeline</b> — the running history of activities on the case.</li></ul>" },
        { t: "callout", kind: "warn", title: "Customised versions look different",
          body: "Your employer can rename fields, hide tabs, add buttons and change colours. If a screen doesn't match this course exactly, that's expected — look for the same <i>concepts</i> (a list, a view selector, a command bar, a timeline)." },
        { t: "hotspot", id: "m2-hotspot", title: "Explore a simulated Dynamics screen",
          instructions: "Click each highlighted area to learn what it does.",
          regions: [
            { key: "nav",   label: "Left navigation", text: "The site map. Switch between Dashboards, Cases, Accounts, Contacts and Queues here." },
            { key: "view",  label: "View selector", text: "Chooses which saved filter you're looking at — e.g. 'My Active Cases'. Changing it changes which rows appear." },
            { key: "cmd",   label: "Command bar", text: "Actions for the current screen: New Case, Save, Assign, Resolve. The buttons change with context." },
            { key: "grid",  label: "Case list (grid)", text: "A table of cases. Click a column header to sort; click a row to open the case." },
            { key: "search",label: "Search", text: "Find records by case number, customer, contact or keyword." }
          ] },
        { t: "pick", id: "m2-find", title: "Find the correct section", multi: false,
          prompt: "You need to change which cases you're looking at from 'My Active Cases' to 'All Open Cases'. Where do you click?",
          options: [
            { label: "The view selector at the top of the list", correct: true, feedback: "Correct — the view selector switches the saved filter behind the list." },
            { label: "The command bar 'Save' button", correct: false, feedback: "Save commits changes to a record; it doesn't change which list you see." },
            { label: "The timeline on the case form", correct: false, feedback: "The timeline is a case's history — it doesn't control the list view." },
            { label: "The left navigation 'Accounts' link", correct: false, feedback: "That takes you to organisations, not a different case view." }
          ] },
        { t: "quiz", id: "m2-check", title: "Module 2 knowledge check",
          questions: [
            { q: "The main difference between the Customer Service Hub and the workspace is…",
              options: ["They store different data", "Layout — the workspace is multi-session/tabbed", "The Hub has no cases", "The workspace is read-only"],
              answer: 1, explain: "Same data, different layout. The workspace lets you keep several cases open at once." },
            { q: "A 'view' is best described as…",
              options: ["A saved filter over a list of records", "A single case", "A permission level", "A dashboard chart"],
              answer: 0, explain: "Views are saved filters — 'My Active Cases', 'All Open Cases', etc." },
            { q: "Where do you find buttons like Save, Assign and Resolve?",
              options: ["The timeline", "The command bar", "The left navigation", "The status bar"],
              answer: 1, explain: "The command bar holds the actions for whatever you're looking at." },
            { q: "On a case form, the running history of emails, calls and notes is the…",
              options: ["Command bar", "View selector", "Timeline", "Site map"],
              answer: 2, explain: "The timeline is the case's activity history." },
            { q: "Your company's Dynamics looks different from this course. That means…",
              options: ["Something is broken", "It's been customised — normal; look for the same concepts", "You're in the wrong app", "You need a new licence"],
              answer: 1, explain: "Customisation is expected. Field names and layout change; the underlying concepts don't." }
          ] }
      ]
    },

    /* ============================================================ M3 */
    {
      id: "m3", num: 3, icon: "🔎",
      title: "Understanding Cases",
      summary: "Every field on a case and what it means — plus the crucial difference between a reported symptom and a confirmed diagnosis.",
      estMin: 24, badge: DYN_BADGES.m3,
      blocks: [
        { t: "prose", h: "What a case really is",
          body: "<p>A case is a container for one problem and everything about it. Read a case well and you'll know exactly where it stands without asking anyone.</p>" },
        { t: "prose", h: "The anatomy of a case",
          body: "<ul><li><b>Case title</b> — a short, human summary ('Cannot sign in to Microsoft 365').</li><li><b>Case number</b> — the unique reference (e.g. MN-1001). Use it when talking about the case.</li><li><b>Customer</b> — the account (organisation) and <b>contact</b> (person).</li><li><b>Owner</b> — the technician or team currently responsible.</li><li><b>Queue</b> — the shared list it currently sits in.</li><li><b>Status</b> — Active, Resolved or Cancelled.</li><li><b>Status reason</b> — the finer detail (e.g. 'In Progress', 'Waiting on Customer', 'Problem Solved').</li><li><b>Priority</b> — Low, Normal, High or Critical.</li><li><b>Description</b> — the full detail of the problem.</li><li><b>Timeline / activities</b> — the history of what's been done.</li><li><b>Related cases</b> — other cases linked to the same issue or customer.</li></ul>" },
        { t: "callout", kind: "good", title: "Symptom ≠ diagnosis",
          body: "A <b>reported symptom</b> is what the user experiences ('the internet is down'). A <b>confirmed diagnosis</b> is what you've proven ('their Wi-Fi adapter is disabled; other users are fine'). Beginners record symptoms as if they were diagnoses. Keep them separate — assumptions cause wrong fixes." },
        { t: "prose", h: "A fictional case to explore",
          body: "<div class='dyn-caseflat'><div class='dcf-h'>Case MN-0420 · <b>Guardian Risk Ltd</b></div><div class='dcf-title'>“Email keeps disconnecting”</div><p><b>Contact:</b> Priya Shah · <b>Priority:</b> Normal · <b>Status:</b> Active (In Progress)</p><p><b>Description:</b> Priya reports Outlook shows 'Disconnected' several times a day since Monday. Webmail (Outlook on the web) has been fine when she's tried it. She's on the new laptop IT issued last week. Nobody else on her team has reported the same thing.</p></div>" },
        { t: "sort", id: "m3-sort", title: "Facts, assumptions and questions",
          instructions: "Drag each statement into the correct bucket. This is the habit that separates good technicians from guessers.",
          buckets: [
            { id: "fact", label: "Confirmed fact" },
            { id: "assume", label: "Assumption" },
            { id: "question", label: "Question to ask" }
          ],
          items: [
            { text: "Outlook shows 'Disconnected' several times a day", bucket: "fact" },
            { text: "Webmail has worked when Priya tried it", bucket: "fact" },
            { text: "The problem is the new laptop", bucket: "assume" },
            { text: "It must be the whole team's mail server", bucket: "assume" },
            { text: "Does it disconnect on Wi-Fi, wired, or both?", bucket: "question" },
            { text: "What exact time did it last disconnect?", bucket: "question" }
          ] },
        { t: "pick", id: "m3-read", title: "Case-reading exercise", multi: false,
          prompt: "From the MN-0420 case above, which statement is best supported by the evidence right now?",
          options: [
            { label: "The desktop Outlook client is the likely problem area, not the mailbox", correct: true, feedback: "Right — webmail works, so the mailbox is reachable; the issue points at the desktop client or its connection." },
            { label: "The mail server is down for everyone", correct: false, feedback: "No one else reported it and webmail works — a server-wide outage doesn't fit the evidence." },
            { label: "Priya's password is wrong", correct: false, feedback: "A wrong password would block webmail too; webmail works." },
            { label: "The case should be closed as no fault found", correct: false, feedback: "There's a clear, repeating symptom — it needs investigating, not closing." }
          ] },
        { t: "quiz", id: "m3-check", title: "Module 3 knowledge check",
          questions: [
            { q: "The unique reference you use when talking about a case is its…",
              options: ["Title", "Case number", "Status reason", "Owner"],
              answer: 1, explain: "The case number (e.g. MN-1001) is the unique handle for the case." },
            { q: "'Waiting on Customer' is an example of a…",
              options: ["Priority", "Queue", "Status reason", "Case number"],
              answer: 2, explain: "Status reason adds detail beneath the top-level Status (Active/Resolved/Cancelled)." },
            { q: "'The internet is down' reported by a user is a…",
              options: ["Confirmed diagnosis", "Reported symptom", "Resolution", "Status reason"],
              answer: 1, explain: "It's what they experience. A diagnosis is what you've proven." },
            { q: "Who is the 'owner' of a case?",
              options: ["The customer", "The technician or team currently responsible", "The person who closed it", "The account manager"],
              answer: 1, explain: "The owner is whoever is currently accountable for moving the case forward." },
            { q: "Why keep facts and assumptions separate?",
              options: ["It looks tidy", "Assumptions treated as facts lead to wrong fixes", "It's required by law", "To fill the timeline"],
              answer: 1, explain: "Acting on an unverified assumption is how cases get the wrong fix and reopen." }
          ] }
      ]
    },

    /* ============================================================ M4 */
    {
      id: "m4", num: 4, icon: "🚦",
      title: "Opening and Assessing a New Case",
      summary: "The TRIAGE method — Title, Reach, Impact, Age, Groundwork, Escalation risk — applied to a real fictional case.",
      estMin: 22, badge: DYN_BADGES.m4,
      blocks: [
        { t: "prose", h: "Assess before you act",
          body: "<p>When a fresh case lands, resist the urge to dive straight into fixing. Spend 60 seconds <i>assessing</i> it. A quick, consistent method stops you mis-prioritising and missing something important.</p>" },
        { t: "prose", h: "The TRIAGE method",
          body: "<ul><li><b>T — Title:</b> can you write a clear one-line summary of the real problem?</li><li><b>R — Reach:</b> how many people/sites are affected? One user, a team, everyone?</li><li><b>I — Impact:</b> how badly is work blocked? Is there a workaround?</li><li><b>A — Age:</b> when did it start, and is a deadline looming?</li><li><b>G — Groundwork:</b> what's already been tried or recorded?</li><li><b>E — Escalation risk:</b> could this be security, an outage, or beyond first line?</li></ul>" },
        { t: "callout", kind: "info", title: "Your practice case",
          body: "<b>Case MN-1001</b> · Customer: <b>Guardian Risk Ltd</b> · Contact: <b>Alex Morgan</b><br>Issue: Alex cannot sign in to Microsoft 365. A client meeting starts in <b>25 minutes</b> and their presentation is stored in SharePoint. Only one user appears affected." },
        { t: "pick", id: "m4-questions", title: "Choose the right questions to ask", multi: true,
          prompt: "Select the questions that genuinely help you triage MN-1001. (Choose all that apply.)",
          options: [
            { label: "What exact error message appears when you try to sign in?", correct: true, feedback: "Yes — the exact error narrows the cause fast." },
            { label: "Can you sign in to Outlook on the web from another device or browser?", correct: true, feedback: "Yes — isolates account vs device/app." },
            { label: "Is the presentation only in SharePoint, or also emailed/local?", correct: true, feedback: "Yes — finds a possible workaround for the 25-minute deadline." },
            { label: "What's your password so I can test it?", correct: false, feedback: "Never ask for a password. Verify identity per policy instead." },
            { label: "Did it work yesterday, and did anything change since?", correct: true, feedback: "Yes — age and recent change point at the cause." }
          ] },
        { t: "priority", id: "m4-priority", title: "Set a provisional priority",
          instructions: "Given a director-facing deadline in 25 minutes but only one user affected, choose the priority you'd set initially. Then read the reasoning.",
          cases: [
            { text: "MN-1001 — Alex can't sign in; client meeting in 25 minutes; presentation in SharePoint; one user affected.",
              correct: "high",
              why: "Reach is low (one user) but Impact is high and urgent — a director-facing deadline in minutes with work fully blocked. High is defensible. Follow your employer's matrix, which may weight VIP/deadline differently." }
          ] },
        { t: "clear", id: "m4-firstnote", title: "Write your first internal note",
          brief: "Write the opening internal note for MN-1001 — what you know, what you'll check, and any workaround you're chasing. (Internal, not customer-facing.)",
          blocks: [
            { label: "Contact + context", text: "Alex Morgan (Guardian Risk) cannot sign in to Microsoft 365; client meeting in ~25 min; presentation stored in SharePoint; appears to be one user only." },
            { label: "First checks planned", text: "Will confirm exact sign-in error and test access from another browser/device to isolate account vs device." },
            { label: "Workaround being chased", text: "Checking whether the presentation can be reached via Outlook on the web or a colleague to protect the deadline." }
          ],
          rubric: {
            minWords: 20,
            required: [
              { label: "who + which customer", any: ["alex", "guardian"] },
              { label: "the core issue (can't sign in)", any: ["sign in", "sign-in", "log in", "login", "cannot access", "can't access"] },
              { label: "the deadline/urgency", any: ["25", "meeting", "deadline", "minutes"] },
              { label: "a next check or test", any: ["test", "check", "another browser", "another device", "webmail", "outlook on the web"] }
            ],
            bonus: [ { label: "notes a workaround", any: ["workaround", "colleague", "email", "download"] } ],
            forbidden: SEC_FORBIDDEN
          },
          sample: "Alex Morgan (Guardian Risk Ltd) reports they cannot sign in to Microsoft 365. Client meeting starts in ~25 minutes; presentation is stored in SharePoint. Only one user appears affected. Next: confirm the exact sign-in error and test access from another browser/device to isolate account vs device. In parallel, checking whether the file can be reached via Outlook on the web or a colleague to protect the deadline. Identity to be verified per policy before any account change."
        },
        { t: "quiz", id: "m4-check", title: "Module 4 knowledge check",
          questions: [
            { q: "In TRIAGE, the 'R' stands for…",
              options: ["Resolve", "Reach — how many are affected", "Restart", "Report"],
              answer: 1, explain: "Reach = the spread of the problem: one user, a team, or everyone." },
            { q: "Why check 'Age' when triaging?",
              options: ["To bill correctly", "Start time and looming deadlines change urgency and point at causes", "To assign a queue", "It's not useful"],
              answer: 1, explain: "When it started (and any deadline) affects both urgency and diagnosis." },
            { q: "A user asks you to 'just tell me your quick fix'. You should first…",
              options: ["Guess a fix to save time", "Assess the case (TRIAGE) so you fix the right thing", "Close it", "Escalate immediately"],
              answer: 1, explain: "A minute of assessment prevents the wrong fix." }
          ] }
      ]
    },

    /* ============================================================ M5 */
    {
      id: "m5", num: 5, icon: "🗂️",
      title: "Accounts, Contacts and Customer Context",
      summary: "Account vs contact, reading customer history, spotting repeat incidents, and using customer information safely.",
      estMin: 18, badge: DYN_BADGES.m5,
      blocks: [
        { t: "prose", h: "Account vs contact",
          body: "<p>An <b>account</b> is an organisation (e.g. 'Northstar Retail'). A <b>contact</b> is a person who belongs to it (e.g. 'Sam Doyle, Northstar Retail'). One account has many contacts. A case links to both.</p><p>Before you start work, glance at the customer record. It answers questions like: <i>Has this happened before? Are there other open cases? Is there anything special about this customer?</i></p>" },
        { t: "prose", h: "Reading customer history well",
          body: "<ul><li><b>Repeated incidents</b> — three printer cases this month is a pattern, not three coincidences.</li><li><b>Existing open cases</b> — the issue may already be in hand; don't duplicate.</li><li><b>Recent changes</b> — a new laptop, a recent move, a licence change.</li></ul>" },
        { t: "callout", kind: "security", title: "Handle records with care",
          body: "Only open records you need for the case in front of you. Don't edit customer or contact records unnecessarily — a wrong edit ripples across every case. Never store sensitive personal information you don't need. Verify identity before acting on account changes." },
        { t: "pick", id: "m5-record", title: "Select the correct customer record", multi: false,
          prompt: "A caller says: 'I'm Sam from Northstar — the shop till system.' Which record do you open?",
          options: [
            { label: "Contact: Sam Doyle — linked to Account: Northstar Retail", correct: true, feedback: "Correct — match both the person and their organisation before you trust the record." },
            { label: "Account: Northstar Legal (a different company)", correct: false, feedback: "Similar name, wrong organisation — always confirm the exact account." },
            { label: "The first 'Sam' in the list", correct: false, feedback: "Names repeat across companies; match the person to the right account." },
            { label: "Create a brand-new contact immediately", correct: false, feedback: "Check for an existing record first to avoid duplicates." }
          ] },
        { t: "pick", id: "m5-pattern", title: "Spot the pattern", multi: false,
          prompt: "Northstar Retail's history shows: 12 Mar 'printer offline', 19 Mar 'printer offline', 2 Apr 'printer offline' — all the same device (PRN-TILL-01), all resolved by 'restarted printer'. What's the best read?",
          options: [
            { label: "A recurring underlying fault — restarting only masks it; investigate the root cause", correct: true, feedback: "Exactly — a repeat every couple of weeks with the same quick fix is a pattern to escalate for a permanent fix." },
            { label: "Three unrelated one-offs; restart again and close", correct: false, feedback: "The repetition is the signal. Restarting again just resets the clock." },
            { label: "The user is doing something wrong", correct: false, feedback: "Maybe — but the consistent device and symptom point at the device/queue, not the user." }
          ] },
        { t: "sort", id: "m5-relevant", title: "Which information is relevant?",
          instructions: "For a case about a broken printer, sort what's worth reading now vs what to leave alone.",
          buckets: [
            { id: "use", label: "Relevant — read it" },
            { id: "skip", label: "Not relevant / leave alone" }
          ],
          items: [
            { text: "Previous printer cases for this site", bucket: "use" },
            { text: "The specific printer/device name", bucket: "use" },
            { text: "Any open cases already covering this", bucket: "use" },
            { text: "The contact's home address", bucket: "skip" },
            { text: "The customer's unrelated billing dispute", bucket: "skip" }
          ] }
      ]
    },

    /* ============================================================ M6 */
    {
      id: "m6", num: 6, icon: "📝",
      title: "Timelines, Notes and Activities",
      summary: "Notes, emails, calls, tasks and appointments — and the CLEAR method for writing case notes that actually help.",
      estMin: 26, badge: DYN_BADGES.m6,
      blocks: [
        { t: "prose", h: "Activities on the timeline",
          body: "<p>The timeline records everything that happens on a case. The activity types you'll use most:</p><ul><li><b>Note</b> — internal working record ('what I did / found').</li><li><b>Email</b> — customer-facing message, kept on the case automatically.</li><li><b>Phone call</b> — a logged call with a short summary.</li><li><b>Task</b> — a to-do with an owner and due date.</li><li><b>Appointment</b> — a scheduled event (e.g. a callback).</li></ul><p>Keep <b>internal updates</b> (notes) and <b>customer-facing communication</b> (emails) clearly separate. Write notes assuming a colleague will read them at 2am.</p>" },
        { t: "prose", h: "The CLEAR case-note method",
          body: "<ul><li><b>C — Contact and context:</b> who, which customer, what they reported.</li><li><b>L — Looked at:</b> what you checked or observed.</li><li><b>E — Executed:</b> what you actually did (one change at a time).</li><li><b>A — Answer or result:</b> what happened as a result.</li><li><b>R — Route, return or next action:</b> what happens next and who has it.</li></ul>" },
        { t: "pick", id: "m6-weakstrong", title: "Weak note or strong note?", multi: false,
          prompt: "Which note would actually help the next technician?",
          options: [
            { label: "“User reports Outlook fails at launch after Windows sign-in. Confirmed webmail works. Reproduced the desktop failure and recorded the error. Restart didn't fix it. Escalating to 2nd line with the error and confirmation that browser access works.”", correct: true, feedback: "Strong — it has context, what was checked, what was done, the result, and the next action. That's CLEAR." },
            { label: "“Tried a few things. Still broken. Escalated.”", correct: false, feedback: "Weak — no context, no error, no evidence, nothing the next person can build on." }
          ] },
        { t: "clear", id: "m6-rewrite", title: "Rewrite a poor case note",
          brief: "Rewrite this weak note into a CLEAR one:  “Tried a few things. Still broken. Escalated.”  Invent reasonable specifics for a printer that won't print (device PRN-FIN-02).",
          blocks: [
            { label: "C — Contact + context", text: "Jo Reid (Caledonia Legal) reports documents won't print to PRN-FIN-02 since this morning; deadline this afternoon." },
            { label: "L — Looked at", text: "Confirmed printer powered and on the network; print queue shows jobs stuck at 'error'; other users report the same on this printer." },
            { label: "E — Executed", text: "Cleared the print queue and sent a test page (one change at a time)." },
            { label: "A — Answer/result", text: "Test page still failed with the same error; multiple users affected, so not a single workstation." },
            { label: "R — Route/next", text: "Routing to Hardware queue with the error text and confirmation that the fault is printer-wide; suggested a nearby working printer as a workaround." }
          ],
          rubric: {
            minWords: 30,
            required: [
              { label: "who + customer", any: ["jo", "caledonia", "user reports", "contact"] },
              { label: "what was checked (Looked at)", any: ["confirmed", "checked", "queue", "network", "other users"] },
              { label: "what you did (Executed)", any: ["cleared", "test page", "restarted", "reset", "sent"] },
              { label: "the result (Answer)", any: ["still", "failed", "resolved", "same error", "did not", "didn't"] },
              { label: "next action (Route)", any: ["routing", "escalat", "hardware", "queue", "workaround", "next"] }
            ],
            bonus: [ { label: "records the exact error", any: ["error", "code", "message"] } ],
            forbidden: SEC_FORBIDDEN
          },
          sample: "Jo Reid (Caledonia Legal) reports documents won't print to PRN-FIN-02 since this morning, with a deadline this afternoon. Looked at: printer is powered and on the network; the queue shows jobs stuck at 'error'; two colleagues report the same on this printer. Executed: cleared the print queue and sent a test page (one change at a time). Result: the test page failed with the same error, and multiple users are affected, so it isn't a single workstation. Next: routing to the Hardware queue with the error text and confirmation the fault is printer-wide; advised a nearby working printer as a workaround."
        },
        { t: "note", id: "m6-freenote", title: "Free-text CLEAR note",
          brief: "A user (Dana Fox, MaxNova Tech) says their laptop is 'really slow since the update this morning'. Write a CLEAR opening note. Remember: symptom vs diagnosis, and one change at a time.",
          minWords: 30,
          rubric: {
            minWords: 30,
            required: [
              { label: "contact + customer", any: ["dana", "maxnova"] },
              { label: "the reported symptom", any: ["slow", "slow since", "performance"] },
              { label: "when it started / recent change", any: ["update", "this morning", "since", "started"] },
              { label: "a first check (Looked at)", any: ["task manager", "check", "cpu", "memory", "startup", "reproduce"] },
              { label: "a next action (Route/next)", any: ["next", "will", "monitor", "escalate", "workaround"] }
            ],
            bonus: [ { label: "avoids guessing a cause", any: ["confirm", "verify", "reproduce", "test"] } ],
            forbidden: SEC_FORBIDDEN
          },
          sample: "Dana Fox (MaxNova Tech) reports their laptop has been slow since this morning's Windows update — a reported symptom, not yet a confirmed cause. Looked at: will check Task Manager for high CPU/memory and review recent startup and update history to see what changed. Executed: none yet — will make one change at a time. Next: reproduce the slowdown, capture what's consuming resources, and monitor; escalate with findings if it's a bad update needing rollback."
        },
        { t: "quiz", id: "m6-check", title: "Module 6 knowledge check",
          questions: [
            { q: "In CLEAR, the 'E' stands for…",
              options: ["Email the user", "Executed — what you actually did", "Escalate", "Explain"],
              answer: 1, explain: "Executed = the action you took, ideally one change at a time." },
            { q: "Internal working records on a case are best captured as…",
              options: ["Emails to the customer", "Notes", "Appointments", "Accounts"],
              answer: 1, explain: "Notes are internal; emails are customer-facing." },
            { q: "The biggest problem with 'Tried a few things. Still broken. Escalated.' is…",
              options: ["It's too long", "It has no context, evidence or next action", "It uses the wrong font", "It mentions escalation"],
              answer: 1, explain: "It's unusable — the next person learns nothing they can act on." }
          ] }
      ]
    },

    /* ============================================================ M7 */
    {
      id: "m7", num: 7, icon: "🎛️",
      title: "Queues, Ownership and Routing",
      summary: "Personal and team queues, ownership, picking up and assigning work, and why a queue and an owner aren't the same thing.",
      estMin: 20, badge: DYN_BADGES.m7,
      blocks: [
        { t: "prose", h: "Queues vs ownership",
          body: "<p>A <b>queue</b> is a shared list of work waiting to be picked up. An <b>owner</b> is the specific person (or team) currently responsible for a case. They're related but not the same:</p><ul><li>A case can sit <b>in a queue</b> with <b>no individual owner</b> yet — waiting to be picked up.</li><li>When you <b>pick it up</b>, you become the owner; it may stay visible in the team queue or move to your personal queue.</li><li><b>Routing</b> means sending a case to a different queue (e.g. First Line → Second Line).</li><li><b>Releasing/returning</b> puts a case back for someone else when you can't progress it.</li></ul>" },
        { t: "callout", kind: "info", title: "Suggested queues in this course",
          body: "First Line Support · Second Line Support · Microsoft 365 · Networking · Security · Hardware · New Starters and Leavers. Your employer's names will differ — the idea is the same." },
        { t: "sort", id: "m7-route", title: "Drag each case into the right queue",
          instructions: "Route each case to the most appropriate team queue.",
          buckets: [
            { id: "m365", label: "Microsoft 365" },
            { id: "net", label: "Networking" },
            { id: "sec", label: "Security" },
            { id: "hw", label: "Hardware" },
            { id: "nsl", label: "New Starters & Leavers" }
          ],
          items: [
            { text: "Shared mailbox permissions need changing in Exchange", bucket: "m365" },
            { text: "A whole floor has lost internet; the switch may be down", bucket: "net" },
            { text: "A user reports MFA prompts they didn't request", bucket: "sec" },
            { text: "A laptop won't power on at all", bucket: "hw" },
            { text: "New employee starts Monday and needs an account + kit", bucket: "nsl" }
          ] },
        { t: "pick", id: "m7-keep", title: "Keep it or route it?", multi: false,
          prompt: "You're first line. A user can't open a PDF because Adobe Reader isn't installed. What's the right move?",
          options: [
            { label: "Handle it on first line — it's a routine app/install task within your remit", correct: true, feedback: "Correct — don't route work you're equipped to do; routing routine tasks just adds delay." },
            { label: "Route straight to Second Line", correct: false, feedback: "Unnecessary — this is standard first-line work. Route only when it's beyond your remit or access." },
            { label: "Route to Security", correct: false, feedback: "There's no security signal here." }
          ] },
        { t: "pick", id: "m7-assign", title: "Assign to the correct team", multi: false,
          prompt: "A case reads: 'VPN certificate expired for remote users; several people can't connect.' Where does it belong?",
          options: [
            { label: "Networking (VPN/connectivity), flagged as multi-user", correct: true, feedback: "Right — VPN/connectivity is networking, and 'several people' raises its impact." },
            { label: "Hardware", correct: false, feedback: "No physical device fault here — it's a certificate/connectivity issue." },
            { label: "New Starters & Leavers", correct: false, feedback: "Nothing about onboarding/offboarding." }
          ] },
        { t: "quiz", id: "m7-check", title: "Module 7 knowledge check",
          questions: [
            { q: "A queue and an owner are different because…",
              options: ["They're actually the same", "A queue is a shared list; an owner is who's currently responsible", "Owners are always teams", "Queues can't hold cases"],
              answer: 1, explain: "A case can sit in a queue with no owner yet; picking it up makes you the owner." },
            { q: "'Routing' a case means…",
              options: ["Closing it", "Deleting it", "Sending it to a different queue/team", "Emailing the customer"],
              answer: 2, explain: "Routing moves a case to the queue best placed to handle it." },
            { q: "You can't progress a case you picked up. The right action is to…",
              options: ["Leave it and forget it", "Release/return it (or route it) so someone else can act", "Resolve it anyway", "Delete it"],
              answer: 1, explain: "Return or route it — never sit on work you can't move." }
          ] }
      ]
    },

    /* ============================================================ M8 */
    {
      id: "m8", num: 8, icon: "⚖️",
      title: "Priority, Impact, Urgency and SLAs",
      summary: "Impact vs urgency, the priority levels, how affected-user count changes things, and what an SLA really promises.",
      estMin: 24, badge: DYN_BADGES.m8,
      blocks: [
        { t: "prose", h: "Impact vs urgency",
          body: "<p>Two different questions:</p><ul><li><b>Impact</b> — <i>how badly</i> is work affected, and <i>how many</i> people? One user with a cosmetic issue is low impact; twenty people unable to work is high.</li><li><b>Urgency</b> — <i>how soon</i> does it need fixing? A director on a deadline in ten minutes is urgent even if only one person is affected.</li></ul><p>Priority is usually <b>impact × urgency</b>, mapped to <b>Low / Normal / High / Critical</b>. A workaround lowers urgency; a looming business deadline raises it.</p>" },
        { t: "callout", kind: "warn", title: "Follow your employer's matrix",
          body: "Every company has its own priority matrix and definitions. The examples here teach the reasoning; your real job is to apply <i>your employer's</i> policy consistently." },
        { t: "priority", id: "m8-rank", title: "Priority-ranking exercise",
          instructions: "Choose the priority you'd assign to each case, then compare with the reasoning.",
          cases: [
            { text: "One user wants a desktop shortcut moved.", correct: "low",
              why: "Single user, cosmetic, easy workaround — low impact and low urgency." },
            { text: "Twenty users cannot sign in to a core business application.", correct: "critical",
              why: "High reach and work fully blocked — critical. Many matrices treat 'core app down for many' as the top band." },
            { text: "A director cannot join a client meeting in ten minutes.", correct: "high",
              why: "One user but very high urgency and business exposure — typically High (some matrices go Critical for VIP/deadline)." },
            { text: "One user cannot print but can use another printer nearby.", correct: "low",
              why: "A working workaround exists, so urgency drops — usually Low/Normal." }
          ] },
        { t: "prose", h: "What an SLA is",
          body: "<p>An <b>SLA (Service Level Agreement)</b> is a promise about time. Two common targets:</p><ul><li><b>Response target</b> — how quickly someone will first respond.</li><li><b>Resolution target</b> — how quickly it should be fixed.</li></ul><p>Higher priority usually means shorter targets. Dynamics can show an <b>SLA timer</b> counting down; when it's close to breaching, act or escalate.</p>" },
        { t: "sla", id: "m8-sla", title: "SLA countdown simulation",
          instructions: "Watch a High-priority SLA timer tick down. Notice how the indicator changes as it nears breach — that's your cue to act or escalate.",
          minutes: 4, warnAt: 0.5, breachLabel: "SLA breached — escalate and note why" },
        { t: "note", id: "m8-justify", title: "Explain why a priority is correct",
          brief: "In your own words, justify setting 'Twenty users cannot sign in to a core booking system' as your highest priority. Mention impact, reach and urgency.",
          minWords: 25,
          rubric: {
            minWords: 25,
            required: [
              { label: "mentions many/twenty users (reach)", any: ["twenty", "20", "many users", "lots of", "several", "whole team"] },
              { label: "work is blocked (impact)", any: ["blocked", "can't work", "cannot work", "core", "business", "down", "unable"] },
              { label: "urgency/time", any: ["urgent", "immediately", "now", "quickly", "asap", "time"] },
              { label: "refers to policy/matrix", any: ["policy", "matrix", "sla", "target"] }
            ],
            bonus: [ { label: "notes no workaround", any: ["no workaround", "cannot work around", "nothing else"] } ]
          },
          sample: "Twenty users unable to sign in to a core booking system is my highest priority because the reach is wide (a whole team, not one person) and the impact is severe — their work is fully blocked with no workaround, so the business is losing money every minute. Urgency is high because it's happening now. Under our priority matrix, a core application down for many users maps to Critical, and the SLA response/resolution targets are the tightest, so it goes to the top of the list."
        },
        { t: "quiz", id: "m8-check", title: "Module 8 knowledge check",
          questions: [
            { q: "Impact is mainly about…",
              options: ["How soon it must be fixed", "How badly and how widely work is affected", "Who reported it", "The queue"],
              answer: 1, explain: "Impact = severity × how many affected. Urgency = how soon." },
            { q: "A working workaround usually…",
              options: ["Raises urgency", "Lowers urgency (and often priority)", "Has no effect", "Closes the case"],
              answer: 1, explain: "If people can still work, it's less urgent — priority typically drops." },
            { q: "An SLA is a promise about…",
              options: ["Cost", "Time — response and/or resolution targets", "Who owns the case", "The error code"],
              answer: 1, explain: "SLAs set response and resolution time targets." },
            { q: "When an SLA timer is close to breaching you should…",
              options: ["Ignore it", "Act or escalate, and record why", "Close the case", "Lower the priority"],
              answer: 1, explain: "A near-breach is your cue to progress or escalate and note the reason." },
            { q: "Which is Critical in most matrices?",
              options: ["One user wants a shortcut moved", "Twenty users can't use a core app", "One user can use another printer", "A cosmetic wallpaper request"],
              answer: 1, explain: "Wide reach + fully blocked core work = Critical." }
          ] }
      ]
    },

    /* ============================================================ M9 */
    {
      id: "m9", num: 9, icon: "🔦",
      title: "Searching, Views and Filters",
      summary: "Search by case number, customer, contact or error; use active vs resolved views; and why 'My Active Cases' isn't everything.",
      estMin: 18, badge: DYN_BADGES.m9,
      blocks: [
        { t: "prose", h: "Finding things fast",
          body: "<p>You'll search constantly. Know the handles:</p><ul><li><b>Case number</b> (e.g. MN-1042) — the fastest, most exact search.</li><li><b>Customer / account</b> — all cases for an organisation.</li><li><b>Contact</b> — all cases for a person.</li><li><b>Error message / keyword</b> — find similar past cases and their fixes.</li></ul>" },
        { t: "prose", h: "Views and filters",
          body: "<p><b>Views</b> are saved filters: 'My Active Cases', 'All Open Cases', 'Resolved Cases'. <b>Filters</b> narrow a list further (by priority, queue, date). Two traps:</p><ul><li><b>Active vs Resolved</b> — if you can't find a case, you may be looking at the wrong status view.</li><li><b>'My Active Cases' ≠ everything</b> — it only shows cases <i>you</i> own. Team members' and unassigned cases live in other views.</li></ul>" },
        { t: "search", id: "m9-find", title: "Find the case",
          instructions: "Use the search box to find a specific case in the list below.",
          prompt: "Find the case where 'Harbour Dental' reported a scanner problem. Type part of it (customer or keyword) to filter.",
          targetId: "MN-1042",
          cases: [
            { num: "MN-1039", org: "Northstar Retail", subject: "Till printer offline" },
            { num: "MN-1041", org: "MaxNova Tech", subject: "New starter account setup" },
            { num: "MN-1042", org: "Harbour Dental", subject: "Reception scanner won't scan to email" },
            { num: "MN-1043", org: "Caledonia Legal", subject: "Outlook disconnecting" },
            { num: "MN-1044", org: "Guardian Risk Ltd", subject: "VPN certificate warning" }
          ] },
        { t: "pick", id: "m9-fixfilter", title: "Correct the filter", multi: false,
          prompt: "A colleague says 'the case has vanished — I resolved it an hour ago but it's gone.' What's most likely and the fix?",
          options: [
            { label: "It's now in the Resolved view — switch from 'My Active Cases' to a resolved/all view", correct: true, feedback: "Correct — resolving moves it out of active views. Change the view or clear the status filter." },
            { label: "The case was deleted forever", correct: false, feedback: "Resolving doesn't delete — it changes status. It's still findable." },
            { label: "Dynamics is broken", correct: false, feedback: "Almost always it's a view/filter, not a fault." }
          ] },
        { t: "pick", id: "m9-method", title: "Choose the best search method", multi: false,
          prompt: "A user quotes their reference 'MN-1042'. Fastest way to open it?",
          options: [
            { label: "Search by the case number directly", correct: true, feedback: "Yes — the case number is the most exact, fastest handle." },
            { label: "Scroll through 'All Open Cases' by hand", correct: false, feedback: "Slow and error-prone when you already have the exact number." },
            { label: "Search the error message text", correct: false, feedback: "Useful for finding similar cases, but you already have the exact reference." }
          ] },
        { t: "quiz", id: "m9-check", title: "Module 9 knowledge check",
          questions: [
            { q: "The fastest, most exact way to open a known case is by…",
              options: ["Customer name", "Case number", "Error message", "Priority"],
              answer: 1, explain: "The case number is unique and exact." },
            { q: "'My Active Cases' shows…",
              options: ["Every case in the system", "Only active cases you own", "Only resolved cases", "Everyone's cases"],
              answer: 1, explain: "It's filtered to your own active cases — not the whole desk." },
            { q: "You can't find a case you know exists. First thing to check?",
              options: ["Whether you're in the right view (active vs resolved)", "Reinstall Dynamics", "Raise a new case", "Reset your password"],
              answer: 0, explain: "Usually it's a view/filter mismatch — check the status view." }
          ] }
      ]
    },

    /* ============================================================ M10 */
    {
      id: "m10", num: 10, icon: "🧪",
      title: "Troubleshooting and Documentation",
      summary: "The support loop — observe, hypothesise, test one thing, record, repeat — and documenting exactly what you did.",
      estMin: 24, badge: DYN_BADGES.m10,
      blocks: [
        { t: "prose", h: "The support loop",
          body: "<p>Good troubleshooting is a loop, not a guess:</p><p><b>Observe → form a hypothesis → perform ONE safe test → record the result → update the hypothesis → choose the next action.</b></p><p>The discipline is <b>one change at a time</b>. Change three things and fix it, and you'll never know which change worked — or what you broke.</p>" },
        { t: "prose", h: "What to record as you go",
          body: "<ul><li>The <b>exact</b> error message (screenshot or copy it — don't paraphrase).</li><li>Affected <b>users, devices and services</b>.</li><li><b>When</b> it started and any <b>recent change</b>.</li><li>Each <b>test</b> and its <b>result</b>.</li><li>Any <b>workaround</b> in place.</li></ul><p>Avoid assumptions in the record. Write what you observed, not what you assume it means.</p>" },
        { t: "order", id: "m10-order", title: "Put the troubleshooting steps in order",
          instructions: "Arrange one pass of the support loop.",
          items: [
            "Observe the symptom and gather the exact error",
            "Form a single hypothesis about the cause",
            "Perform one safe test of that hypothesis",
            "Record the result on the case",
            "Update the hypothesis based on what you saw",
            "Choose the next action (or escalate)"
          ] },
        { t: "pick", id: "m10-safe", title: "Safe or unsafe action?", multi: true,
          prompt: "Select the actions that are SAFE for a first-line technician to take while troubleshooting a single user's email problem. (Choose all that apply.)",
          options: [
            { label: "Test the same account in Outlook on the web", correct: true, feedback: "Safe — read-only check that isolates client vs mailbox." },
            { label: "Restart the Outlook app", correct: true, feedback: "Safe, reversible, one change at a time." },
            { label: "Delete the user's mailbox to 'start fresh'", correct: false, feedback: "Destructive and irreversible — never do this." },
            { label: "Disable everyone's MFA to rule it out", correct: false, feedback: "A serious security change affecting many users — absolutely not." },
            { label: "Record the exact error before changing anything", correct: true, feedback: "Safe and essential — capture evidence first." }
          ] },
        { t: "clear", id: "m10-log", title: "Complete a troubleshooting log / case update",
          brief: "You're mid-way through a case: a user's mapped network drive keeps disconnecting. Write a case update recording your last test and its result, and your next step. One change at a time.",
          blocks: [
            { label: "Observed", text: "Mapped drive S: shows a red X and 'not connected' intermittently; other users on the same share are unaffected." },
            { label: "Hypothesis + test", text: "Hypothesis: stale credentials on this device. Test: reconnected the drive with 'reconnect at sign-in' and re-entered saved credentials via Credential Manager (one change)." },
            { label: "Result", text: "Drive reconnected and held for 20 minutes of use, then dropped again — hypothesis only partly right." },
            { label: "Next", text: "Next: check the device's network profile/power settings on the adapter; if it recurs, route to Networking with the timestamps." }
          ],
          rubric: {
            minWords: 30,
            required: [
              { label: "the observed symptom", any: ["drive", "disconnect", "not connected", "s:"] },
              { label: "one specific test", any: ["reconnect", "credential", "test", "checked", "re-map", "remap"] },
              { label: "the result of that test", any: ["dropped", "held", "reconnected", "failed", "still", "recurred"] },
              { label: "a clear next step", any: ["next", "route", "escalate", "check", "monitor"] }
            ],
            bonus: [ { label: "one change at a time / timestamps", any: ["one change", "timestamp", "time", "20 minutes"] } ],
            forbidden: SEC_FORBIDDEN
          },
          sample: "Observed: mapped drive S: intermittently shows 'not connected'; other users of the same share are fine, so it looks device-specific. Test (one change): reconnected the drive with 'reconnect at sign-in' and refreshed the saved credential in Credential Manager. Result: it reconnected and held for about 20 minutes of use, then dropped again — so stale credentials were only part of it. Next: check the network adapter power-management and the device's network profile; if it recurs, route to Networking with the disconnect timestamps."
        },
        { t: "quiz", id: "m10-check", title: "Module 10 knowledge check",
          questions: [
            { q: "The core discipline of troubleshooting is…",
              options: ["Change several things quickly", "One change at a time, recording results", "Reboot everything", "Escalate first"],
              answer: 1, explain: "One change at a time keeps cause and effect clear." },
            { q: "You should record the error message by…",
              options: ["Paraphrasing roughly", "Capturing it exactly (copy/screenshot)", "Ignoring it", "Guessing the code"],
              answer: 1, explain: "Exact wording/codes matter — don't paraphrase." },
            { q: "Which is an UNSAFE first-line action?",
              options: ["Testing webmail", "Restarting an app", "Deleting a mailbox to start fresh", "Recording the error"],
              answer: 2, explain: "Destructive, irreversible actions are never a casual troubleshooting step." }
          ] }
      ]
    },

    /* ============================================================ M11 */
    {
      id: "m11", num: 11, icon: "📣",
      title: "Escalation, Handover and Collaboration",
      summary: "When to escalate, and the HANDOFF method for a handover the next team can act on immediately.",
      estMin: 24, badge: DYN_BADGES.m11,
      blocks: [
        { t: "prose", h: "When to escalate",
          body: "<p>Escalate when:</p><ul><li>It's <b>outside first-line permission</b> or access.</li><li>You suspect a <b>security incident</b>.</li><li>There's a <b>widespread outage</b>.</li><li>A <b>specialist system</b> is required.</li><li>You've <b>exhausted</b> first-line troubleshooting.</li><li>The <b>SLA is at risk</b>.</li><li>A <b>manager or team lead</b> instructs you to.</li></ul><p>Escalation isn't failure — a timely, well-documented escalation is good support.</p>" },
        { t: "prose", h: "The HANDOFF method",
          body: "<ul><li><b>H — Headline:</b> one line: what's wrong.</li><li><b>A — Affected:</b> who/what/how many.</li><li><b>N — Noticed:</b> when it started and what you observed.</li><li><b>D — Done:</b> what you've already tried and the results.</li><li><b>O — Outcome:</b> current state / any workaround.</li><li><b>F — Further help required:</b> exactly what you need the next team to do.</li><li><b>F — Follow-up expectation:</b> priority, SLA, and who's expecting an update.</li></ul>" },
        { t: "pick", id: "m11-poor", title: "What's wrong with this handover?", multi: true,
          prompt: "Poor escalation:  “VPN broken. Tried restart. Can you look?”  Select everything it's missing. (Choose all that apply.)",
          options: [
            { label: "Who/how many are affected", correct: true, feedback: "Right — no Affected. One user or the whole company?" },
            { label: "When it started and what was observed", correct: true, feedback: "Right — no Noticed. No timeline or exact error." },
            { label: "What exactly was tried and the result", correct: true, feedback: "Right — 'tried restart' with no detail or outcome." },
            { label: "What help is needed and the priority/SLA", correct: true, feedback: "Right — no clear ask and no follow-up expectation." },
            { label: "It's too formal and detailed", correct: false, feedback: "The opposite — it's far too vague to act on." }
          ] },
        { t: "handoff", id: "m11-build", title: "Build a correct handover",
          brief: "Rewrite the VPN escalation properly using HANDOFF. Facts: 6 remote users at Guardian Risk can't connect to VPN since 09:00; error 'certificate expired'; you confirmed it affects multiple users and webmail still works; you restarted the client (no change). You need Networking to renew/replace the VPN certificate. High priority, SLA response due within the hour; the office manager is expecting an update.",
          rubric: {
            minWords: 35,
            required: [
              { label: "headline (VPN can't connect)", any: ["vpn", "cannot connect", "can't connect", "connect"] },
              { label: "affected (multiple users)", any: ["6", "six", "multiple", "several", "remote users", "users"] },
              { label: "noticed (start time / error)", any: ["09:00", "9am", "since", "certificate expired", "error"] },
              { label: "done (what you tried)", any: ["restart", "restarted", "confirmed", "tested", "checked"] },
              { label: "further help needed (the ask)", any: ["renew", "replace", "certificate", "networking", "need"] },
              { label: "follow-up (priority/SLA/who)", any: ["high", "sla", "hour", "office manager", "update", "priority"] }
            ],
            bonus: [ { label: "notes a workaround/what still works", any: ["webmail", "workaround", "still works"] } ],
            forbidden: SEC_FORBIDDEN
          },
          sample: "Headline: 6 remote users at Guardian Risk cannot connect to the VPN. Affected: six named remote users since ~09:00 today; office-based users unaffected. Noticed: all get 'certificate expired' at connection; webmail still works, so it's VPN-specific. Done: confirmed it affects multiple users (not one device) and restarted the VPN client with no change. Outcome: remote users blocked; no working VPN workaround. Further help required: Networking to renew/replace the expired VPN certificate. Follow-up: High priority, SLA response due within the hour; the office manager is expecting an update."
        },
        { t: "pick", id: "m11-evidence", title: "Select the missing evidence", multi: false,
          prompt: "Before you route a 'users can't log in' case to Second Line, which single piece of evidence is most important to attach?",
          options: [
            { label: "The exact error message users see and how many are affected", correct: true, feedback: "Correct — the exact error plus reach lets the next team start immediately." },
            { label: "The user's password so they can test", correct: false, feedback: "Never — passwords must not be recorded or shared." },
            { label: "Your lunch break time", correct: false, feedback: "Irrelevant to the case." }
          ] },
        { t: "quiz", id: "m11-check", title: "Module 11 knowledge check",
          questions: [
            { q: "Which is a valid reason to escalate?",
              options: ["You're bored of the case", "You suspect a security incident", "It's nearly home time", "The user is annoying"],
              answer: 1, explain: "Suspected security incidents (and outages, SLA risk, out-of-remit work) warrant escalation." },
            { q: "In HANDOFF, the first 'F' (Further help required) is…",
              options: ["A joke", "Exactly what you need the next team to do", "The customer's phone number", "The font to use"],
              answer: 1, explain: "State the precise ask so the next team can act without guessing." },
            { q: "A good escalation is…",
              options: ["A sign you failed", "Timely and well-documented — that's good support", "Always avoidable", "Only for managers"],
              answer: 1, explain: "Escalating the right things, well-documented and on time, is part of doing the job well." }
          ] }
      ]
    },

    /* ============================================================ M12 */
    {
      id: "m12", num: 12, icon: "✅",
      title: "Resolving and Closing Cases",
      summary: "Confirming the outcome, recording the fix, customer confirmation, resolution categories, and verifying the final case state.",
      estMin: 20, badge: DYN_BADGES.m12,
      blocks: [
        { t: "prose", h: "Closing well",
          body: "<p>Closing a case is more than clicking 'Resolve'. Before you do:</p><ul><li><b>Confirm the outcome</b> — is it actually fixed, or is a workaround in place?</li><li><b>Record the final fix</b> clearly (the next person may hit the same issue).</li><li><b>Get customer confirmation</b> where appropriate — they agree it's resolved.</li><li>Set the right <b>resolution category</b>, <b>status</b> and <b>status reason</b>.</li><li>Check any <b>promised follow-up</b> is done or scheduled.</li><li><b>Save and verify</b> the final state.</li></ul>" },
        { t: "callout", kind: "security", title: "Only claim what you actually did",
          body: "Never mark a case resolved or write 'done' unless the action was genuinely completed and confirmed. A false 'resolved' hides a live problem and breaks trust." },
        { t: "pick", id: "m12-ready", title: "Is this case ready to resolve?", multi: false,
          prompt: "A user's printer works again after you fixed the queue, you sent a test page that printed, and the user confirmed. What's the correct action?",
          options: [
            { label: "Resolve it — outcome confirmed, fix recorded, customer confirmed", correct: true, feedback: "Correct — verified fix + customer confirmation + recorded resolution = ready to resolve." },
            { label: "Resolve it without telling the user", correct: false, feedback: "Skipping confirmation risks closing something the user still can't use." },
            { label: "Leave it open indefinitely just in case", correct: false, feedback: "Once verified and confirmed, resolve it — don't clutter active views." }
          ] },
        { t: "note", id: "m12-resolution", title: "Write a resolution summary",
          brief: "Write the resolution note for a printing case you fixed by pointing the user's print job from a retired queue (PRN-OLD) to the correct one (PRN-FIN-02), then testing. Model tone: precise, verifiable.",
          minWords: 20,
          rubric: {
            minWords: 20,
            required: [
              { label: "what the fix was", any: ["queue", "prn-fin-02", "corrected", "changed", "pointed", "printer"] },
              { label: "the retired/old element", any: ["prn-old", "retired", "old queue"] },
              { label: "verification (test page)", any: ["test page", "test print", "tested", "confirmed printing"] },
              { label: "customer confirmation", any: ["user confirmed", "customer confirmed", "confirmed normal", "confirmed"] }
            ],
            bonus: [ { label: "clear outcome statement", any: ["resolved", "restored", "working"] } ],
            forbidden: SEC_FORBIDDEN
          },
          sample: "Resolved after correcting the selected printer queue from the retired PRN-OLD queue to PRN-FIN-02. A successful test page was completed and the user confirmed normal printing was restored."
        },
        { t: "pick", id: "m12-missing", title: "Spot the missing closure information", multi: false,
          prompt: "A colleague resolves a case with the note: 'Fixed it, all good.' What's the most important thing missing?",
          options: [
            { label: "What the actual fix was and how it was verified", correct: true, feedback: "Correct — 'fixed it' tells the next person nothing and can't be trusted or reused." },
            { label: "The colour of the printer", correct: false, feedback: "Irrelevant to closure quality." },
            { label: "The user's date of birth", correct: false, feedback: "Not needed — and unnecessary personal data should be avoided." }
          ] },
        { t: "quiz", id: "m12-check", title: "Module 12 knowledge check",
          questions: [
            { q: "Before resolving, you should confirm…",
              options: ["Only that you're tired", "The outcome — is it truly fixed, or a workaround?", "The weather", "Nothing — just click resolve"],
              answer: 1, explain: "Confirm the real outcome and record whether it's a fix or a workaround." },
            { q: "A good resolution note…",
              options: ["Says 'all good'", "Records the actual fix and how it was verified", "Is left blank", "Contains the user's password"],
              answer: 1, explain: "Record the fix and its verification so it's trustworthy and reusable." },
            { q: "You may mark a case resolved when…",
              options: ["You think it's probably fine", "The fix is genuinely done and confirmed", "It's nearly 5pm", "The queue is busy"],
              answer: 1, explain: "Only claim resolution when the action was actually completed and confirmed." }
          ] }
      ]
    },

    /* ============================================================ M13 */
    {
      id: "m13", num: 13, icon: "📚",
      title: "Knowledge Articles",
      summary: "Finding and trusting approved knowledge, checking it's current, and treating a past fix as guidance rather than proof.",
      estMin: 16, badge: DYN_BADGES.m13,
      blocks: [
        { t: "prose", h: "What knowledge articles are",
          body: "<p><b>Knowledge articles</b> are approved, reusable write-ups of how to handle a known issue. Used well they make you faster and more consistent. Used badly they spread stale or wrong fixes.</p><p>Before you follow one:</p><ul><li>Check it actually <b>matches the issue</b> (same symptom, same system).</li><li>Check it's <b>current</b> — look at the last-reviewed date.</li><li>Follow any <b>prerequisites and warnings</b>.</li><li><b>Report</b> outdated or wrong information so it gets fixed.</li></ul>" },
        { t: "callout", kind: "warn", title: "A previous fix is guidance, not proof",
          body: "'It worked last time' is a starting point, not a guarantee. Systems change. Verify the article still fits <i>this</i> case before you act on it." },
        { t: "knowledge", id: "m13-choose", title: "Select the correct knowledge article",
          prompt: "A user's Outlook desktop client won't connect, but Outlook on the web works. Which article fits best?",
          articles: [
            { title: "KB-204: Outlook desktop can't connect (webmail OK) — client-side checks", reviewed: "reviewed 3 weeks ago", correct: true,
              why: "Matches exactly: desktop-only failure with working webmail points at the client, and this article is current." },
            { title: "KB-118: Full mailbox outage — all access down", reviewed: "reviewed 2 months ago", correct: false,
              why: "Wrong symptom — webmail works, so it isn't a full outage." },
            { title: "KB-052: Reset a user password", reviewed: "reviewed 14 months ago", correct: false,
              why: "Wrong issue (and stale) — a password problem would block webmail too." }
          ] },
        { t: "pick", id: "m13-stale", title: "Identify the stale article", multi: false,
          prompt: "Three articles could apply. Which is the biggest risk to follow as-is?",
          options: [
            { label: "One last reviewed 14 months ago referencing a tool that's since been replaced", correct: true, feedback: "Correct — old review date plus a referenced tool that no longer exists = high risk. Verify or report it." },
            { label: "One reviewed last week matching the exact symptom", correct: false, feedback: "Current and matching — the safest to use." },
            { label: "One reviewed last month with a matching symptom", correct: false, feedback: "Recent enough and relevant — reasonable to use with a quick check." }
          ] },
        { t: "note", id: "m13-write", title: "Draft a short knowledge article",
          brief: "Write a brief knowledge article for a repeated printer issue: 'Jobs stuck in the queue on shared printers'. Include a symptom line, the fix steps, and a warning/prerequisite.",
          minWords: 30,
          rubric: {
            minWords: 30,
            required: [
              { label: "a symptom line", any: ["symptom", "stuck", "won't print", "queue", "jobs"] },
              { label: "clear fix steps", any: ["clear the queue", "restart", "spooler", "steps", "1.", "then"] },
              { label: "a warning or prerequisite", any: ["warning", "prerequisite", "note that", "before", "check first", "caution"] }
            ],
            bonus: [ { label: "notes when to escalate", any: ["escalate", "if it recurs", "hardware", "route"] } ],
            forbidden: SEC_FORBIDDEN
          },
          sample: "Title: Jobs stuck in the queue on shared printers. Symptom: print jobs sit in the queue showing 'error' or 'spooling' and nothing prints; often affects everyone on that printer. Prerequisite/warning: confirm the printer is powered and online first, and warn the user their queued jobs will be cleared. Fix: 1) Clear the stuck jobs from the print queue; 2) restart the Print Spooler service if needed; 3) send a test page to confirm. If jobs stick again on the same device, escalate to Hardware with the device name — it may be a driver or hardware fault."
        }
      ]
    },

    /* ============================================================ M14 */
    {
      id: "m14", num: 14, icon: "🎯",
      title: "IT Support Scenario Lab",
      summary: "Ten realistic cases. For each: assess, prioritise, choose questions, write a CLEAR note, and decide continue / escalate / resolve.",
      estMin: 45, badge: DYN_BADGES.m14,
      blocks: [
        { t: "callout", kind: "info", title: "How the lab works",
          body: "Each scenario asks you to make the same real decisions you'll make on the desk. There's no single word-perfect answer — you're scored on the important concepts, with feedback after you submit. Take your time." },
        scenario("m14-s1", "🔑", "1 · Password / sign-in problem",
          { from: "Sam Doyle", org: "Northstar Retail", subject: "Can't log in this morning",
            body: "Sam can't sign in to their PC this morning — 'the usual password isn't working'. They're the only one affected and mention their account 'locked yesterday too'." },
          "normal", "single user, no deadline stated; recurring lockout hints at a cause",
          ["What exact message appears (wrong password vs account locked)?", "Can they sign in to Outlook on the web from a phone?", "Did anything change — new phone, password reset recently?", "What's your password? I'll try it."],
          [0,1,2],
          { hint: "verify identity first; a re-locking account often means a device caching the old password" },
          "continue", "It's within first-line remit — verify identity, then unlock/reset per policy and find the caching device so it doesn't re-lock."),
        scenario("m14-s2", "☁️", "2 · Microsoft 365 access issue",
          { from: "Priya Shah", org: "Guardian Risk Ltd", subject: "Can't get into Teams or SharePoint",
            body: "Priya can reach email but Teams and SharePoint both say 'you don't have access'. Started after she was moved to a new department yesterday." },
          "high", "core collaboration blocked; likely a licensing/group change from the department move",
          ["Does webmail work (confirming the account is fine)?", "Was her group/licence changed in the move?", "Is anyone else in the new department affected?", "Can I have her recovery key to check?"],
          [0,1,2],
          { hint: "the department move likely changed group membership/licences — check that before anything drastic" },
          "continue", "Investigate group/licence changes from the move; if it needs Entra/licensing changes beyond your access, route to Microsoft 365."),
        scenario("m14-s3", "🖨️", "3 · Printer offline",
          { from: "Jo Reid", org: "Caledonia Legal", subject: "Printer says offline",
            body: "The shared printer PRN-FIN-02 shows 'offline'. Two people nearby say the same. There's another printer down the hall that works." },
          "normal", "multiple users but a working nearby printer is a workaround, lowering urgency",
          ["Is the printer powered and on the network?", "Are jobs stuck in the queue?", "Can affected users use the working printer meanwhile?", "What's the office alarm code?"],
          [0,1,2],
          { hint: "offer the nearby printer as an immediate workaround while you fix PRN-FIN-02" },
          "continue", "Workaround available (nearby printer); fix the queue/connection on PRN-FIN-02 as routine first-line work."),
        scenario("m14-s4", "💻", "4 · Laptop won't boot",
          { from: "Dana Fox", org: "MaxNova Tech", subject: "Laptop dead — black screen",
            body: "Dana's laptop shows a black screen and won't start. No recent drops or spills mentioned. They have a client deliverable due tomorrow." },
          "high", "work fully blocked for the user with a next-day deadline; likely hardware",
          ["Any lights/fans/sounds when powering on?", "Does it respond to a hard power cycle / charger check?", "Is the deliverable stored in the cloud so a loaner could unblock them?", "Can you post me the laptop password?"],
          [0,1,2],
          { hint: "if it's hardware, a loaner + cloud files may protect the deadline while the laptop is repaired" },
          "escalate", "After safe basic checks, a dead laptop is likely a hardware fault — route to Hardware, and unblock the deadline with a loaner + cloud files."),
        scenario("m14-s5", "🔐", "5 · VPN certificate warning",
          { from: "Aziz Khan", org: "Guardian Risk Ltd", subject: "Scary certificate warning on VPN",
            body: "Aziz gets a certificate warning connecting to the VPN and isn't sure if it's safe to click through. A couple of colleagues mention it too." },
          "high", "possible expired/replaced cert affecting several remote users; also a security-judgement moment",
          ["What exactly does the warning say (expired vs untrusted)?", "How many remote users see it?", "Has the VPN certificate recently changed/expired?", "Just tell users to click 'ignore' and move on."],
          [0,1,2],
          { hint: "don't advise users to bypass certificate warnings; confirm the cert status and route to Networking" },
          "escalate", "Never coach users to click through security warnings. Confirm the certificate status and route to Networking to renew/replace it."),
        scenario("m14-s6", "📧", "6 · Email delivery issue",
          { from: "Ruth Bell", org: "Harbour Dental", subject: "Client says they never got my email",
            body: "Ruth sent an important email to a client two hours ago; the client says it never arrived. Ruth can send and receive other mail fine." },
          "normal", "single user, one message; other mail flows, so not an outage — needs evidence",
          ["What's the recipient address and rough send time?", "Was there a bounce-back (NDR)?", "Shall I run a message trace to see where it went?", "Can you share your mailbox password so I can resend?"],
          [0,1,2],
          { hint: "a message trace is the evidence tool for 'they never got it' — delivered, blocked or quarantined" },
          "continue", "Use a message trace to find whether it was delivered, blocked or quarantined, and act on what the evidence shows."),
        scenario("m14-s7", "🐌", "7 · Slow computer",
          { from: "Tom Blake", org: "Northstar Retail", subject: "PC crawling all day",
            body: "Tom's PC has been very slow all day. It's usable but frustrating. No deadline mentioned; only Tom affected." },
          "low", "single user, usable (workaround = keep working), no deadline — low urgency",
          ["When did it start and did anything change (update/new software)?", "What does Task Manager show is using CPU/memory/disk?", "Is it slow in everything or one app?", "What's your login PIN?"],
          [0,1,2],
          { hint: "observe first (Task Manager) rather than guessing; one change at a time" },
          "continue", "Routine first-line: observe resource usage, identify the hog, and address it methodically — low priority as it's usable."),
        scenario("m14-s8", "⚠️", "8 · Unapproved software install request",
          { from: "Ellie Grant", org: "Caledonia Legal", subject: "Please install this tool I found",
            body: "Ellie wants you to install a free file-converter she downloaded from a website, today, to finish a task. It isn't on the approved software list." },
          "normal", "not urgent-critical, but a policy/security decision — don't just install unvetted software",
          ["Is the tool on the approved software list / does an approved equivalent exist?", "What's the actual task — is there a sanctioned way to do it?", "Does this need manager/security approval per policy?", "I'll just install her download to be helpful."],
          [0,1,2],
          { hint: "follow software-approval policy; offer an approved alternative rather than installing an unvetted download" },
          "escalate", "Don't install unvetted software. Follow the approval process and offer an approved alternative; route for approval if needed."),
        scenario("m14-s9", "🌟", "9 · New user setup",
          { from: "HR (Nadia Rees)", org: "MaxNova Tech", subject: "New starter Monday",
            body: "A new employee starts Monday (4 days away). They need an account, licence, email, group access and a laptop." },
          "normal", "clear deadline (4 days) but not an emergency; a standard onboarding checklist",
          ["What's the role, department and start date?", "Which groups/licences match that role?", "What hardware do they need and is stock available?", "Can HR send me the new person's future password?"],
          [0,1,2],
          { hint: "onboarding is a checklist against the role; passwords are set securely, never sent around" },
          "continue", "Standard New Starters work — build to the onboarding checklist for the role, well before Monday."),
        scenario("m14-s10", "🚪", "10 · Leaver account request",
          { from: "HR (Nadia Rees)", org: "MaxNova Tech", subject: "Leaver today",
            body: "An employee leaves today. HR asks you to make sure their access is removed. Their manager needs access to their files." },
          "high", "security-sensitive and time-bound — access must be revoked promptly and handled per policy",
          ["What's the exact last-working date/time to disable access?", "How should the mailbox/files be handled (delegate to manager)?", "Are there shared or privileged accounts to rotate?", "Shall I just delete everything right now?"],
          [0,1,2],
          { hint: "follow the leaver process: disable (don't hastily delete), preserve data, reassign per policy" },
          "continue", "Follow the leaver checklist: disable access on time, preserve/delegate data to the manager, and rotate any shared credentials — don't rush to delete.")
      ]
    },

    /* ============================================================ M15 */
    {
      id: "m15", num: 15, icon: "🌅",
      title: "Mock First Day",
      summary: "A simulated 08:30 shift: order the queue, work the cases, react to a security flag, and write an end-of-day handover.",
      estMin: 35, badge: DYN_BADGES.m15,
      blocks: [
        { t: "callout", kind: "info", title: "08:30 — your shift begins",
          body: "Six cases are waiting. Work them like a real morning: decide the order, justify your top picks, then respond to what the day throws at you. You're scored on security awareness, business impact, reach, urgency, note quality, correct escalation and follow-up." },
        { t: "prose", h: "The cases on the board",
          body: "<div class='dyn-board'>" +
            "<div class='dbrow'><b>MN-3001</b> — CEO requests a new branded wallpaper before next week.</div>" +
            "<div class='dbrow'><b>MN-3002</b> — Eighteen users cannot access a core booking system.</div>" +
            "<div class='dbrow'><b>MN-3003</b> — One user cannot print, but a nearby colleague can.</div>" +
            "<div class='dbrow'><b>MN-3004</b> — One user reports suspicious MFA prompts they did not initiate.</div>" +
            "<div class='dbrow'><b>MN-3005</b> — New starter setup required in four days.</div>" +
            "<div class='dbrow'><b>MN-3006</b> — One user's Outlook desktop app closes, but webmail works.</div>" +
          "</div>" },
        { t: "order", id: "m15-order", title: "Put the cases into a sensible work order",
          instructions: "Arrange the six cases from what you'd tackle first to last. Think reach, impact, urgency — and security.",
          items: [
            "MN-3004 — Suspicious MFA prompts (possible security incident)",
            "MN-3002 — 18 users can't access core booking system",
            "MN-3006 — Outlook desktop closes; webmail works",
            "MN-3003 — One user can't print; colleague nearby can",
            "MN-3005 — New starter setup in four days",
            "MN-3001 — CEO wallpaper request for next week"
          ] },
        { t: "note", id: "m15-top3", title: "Explain your top three choices",
          brief: "In a few sentences, justify your first three cases. Name them and say why they beat the rest (reach, impact, urgency, security).",
          minWords: 30,
          rubric: {
            minWords: 30,
            required: [
              { label: "prioritises the MFA/security case", any: ["mfa", "3004", "security", "suspicious"] },
              { label: "prioritises the 18-user outage", any: ["3002", "18", "eighteen", "booking", "many users"] },
              { label: "reasoning by impact/reach/urgency", any: ["impact", "reach", "users", "urgent", "blocked", "business"] },
              { label: "de-prioritises the wallpaper", any: ["wallpaper", "3001", "ceo", "cosmetic", "next week"] }
            ],
            bonus: [ { label: "notes the CEO request isn't urgent despite the VIP", any: ["not urgent", "cosmetic", "can wait", "low priority"] } ]
          },
          sample: "First: MN-3004, the suspicious MFA prompts — a possible account compromise is a security incident, so it's flagged and escalated before anything else. Second: MN-3002, eighteen users locked out of a core booking system — wide reach and fully blocked work, the biggest business impact. Third: MN-3006, Outlook desktop failing while webmail works — one user but genuinely blocked, and quick to isolate. The CEO's wallpaper (MN-3001) is last: despite being the CEO it's cosmetic and due next week, so urgency is low — VIP doesn't override impact." },
        { t: "pick", id: "m15-security", title: "10:15 — a team lead flags MN-3004", multi: false,
          prompt: "Your team lead says the suspicious-MFA case (MN-3004) looks like a possible account compromise. What do you do?",
          options: [
            { label: "Treat it as a security incident: escalate to Security per policy immediately, record the facts, and don't tell the user to just approve/ignore prompts", correct: true, feedback: "Correct — suspected compromise is escalated to Security straight away, with facts recorded and no risky advice to the user." },
            { label: "Tell the user to approve the next prompt so it stops", correct: false, feedback: "Dangerous — approving may hand an attacker access. Never advise this." },
            { label: "Resolve it as 'user error' and move on", correct: false, feedback: "Closing a possible compromise hides a serious risk." }
          ] },
        { t: "handoff", id: "m15-handover", title: "17:00 — write your end-of-day handover",
          brief: "Write an end-of-day handover for the incoming shift using HANDOFF. Cover the state of your key cases: MN-3004 escalated to Security (awaiting their action); MN-3002 core booking outage — root cause found (expired service account), fix in progress with Second Line; MN-3006 isolated to the Outlook client, escalated to M365; MN-3005 new starter on track for the deadline. Note what still needs follow-up.",
          rubric: {
            minWords: 40,
            required: [
              { label: "MN-3004 security status", any: ["3004", "security", "mfa", "escalated"] },
              { label: "MN-3002 outage status/owner", any: ["3002", "booking", "second line", "service account", "in progress"] },
              { label: "what still needs follow-up", any: ["follow-up", "follow up", "awaiting", "pending", "tomorrow", "next shift", "still needs"] },
              { label: "clear per-case state", any: ["escalated", "in progress", "resolved", "on track", "isolated"] }
            ],
            bonus: [ { label: "flags the security case as top priority for the next shift", any: ["priority", "urgent", "watch", "highest"] } ],
            forbidden: SEC_FORBIDDEN
          },
          sample: "Headline: end-of-day handover — one security case and one core outage still live. Affected/State: MN-3004 (suspicious MFA) escalated to Security as a possible compromise — awaiting their action; treat as top priority. MN-3002 (18 users, booking system) root cause found — expired service account; fix in progress with Second Line, expected shortly. MN-3006 isolated to the Outlook desktop client and escalated to Microsoft 365. MN-3005 new-starter setup on track for the four-day deadline. Follow-up needed: chase Security on MN-3004 first, confirm MN-3002 restored and users can log in, and check M365's update on MN-3006. Lower cases (printer MN-3003, CEO wallpaper MN-3001) logged and can wait." }
      ]
    },

    /* ============================================================ M16 */
    {
      id: "m16", num: 16, icon: "🎓",
      title: "Final Assessment",
      summary: "Twenty questions plus a case assessment, a CLEAR note and a HANDOFF escalation. Pass mark 80% — then claim your certificate.",
      estMin: 40, badge: DYN_BADGES.m16,
      blocks: [
        { t: "callout", kind: "info", title: "Final assessment",
          body: "This pulls together the whole course. The 20-question exam below is scored and is the gate for your certificate (pass mark 80%). The written exercises that follow give feedback so you can practise the real skills. You can retake any part." },
        { t: "quiz", id: "m16-exam", title: "Final exam — 20 questions", isFinal: true,
          questions: [
            { q: "A case is…", options: ["A billing record", "One request for help tracked open to closed", "A dashboard", "A queue"], answer: 1, explain: "The unit of support work." },
            { q: "The organisation a case belongs to is the…", options: ["Contact", "Account", "Owner", "Activity"], answer: 1, explain: "Account = organisation; Contact = person." },
            { q: "The running history of activities on a case is the…", options: ["Command bar", "Timeline", "View", "Site map"], answer: 1, explain: "The timeline." },
            { q: "'My Active Cases' shows…", options: ["All cases", "Only active cases you own", "Only resolved", "Everyone's cases"], answer: 1, explain: "Just your own active cases." },
            { q: "A reported symptom differs from a diagnosis because…", options: ["They're the same", "A symptom is experienced; a diagnosis is proven", "A diagnosis is a guess", "A symptom is the fix"], answer: 1, explain: "Prove before you conclude." },
            { q: "In TRIAGE, 'R' is…", options: ["Resolve", "Reach", "Restart", "Report"], answer: 1, explain: "Reach = how many affected." },
            { q: "Impact is about…", options: ["How soon", "How badly/widely work is affected", "Who reported it", "The queue"], answer: 1, explain: "Severity × reach." },
            { q: "A working workaround usually…", options: ["Raises urgency", "Lowers urgency", "Deletes the case", "Has no effect"], answer: 1, explain: "People can still work → less urgent." },
            { q: "Twenty users can't use a core app. Likely priority…", options: ["Low", "Normal", "Critical", "None"], answer: 2, explain: "Wide reach + blocked core work." },
            { q: "An SLA is a promise about…", options: ["Cost", "Time (response/resolution)", "Ownership", "Colour"], answer: 1, explain: "Time targets." },
            { q: "In CLEAR, 'E' is…", options: ["Email", "Executed", "Escalate", "Explain"], answer: 1, explain: "What you actually did." },
            { q: "The core troubleshooting discipline is…", options: ["Change many things fast", "One change at a time, recording results", "Always reboot", "Escalate first"], answer: 1, explain: "One change at a time." },
            { q: "A queue is…", options: ["A priority", "A shared list of waiting cases", "An owner", "A report"], answer: 1, explain: "Shared holding list." },
            { q: "Routing a case means…", options: ["Closing it", "Sending it to a different queue/team", "Deleting it", "Resolving it"], answer: 1, explain: "Move it to the right team." },
            { q: "You should escalate when…", options: ["You're bored", "You suspect a security incident", "It's home time", "The user is rude"], answer: 1, explain: "Security, outages, out-of-remit, SLA risk." },
            { q: "In HANDOFF, the first 'F' is…", options: ["Font", "Further help required", "Finish", "Forget"], answer: 1, explain: "The precise ask for the next team." },
            { q: "Before resolving, you should…", options: ["Nothing", "Confirm the outcome and record the fix", "Delete the timeline", "Lower the priority"], answer: 1, explain: "Confirm + record + verify." },
            { q: "A previous knowledge-article fix is…", options: ["Guaranteed to work", "Guidance to verify against this case", "Always wrong", "Irrelevant"], answer: 1, explain: "Guidance, not proof." },
            { q: "Which must NEVER be recorded in a case?", options: ["The error message", "A user's password or MFA code", "The affected users", "The start time"], answer: 1, explain: "Never store secrets." },
            { q: "A user reports suspicious MFA prompts they didn't start. You…", options: ["Tell them to approve it", "Treat as a possible security incident and escalate", "Close as user error", "Ignore it"], answer: 1, explain: "Possible compromise → escalate to Security." }
          ] },
        { t: "triage", id: "m16-triage", title: "Case assessment (TRIAGE)",
          caseText: "Case MN-2050 · Bright Roots Learning · Contact: Morgan Lee. 'Nobody in the office can access the shared drive since about 09:00. We have parents arriving at 11:00 and need the registration files.' Around 12 staff affected.",
          steps: [
            { key: "T", label: "Title", prompt: "Write a clear one-line title.", model: "Shared drive inaccessible for all office staff at Bright Roots since 09:00" },
            { key: "R", label: "Reach", prompt: "How many/what is affected?", model: "~12 staff — the whole office; a shared resource, not one device" },
            { key: "I", label: "Impact", prompt: "How blocked is the work? Any workaround?", model: "High — registration files unreachable ahead of an 11:00 deadline; no obvious workaround" },
            { key: "A", label: "Age", prompt: "When did it start / deadline?", model: "Since ~09:00 today; hard deadline at 11:00" },
            { key: "G", label: "Groundwork", prompt: "What would you check/record first?", model: "Confirm exact error, whether it's one share or the server, and any recent change; check for existing related cases" },
            { key: "E", label: "Escalation risk", prompt: "Could this need escalation?", model: "Yes — if it's a server/network fault affecting all staff, route to Networking; high priority with a looming deadline" }
          ] },
        { t: "note", id: "m16-clear", title: "CLEAR case-note exercise",
          brief: "Write the opening CLEAR note for MN-2050 (Bright Roots shared-drive outage above).",
          minWords: 35,
          rubric: {
            minWords: 35,
            required: [
              { label: "contact + customer", any: ["morgan", "bright roots"] },
              { label: "the symptom + reach", any: ["shared drive", "12", "office", "staff", "everyone", "all"] },
              { label: "start time / deadline", any: ["09:00", "9am", "11:00", "11am", "deadline", "since"] },
              { label: "a first check (Looked at)", any: ["confirm", "check", "error", "server", "one share", "recent change"] },
              { label: "a next action (Route/next)", any: ["route", "networking", "escalate", "next", "workaround"] }
            ],
            forbidden: SEC_FORBIDDEN
          },
          sample: "Morgan Lee (Bright Roots Learning) reports that all office staff (~12) have been unable to reach the shared drive since ~09:00, with parents arriving at 11:00 needing the registration files. Looked at: will confirm the exact error, whether it's one share or the whole server, and any recent change; checking for related open cases. Executed: none yet. Result/next: this looks like a server or network fault affecting everyone — high priority given the 11:00 deadline; if confirmed beyond first-line, route to Networking with the start time and error, and look for any way to retrieve the registration files in the meantime." },
        { t: "handoff", id: "m16-handoff", title: "HANDOFF escalation exercise",
          brief: "The MN-2050 shared-drive fault is beyond first line — the file server appears offline. Write the escalation to Networking using HANDOFF.",
          rubric: {
            minWords: 40,
            required: [
              { label: "headline", any: ["shared drive", "file server", "offline", "outage", "inaccessible"] },
              { label: "affected", any: ["12", "all staff", "office", "everyone", "bright roots"] },
              { label: "noticed (time/error)", any: ["09:00", "9am", "since", "error"] },
              { label: "done", any: ["confirmed", "checked", "tested", "ruled out"] },
              { label: "further help / ask", any: ["networking", "server", "restore", "restart", "investigate", "need"] },
              { label: "follow-up (priority/deadline)", any: ["11:00", "deadline", "high", "sla", "priority", "update"] }
            ],
            forbidden: SEC_FORBIDDEN
          },
          sample: "Headline: shared drive/file server offline for all Bright Roots office staff. Affected: ~12 staff (whole office) since ~09:00; not device-specific. Noticed: users get an error reaching the shared drive; confirmed it's not one share or one PC. Done: verified multiple users and devices affected and that it isn't a permissions change; the file server appears offline. Outcome: staff fully blocked from registration files; no workaround found. Further help required: Networking to check/restore the file server. Follow-up: High priority — hard deadline at 11:00 today; office manager expecting updates. Please advise ETA." },
        { t: "final", id: "m16-final", title: "Course result",
          examBlockId: "m16-exam", passMark: 80 }
      ]
    }
  ]
};

/* ------------------------------------------------------------------
   Scenario factory — builds a full scenario-lab block from parts.
   parts: assessQuestionsCorrect = array of correct option indexes.
   ------------------------------------------------------------------ */
function scenario(id, icon, title, ticket, priority, priorityWhy, questions, correctQ, note, decision, decisionWhy) {
  return {
    t: "scenario", id: id, icon: icon, title: title, ticket: ticket,
    priority: { correct: priority, why: priorityWhy },
    questions: {
      prompt: "Which questions genuinely help here? (Choose all that apply.)",
      options: questions.map(function (q, i) {
        return { label: q, correct: correctQ.indexOf(i) !== -1,
          feedback: correctQ.indexOf(i) !== -1 ? "Good question — it moves the case forward." :
            (/password|recovery key|pin|alarm|delete everything/i.test(q) ? "Avoid this — it's a security risk or irrelevant." : "Not the most useful question here.") };
      })
    },
    note: {
      hint: note.hint,
      rubric: {
        minWords: 20,
        required: [
          { label: "who + customer", any: [ticket.from.split(" ")[0].toLowerCase(), ticket.org.split(" ")[0].toLowerCase()] },
          { label: "the core issue", any: title.replace(/^\d+\s·\s/, "").toLowerCase().split(" ").slice(0, 2) },
          { label: "a next action or check", any: ["next", "check", "test", "confirm", "route", "escalate", "workaround"] }
        ],
        forbidden: SEC_FORBIDDEN
      }
    },
    decision: {
      correct: decision, why: decisionWhy,
      options: [
        { label: "Continue working it on first line", correct: decision === "continue" },
        { label: "Escalate / route to another team", correct: decision === "escalate" },
        { label: "Resolve and close now", correct: decision === "resolve" }
      ]
    }
  };
}
