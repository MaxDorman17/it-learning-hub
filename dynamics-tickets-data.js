/* =====================================================================
   Dynamics 365 course — Ticket Lab dataset
   50 realistic IT support tickets. Each is a mini practice test:
   read the ticket, decide priority + a quick self-check, then reveal the
   worked walkthrough (questions to ask, step-by-step fix, model note,
   escalation guidance). Fictional organisations/people only.

   window.DYN_TICKETS = [ {..} x50 ]
   Ticket shape:
     id, cat, difficulty (Starter|Core|Advanced), priority (low|normal|high|critical),
     ticket:{ from, org, subject, body },
     task,                       // what you're being asked to do
     ask:[..],                   // questions to ask / info to gather
     steps:[..],                 // how to do it, in order
     note,                       // model resolution / case note
     escalate,                   // when/where to escalate or route
     check:{ q, options:[..], answer, explain }   // quick self-check MCQ
   ===================================================================== */

window.DYN_TICKET_CATS = [
  "Accounts & Identity", "Email & Collaboration", "Devices & Hardware",
  "Network & Connectivity", "Microsoft 365", "Printing", "Security",
  "User Lifecycle", "Telephony"
];

window.DYN_TICKETS = [
  /* ================= Accounts & Identity (8) ================= */
  {
    id: "TCK-01", cat: "Accounts & Identity", difficulty: "Starter", priority: "normal",
    ticket: { from: "Sam Doyle", org: "Northstar Retail", subject: "Forgotten my password",
      body: "I can't remember my password and can't sign in to my PC this morning. Can you reset it?" },
    task: "Verify the caller, then reset the password safely and get them working again.",
    ask: ["Confirm identity using your company's verification procedure", "Which account/username exactly?", "Is Self-Service Password Reset (SSPR) available to them?"],
    steps: [
      "Verify the user's identity per policy BEFORE any change — never skip this.",
      "If SSPR is enabled, guide them to aka.ms/sspr so they reset it themselves.",
      "If not, reset the password in the Entra/Microsoft 365 admin center (Users → select user → Reset password).",
      "Set 'require change at next sign-in' so only they know the final password.",
      "Deliver the temporary password over a secure channel and confirm they can sign in."
    ],
    note: "Verified identity per policy. Reset password for Sam Doyle (Northstar Retail); set change-at-next-sign-in. User confirmed successful sign-in. Suggested SSPR enrolment to self-serve next time.",
    escalate: "Escalate only if the account is managed elsewhere (e.g. on-prem AD you can't reach) or identity can't be verified.",
    check: { q: "What must you do before resetting a password?", options: ["Reset it fast so they're not blocked", "Verify the caller's identity per policy", "Ask for their old password", "Disable MFA"], answer: 1, explain: "Identity verification first — password resets are a social-engineering target." }
  },
  {
    id: "TCK-02", cat: "Accounts & Identity", difficulty: "Core", priority: "normal",
    ticket: { from: "Priya Shah", org: "Guardian Risk Ltd", subject: "Account keeps locking",
      body: "Every time you unlock my account it locks again a few minutes later. Really frustrating!" },
    task: "Unlock the account AND find what keeps re-locking it, or it'll just recur.",
    ask: ["What devices/apps use this account (phone email, mapped drives, saved Wi-Fi)?", "Did they recently change their password?", "When exactly does it re-lock?"],
    steps: [
      "Verify identity, then unlock the account.",
      "Check Entra sign-in logs for repeated failures — note the source app/IP/device.",
      "The classic cause: a phone/tablet or a mapped drive still using the OLD cached password.",
      "Update or remove the stale credential on that device (re-add mail account, refresh saved password).",
      "Unlock again and confirm it stays unlocked."
    ],
    note: "Unlocked account for Priya Shah. Sign-in logs showed repeated failures from her mobile mail app using the old password. Removed and re-added the account on the phone. Account stayed unlocked and mail flowing.",
    escalate: "Escalate if failures come from an unknown IP/location (possible attack) — route to Security.",
    check: { q: "An account re-locks seconds after each unlock. Most likely cause?", options: ["A broken server", "A device/app still using the old cached password", "A Windows update", "The user typing slowly"], answer: 1, explain: "A cached old password (often a phone) keeps retrying and re-locks the account." }
  },
  {
    id: "TCK-03", cat: "Accounts & Identity", difficulty: "Core", priority: "high",
    ticket: { from: "Aziz Khan", org: "Guardian Risk Ltd", subject: "New phone, no Authenticator",
      body: "I got a new phone and now I can't approve MFA — I'm locked out of everything." },
    task: "Get the user securely back in and re-registered for MFA on the new device.",
    ask: ["Verify identity strongly (MFA reset is high-risk)", "Do they still have the old phone?", "Is a Temporary Access Pass (TAP) available?"],
    steps: [
      "Verify identity per your strict MFA-reset procedure — this is a top social-engineering target.",
      "In Entra, review the user's authentication methods.",
      "Issue a Temporary Access Pass (TAP) so they can sign in once without the old method.",
      "Have them install Authenticator on the new phone and register it via aka.ms/mfasetup.",
      "Remove the old/lost method and confirm the new one works."
    ],
    note: "Verified identity per MFA policy. Issued a TAP to Aziz Khan; user re-registered Microsoft Authenticator on the new phone and removed the old method. Confirmed MFA prompt works.",
    escalate: "If identity can't be strongly verified, do NOT reset — escalate to Security/team lead.",
    check: { q: "A Temporary Access Pass (TAP) is used to…", options: ["Grant permanent admin rights", "Bootstrap/recover an account, e.g. register a new Authenticator", "Bypass Conditional Access forever", "Reset a mailbox"], answer: 1, explain: "A TAP is a time-limited passcode to get a user back in and re-register MFA." }
  },
  {
    id: "TCK-04", cat: "Accounts & Identity", difficulty: "Starter", priority: "normal",
    ticket: { from: "Ruth Bell", org: "Harbour Dental", subject: "Locked out after holiday",
      body: "I've been off for two weeks and now my account won't let me in. Says it's disabled." },
    task: "Determine why the account is disabled before re-enabling it.",
    ask: ["Was the account disabled deliberately (long absence/leaver process)?", "Confirm they are still an active employee (check with HR/manager)"],
    steps: [
      "Verify identity and confirm current employment status with HR/manager.",
      "In the admin center, check the account status and any sign-in block/Conditional Access.",
      "If it was disabled by policy during leave and they're a confirmed active employee, re-enable it.",
      "Confirm licences/group membership are intact, then have them sign in.",
      "Record who authorised the re-enable."
    ],
    note: "Confirmed with HR that Ruth Bell is an active returning employee. Account had been disabled during extended leave per policy. Re-enabled account, verified licence and group membership, user signed in successfully.",
    escalate: "Escalate if you can't confirm the account should be active — never re-enable on the user's word alone.",
    check: { q: "A user says their account is 'disabled'. First thing to establish?", options: ["Re-enable it immediately", "Why it was disabled and whether they should be active", "Reset the password", "Delete and recreate it"], answer: 1, explain: "Find out why first — it may have been disabled deliberately." }
  },
  {
    id: "TCK-05", cat: "Accounts & Identity", difficulty: "Core", priority: "normal",
    ticket: { from: "Tom Blake", org: "Northstar Retail", subject: "Can't set up self-service reset",
      body: "You told me to register for password reset but the page won't accept my mobile number." },
    task: "Help the user complete SSPR registration.",
    ask: ["What error appears on the registration page?", "Is SSPR enabled for their group?", "Which methods does your policy require (phone, Authenticator, email)?"],
    steps: [
      "Confirm the user is in a group where SSPR is enabled.",
      "Direct them to aka.ms/ssprsetup while signed in.",
      "Register the required methods (Authenticator app and/or phone).",
      "If a number is rejected, check format (country code) and that it isn't already in use.",
      "Test a reset at aka.ms/sspr to confirm it works end-to-end."
    ],
    note: "Confirmed SSPR enabled for user's group. Walked Tom Blake through aka.ms/ssprsetup; number was rejected due to missing country code. Registered Authenticator + mobile and verified a test reset.",
    escalate: "Escalate if SSPR isn't enabled for their group and policy needs changing.",
    check: { q: "SSPR lets a user…", options: ["Share files", "Reset their own password after verifying identity", "Set up a shared mailbox", "Bypass MFA"], answer: 1, explain: "Self-Service Password Reset reduces your most common ticket." }
  },
  {
    id: "TCK-06", cat: "Accounts & Identity", difficulty: "Advanced", priority: "high",
    ticket: { from: "IT Manager", org: "Caledonia Legal", subject: "Contractor needs access today",
      body: "A contractor starts today and needs access to the shared case folders for 3 months only." },
    task: "Provision appropriate, time-bound access following least privilege.",
    ask: ["Exactly which resources do they need, and at what access level?", "What's the end date?", "Is a guest/B2B account or a full internal account appropriate?"],
    steps: [
      "Confirm the precise resources and access level with the requester (least privilege).",
      "Create the account (or invite as a guest if external) per policy.",
      "Add only to the specific group(s) that grant the needed folder access.",
      "Set an access-review or expiry/end date so it's removed automatically after 3 months.",
      "Document the authorisation and notify the requester when done."
    ],
    note: "Provisioned time-bound access for contractor at Caledonia Legal per manager's request. Added to the case-folders group only (least privilege). Set access expiry to the 3-month end date. Authorisation recorded.",
    escalate: "Escalate to Security/identity team if guest governance or Conditional Access changes are needed.",
    check: { q: "Giving an account only the access it needs is called…", options: ["Zero trust", "Least privilege", "Delegation", "Role hoarding"], answer: 1, explain: "Least privilege limits damage if the account is misused or compromised." }
  },
  {
    id: "TCK-07", cat: "Accounts & Identity", difficulty: "Starter", priority: "low",
    ticket: { from: "Ellie Grant", org: "Caledonia Legal", subject: "Name spelt wrong in email",
      body: "My display name shows 'Elie' not 'Ellie' — can you fix it?" },
    task: "Correct the display name without disrupting the account.",
    ask: ["Confirm the correct legal/preferred name", "Is this just display name, or also the email address (UPN)?"],
    steps: [
      "Confirm the correct spelling with the user.",
      "In the admin center, edit the user's Display name field.",
      "Only change the email address/UPN if requested and after checking downstream impact (it changes their sign-in).",
      "Allow directory changes to propagate (can take a little time).",
      "Confirm the corrected name shows in Outlook/Teams."
    ],
    note: "Corrected display name for Ellie Grant (was 'Elie'). Left the sign-in address unchanged. User confirmed the name now appears correctly.",
    escalate: "Escalate/route if the email ADDRESS must change (affects sign-in, aliases, external contacts).",
    check: { q: "Changing a user's display name vs their email address (UPN)…", options: ["Are the same thing", "Display name is cosmetic; changing the UPN affects sign-in", "Both break the account", "Neither matters"], answer: 1, explain: "Display name is safe; the UPN is their sign-in and needs care." }
  },
  {
    id: "TCK-08", cat: "Accounts & Identity", difficulty: "Core", priority: "high",
    ticket: { from: "Service Desk alert", org: "MaxNova Tech", subject: "Impossible-travel sign-in",
      body: "Automated alert: user signed in from London and Singapore within 20 minutes." },
    task: "Treat as a possible compromise and act quickly.",
    ask: ["Is this a known VPN/travel pattern?", "Are there other risky sign-ins for the account?"],
    steps: [
      "Do NOT ignore it — impossible travel is a compromise indicator.",
      "Review the user's recent sign-in logs and risk detections in Entra.",
      "If it looks malicious, follow your incident process: confirm/require MFA, and consider revoking sessions.",
      "Contact the user through a trusted channel to confirm activity.",
      "Escalate to Security and document everything."
    ],
    note: "Impossible-travel alert on a MaxNova Tech account. Reviewed sign-in logs (unknown Singapore IP), confirmed user was only in London. Revoked sessions, forced MFA re-registration and escalated to Security per incident policy.",
    escalate: "Always involve Security for suspected account compromise — don't handle alone on first line.",
    check: { q: "An 'impossible travel' sign-in alert should be…", options: ["Ignored — usually false", "Treated as a possible compromise and escalated", "Resolved as user error", "Deleted"], answer: 1, explain: "It's a classic compromise indicator — investigate and escalate to Security." }
  },

  /* ================= Email & Collaboration (8) ================= */
  {
    id: "TCK-09", cat: "Email & Collaboration", difficulty: "Starter", priority: "normal",
    ticket: { from: "Jo Reid", org: "Caledonia Legal", subject: "Outlook won't receive email",
      body: "My Outlook hasn't received anything since this morning. Is the mail server down?" },
    task: "Isolate whether it's the mailbox or just the desktop client.",
    ask: ["Can they access webmail at outlook.office.com?", "Does it affect send, receive, or both?", "Any error shown in Outlook?"],
    steps: [
      "Have the user check Outlook on the web (OWA). If mail is there, the mailbox is fine — it's the client.",
      "In Outlook desktop, check Send/Receive status and the connection indicator (bottom bar).",
      "Restart Outlook; if still stuck, try Outlook in safe mode or toggle 'Work Offline'.",
      "If OWA is also empty, check for a mail-flow issue via message trace.",
      "Confirm mail resumes and record what fixed it."
    ],
    note: "Confirmed webmail (OWA) was receiving normally — mailbox healthy, issue was the desktop client. 'Work Offline' was toggled on; disabled it and mail flowed. User confirmed receipt.",
    escalate: "If OWA is also affected, route to Microsoft 365 with message-trace evidence.",
    check: { q: "Best first diagnostic for 'Outlook won't receive'?", options: ["Reinstall Office", "Check webmail (OWA)", "Reset the password", "Rebuild the profile"], answer: 1, explain: "OWA instantly separates a client problem from a mailbox problem." }
  },
  {
    id: "TCK-10", cat: "Email & Collaboration", difficulty: "Core", priority: "normal",
    ticket: { from: "Ruth Bell", org: "Harbour Dental", subject: "Client never got my email",
      body: "I emailed a client 2 hours ago and they say it never arrived. Everything else works." },
    task: "Prove what happened to the message using evidence, not guesswork.",
    ask: ["Exact recipient address and approximate send time?", "Was there a bounce-back (NDR)?", "Was it flagged as spam their end?"],
    steps: [
      "Ask for the recipient address and send time.",
      "Run a message trace in the Exchange admin center for that sender/recipient/time window.",
      "Read the result: Delivered, Failed, Pending or Quarantined — that tells you the next step.",
      "If quarantined/blocked, review why (spam rule, attachment); release or advise as appropriate.",
      "Report the finding to the user with evidence."
    ],
    note: "Ran a message trace for Ruth Bell → client. Message was quarantined by the spam filter due to a flagged attachment type. Reviewed and released it, advised sender on the attachment. Confirmed delivery.",
    escalate: "Escalate to M365/Security if it's a policy/quarantine decision beyond your remit.",
    check: { q: "Which tool proves whether an email was delivered, blocked or quarantined?", options: ["Task Manager", "Message trace", "ipconfig", "Sign-in logs"], answer: 1, explain: "Message trace in Exchange is the evidence tool for 'they never got it'." }
  },
  {
    id: "TCK-11", cat: "Email & Collaboration", difficulty: "Core", priority: "normal",
    ticket: { from: "Reception", org: "Harbour Dental", subject: "Can't access the shared inbox",
      body: "The whole team needs to see the 'bookings' mailbox but I can't open it anymore." },
    task: "Restore access to the shared mailbox for the right people.",
    ask: ["Which shared mailbox exactly?", "Who should have access?", "Did their permissions or team membership recently change?"],
    steps: [
      "Confirm the shared mailbox name and who needs access.",
      "In Exchange admin center, open the shared mailbox → Mailbox delegation.",
      "Grant 'Full Access' (and 'Send As' if they need to send as the mailbox).",
      "Have the user re-open Outlook — auto-mapping usually adds it within a short time.",
      "If it doesn't appear, add it manually via Account Settings → More Settings → Advanced."
    ],
    note: "Added Full Access (and Send As) for reception staff to the Harbour Dental 'bookings' shared mailbox. Mailbox auto-mapped in Outlook after restart; users confirmed access.",
    escalate: "Route to M365 if permissions look correct but access still fails (possible sync/licensing issue).",
    check: { q: "Does a shared mailbox under 50 GB need its own licence?", options: ["Yes, always", "No", "Only with a calendar", "Only for guests"], answer: 1, explain: "Shared mailboxes under 50 GB are free." }
  },
  {
    id: "TCK-12", cat: "Email & Collaboration", difficulty: "Starter", priority: "normal",
    ticket: { from: "Morgan Lee", org: "Bright Roots Learning", subject: "Teams stuck loading",
      body: "Teams just spins on the sign-in screen and never loads." },
    task: "Get Teams signing in again.",
    ask: ["Does Teams on the web work?", "Any error code shown?"],
    steps: [
      "Try Teams on the web (teams.microsoft.com) to confirm the account is fine.",
      "Fully quit Teams (check it's closed in the system tray/Task Manager).",
      "Clear the Teams cache (sign out, clear cached credentials/app cache), then reopen.",
      "If still stuck, confirm the client is updated or reinstall.",
      "Confirm sign-in and normal function."
    ],
    note: "Teams web worked (account healthy). Cleared the desktop Teams cache and restarted; sign-in loop resolved. User confirmed Teams loads normally.",
    escalate: "Route to M365 if web Teams also fails (account/licensing/Conditional Access).",
    check: { q: "Teams is stuck on the sign-in/loading screen. Common fix?", options: ["Reinstall Windows", "Clear the Teams cache and restart", "Reset the password", "Buy more licences"], answer: 1, explain: "Clearing the Teams cache resolves most sign-in/loading loops." }
  },
  {
    id: "TCK-13", cat: "Email & Collaboration", difficulty: "Core", priority: "low",
    ticket: { from: "Dana Fox", org: "MaxNova Tech", subject: "Calendar not showing colleague's free/busy",
      body: "I can't see when my teammate is free when booking meetings." },
    task: "Restore visibility of free/busy or shared calendar details.",
    ask: ["Are they trying to see free/busy or full calendar detail?", "Is it one colleague or everyone?"],
    steps: [
      "Clarify whether they need free/busy (default) or shared detail.",
      "If one colleague only, ask that colleague to share their calendar (Calendar → Share) with the needed permission.",
      "If everyone is affected, check for an Outlook/OWA connectivity or availability service issue.",
      "Test by opening the Scheduling Assistant.",
      "Confirm free/busy now shows."
    ],
    note: "Colleague shared their calendar with 'Can view when I'm busy' to Dana Fox. Free/busy now appears in Scheduling Assistant. Confirmed working.",
    escalate: "Route to M365 if free/busy fails org-wide (availability service issue).",
    check: { q: "By default, colleagues can usually see each other's…", options: ["Full email content", "Free/busy availability", "Passwords", "Nothing at all"], answer: 1, explain: "Free/busy is the default; more detail needs explicit sharing." }
  },
  {
    id: "TCK-14", cat: "Email & Collaboration", difficulty: "Starter", priority: "normal",
    ticket: { from: "Sam Doyle", org: "Northstar Retail", subject: "Mailbox full warning",
      body: "I keep getting 'your mailbox is almost full' and can't send." },
    task: "Reduce mailbox size and confirm sending works.",
    ask: ["How large is the mailbox / what's the quota?", "Are there huge folders (Sent, Deleted, large attachments)?"],
    steps: [
      "Check the mailbox size vs quota in the Exchange admin center.",
      "Ask the user to empty Deleted Items and clear obvious large items.",
      "Use Outlook's Mailbox Cleanup / search by size to find big attachments.",
      "Consider archiving (online archive) if licensed, rather than deleting important mail.",
      "Confirm the user can send again."
    ],
    note: "Mailbox for Sam Doyle was near quota. Emptied Deleted Items and removed several large attachments; enabled online archive. Size dropped below quota and sending resumed.",
    escalate: "Route to M365 if a quota increase or archive licensing change is needed.",
    check: { q: "A 'mailbox almost full' warning usually means…", options: ["The server is broken", "The mailbox is near its storage quota", "The password expired", "A virus"], answer: 1, explain: "It's a storage-quota issue — clean up or archive." }
  },
  {
    id: "TCK-15", cat: "Email & Collaboration", difficulty: "Core", priority: "normal",
    ticket: { from: "Nadia Rees", org: "MaxNova Tech", subject: "Not receiving the newsletter list",
      body: "I should be on the 'All Staff' email list but I never get those emails." },
    task: "Check and correct distribution-list membership.",
    ask: ["Which list exactly?", "Is it a distribution list or a Microsoft 365 group?"],
    steps: [
      "Find the list in the Exchange admin center (Recipients → Groups).",
      "Check whether the user is a member.",
      "If missing, add them (per any ownership/approval rules on the list).",
      "Send/check a test message to confirm delivery.",
      "If they ARE a member but not receiving, run a message trace for a recent send."
    ],
    note: "Nadia Rees was not a member of the 'All Staff' distribution list. Added her per the list owner's approval; test message delivered. Confirmed receipt.",
    escalate: "Escalate to the list owner if membership requires their approval.",
    check: { q: "A user isn't getting a mailing list's emails. First check?", options: ["Reinstall Outlook", "Whether they're actually a member of the list", "Reset their password", "Buy a licence"], answer: 1, explain: "Confirm membership before anything else." }
  },
  {
    id: "TCK-16", cat: "Email & Collaboration", difficulty: "Advanced", priority: "high",
    ticket: { from: "Multiple users", org: "Guardian Risk Ltd", subject: "Emails to a client bouncing",
      body: "Several of us are getting bounce-backs (NDRs) emailing one particular client domain." },
    task: "Diagnose why mail to one external domain is failing.",
    ask: ["What NDR code/text is returned?", "Is it one recipient or the whole domain?", "When did it start?"],
    steps: [
      "Collect the exact NDR text/code (e.g. 550 5.x.x) — it states the reason.",
      "Run a message trace to confirm where delivery stops.",
      "Read the code: recipient unknown, blocked by their filter, or a sender-reputation/DNS issue.",
      "If it's their side (blocked/greylisted), advise the user to contact the recipient; gather evidence.",
      "If it's a config/reputation issue your side, escalate with the NDR and trace."
    ],
    note: "Multiple NDRs (550) emailing a client domain at Guardian Risk. Message trace showed the recipient's mail system rejecting for reputation. Provided NDR evidence and escalated to M365/mail team; advised users to contact the client's IT.",
    escalate: "Escalate to M365/mail-flow specialists for domain reputation, connectors or DNS issues.",
    check: { q: "What is an NDR?", options: ["A network report", "A Non-Delivery Report (bounce-back)", "A new device request", "A DNS record"], answer: 1, explain: "The bounce-back; its code tells you why delivery failed." }
  },

  /* ================= Devices & Hardware (7) ================= */
  {
    id: "TCK-17", cat: "Devices & Hardware", difficulty: "Core", priority: "high",
    ticket: { from: "Dana Fox", org: "MaxNova Tech", subject: "Laptop won't turn on",
      body: "Black screen, nothing happens when I press power. I have a client deliverable tomorrow." },
    task: "Run safe basic checks; if it's hardware, protect the deadline.",
    ask: ["Any lights/fans/sounds on power?", "Is it charged / does the charger light show?", "Any recent drop or spill?"],
    steps: [
      "Check for power: connect the charger, look for a charge LED, listen for fans.",
      "Try a hard reset: hold power 10–15s; on some models drain residual power (remove charger, hold power).",
      "Try an external monitor to rule out a display-only fault.",
      "If still dead, it's likely hardware — arrange repair/loaner.",
      "Protect the deadline: if files are in OneDrive/SharePoint, set them up on a loaner."
    ],
    note: "Basic checks on Dana Fox's laptop (no power LED, no fans) point to a hardware fault. Confirmed the deliverable is in OneDrive; issued a loaner and signed the user in. Routed the device to Hardware for repair.",
    escalate: "Route to Hardware for repair/replacement after safe basic checks fail.",
    check: { q: "A laptop is completely dead. A SAFE first-line step is…", options: ["Open the case and reseat the CPU", "Check charger/power and try a hard reset + external monitor", "Reinstall Windows remotely", "Delete the user's profile"], answer: 1, explain: "Power checks, hard reset and external monitor are safe, reversible checks." }
  },
  {
    id: "TCK-18", cat: "Devices & Hardware", difficulty: "Starter", priority: "normal",
    ticket: { from: "Tom Blake", org: "Northstar Retail", subject: "Laptop won't charge",
      body: "Battery stuck at 3% and it says 'plugged in, not charging'." },
    task: "Restore charging or identify a hardware fault.",
    ask: ["Which charger/port are they using?", "Any damage to cable/port?", "Does another known-good charger work?"],
    steps: [
      "Confirm they're using the correct wattage charger and a working outlet.",
      "Inspect the cable and port for damage/debris.",
      "Try a known-good charger and a different port (esp. USB-C).",
      "Update battery/chipset drivers or run the vendor battery diagnostic; a reboot can clear 'not charging'.",
      "If a known-good charger still won't charge, it's likely the battery/board — arrange repair."
    ],
    note: "Tom Blake's laptop 'plugged in, not charging'. A known-good charger on a different port resumed charging — original cable was faulty. Issued a replacement cable; battery now charges normally.",
    escalate: "Route to Hardware if a known-good charger still won't charge (battery/board fault).",
    check: { q: "'Plugged in, not charging' — best quick test?", options: ["Reinstall Windows", "Try a known-good charger and different port", "Reset the password", "Delete drivers permanently"], answer: 1, explain: "Isolate the charger/cable/port before suspecting the battery." }
  },
  {
    id: "TCK-19", cat: "Devices & Hardware", difficulty: "Core", priority: "normal",
    ticket: { from: "Ellie Grant", org: "Caledonia Legal", subject: "No second screen via dock",
      body: "My external monitor stopped working when I plug into the docking station." },
    task: "Restore the external display through the dock.",
    ask: ["Does the monitor work plugged directly into the laptop?", "Any recent dock/driver/OS change?"],
    steps: [
      "Check cables both ends and the monitor's input source.",
      "Test the monitor directly into the laptop to isolate dock vs monitor.",
      "Reseat the dock connection; power-cycle the dock (unplug 30s).",
      "Update dock firmware and graphics/display drivers.",
      "Use Win+P to select 'Extend'; confirm the display is detected."
    ],
    note: "Monitor worked direct to Ellie Grant's laptop, so isolated to the dock. Power-cycled the dock and updated its firmware + display drivers; external screen detected. Win+P set to Extend. Confirmed working.",
    escalate: "Route to Hardware if the dock is faulty after firmware/driver updates.",
    check: { q: "External monitor fails via the dock. Key isolating test?", options: ["Reset the password", "Plug the monitor straight into the laptop", "Reinstall Office", "Buy a new laptop"], answer: 1, explain: "Direct connection separates a dock fault from a monitor/cable fault." }
  },
  {
    id: "TCK-20", cat: "Devices & Hardware", difficulty: "Starter", priority: "normal",
    ticket: { from: "Sam Doyle", org: "Northstar Retail", subject: "Keyboard typing wrong symbols",
      body: "My @ and \" are swapped and some keys type the wrong thing." },
    task: "Fix the keyboard layout.",
    ask: ["Did the layout recently change (US vs UK)?", "Is it one app or everywhere?"],
    steps: [
      "This is almost always a keyboard-layout mismatch (US vs UK).",
      "Check the language bar / Settings → Time & language → Language & region → keyboard.",
      "Set the correct layout (e.g. English (United Kingdom)) and remove the wrong one.",
      "Quick toggle: Win+Space cycles installed layouts.",
      "Test @ and \" to confirm."
    ],
    note: "Sam Doyle's keyboard had switched to US layout (@ and \" swapped). Set the layout back to English (UK) and removed the US layout. Keys now type correctly.",
    escalate: "Route to Hardware only if physical keys are dead after the layout is correct.",
    check: { q: "@ and \" are swapped on the keyboard. Most likely cause?", options: ["Failing hardware", "Wrong keyboard layout (US vs UK)", "A virus", "Dead battery"], answer: 1, explain: "Swapped @ and \" is the classic US/UK layout mismatch." }
  },
  {
    id: "TCK-21", cat: "Devices & Hardware", difficulty: "Advanced", priority: "high",
    ticket: { from: "Morgan Lee", org: "Bright Roots Learning", subject: "Blue screen crashes",
      body: "My PC keeps crashing to a blue screen a few times a day since last week." },
    task: "Gather evidence and stabilise; identify a likely cause.",
    ask: ["What's the exact stop code on the blue screen?", "What changed last week (update, new hardware/driver)?", "Does it crash during a specific activity?"],
    steps: [
      "Record the exact BSOD stop code (photo/screenshot) — don't paraphrase.",
      "Note recent changes: Windows updates, driver installs, new hardware.",
      "Check Reliability Monitor / Event Viewer for the failing component/driver.",
      "Update or roll back the suspect driver; run memory/disk diagnostics.",
      "One change at a time; monitor and record whether crashes stop."
    ],
    note: "Morgan Lee's PC BSOD stop code pointed to a recently updated GPU driver. Rolled back the driver (one change); no further crashes over the day of monitoring. Documented and will confirm with the user.",
    escalate: "Route to Hardware if diagnostics show failing RAM/disk, or to specialists for persistent driver faults.",
    check: { q: "First thing to capture for a blue-screen fault?", options: ["The user's password", "The exact stop code", "The screen brightness", "The room temperature"], answer: 1, explain: "The exact stop code is your key diagnostic — record it precisely." }
  },
  {
    id: "TCK-22", cat: "Devices & Hardware", difficulty: "Core", priority: "low",
    ticket: { from: "Ruth Bell", org: "Harbour Dental", subject: "PC very slow",
      body: "My computer has been crawling all day. It's usable but frustrating." },
    task: "Find what's consuming resources — observe before guessing.",
    ask: ["When did it start / any recent change?", "Slow everywhere or in one app?"],
    steps: [
      "Open Task Manager and observe CPU, Memory and Disk — find the top consumer.",
      "Check for a runaway process, pending updates, or low disk space.",
      "Close/uninstall the offending item; clear temp files if disk is full.",
      "Confirm Windows/driver updates aren't mid-install (which slows things).",
      "Reboot if needed and monitor; record findings."
    ],
    note: "Ruth Bell's slow PC — Task Manager showed 100% disk from a stuck background update. Let it complete, cleared temp files, rebooted. Performance returned to normal; user confirmed.",
    escalate: "Route to Hardware if diagnostics suggest a failing disk; to M365/apps for a specific app fault.",
    check: { q: "For a slow PC, the best first move is to…", options: ["Reinstall Windows", "Observe Task Manager to find the resource hog", "Replace the laptop", "Reset the password"], answer: 1, explain: "Observe first — don't guess. Task Manager shows the cause." }
  },
  {
    id: "TCK-23", cat: "Devices & Hardware", difficulty: "Core", priority: "normal",
    ticket: { from: "Aziz Khan", org: "Guardian Risk Ltd", subject: "Webcam not detected in Teams",
      body: "My camera works in the Camera app but Teams says no camera found." },
    task: "Restore the camera in Teams specifically.",
    ask: ["Does it work in the Windows Camera app? (It does here.)", "Is the right device selected in Teams?"],
    steps: [
      "Since the Camera app works, hardware/driver is fine — it's Teams config/permissions.",
      "Check Windows Settings → Privacy → Camera → allow desktop apps.",
      "In Teams → Settings → Devices, select the correct camera.",
      "Ensure no other app is holding the camera; restart Teams.",
      "Test in a Teams call and confirm."
    ],
    note: "Camera worked in the Windows Camera app, so isolated to Teams. Enabled camera access for apps and selected the correct device in Teams Devices. Restarted Teams; camera works in calls.",
    escalate: "Route to M365 if Teams device settings are missing/locked by policy.",
    check: { q: "Camera works in Windows but not Teams. Likely cause?", options: ["Broken webcam", "App permission or wrong device selected in Teams", "Dead battery", "Bad password"], answer: 1, explain: "If it works elsewhere, it's app permissions/selection, not hardware." }
  },

  /* ================= Network & Connectivity (6) ================= */
  {
    id: "TCK-24", cat: "Network & Connectivity", difficulty: "Core", priority: "normal",
    ticket: { from: "Tom Blake", org: "Northstar Retail", subject: "No internet at my desk",
      body: "Only my PC has no internet — everyone around me is fine." },
    task: "Fix single-user connectivity (others are fine, so it's local).",
    ask: ["Wired or Wi-Fi?", "Any network icon warning?", "Did it work earlier / anything change?"],
    steps: [
      "Others are fine → it's local to this device, not the network.",
      "Check the physical cable / Wi-Fi connection and the adapter status.",
      "Run ipconfig: is there a valid IP or a 169.254 (APIPA) address?",
      "Try ipconfig /release + /renew, or toggle the adapter / reconnect Wi-Fi.",
      "Flush DNS (ipconfig /flushdns) if it resolves names poorly; confirm browsing works."
    ],
    note: "Only Tom Blake's PC affected. ipconfig showed a 169.254 APIPA address (no DHCP). Reseated the cable and ran release/renew; got a valid IP and internet returned. Confirmed browsing.",
    escalate: "Route to Networking if the port/switch appears faulty, or if many users are affected.",
    check: { q: "One user has no internet but everyone else is fine. This points to…", options: ["A company-wide outage", "A local device/connection issue", "A password problem", "A licensing issue"], answer: 1, explain: "If only one is affected, the fault is local, not the network." }
  },
  {
    id: "TCK-25", cat: "Network & Connectivity", difficulty: "Advanced", priority: "critical",
    ticket: { from: "Office Manager", org: "Bright Roots Learning", subject: "Whole office offline",
      body: "Nobody in the building has internet or shared drives. Parents arrive at 11:00." },
    task: "Treat as a high-impact outage — assess reach and escalate fast.",
    ask: ["Is it internet only, or internal network too?", "Any router/switch lights abnormal?", "Recent power cut or change?"],
    steps: [
      "Confirm reach: everyone in the building → high impact, likely infrastructure.",
      "Check core kit: router/firewall and main switch lights; is the ISP link up?",
      "Power-cycle the router/modem if safe and appropriate.",
      "If the ISP link is down or hardware is dead, this is beyond first line.",
      "Escalate to Networking immediately with the deadline; raise priority and note the 11:00 constraint."
    ],
    note: "Whole-office outage at Bright Roots — internet and internal both down; main switch showed no link. Beyond first line. Escalated to Networking as Critical with the 11:00 deadline; kept the office manager updated.",
    escalate: "Escalate to Networking at once for a site-wide outage; involve the ISP if the WAN link is down.",
    check: { q: "A whole site is offline with a looming deadline. Priority?", options: ["Low", "Normal", "Critical", "It depends on the user's mood"], answer: 2, explain: "Site-wide impact + deadline = Critical; escalate immediately." }
  },
  {
    id: "TCK-26", cat: "Network & Connectivity", difficulty: "Core", priority: "high",
    ticket: { from: "Aziz Khan", org: "Guardian Risk Ltd", subject: "VPN won't connect",
      body: "Working from home and the VPN just says 'unable to connect'." },
    task: "Diagnose remote VPN failure for one user.",
    ask: ["Exact error message?", "Do they have general internet at home?", "Did it work before / any change?"],
    steps: [
      "Confirm they have working home internet first (VPN needs it).",
      "Get the exact error text.",
      "Check credentials/MFA if the VPN requires them; retry after a client restart.",
      "Confirm the VPN client is up to date and any required certificate is present/valid.",
      "If several remote users fail the same way, suspect a server-side/cert issue and escalate."
    ],
    note: "Aziz Khan couldn't connect to VPN; home internet was fine. Error was an authentication timeout; restarted the client and re-authenticated with MFA — connected. Confirmed access to resources.",
    escalate: "Escalate to Networking if multiple remote users fail, or a certificate/gateway issue is suspected.",
    check: { q: "Before troubleshooting VPN, confirm the user has…", options: ["A new laptop", "Working general internet at home", "A printer", "Admin rights"], answer: 1, explain: "VPN rides on the user's internet — confirm that first." }
  },
  {
    id: "TCK-27", cat: "Network & Connectivity", difficulty: "Advanced", priority: "high",
    ticket: { from: "Several staff", org: "Guardian Risk Ltd", subject: "VPN certificate expired warning",
      body: "A few of us get a 'certificate expired' warning connecting to the VPN. Is it safe?" },
    task: "Handle a likely expired/replaced VPN certificate — and the security judgement.",
    ask: ["Exact warning text (expired vs untrusted)?", "How many remote users see it?", "Did the VPN cert recently change/expire?"],
    steps: [
      "Do NOT tell users to click through security warnings.",
      "Confirm how many are affected and the exact wording.",
      "Check whether the VPN gateway certificate has expired or been replaced.",
      "This is typically a server-side certificate renewal — beyond first line.",
      "Escalate to Networking to renew/replace the certificate; advise users to hold off until fixed."
    ],
    note: "Multiple remote users at Guardian Risk report 'certificate expired' on VPN. Confirmed it affects several users and webmail still works. Did not advise bypassing the warning. Escalated to Networking to renew the VPN certificate; High priority.",
    escalate: "Escalate to Networking/Security — certificate renewal is not a first-line click-through.",
    check: { q: "Users get a VPN certificate warning. You should…", options: ["Tell them to click 'ignore'", "Confirm the cert status and escalate to Networking", "Reset their passwords", "Close the ticket"], answer: 1, explain: "Never coach users past security warnings — verify and escalate." }
  },
  {
    id: "TCK-28", cat: "Network & Connectivity", difficulty: "Core", priority: "normal",
    ticket: { from: "Dana Fox", org: "MaxNova Tech", subject: "Wi-Fi keeps dropping",
      body: "My laptop drops Wi-Fi every few minutes but reconnects." },
    task: "Stabilise an intermittent Wi-Fi connection.",
    ask: ["One device or several?", "Same in all locations or one spot?", "Recent driver/OS change?"],
    steps: [
      "Establish whether it's one device (local) or many (AP/network).",
      "Check signal strength and whether it drops only in certain areas.",
      "Update the Wi-Fi adapter driver; disable adapter power-saving (Device Manager → adapter → Power Management).",
      "Forget/rejoin the network; test on another SSID/band (2.4 vs 5 GHz).",
      "Monitor; if many devices drop, escalate to Networking (AP/interference)."
    ],
    note: "Dana Fox's laptop dropping Wi-Fi. Only their device affected; disabled adapter power-saving and updated the driver. No drops over the test period. Confirmed stable.",
    escalate: "Route to Networking if multiple devices drop (access-point or interference issue).",
    check: { q: "One laptop keeps dropping Wi-Fi. A good local fix to try?", options: ["Replace the router", "Update the Wi-Fi driver and disable adapter power-saving", "Reset all passwords", "Reinstall Office"], answer: 1, explain: "Driver + power-management settings are common single-device causes." }
  },
  {
    id: "TCK-29", cat: "Network & Connectivity", difficulty: "Starter", priority: "low",
    ticket: { from: "Ellie Grant", org: "Caledonia Legal", subject: "Can't reach one website",
      body: "One specific website won't load but everything else is fine." },
    task: "Determine whether it's the site or the user's device.",
    ask: ["Exact URL and error?", "Does it fail on another device/network (e.g. mobile data)?"],
    steps: [
      "Try the site on another device/network — if it fails everywhere, the site is down (not you).",
      "Clear the browser cache or try a private window / different browser.",
      "Flush DNS (ipconfig /flushdns) in case of a stale record.",
      "Check it isn't blocked by web filtering/policy.",
      "Confirm and advise accordingly."
    ],
    note: "One site failed for Ellie Grant but loaded fine on mobile data and after a DNS flush — stale DNS entry locally. Site now loads. Confirmed.",
    escalate: "Route to Networking/Security if the site is blocked by policy and should be allowed.",
    check: { q: "One website won't load but others do. Quick way to tell if it's the site or you?", options: ["Reinstall Windows", "Try it on another device/network", "Reset the password", "Replace the laptop"], answer: 1, explain: "If it fails everywhere, the site is down; if only on their device, it's local." }
  },

  /* ================= Microsoft 365 (6) ================= */
  {
    id: "TCK-30", cat: "Microsoft 365", difficulty: "Core", priority: "normal",
    ticket: { from: "Nadia Rees", org: "MaxNova Tech", subject: "New hire has no Office apps",
      body: "Our new starter can sign in but has no Word/Excel/Teams — says 'no licence'." },
    task: "Assign the correct licence so the apps activate.",
    ask: ["Which licence/plan should this role have?", "Are licences available in the tenant?"],
    steps: [
      "Confirm the correct licence/plan for the role with the requester.",
      "In the admin center, Users → select user → Licenses and apps.",
      "Assign the appropriate licence (and set the right location if missing).",
      "Have the user sign out/in; Office should activate within a short time.",
      "Confirm the apps open and are activated."
    ],
    note: "New starter at MaxNova Tech had no licence. Assigned the standard staff plan (location set). User signed out/in and Office activated. Confirmed Word/Excel/Teams work.",
    escalate: "Escalate if no licences are available (procurement) or Office won't activate after assignment.",
    check: { q: "A user has 'no licence' for Office apps. Fix?", options: ["Reinstall Windows", "Assign the correct licence in the admin center", "Reset the password", "Replace the laptop"], answer: 1, explain: "Office activation requires an assigned licence." }
  },
  {
    id: "TCK-31", cat: "Microsoft 365", difficulty: "Core", priority: "normal",
    ticket: { from: "Morgan Lee", org: "Bright Roots Learning", subject: "Access denied to a SharePoint site",
      body: "I click the team's SharePoint link and get 'you don't have access'." },
    task: "Grant appropriate SharePoint access via the correct group.",
    ask: ["Which site exactly?", "What access level do they need?", "Should access be granted via a group?"],
    steps: [
      "Identify the site and the required permission level (usually via a group).",
      "Prefer adding the user to the site's Microsoft 365 group / permission group rather than direct grants.",
      "Confirm the sharing/permission with the site owner if approval is needed.",
      "Have the user retry after membership propagates.",
      "Confirm access and correct level (not over-permissioned)."
    ],
    note: "Morgan Lee lacked access to the team SharePoint site. Added them to the site's Members group (per owner approval) rather than a direct grant. Access confirmed at the correct level.",
    escalate: "Escalate to the site owner for approval, or to M365 for tenant-level sharing policy issues.",
    check: { q: "Best practice for granting SharePoint access is to…", options: ["Give direct one-off permissions", "Add the user to the appropriate group", "Make everyone an owner", "Email them the files"], answer: 1, explain: "Group-based access is cleaner, auditable and easier to revoke." }
  },
  {
    id: "TCK-32", cat: "Microsoft 365", difficulty: "Core", priority: "normal",
    ticket: { from: "Sam Doyle", org: "Northstar Retail", subject: "OneDrive stuck syncing",
      body: "OneDrive shows a spinning icon and my files aren't updating." },
    task: "Get OneDrive syncing again without losing data.",
    ask: ["Any error on the OneDrive icon?", "Recent large file or full disk?", "Is the file/path name too long or unsupported?"],
    steps: [
      "Check the OneDrive icon for a specific error/paused state.",
      "Ensure they're signed in and not 'Paused'; resume sync.",
      "Look for problem files (unsupported characters, very long paths, huge files) and fix/rename.",
      "Check local disk space; free space if low.",
      "If needed, restart OneDrive or reset the client (keeps files); confirm sync completes."
    ],
    note: "Sam Doyle's OneDrive stuck — a file with unsupported characters blocked sync. Renamed it; sync resumed and completed. Confirmed files up to date.",
    escalate: "Route to M365 if a reset doesn't clear a persistent sync error.",
    check: { q: "OneDrive won't finish syncing. A common culprit is…", options: ["A dead battery", "A problem file (bad characters/long path) or full disk", "The wrong password", "A printer"], answer: 1, explain: "Unsupported names, long paths and low disk space commonly block sync." }
  },
  {
    id: "TCK-33", cat: "Microsoft 365", difficulty: "Starter", priority: "normal",
    ticket: { from: "Jo Reid", org: "Caledonia Legal", subject: "Word says product deactivated",
      body: "Word shows 'Product Deactivated' and I can't edit documents." },
    task: "Reactivate Office for the signed-in user.",
    ask: ["Are they signed in with their work account?", "Was the account recently changed or licence moved?"],
    steps: [
      "Confirm the user is signed in to Office with their licensed work account (File → Account).",
      "Verify a licence is assigned in the admin center.",
      "Sign out and back in within Office to refresh activation.",
      "If needed, remove and re-add the account in File → Account.",
      "Confirm the apps show 'Product Activated'."
    ],
    note: "Jo Reid's Office showed 'Product Deactivated' — signed into a personal account. Signed in with the licensed work account; Office reactivated. Confirmed editing works.",
    escalate: "Escalate if a valid licence is assigned but activation still fails.",
    check: { q: "'Product Deactivated' in Office usually means…", options: ["The PC is broken", "A licensing/sign-in issue — check the account and licence", "A virus", "The printer is offline"], answer: 1, explain: "Confirm the signed-in account and its assigned licence." }
  },
  {
    id: "TCK-34", cat: "Microsoft 365", difficulty: "Core", priority: "normal",
    ticket: { from: "Aziz Khan", org: "Guardian Risk Ltd", subject: "Can't hear anyone in Teams calls",
      body: "In Teams calls I can see people but there's no audio and they can't hear me." },
    task: "Fix Teams audio device configuration.",
    ask: ["Which speaker/mic is selected in Teams?", "Does audio work elsewhere (Windows sound test)?", "Headset plugged/paired?"],
    steps: [
      "Run a Teams test call (Settings → Devices → Make a test call).",
      "Select the correct speaker and microphone in Teams Devices.",
      "Check Windows sound settings — correct default output/input, volume not muted.",
      "Reconnect/re-pair the headset; check app mic permissions.",
      "Retest and confirm two-way audio."
    ],
    note: "Aziz Khan had no Teams audio — the wrong output device was selected and the headset wasn't set as default. Selected the correct devices in Teams and Windows; test call passed. Confirmed two-way audio.",
    escalate: "Route to Hardware if the headset is faulty, or M365 if Teams device settings are locked.",
    check: { q: "No audio in Teams but you can see people. First check?", options: ["Reinstall Windows", "The selected speaker/mic device in Teams", "The password", "The VPN"], answer: 1, explain: "Wrong device selection is the most common Teams audio cause." }
  },
  {
    id: "TCK-35", cat: "Microsoft 365", difficulty: "Advanced", priority: "normal",
    ticket: { from: "Dana Fox", org: "MaxNova Tech", subject: "Need a Power Automate flow to notify a channel",
      body: "Can you set up something so new form responses post to our Teams channel?" },
    task: "Assess the automation request and either build a simple flow or route it.",
    ask: ["What triggers it (which form) and what should it post where?", "Who owns/approves the automation?", "Any data-sensitivity concerns?"],
    steps: [
      "Clarify the exact trigger (e.g. Microsoft Forms response) and the target Teams channel.",
      "Confirm ownership/approval and that no sensitive data is exposed.",
      "In Power Automate, use a template: 'When a new response is submitted' → 'Post message in a channel'.",
      "Map the fields, set the channel, and test with a sample submission.",
      "Hand over ownership to the team and document it."
    ],
    note: "Built a Power Automate flow for MaxNova Tech: new Microsoft Forms response posts a summary to the requested Teams channel. Tested with a sample; handed ownership to the team lead and documented the flow.",
    escalate: "Route to the automation/Power Platform specialist if it needs premium connectors, approvals or governance review.",
    check: { q: "Before building an automation that posts data to Teams, confirm…", options: ["Nothing — just build it", "The trigger, target, ownership/approval and data sensitivity", "The user's password", "The printer model"], answer: 1, explain: "Scope, ownership and data-sensitivity checks come before building." }
  },

  /* ================= Printing (4) ================= */
  {
    id: "TCK-36", cat: "Printing", difficulty: "Starter", priority: "normal",
    ticket: { from: "Jo Reid", org: "Caledonia Legal", subject: "Printer says offline",
      body: "The shared printer PRN-FIN-02 shows 'offline' and won't print." },
    task: "Bring the printer back online (offer a workaround if others are affected).",
    ask: ["Is it powered and on the network?", "Just them or several users?", "Is there a nearby working printer?"],
    steps: [
      "Check the printer is powered on and shows connected on its panel.",
      "On the PC, remove the 'Use Printer Offline' setting if set.",
      "Ping the printer / confirm it's reachable; restart the Print Spooler service if needed.",
      "Clear any stuck jobs; send a test page.",
      "If several are affected, offer a nearby printer as a workaround while you fix it."
    ],
    note: "PRN-FIN-02 showed offline for Jo Reid. 'Use Printer Offline' was set on the PC; cleared it and restarted the spooler. Test page printed. Confirmed printing restored.",
    escalate: "Route to Hardware if the printer itself is faulty after network/spooler checks.",
    check: { q: "A printer shows 'offline' but is powered and on the network. Try…", options: ["Replacing it", "Clearing 'Use Printer Offline' and restarting the spooler", "Resetting the password", "Reinstalling Windows"], answer: 1, explain: "The offline flag + a spooler restart fix most of these." }
  },
  {
    id: "TCK-37", cat: "Printing", difficulty: "Core", priority: "normal",
    ticket: { from: "Reception", org: "Harbour Dental", subject: "Print jobs stuck in queue",
      body: "Everyone's print jobs are stuck — nothing comes out of the shared printer." },
    task: "Clear a stuck print queue affecting multiple users.",
    ask: ["Is the printer online with paper/toner?", "How many users affected?"],
    steps: [
      "Confirm the printer is online with paper and toner (not an error state).",
      "Open the print queue and cancel the stuck jobs.",
      "If jobs won't clear, restart the Print Spooler service (services.msc → Print Spooler → Restart).",
      "Send a test page to confirm flow.",
      "Warn users their queued jobs were cleared and may need resending."
    ],
    note: "Shared printer at Harbour Dental had a jammed queue affecting all users. Cancelled stuck jobs and restarted the Print Spooler; test page printed. Advised users to resend. Confirmed printing.",
    escalate: "Route to Hardware if jobs re-stick on the same device (driver/hardware fault).",
    check: { q: "Jobs are stuck in the print queue. Reliable fix?", options: ["Buy a new printer", "Clear the queue and restart the Print Spooler", "Reset passwords", "Reinstall Office"], answer: 1, explain: "Clearing the queue + spooler restart clears most stuck-job issues." }
  },
  {
    id: "TCK-38", cat: "Printing", difficulty: "Core", priority: "normal",
    ticket: { from: "Ruth Bell", org: "Harbour Dental", subject: "Scan-to-email not arriving",
      body: "The scanner finishes but the scan-to-email never turns up in my inbox." },
    task: "Restore scan-to-email delivery.",
    ask: ["Does scan-to-USB/folder work (isolates scanner vs email)?", "Correct destination address configured?", "Any recent mail/SMTP change?"],
    steps: [
      "Test scan-to-USB/folder — if that works, the scanner is fine; it's the email path.",
      "Check the destination email address configured on the device.",
      "Verify the device's SMTP settings/authentication (a mail change can break this).",
      "Check the mailbox junk/quarantine for the scans.",
      "Send a test scan and confirm arrival."
    ],
    note: "Ruth Bell's scan-to-email failed but scan-to-USB worked, isolating it to the email path. The device's SMTP auth had broken after a mail change; corrected the settings. Test scan arrived. Confirmed.",
    escalate: "Route to M365/mail team if SMTP relay/connector settings need changing centrally.",
    check: { q: "Scan-to-email fails but scan-to-USB works. The problem is in the…", options: ["Scanner hardware", "Email/SMTP path", "User's password", "Monitor"], answer: 1, explain: "Working USB scan proves hardware is fine — focus on the email path." }
  },
  {
    id: "TCK-39", cat: "Printing", difficulty: "Starter", priority: "low",
    ticket: { from: "Sam Doyle", org: "Northstar Retail", subject: "Prints going to wrong printer",
      body: "My documents keep printing on a printer in another room." },
    task: "Set the correct default printer.",
    ask: ["Which printer should be their default?", "Is 'let Windows manage my default' on?"],
    steps: [
      "Confirm the correct printer with the user.",
      "Settings → Bluetooth & devices → Printers & scanners.",
      "Turn OFF 'Let Windows manage my default printer' (this causes it to change).",
      "Set the correct printer as default.",
      "Print a test to confirm it goes to the right device."
    ],
    note: "Sam Doyle's prints went to the wrong room — Windows was auto-managing the default. Disabled that setting and set the correct printer as default. Test print landed on the right device.",
    escalate: "Route to Hardware only if the correct printer then fails to print.",
    check: { q: "Prints keep going to the wrong printer. Common cause?", options: ["A virus", "'Let Windows manage my default printer' is on", "A dead battery", "Wrong password"], answer: 1, explain: "That setting silently changes the default to the last-used printer." }
  },

  /* ================= Security (5) ================= */
  {
    id: "TCK-40", cat: "Security", difficulty: "Core", priority: "critical",
    ticket: { from: "Ellie Grant", org: "Caledonia Legal", subject: "MFA prompts I didn't start",
      body: "I keep getting 'approve sign-in?' prompts on my phone but I'm not signing in." },
    task: "Treat as a possible account compromise — do NOT tell them to approve.",
    ask: ["Are they currently approving any? (They must NOT.)", "When did it start?"],
    steps: [
      "Tell the user to DENY all prompts and not approve any — approving may hand access to an attacker.",
      "Treat as a possible compromise (MFA fatigue attack).",
      "Follow your incident process: change the password, revoke sessions, review sign-in logs.",
      "Escalate to Security immediately and record the facts.",
      "Do not close as user error — confirm the account is secured."
    ],
    note: "Ellie Grant reports unsolicited MFA prompts — possible MFA-fatigue attack. Advised her to deny all prompts. Reset password, revoked sessions and escalated to Security per incident policy. Documented sign-in log entries.",
    escalate: "Escalate to Security at once — suspected compromise is never a first-line-only close.",
    check: { q: "A user gets MFA prompts they didn't start. You tell them to…", options: ["Approve one to make it stop", "Deny all prompts; treat as possible compromise and escalate", "Ignore it", "Turn off MFA"], answer: 1, explain: "Approving could grant an attacker access — deny and escalate to Security." }
  },
  {
    id: "TCK-41", cat: "Security", difficulty: "Core", priority: "high",
    ticket: { from: "Tom Blake", org: "Northstar Retail", subject: "Suspicious email — did I get phished?",
      body: "I got an email asking me to 'verify my password' and I think I clicked the link." },
    task: "Contain a possible phishing/credential compromise.",
    ask: ["Did they enter any credentials on the linked page?", "Is the email still available to inspect?", "What exactly did they click/submit?"],
    steps: [
      "If they entered credentials, treat the account as compromised: reset password and revoke sessions immediately.",
      "Have them NOT delete the email — report it via your phishing-report process for analysis.",
      "Check sign-in logs for suspicious activity.",
      "Warn others if it's a wider campaign; block the sender/URL if within remit.",
      "Escalate to Security and record the timeline."
    ],
    note: "Tom Blake clicked a phishing link and may have entered credentials. Reset his password, revoked sessions and checked sign-in logs. Reported the email for analysis and escalated to Security. Advised on spotting phishing.",
    escalate: "Escalate to Security for any credential-entry phishing — and if it's a broader campaign.",
    check: { q: "A user entered their password on a phishing page. First action?", options: ["Delete the email and move on", "Reset the password and revoke sessions immediately", "Wait and see", "Tell them off"], answer: 1, explain: "Assume compromise — reset and revoke, then escalate to Security." }
  },
  {
    id: "TCK-42", cat: "Security", difficulty: "Advanced", priority: "critical",
    ticket: { from: "Morgan Lee", org: "Bright Roots Learning", subject: "Files renamed, weird message",
      body: "Loads of my files have odd extensions and there's a note demanding payment." },
    task: "Suspect ransomware — contain immediately, don't experiment.",
    ask: ["Is the device still on the network?", "Are shared drives affected too?"],
    steps: [
      "Treat as a serious security incident — speed and containment matter.",
      "Isolate the device: disconnect it from the network (unplug/disable Wi-Fi) to stop spread.",
      "Do NOT pay, run random 'fixes', or reboot repeatedly — preserve evidence.",
      "Alert Security/incident response immediately and check whether shared drives/other devices are affected.",
      "Follow the incident plan for recovery from backups once contained."
    ],
    note: "Bright Roots device showing ransomware indicators (renamed files, ransom note). Immediately isolated it from the network, preserved evidence and did not reboot. Escalated to Security/incident response as Critical; checking scope on shared drives.",
    escalate: "Escalate to Security/incident response instantly — ransomware is never handled alone on first line.",
    check: { q: "A device shows ransomware signs. Your first move?", options: ["Pay the ransom", "Isolate it from the network and escalate to Security", "Reboot it a few times", "Delete the files"], answer: 1, explain: "Contain first (isolate), preserve evidence, and escalate immediately." }
  },
  {
    id: "TCK-43", cat: "Security", difficulty: "Core", priority: "high",
    ticket: { from: "Aziz Khan", org: "Guardian Risk Ltd", subject: "Lost my work phone",
      body: "I left my work phone on the train. It has my email and Authenticator on it." },
    task: "Reduce risk from a lost device holding company access.",
    ask: ["When/where was it lost? Is it PIN/biometric protected?", "Does it have company mail + MFA?"],
    steps: [
      "Follow the lost-device process promptly — it holds mail and MFA.",
      "In Intune/Entra, consider a remote wipe (or selective wipe of company data) on the device.",
      "Revoke the device's sessions and its MFA method; help the user re-register MFA on a new device (TAP).",
      "Consider a precautionary password reset.",
      "Escalate to Security and record actions/timeline."
    ],
    note: "Aziz Khan lost his work phone (had mail + Authenticator). Initiated a remote wipe via Intune, revoked sessions and removed the lost MFA method. Issued a TAP to re-register MFA on a replacement. Escalated to Security and documented.",
    escalate: "Escalate to Security for lost/stolen devices with company access; involve MDM admins for wipe.",
    check: { q: "A work phone with mail + Authenticator is lost. A key action is to…", options: ["Do nothing until it's found", "Remote wipe / revoke sessions and re-register MFA elsewhere", "Reset the printer", "Buy new licences"], answer: 1, explain: "Contain the risk: wipe/revoke, then re-establish MFA securely." }
  },
  {
    id: "TCK-44", cat: "Security", difficulty: "Core", priority: "normal",
    ticket: { from: "Ellie Grant", org: "Caledonia Legal", subject: "Can I install this free tool?",
      body: "I found a free PDF converter online and want to install it to finish a task today." },
    task: "Apply software policy — don't just install unvetted software.",
    ask: ["Is it on the approved software list, or is there an approved equivalent?", "What's the actual task?", "Does policy require manager/security approval?"],
    steps: [
      "Do not install unvetted downloads on request.",
      "Check the approved software list for an equivalent that does the job.",
      "If nothing exists, follow the approval/request process (manager/security sign-off).",
      "Offer a safe alternative or built-in feature to meet today's deadline if possible.",
      "Document the decision."
    ],
    note: "Ellie Grant requested an unapproved PDF converter. Not on the approved list; offered the built-in 'Print to PDF' / an approved tool that met the need today. Logged the request for the approval process. No unvetted software installed.",
    escalate: "Route to Security/software-approval if no approved equivalent exists and a request is warranted.",
    check: { q: "A user wants an unapproved free tool installed today. You…", options: ["Just install it to be helpful", "Follow the approval process and offer an approved alternative", "Ignore the request", "Install it and hide it"], answer: 1, explain: "Unvetted software is a security risk — follow policy, offer alternatives." }
  },

  /* ================= User Lifecycle (4) ================= */
  {
    id: "TCK-45", cat: "User Lifecycle", difficulty: "Core", priority: "normal",
    ticket: { from: "Nadia Rees (HR)", org: "MaxNova Tech", subject: "New starter Monday",
      body: "New employee starts Monday — needs account, email, licence, group access and a laptop." },
    task: "Onboard a new starter against a checklist, ready before day one.",
    ask: ["Role, department and exact start date?", "Which groups/licences match the role?", "What hardware, and is stock available?"],
    steps: [
      "Get the role, department and start date from HR.",
      "Create the account with a secure initial password (change at first sign-in). Never email a password around insecurely.",
      "Assign the correct licence and add to role-based groups (least privilege).",
      "Prepare and enrol the laptop (e.g. via Intune/Autopilot); install standard apps.",
      "Test sign-in, hand over, and confirm everything works before the start date."
    ],
    note: "Onboarded new MaxNova Tech starter for Monday: created account (change-at-first-sign-in), assigned role licence and groups (least privilege), enrolled the laptop via Autopilot with standard apps. Verified sign-in ahead of the start date.",
    escalate: "Escalate if licences/hardware are unavailable, or role/access needs manager approval.",
    check: { q: "When creating a new starter's account, the password should be…", options: ["Emailed in plain text to everyone", "Set securely with change-at-first-sign-in", "Written in the ticket", "The same for all staff"], answer: 1, explain: "Never share passwords insecurely; force a change at first sign-in." }
  },
  {
    id: "TCK-46", cat: "User Lifecycle", difficulty: "Advanced", priority: "high",
    ticket: { from: "Nadia Rees (HR)", org: "MaxNova Tech", subject: "Leaver today",
      body: "An employee leaves today. Remove their access; their manager needs their files." },
    task: "Offboard securely and preserve/handover data — don't rush to delete.",
    ask: ["Exact last-working time to disable access?", "How should mail/files be handled (delegate to manager)?", "Any shared/privileged accounts to rotate?"],
    steps: [
      "Confirm the exact time to disable access with HR.",
      "Disable the account and revoke sessions at that time (disable, don't immediately delete — preserves data).",
      "Convert the mailbox to shared or delegate it to the manager; grant the manager access to needed files/OneDrive.",
      "Rotate any shared/privileged credentials the leaver knew.",
      "Follow retention policy before any eventual deletion; document actions."
    ],
    note: "Offboarded MaxNova Tech leaver: disabled account and revoked sessions at the confirmed time (not deleted). Delegated mailbox and OneDrive to the manager, rotated a shared credential. Retained per policy; documented.",
    escalate: "Escalate to Security for privileged-account rotation, and follow legal/retention policy on deletion.",
    check: { q: "For a leaver, the safe first step is usually to…", options: ["Delete everything immediately", "Disable the account and preserve/delegate data", "Do nothing for a month", "Give access to everyone"], answer: 1, explain: "Disable (not delete) to revoke access while preserving data for handover." }
  },
  {
    id: "TCK-47", cat: "User Lifecycle", difficulty: "Core", priority: "normal",
    ticket: { from: "Ellie Grant", org: "Caledonia Legal", subject: "Changed my surname",
      body: "I got married and changed my surname — can you update my email and name?" },
    task: "Update the user's name and (carefully) email, keeping old mail flowing.",
    ask: ["Confirm the new legal name (with HR).", "Do they want a new email address, or just display name?"],
    steps: [
      "Confirm the change with HR and the exact new name.",
      "Update the Display name.",
      "If the email address changes, add the NEW address as primary and KEEP the old one as an alias so mail to it still arrives.",
      "Notify them their sign-in may change if the UPN changes.",
      "Confirm mail flows to both and the new name shows."
    ],
    note: "Updated Ellie Grant's surname per HR. Set the new email as primary and retained the old address as an alias so existing mail still delivers. Updated display name; confirmed with the user.",
    escalate: "Escalate/plan if the sign-in UPN change affects many integrated systems.",
    check: { q: "When changing a user's email address, keep the old one as…", options: ["Deleted immediately", "An alias so existing mail still arrives", "A separate new mailbox", "A shared mailbox"], answer: 1, explain: "Retaining the old address as an alias prevents lost mail." }
  },
  {
    id: "TCK-48", cat: "User Lifecycle", difficulty: "Core", priority: "normal",
    ticket: { from: "IT Manager", org: "Guardian Risk Ltd", subject: "Internal role change",
      body: "A user moved from Sales to Finance and needs the right access for the new team." },
    task: "Re-align access to the new role using least privilege.",
    ask: ["Which groups/apps does the Finance role require?", "Which old access should be removed?"],
    steps: [
      "Confirm the access the new role needs (and what the old role no longer justifies).",
      "Add the user to the Finance role-based groups.",
      "Remove the Sales-specific access they no longer need (least privilege).",
      "Check licences/apps still fit the new role.",
      "Confirm the user can reach the new resources and can't the old ones."
    ],
    note: "Guardian Risk user moved Sales → Finance. Added to Finance groups and removed Sales-specific access (least privilege). Verified new resource access and that old access is gone. Confirmed with the user.",
    escalate: "Escalate to the resource/data owner if access requires their approval.",
    check: { q: "On a role change, besides granting new access you should…", options: ["Keep all old access too", "Remove access the old role no longer justifies", "Delete the account", "Reset all passwords"], answer: 1, explain: "Remove no-longer-needed access — least privilege reduces risk." }
  },

  /* ================= Telephony (2) ================= */
  {
    id: "TCK-49", cat: "Telephony", difficulty: "Core", priority: "normal",
    ticket: { from: "Reception", org: "Harbour Dental", subject: "One-way audio on calls",
      body: "On calls we can hear the caller but they can't hear us (or vice versa)." },
    task: "Diagnose one-way audio on a VoIP call.",
    ask: ["Which direction is missing?", "One handset or all?", "Recent network/firewall change?"],
    steps: [
      "Signalling worked (the call connected), so the AUDIO path (RTP) is the issue — usually firewall/NAT.",
      "Check whether it's one handset (local) or all (network/firewall).",
      "Confirm the handset/headset isn't muted and the correct device is selected.",
      "If all calls are affected one-way, suspect firewall/NAT blocking RTP or a QoS/routing change.",
      "Gather details and escalate to Networking/Telephony if it's an RTP/firewall issue."
    ],
    note: "Harbour Dental reception had one-way audio on all calls — call setup worked but RTP audio was blocked one direction. Not a single handset. Gathered details and escalated to Networking/Telephony for a firewall/NAT check on RTP.",
    escalate: "Escalate to Networking/Telephony — RTP/firewall/NAT issues are beyond first-line handset checks.",
    check: { q: "A call connects but there's one-way audio. Likely cause?", options: ["Wrong password", "RTP (audio) blocked by firewall/NAT", "The PBX is off", "A DNS issue"], answer: 1, explain: "Call setup (SIP) worked, so it's the audio path (RTP) being blocked." }
  },
  {
    id: "TCK-50", cat: "Telephony", difficulty: "Starter", priority: "normal",
    ticket: { from: "Sam Doyle", org: "Northstar Retail", subject: "Desk phone has no dial tone",
      body: "My desk phone is dead — no dial tone, screen is blank." },
    task: "Restore a dead VoIP handset (check the basics first).",
    ask: ["Any lights on the phone?", "Is it powered (PoE switch port or PSU)?", "One phone or several?"],
    steps: [
      "Check the phone has power — most are Power-over-Ethernet from the switch; look for screen/lights.",
      "Reseat the network/PoE cable at both ends; try a known-good port.",
      "If it powers but won't register, check it obtains an IP and reaches the phone system.",
      "Reboot the handset; confirm it registers and gets a dial tone.",
      "If several phones are dead, suspect the switch/PoE or phone system — escalate."
    ],
    note: "Sam Doyle's desk phone was dead. Reseating the PoE cable into a known-good port restored power; the handset registered and got a dial tone — original switch port was faulty. Confirmed calls work.",
    escalate: "Escalate to Networking/Telephony if multiple phones are down (PoE/switch or phone-system issue).",
    check: { q: "A single VoIP desk phone is dead. First thing to check?", options: ["The user's password", "Power (PoE cable/port) and reseat it", "The printer", "The VPN"], answer: 1, explain: "Most desk phones are PoE-powered — check power and the cable/port first." }
  }
];
