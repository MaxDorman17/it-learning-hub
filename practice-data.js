/* =====================================================================
   IT Engineer Learning Hub — practice-data.js
   QUIZZES: multiple-choice per topic (answer = index of correct option).
   SIMULATOR: branching ticket scenarios (node graph; endings are nodes
   with an `ending` of good | ok | bad).
   ===================================================================== */

window.QUIZZES = [
  {
    id: "quiz-identity", title: "Accounts & Identity", icon: "🔑",
    questions: [
      { q: "A caller asks you to reset their MFA. What must you do first?",
        options: ["Reset it quickly so they're not blocked", "Verify their identity per company policy", "Ask for their password", "Escalate to security"],
        answer: 1, explain: "MFA reset is the #1 social-engineering target. Always verify identity before touching it." },
      { q: "What was Microsoft Entra ID previously called?",
        options: ["Active Directory", "Azure AD", "Office 365", "Windows Hello"],
        answer: 1, explain: "Entra ID is the new name for Azure AD — Microsoft's cloud identity service." },
      { q: "An account keeps re-locking seconds after you unlock it. Most likely cause?",
        options: ["The server is broken", "A device/app is still using the old cached password", "The user forgot their password", "A Windows update"],
        answer: 1, explain: "The classic cause: a phone's email or a mapped drive keeps retrying the OLD password. Fix the source or it re-locks." },
      { q: "What does SSPR let a user do?",
        options: ["Share files securely", "Reset their own password after verifying identity", "Set up a shared mailbox", "Sync SharePoint"],
        answer: 1, explain: "Self-Service Password Reset lets users reset their own password — cutting your most common ticket." },
      { q: "A Temporary Access Pass (TAP) is used to…",
        options: ["Give temporary admin rights", "Bootstrap/recover an account, e.g. register a new Authenticator", "Bypass Conditional Access permanently", "Reset a mailbox"],
        answer: 1, explain: "A TAP is a time-limited passcode to get a user back in — handy when their MFA phone is lost." }
    ]
  },
  {
    id: "quiz-email", title: "Email & Collaboration", icon: "📧",
    questions: [
      { q: "A user says Outlook won't receive mail. Best first diagnostic?",
        options: ["Rebuild their Outlook profile", "Check webmail (OWA) at outlook.office.com", "Reinstall Office", "Reset their password"],
        answer: 1, explain: "If OWA works, the problem is the client, not the mailbox — instantly narrows it down." },
      { q: "What is an NDR?",
        options: ["A network diagnostic report", "A Non-Delivery Report (bounce-back)", "A new device request", "A named domain record"],
        answer: 1, explain: "The bounce-back email; its code (e.g. 550) tells you why delivery failed." },
      { q: "Which tool proves whether an email was delivered, blocked, or quarantined?",
        options: ["Message trace", "Task Manager", "Sign-in logs", "ipconfig"],
        answer: 0, explain: "Message trace in the Exchange admin center is your evidence tool for 'I never got it'." },
      { q: "Does a shared mailbox under 50 GB need its own licence?",
        options: ["Yes, always", "No", "Only if it has a calendar", "Only for external users"],
        answer: 1, explain: "Shared mailboxes under 50 GB are free — no licence required." },
      { q: "Teams is stuck on the loading/sign-in screen. Common fix?",
        options: ["Reinstall Windows", "Clear the Teams cache and restart", "Reset the password", "Buy more licences"],
        answer: 1, explain: "Clearing the Teams cache resolves most sign-in and loading loops." }
    ]
  },
  {
    id: "quiz-ms365", title: "MS365 Admin", icon: "☁️",
    questions: [
      { q: "Which portal has sign-in logs and Conditional Access?",
        options: ["Exchange admin center", "Entra admin center", "SharePoint admin center", "Teams admin center"],
        answer: 1, explain: "Identity lives in Entra (entra.microsoft.com) — sign-in logs, MFA, Conditional Access." },
      { q: "Where do you run a message trace?",
        options: ["Entra admin center", "Exchange admin center", "Intune", "Security portal"],
        answer: 1, explain: "Mail flow and message trace are in the Exchange admin center." },
      { q: "How long is a deleted SharePoint site recoverable?",
        options: ["7 days", "30 days", "93 days", "Forever"],
        answer: 2, explain: "Deleted sites can be restored for 93 days before permanent deletion." },
      { q: "Giving an account only the access it needs is called…",
        options: ["Zero trust", "Least privilege", "Role hoarding", "Delegation"],
        answer: 1, explain: "Least privilege limits the damage if an account is compromised." },
      { q: "Which SharePoint permission level is read-only?",
        options: ["Owner", "Member", "Visitor", "Editor"],
        answer: 2, explain: "Visitor = read-only; Member can edit; Owner can manage permissions." }
    ]
  },
  {
    id: "quiz-voip", title: "VoIP", icon: "📞",
    questions: [
      { q: "What does SIP handle in a VoIP call?",
        options: ["The audio stream", "Signalling — setting up and ending the call", "Billing", "Encryption only"],
        answer: 1, explain: "SIP is the signalling: dialling, ringing, connecting and ending. RTP carries the audio." },
      { q: "A call connects and rings, but there's one-way audio. Most likely cause?",
        options: ["Wrong password", "RTP (the audio) is blocked — firewall/NAT", "The PBX is off", "A DNS issue"],
        answer: 1, explain: "SIP worked (it connected), so the audio path RTP is being blocked — usually firewall or NAT." },
      { q: "Choppy, robotic audio on calls usually points to…",
        options: ["A licensing problem", "Jitter / packet loss on the network", "A dead handset", "Wrong extension"],
        answer: 1, explain: "Voice is real-time — jitter and packet loss (network problems) cause choppy audio." },
      { q: "What does QoS do?",
        options: ["Encrypts calls", "Prioritises voice traffic over other data", "Records calls", "Assigns phone numbers"],
        answer: 1, explain: "Quality of Service prioritises voice so a big download doesn't wreck a call." },
      { q: "A DID is…",
        options: ["A device ID", "A phone number that rings a specific person directly", "A data identifier", "A directory index"],
        answer: 1, explain: "Direct Inward Dialling — a public number that rings one extension/user directly." }
    ]
  },
  {
    id: "quiz-devices", title: "Devices & Network", icon: "🖥️",
    questions: [
      { q: "Which command clears the DNS cache?",
        options: ["ipconfig /flushdns", "ping /clear", "netsh reset", "sfc /scannow"],
        answer: 0, explain: "ipconfig /flushdns clears cached DNS entries — fixes 'can't reach a site others can'." },
      { q: "A print queue is jammed. Which service do you restart?",
        options: ["Windows Update", "Print Spooler", "DNS Client", "Workstation"],
        answer: 1, explain: "Restarting the Print Spooler clears most stuck-queue tickets." },
      { q: "First tool to see what's slowing a PC down?",
        options: ["Task Manager", "Notepad", "Registry Editor", "Disk Defragmenter"],
        answer: 0, explain: "Task Manager shows CPU/disk/RAM usage and startup apps — the truth about a slow PC." },
      { q: "Which command repairs corrupted Windows system files?",
        options: ["chkdsk", "sfc /scannow", "gpupdate /force", "tracert"],
        answer: 1, explain: "sfc /scannow scans and repairs protected system files (run as admin)." },
      { q: "A VPN typically authenticates using which credentials?",
        options: ["A separate VPN-only password", "The user's AD/network login", "A one-time code only", "No credentials"],
        answer: 1, explain: "VPN usually uses the AD/Entra login — so a lockout or wrong password blocks it too." }
    ]
  },
  {
    id: "quiz-ai", title: "AI & Automation", icon: "🤖",
    questions: [
      { q: "Sempervox's ticket portal is built on which Microsoft technology?",
        options: ["SharePoint lists", "Power Apps / Dataverse", "Excel", "Exchange"],
        answer: 1, explain: "It's a Power Apps portal on Dataverse — which is why Power Automate & Copilot Studio fit so well." },
      { q: "What is Power Automate for?",
        options: ["Building databases", "Automating workflows ('when X, do Y')", "Editing documents", "Managing licences"],
        answer: 1, explain: "Power Automate builds event-driven flows and desktop RPA across apps." },
      { q: "Copilot Studio is used to build…",
        options: ["Spreadsheets", "Custom AI agents / chatbots", "VPN tunnels", "Phone systems"],
        answer: 1, explain: "Copilot Studio builds low-code AI agents on Dataverse and your knowledge sources." },
      { q: "What's the golden rule when using AI output for customers?",
        options: ["Trust it completely", "Draft with it, then verify before sending", "Never use it", "Only use it for jokes"],
        answer: 1, explain: "AI drafts, you verify. Never send unchecked AI output — and mind what data you put in." },
      { q: "The Hermes agent is made by…",
        options: ["Microsoft", "Google", "Nous Research (open-source)", "Sempervox"],
        answer: 2, explain: "Hermes is Nous Research's open-source AI agent platform — separate from Microsoft's stack." }
    ]
  },
  {
    id: "quiz-md102-devices", title: "MD-102: Devices & Intune", icon: "📲",
    questions: [
      { q: "A Windows device is Entra joined but won't auto-enrol into Intune. What's the most common cause?",
        options: ["No internet", "The user has no Intune licence, or MDM user scope isn't set", "Wrong time zone", "BitLocker is off"],
        answer: 1, explain: "Automatic enrollment needs an Intune licence AND the Entra MDM user scope set to All (or the user's group)." },
      { q: "For a personal BYOD phone, which remote action removes ONLY company data?",
        options: ["Wipe", "Retire", "Fresh Start", "Reset"],
        answer: 1, explain: "Retire unenrols the device and removes company data/policies only, leaving personal data. Wipe factory-resets everything." },
      { q: "In Windows Autopilot, what does the Enrollment Status Page (ESP) do?",
        options: ["Assigns licences", "Shows deployment progress and can block the desktop until required apps/policies apply", "Resets the password", "Joins the device to a domain"],
        answer: 1, explain: "The ESP tracks setup and can hold the device at OOBE until required apps and policies finish — a stuck app there blocks the desktop." },
      { q: "You need a device's BitLocker recovery key for a managed laptop. Where is it?",
        options: ["Printed in the box", "Escrowed to Entra ID / Intune (look up by Key ID)", "Only on the device", "Emailed to the user"],
        answer: 1, explain: "Managed devices escrow the key to Entra/Intune — retrieve it under the device's Recovery keys, matching the Key ID." },
      { q: "An Intune 'Required' app never installs, but the device is online. First thing to check?",
        options: ["Reinstall Windows", "The app's assignment — is the user/device actually in the Required group?", "Buy more licences", "Reset the router"],
        answer: 1, explain: "If it's not assigned to that user/device (or only Available), it won't install. Check assignment, then detection rules and sync." }
    ]
  },
  {
    id: "quiz-md102-security", title: "MD-102: Compliance & Security", icon: "🛡️",
    questions: [
      { q: "A compliance policy on its own will…",
        options: ["Block access to email", "Only label a device Compliant or Not compliant", "Wipe the device", "Reset the password"],
        answer: 1, explain: "Compliance policy = the health check (label only). Conditional Access is what actually blocks access based on that label." },
      { q: "What actually enforces 'only compliant devices can reach email'?",
        options: ["The compliance policy", "A Conditional Access policy requiring a compliant device", "BitLocker", "Autopilot"],
        answer: 1, explain: "Conditional Access does the enforcing — 'require device to be marked as compliant'. The two work as a pair." },
      { q: "When is device compliance evaluated?",
        options: ["Instantly on any change", "When the device checks in / syncs with Intune", "Once a month", "Only at enrollment"],
        answer: 1, explain: "Compliance is evaluated at check-in — that's why you force a Sync after fixing a failing setting." },
      { q: "The default 'Mark device noncompliant' action is set to how many days by default?",
        options: ["0 (immediately)", "7", "30", "It's optional"],
        answer: 0, explain: "It's automatic, can't be removed, and defaults to 0 days (immediate). Change its schedule to create a grace period." },
      { q: "The tenant setting 'Mark devices with no compliance policy as' matters because…",
        options: ["It sets the time zone", "If set to Not compliant, devices without any policy can be blocked by Conditional Access", "It assigns licences", "It controls BitLocker"],
        answer: 1, explain: "A classic lockout trap: no policy + this set to Not compliant + Conditional Access = users blocked." }
    ]
  }
];

window.SIMULATOR = [
  {
    id: "sim-email", title: "The bounced emails", icon: "📧", difficulty: "Easy",
    ticket: { from: "Sarah — Accounts", subject: "Can't send emails",
      body: "\"None of my emails are sending — they keep bouncing straight back to me. It started this morning and I've got invoices to get out!\"" },
    start: "s0",
    nodes: {
      s0: { text: "What's your first move?", choices: [
        { label: "Ask Sarah to read out the exact bounce-back (NDR) message", to: "diag" },
        { label: "Start rebuilding her Outlook profile right away", to: "premature" },
        { label: "Escalate to L2 — sounds complicated", to: "earlyesc" }
      ]},
      premature: { text: "You spend 20 minutes rebuilding her profile. It changes nothing — and you still have no idea what's actually wrong. Sarah's getting more stressed. Lesson: diagnose before you fix.", choices: [
        { label: "Go back and actually diagnose it", to: "diag" }
      ]},
      earlyesc: { text: "L2 bounces it straight back: \"What have you tried? What does the error say?\" You haven't gathered anything yet. Escalating with no diagnosis just wastes everyone's time.", choices: [
        { label: "Do the basic diagnosis yourself first", to: "diag" }
      ]},
      diag: { text: "Sarah reads the NDR: \"Your message wasn't delivered because your mailbox is full.\" You also check webmail (OWA) — same problem there. What now?", choices: [
        { label: "Check her mailbox size and help her free up space", to: "fixquota" },
        { label: "Rebuild her Outlook profile", to: "wrongfix" },
        { label: "Reset her password", to: "irrelevant" }
      ]},
      wrongfix: { text: "OWA failed too — so it's NOT the client, it's the mailbox. Rebuilding the profile can't fix a full mailbox. Back to the real cause.", choices: [
        { label: "Address the full mailbox", to: "fixquota" }
      ]},
      irrelevant: { text: "A password has nothing to do with a full mailbox — and now she has to sign in again for no reason. Refocus on the actual error.", choices: [
        { label: "Address the full mailbox", to: "fixquota" }
      ]},
      fixquota: { text: "Her mailbox is at 100% of its quota. You help her empty Deleted Items and archive old mail — and email starts flowing again. Do you close the ticket here?", choices: [
        { label: "Document the cause, advise on archiving to prevent it recurring, then close", to: "end_good" },
        { label: "Just close it — it's working now", to: "end_ok" }
      ]},
      end_good: { ending: "good", text: "Textbook. You diagnosed before fixing, used OWA to isolate client vs mailbox, found the root cause, and prevented the repeat. That's exactly how a good L1 works a ticket." },
      end_ok: { ending: "ok", text: "You fixed it — but you didn't document the cause or help her prevent it, so the mailbox will fill up again and she'll be back. Resolving the symptom isn't the same as closing the loop." }
    }
  },
  {
    id: "sim-lockout", title: "The urgent unlock", icon: "🔒", difficulty: "Medium",
    ticket: { from: "Unknown caller", subject: "Locked out — urgent!",
      body: "\"Hi, it's Dave from Sales. I'm locked out of my account and I'm about to miss a huge deadline — can you just unlock me quickly? I don't have time for questions.\"" },
    start: "s0",
    nodes: {
      s0: { text: "The caller is pushy and in a hurry. What's your FIRST action?", choices: [
        { label: "Verify their identity per company policy before doing anything", to: "verified" },
        { label: "Unlock immediately — they sound genuinely stressed", to: "socialeng" },
        { label: "Reset their password to be safe", to: "hasty" }
      ]},
      socialeng: { text: "You unlock without verifying. It later emerges the caller was NOT Dave — an attacker used urgency to pressure you into handing over access. This is a real security incident, and the pressure tactic was the red flag.", choices: [
        { label: "See how it should have gone", to: "verified" }
      ]},
      hasty: { text: "Resetting the password without verifying identity has the same problem as unlocking — you could be helping an attacker, and you've now also disrupted the real user. Identity check comes first, always.", choices: [
        { label: "Do the identity check", to: "verified" }
      ]},
      verified: { text: "You verify identity per policy — it really is Dave. You unlock the account. Two minutes later, it locks again. Why?", choices: [
        { label: "A device or app is still using his old cached password", to: "findsource" },
        { label: "Assume compromise and escalate to security immediately", to: "reasonable" },
        { label: "Just keep unlocking it each time", to: "loop" }
      ]},
      loop: { text: "You unlock it again... and again. Without finding what's causing the bad attempts, you'll be doing this all day. Find the source.", choices: [
        { label: "Investigate what's locking it", to: "findsource" }
      ]},
      reasonable: { text: "Not unreasonable to be security-minded — but check the simple, common cause first. Repeated lockouts right after a password change usually mean a cached old password, not an attacker.", choices: [
        { label: "Check for a cached password first", to: "findsource" }
      ]},
      findsource: { text: "You ask what devices Dave uses. He changed his password last week, but his phone's email still has the old one saved — it's been retrying and locking him out. You update the password on his phone. Next?", choices: [
        { label: "Confirm it stays unlocked, then document the cause", to: "end_good" },
        { label: "Close it — he can get in now", to: "end_ok" }
      ]},
      end_good: { ending: "good", text: "Excellent. You resisted the urgency pressure, verified identity (the security-critical step), found the real source of the lockouts, and documented it. That's a mature L1 engineer." },
      end_ok: { ending: "ok", text: "You found and fixed the cause — good — but closing without documenting means the next engineer won't know the history if it recurs. Always leave a clear trail." }
    }
  },
  {
    id: "sim-vpn", title: "Day-one VPN fail", icon: "🔐", difficulty: "Medium",
    ticket: { from: "Tom — new starter", subject: "VPN won't connect",
      body: "\"It's my first day! I've got my laptop set up but the VPN won't connect — it says 'authentication failed'. I can't reach any of the work systems.\"" },
    start: "s0",
    nodes: {
      s0: { text: "Tom is brand new today. What do you check first?", choices: [
        { label: "Confirm his general internet works and his credentials are right", to: "creds" },
        { label: "Reinstall the VPN client immediately", to: "premature" },
        { label: "Assume the VPN server is down and escalate", to: "earlyesc" }
      ]},
      premature: { text: "You reinstall the client — 15 minutes gone, still 'authentication failed'. You jumped to a fix before understanding the problem. Diagnose first.", choices: [
        { label: "Actually diagnose it", to: "creds" }
      ]},
      earlyesc: { text: "Network team checks: the VPN server is fine and dozens of others are connected right now. Escalating on an assumption made you look like you skipped the basics.", choices: [
        { label: "Diagnose it properly", to: "creds" }
      ]},
      creds: { text: "His internet is fine, and he can sign into his laptop and email — so his password is correct. It's specifically the VPN rejecting him, and he's a brand-new starter. Most likely cause?", choices: [
        { label: "He hasn't been added to the VPN-allowed security group yet", to: "group" },
        { label: "His password must be wrong", to: "wrongpw" },
        { label: "The VPN server is down", to: "serverdown" }
      ]},
      wrongpw: { text: "He just logged into email with that password, so it's clearly correct. 'Authentication failed' on VPN specifically points at authorisation (group membership), not the password itself.", choices: [
        { label: "Check his group membership", to: "group" }
      ]},
      serverdown: { text: "Others are connected fine, so the server's up. For a new starter, the issue is almost always their own access/config, not the infrastructure.", choices: [
        { label: "Check his group membership", to: "group" }
      ]},
      group: { text: "You check — Tom isn't in the 'VPN Users' security group (a very common day-one gap). You add him, he reconnects a moment later... and he's in. Anything else?", choices: [
        { label: "Document it and flag adding VPN group to the onboarding checklist", to: "end_good" },
        { label: "Close the ticket — he's working now", to: "end_ok" }
      ]},
      end_good: { ending: "good", text: "Brilliant. You diagnosed logically (internet → credentials → authorisation), found the missing group, AND improved the onboarding process so the next starter doesn't hit it. That's above-and-beyond L1." },
      end_ok: { ending: "ok", text: "You fixed Tom's problem correctly — nice diagnosis. But without flagging the onboarding gap, the next new starter will hit the exact same wall. Spotting the pattern is what makes you stand out." }
    }
  }
];
