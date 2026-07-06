/* =====================================================================
   IT Engineer Learning Hub — runbooks-data.js
   The L1 ticket runbook library. Each runbook follows one shape:
     symptom → questions to ask → diagnosis → fix → escalate-if.
   Light markup supported in strings: **bold** and `code`.
   Steps starting with "**Lead:** rest" render the lead in bold.
   ===================================================================== */
window.RUNBOOKS = [

  /* ---------------- Accounts & Identity ---------------- */
  {
    id: "password-reset",
    title: "Password reset",
    category: "Accounts & Identity",
    icon: "🔑",
    difficulty: "Easy",
    time: "5 min",
    summary: "Get a locked-out-of-their-password user back in safely, in cloud (Entra ID) or on-prem AD.",
    symptom: "User says their password \"isn't working\", they've forgotten it, or it's expired and they can't sign in.",
    askUser: [
      "**Which account exactly?** Windows sign-in, Microsoft 365 / email, or a specific app? They're often different passwords.",
      "**What's the exact error message** on screen? \"Wrong password\" is different from \"account locked\" or \"can't reach server\".",
      "Have you **recently changed** your password, or did it just stop working?",
      "Are you **on-site or working remotely** (over VPN)?",
      "Is it **just you**, or are colleagues having the same problem? (Rules out a wider outage.)"
    ],
    diagnose: [
      "Work out **where the identity lives**. In a Microsoft 365 shop most users are cloud accounts in **Entra ID** (formerly Azure AD). If they're **hybrid/synced** from on-prem Active Directory, the password may have to be reset in on-prem AD.",
      "Rule out a **lockout** — a locked account behaves like a wrong password but the fix is different (see the Account lockout runbook).",
      "Check **Sign-in logs** in the Entra admin center (`entra.microsoft.com` → Users → Sign-in logs) to see the real failure reason.",
      "Confirm you're **talking to the right person** — verify identity before you reset anything."
    ],
    fix: [
      "**Cloud (Entra ID) reset:** `admin.microsoft.com` → **Users → Active users** → pick the user → **Reset password**. Let it auto-generate a password and tick **\"Require this user to change their password when they first sign in\"**.",
      "**Hybrid / on-prem AD:** reset in **Active Directory Users & Computers** (or via self-service if password writeback is configured), then wait for sync — or force it with a delta sync on the server.",
      "**Deliver the temp password securely** — don't just email or Teams it in plain text. Phone them, or use a one-time-secret link. Never dictate it to someone whose identity you haven't verified.",
      "**Confirm they can sign in** and set a new password of their own.",
      "**Prevent the repeat:** make sure they're registered for **SSPR (Self-Service Password Reset)** at `aka.ms/sspr` so next time they can reset it themselves."
    ],
    escalate: [
      "The account is in **on-prem AD you don't have rights to** reset.",
      "**SSPR or password writeback is broken** and needs configuration.",
      "**Repeated resets** or resets you didn't expect → possible account compromise, hand to security."
    ],
    related: ["account-lockout", "mfa-reset"],
    tags: ["password", "entra", "azure ad", "sspr", "reset", "sign in", "login", "credentials"]
  },

  {
    id: "account-lockout",
    title: "Account lockout",
    category: "Accounts & Identity",
    icon: "🔒",
    difficulty: "Medium",
    time: "10 min",
    summary: "Unlock an account and — the important bit — find and kill the source of the bad password attempts so it doesn't re-lock.",
    symptom: "\"Your account has been locked\", or the user keeps getting locked out even though they know the correct password.",
    askUser: [
      "**What's the exact message**, and does it say locked, or just wrong password?",
      "**When did it start**, and have you changed your password recently?",
      "**How many devices** do you sign in on — phone, laptop, desktop, tablet?",
      "Did you set up **anything new** recently — a new phone, mapped drive, saved Wi-Fi, or app?"
    ],
    diagnose: [
      "The **#1 cause**: a device or app still using the **OLD password** after a change — a phone's email profile, a mapped drive, a saved VPN/Wi-Fi credential, or a service. It hammers the account with the wrong password and locks it.",
      "**Entra ID:** check **Sign-in logs** for the failing app and source IP. Entra uses **Smart Lockout**, which locks the attacker out but tries to keep the real user working.",
      "**On-prem AD:** on the domain controller, look for **event 4740** (account locked) to find the source computer/app of the bad attempts."
    ],
    fix: [
      "**Verify the caller's identity first** — unlocking is security-sensitive.",
      "**Unlock it.** On-prem AD: **ADUC → the user → Account tab → Unlock**. Cloud smart-lockout usually clears itself in ~60 seconds; if in doubt, reset the password.",
      "**Find and fix the source** — this is the real fix. Update the cached password on the offending phone/app/drive. If you skip this, it re-locks within minutes.",
      "**Reset the password** if you suspect the account is compromised, and revoke active sessions.",
      "**Confirm** the account stays unlocked for a few minutes after the source is fixed."
    ],
    escalate: [
      "**Repeated lockouts** where you can't find the source.",
      "Sign-in logs show attempts **from unexpected countries/IPs** → likely attack, hand to security immediately."
    ],
    related: ["password-reset", "mfa-reset"],
    tags: ["lockout", "locked", "account", "4740", "smart lockout", "cached password"]
  },

  {
    id: "mfa-reset",
    title: "MFA reset / re-register",
    category: "Accounts & Identity",
    icon: "📱",
    difficulty: "Medium",
    time: "10 min",
    summary: "Re-register a user's multi-factor authentication after a new/lost phone — the single most social-engineered helpdesk request, so identity checks matter.",
    symptom: "New phone, lost/broken phone, changed number, or not receiving the approval prompt, so they can't get past the MFA step.",
    askUser: [
      "**⚠️ Verify identity strictly first.** MFA reset is the classic target for attackers phoning the helpdesk — follow your company's ID-check policy to the letter.",
      "**What changed** — new phone, lost phone, new number, or app just not prompting?",
      "**Which method** are you set up with — the Microsoft Authenticator app, text message, or phone call?",
      "**Can you still sign in at all**, or are you fully locked out at the MFA step?"
    ],
    diagnose: [
      "Check the user's registered methods: **Entra admin center → Users → the user → Authentication methods**.",
      "If the phone is **lost or replaced**, the old method is dead — they need to re-register a new one.",
      "If prompts just aren't arriving, check for a simpler cause: no signal/data, notifications disabled, or wrong account in the Authenticator app."
    ],
    fix: [
      "**Confirm identity per policy** before touching anything — this is the whole ballgame for MFA.",
      "**Entra admin center → Users → the user → Authentication methods.** Delete the old/lost method and/or **Revoke MFA sessions**, so the next sign-in forces re-registration.",
      "**Have the user re-register** at `aka.ms/mfasetup` or on their next sign-in — add the Authenticator app on the new phone.",
      "For a smooth passwordless bootstrap you can issue a **Temporary Access Pass (TAP)** from Authentication methods.",
      "**Confirm** they can complete MFA and sign in."
    ],
    escalate: [
      "**You cannot verify the caller's identity** — do not reset; escalate.",
      "Signs of **account takeover** (mailbox rules, unexpected sign-ins) → security.",
      "**Conditional Access** is blocking them for a policy reason beyond MFA registration."
    ],
    related: ["password-reset", "account-lockout"],
    tags: ["mfa", "2fa", "authenticator", "multi factor", "tap", "temporary access pass", "otp", "verification"]
  },

  /* ---------------- User Lifecycle ---------------- */
  {
    id: "new-user-onboarding",
    title: "New user onboarding",
    category: "User Lifecycle",
    icon: "👤",
    difficulty: "Medium",
    time: "20–30 min",
    summary: "Create, licence, and set up a new starter so they can work on day one — the tidiest way is to copy an existing similar user's access.",
    symptom: "HR or a manager raises a ticket for a new starter who needs an account, email, and access.",
    askUser: [
      "**Full name, job title, department, and their manager?**",
      "**Start date** — and should the account be ready and enabled for that morning?",
      "**Which licence** do they need (e.g. Business Premium)?",
      "**\"Same as\" who?** Is there an existing person whose groups, shared mailboxes and access you should copy? This is the fastest, most reliable route.",
      "**What hardware** do they need, and where is it going?"
    ],
    diagnose: [
      "Check there's a **free licence in the pool** — if not, one needs buying (approval).",
      "Confirm the **username naming convention** (e.g. `firstname.lastname@domain`).",
      "Gather the list of **groups, distribution lists, shared mailboxes and Teams** they should join."
    ],
    fix: [
      "**Create the user:** `admin.microsoft.com` → **Users → Active users → Add a user**. Set display name and username per convention.",
      "**Password:** auto-generate, require change on first sign-in, and plan secure hand-off to the manager.",
      "**Assign the licence** from the available pool, and set **usage location**.",
      "**Roles:** normally none — **least privilege**. Only add admin roles with sign-off.",
      "**Add to groups / distribution lists / shared mailboxes / Teams** — copy from the \"same as\" user where possible.",
      "**Fill in the profile:** manager, job title, department (drives dynamic groups and the org chart).",
      "**Device:** provision the hardware and enrol it (e.g. in Intune) if that's how the estate is managed.",
      "**Document it in the ticket portal** and hand the credentials to the manager securely."
    ],
    escalate: [
      "A **licence must be purchased** — needs approval.",
      "They need **admin roles or special/privileged access** — needs sign-off.",
      "Bespoke line-of-business app access you don't own → the relevant app owner."
    ],
    related: ["user-offboarding", "shared-mailbox-access"],
    tags: ["onboarding", "new starter", "new user", "create account", "provisioning", "licence", "joiner"]
  },

  {
    id: "user-offboarding",
    title: "User offboarding (leaver)",
    category: "User Lifecycle",
    icon: "🚪",
    difficulty: "Medium",
    time: "20 min",
    summary: "Cut off a leaver's access cleanly at the right moment while preserving their email and files for the business.",
    symptom: "HR raises a leaver ticket — an account needs disabling, usually at a specific date/time.",
    askUser: [
      "**Exact last day and time** — and should access be cut **immediately** or at end of day?",
      "**Who takes over their email and files** — their manager or a named delegate?",
      "**Is email forwarding** to someone required?",
      "**Do they own** any shared mailboxes, Teams, or distribution lists that need reassigning?",
      "**⚠️ Any legal hold or investigation?** If so, preserve everything and escalate first."
    ],
    diagnose: [
      "Map what they had: **group memberships, shared mailboxes, delegated access, owned resources, licences**.",
      "Decide the **mailbox plan**: convert to a shared mailbox (keeps email with no licence, if under 50 GB) or forward + delegate."
    ],
    fix: [
      "**Block sign-in** at the agreed time: `admin.microsoft.com` → the user → **Block sign-in**.",
      "**Reset the password and revoke sessions** (sign out everywhere) so live sessions and tokens die.",
      "**Remove MFA methods** so the account can't be re-authenticated.",
      "**Handle the mailbox:** convert to **shared** (Exchange admin center) so colleagues keep access, or set forwarding/delegate to the manager.",
      "**Remove licences** *after* converting the mailbox — this frees the licence and stops billing.",
      "**Reassign resources:** remove from groups/DLs, transfer ownership of Teams/shared mailboxes.",
      "**OneDrive:** grant the manager access to their files (set OneDrive access delegation before the account is deleted).",
      "**Device:** retrieve the hardware and retire/wipe it in Intune. **Document** everything in the ticket."
    ],
    escalate: [
      "**Legal hold, litigation, or an HR investigation** — do not delete anything; preserve and escalate.",
      "Deleting the mailbox/account entirely (vs disabling) — confirm the retention decision with the business."
    ],
    related: ["new-user-onboarding", "shared-mailbox-access"],
    tags: ["offboarding", "leaver", "disable account", "block sign in", "shared mailbox", "deprovision", "termination"]
  },

  /* ---------------- Email & Collaboration ---------------- */
  {
    id: "outlook-send-receive",
    title: "Outlook can't send or receive",
    category: "Email & Collaboration",
    icon: "📧",
    difficulty: "Medium",
    time: "15 min",
    summary: "Diagnose stuck email — the golden first test is whether webmail (OWA) works, which instantly tells you if it's the client or the mailbox.",
    symptom: "Emails stuck in the Outbox, nothing coming in, bounce-backs (NDRs), or Outlook says \"Disconnected\".",
    askUser: [
      "**What's the exact error** or bounce-back text? An NDR usually contains a **code** that tells you the cause.",
      "**Sending, receiving, or both?**",
      "**Just you, or colleagues too?**",
      "**Does webmail work?** Ask them to sign in at `outlook.office.com` — this is the key test.",
      "**When did it start**, and were you sending a **large attachment**?"
    ],
    diagnose: [
      "**Test in OWA (`outlook.office.com`).** If webmail works fine, the problem is the **Outlook client / profile / local network**, not the mailbox or the service.",
      "**Check connection status:** Ctrl+click the Outlook tray icon → **Connection Status**. \"Disconnected\" or \"Trying to connect\" points at network/profile.",
      "**Read the NDR code:** `550` = rejected / recipient doesn't exist / blocked; `5.7.1` = blocked or no permission; a **mailbox-full** message = over quota.",
      "**Check service health** in the admin center for a Microsoft-side outage.",
      "**Run a message trace** (Exchange admin center → Mail flow → Message trace) to see whether mail left, was blocked, or was quarantined."
    ],
    fix: [
      "**Stuck in Outbox:** check **Send/Receive → Work Offline** isn't toggled on; a too-large attachment can also jam the Outbox.",
      "**Mailbox full:** archive/clean up, or raise the quota.",
      "**Client issues:** restart Outlook; try a **new Outlook profile** (Control Panel → Mail → Show Profiles); start in **safe mode** to rule out add-ins; repair the OST; update Office.",
      "**Blocked / spam:** check **quarantine** and allow/block lists; use message trace to confirm delivery.",
      "**Bounces to one contact:** a stale autocomplete entry — delete the cached recipient and retype the address."
    ],
    escalate: [
      "**Mail-flow, connector, or domain issues** (MX, SPF/DKIM/DMARC) → Exchange/email admin.",
      "A **service-wide outage** in service health — communicate and wait.",
      "**Mailbox migration** problems."
    ],
    related: ["shared-mailbox-access", "teams-issues"],
    tags: ["outlook", "email", "ndr", "bounce", "send receive", "outbox", "owa", "exchange", "quarantine", "disconnected"]
  },

  {
    id: "teams-issues",
    title: "Microsoft Teams issues",
    category: "Email & Collaboration",
    icon: "💬",
    difficulty: "Easy",
    time: "10 min",
    summary: "Sign-in loops, missing chats, and call/audio problems in Teams — most clear up with a cache clear or the right device selected.",
    symptom: "Can't sign in / stuck on the loading screen, missing teams or chats, or call and audio problems.",
    askUser: [
      "**Is it sign-in, something inside the app, or call quality?**",
      "**Desktop app, web, or mobile?**",
      "**Just you, or others too?**",
      "**Any error code?** Codes starting `caa` are authentication-related.",
      "**Did it start after an update** or a password change?"
    ],
    diagnose: [
      "**Try the web version** at `teams.microsoft.com`. If that works, the desktop client is the problem.",
      "**Check service health** for a Teams outage.",
      "**Audio problems:** check the correct **microphone/speaker** are selected and the OS has given Teams **permission**."
    ],
    fix: [
      "**Sign-in / loading:** sign out, fully quit Teams, **clear the Teams cache**, then restart. (Classic Teams: delete `%appdata%\\Microsoft\\Teams`. New Teams: use its built-in clear-cache/repair option.)",
      "**Call / audio:** in **Settings → Devices** pick the right mic and speaker, check headset connection and OS permissions, then run a **test call**.",
      "**Missing teams/chats:** check hidden teams and chat filters, and confirm they're still a member.",
      "**Notifications:** check Teams notification settings and Windows **Focus/Do Not Disturb**.",
      "Still stuck? **Update or reinstall** the Teams client."
    ],
    escalate: [
      "**Policy or provisioning** issues (Teams admin center).",
      "**Calling plan / phone system** problems.",
      "Persistent **Conditional Access** auth blocks."
    ],
    related: ["outlook-send-receive", "onedrive-sharepoint-sync"],
    tags: ["teams", "sign in", "cache", "audio", "microphone", "call quality", "caa", "meetings"]
  },

  {
    id: "onedrive-sharepoint-sync",
    title: "OneDrive / SharePoint sync & access",
    category: "Email & Collaboration",
    icon: "🗂️",
    difficulty: "Medium",
    time: "15 min",
    summary: "Files not syncing or \"access denied\" — remember that a sync error and a permissions error look similar but are fixed very differently.",
    symptom: "Files won't sync, a red X on the OneDrive icon, stuck \"processing changes\", or \"access denied\" opening a SharePoint site/library.",
    askUser: [
      "**Is it OneDrive (your own files) or a SharePoint library** (a shared/team area)?",
      "**What does the icon or error say** — red X, paused, or an access-denied message?",
      "**One file or everything?**",
      "**Just you, or the whole team?**",
      "**Was anything recently shared or changed** in permissions?"
    ],
    diagnose: [
      "**Read the OneDrive icon:** blue = syncing, green/check = synced, red = error, paused = paused. A red X is a **sync** problem.",
      "**\"Access denied\" is usually permissions, not sync** — the file is fine, the user just lacks rights.",
      "**Check storage:** local disk full, or OneDrive/SharePoint **quota** full, both stop syncing."
    ],
    fix: [
      "**Sync errors:** open OneDrive settings, **pause and resume**, or restart OneDrive. For stubborn cases, **reset OneDrive** (`onedrive.exe /reset`) and let it re-sync.",
      "**File won't sync:** check it isn't **open/locked** elsewhere, and that the name has no illegal characters or an over-long path.",
      "**Access denied:** verify the user's **SharePoint permission level** (Owner/Member/Visitor), check the **sharing link**, and re-grant access if needed.",
      "**Storage full:** free disk space, turn on **Files On-Demand**, or raise the quota.",
      "**Confirm** the file syncs/opens for the user."
    ],
    escalate: [
      "**Permission architecture** or broken inheritance on a site → SharePoint admin.",
      "A sync issue **affecting many users** or a whole site.",
      "Site-collection or storage-limit changes."
    ],
    related: ["teams-issues", "new-user-onboarding"],
    tags: ["onedrive", "sharepoint", "sync", "access denied", "permissions", "files on demand", "reset", "storage"]
  },

  {
    id: "shared-mailbox-access",
    title: "Shared mailbox / distribution list access",
    category: "Email & Collaboration",
    icon: "📬",
    difficulty: "Easy",
    time: "10 min",
    summary: "Grant access to a shared mailbox or add someone to a distribution list — know the difference between Full Access, Send As, and Send on Behalf.",
    symptom: "A user needs to see a shared mailbox, send as it, or be added to a distribution list.",
    askUser: [
      "**Which shared mailbox or list exactly** (the email address)?",
      "**What level** — just read it (**Full Access**), or **send as** / **send on behalf** of it?",
      "**Who approved this?** Access requests need manager/owner sign-off.",
      "Should it **auto-appear in their Outlook**?"
    ],
    diagnose: [
      "Confirm the **shared mailbox or distribution list exists** and get its exact address.",
      "Check the **current permissions** in the Exchange admin center.",
      "Confirm you have **approval** to grant it."
    ],
    fix: [
      "**Exchange admin center** (`admin.exchange.microsoft.com`) → **Recipients → Mailboxes** → the shared mailbox → **Delegation**.",
      "Grant the right level: **Full Access** (open and read — auto-maps into Outlook), **Send As** (send as the mailbox), or **Send on Behalf**.",
      "Add the user. Note **auto-mapping can take a while** or need an Outlook restart; they can also add it manually.",
      "**Distribution list:** Exchange admin center → **Groups** → the DL → **Members** → add the user. (Some DLs are closed/managed — check ownership.)",
      "**Confirm** the user can see and/or send from it."
    ],
    escalate: [
      "**Dynamic distribution groups** or **mail-enabled security groups** (rule-based membership).",
      "**Ownership changes** on a shared mailbox or list."
    ],
    related: ["outlook-send-receive", "new-user-onboarding"],
    tags: ["shared mailbox", "distribution list", "dl", "full access", "send as", "send on behalf", "delegation"]
  },

  /* ---------------- Devices & Network ---------------- */
  {
    id: "printer-not-working",
    title: "Printer not working",
    category: "Devices & Network",
    icon: "🖨️",
    difficulty: "Easy",
    time: "10 min",
    summary: "Won't print, stuck queue, or \"offline\" — the fastest split is whether other people can print to the same printer.",
    symptom: "Nothing prints, jobs stack up in the queue, the printer shows \"offline\", or there's an error.",
    askUser: [
      "**Network printer or a USB one** plugged into the PC?",
      "**Which printer** (name/model), and is anything showing on its **screen or lights**?",
      "**Just you, just this printer, or everyone?**",
      "**Was it moved or changed** recently?"
    ],
    diagnose: [
      "Check the printer is **powered on, online, and error-free** — paper, toner, no jammed panel.",
      "**Can colleagues print to it?** If yes, the fault is the user's PC; if no, it's the printer/network.",
      "**Network printer:** ping its IP to check it's reachable (a DHCP change can move its address)."
    ],
    fix: [
      "**Basics first:** power-cycle the printer, check cables/paper/toner, clear any error on the panel.",
      "**Stuck queue:** cancel all documents, then **restart the Print Spooler** (`services.msc` → Print Spooler → Restart, or `net stop spooler && net start spooler`).",
      "**\"Offline\" status:** untick **\"Use Printer Offline\"** and power-cycle.",
      "**Driver:** update or reinstall the driver; remove and re-add the printer.",
      "**Network printer moved IP:** re-add it by its current IP, or check the print-server queue.",
      "**Print a test page** to confirm."
    ],
    escalate: [
      "**Print server / driver deployment** (GPO or Intune) issues.",
      "**Hardware fault** → managed-print provider or vendor."
    ],
    related: ["slow-computer", "vpn-wont-connect"],
    tags: ["printer", "print", "spooler", "offline", "queue", "driver", "printing"]
  },

  {
    id: "vpn-wont-connect",
    title: "VPN won't connect",
    category: "Devices & Network",
    icon: "🔐",
    difficulty: "Medium",
    time: "15 min",
    summary: "VPN fails, drops, or connects-but-no-access — always confirm plain internet works first, and remember VPN uses their AD login (so lockouts bite here).",
    symptom: "The VPN client won't connect, keeps dropping, or connects but internal resources (drives, apps) still don't work.",
    askUser: [
      "**Which VPN client**, and what's the **exact error**?",
      "**Won't connect at all, or connects but nothing internal works?**",
      "**Is this the first time** (new starter) or did it work before?",
      "**Is your normal internet working?** (Open a website.)",
      "**On-site or at home?**"
    ],
    diagnose: [
      "**Confirm general internet works** — no internet, no VPN.",
      "**Credentials:** VPN usually uses their **AD/Entra login**, so a wrong password or a **lockout** blocks it (see Account lockout). An MFA approval may be part of connecting.",
      "**New starter:** check they're in the **VPN-allowed security group** — a very common first-day gap.",
      "**Connects but no access:** likely **DNS or split-tunnel** — can they ping an internal host by name?"
    ],
    fix: [
      "**Verify internet**, then re-enter credentials carefully and approve any **MFA** prompt.",
      "**Restart the VPN client** and reconnect; try a different network (e.g. phone hotspot) to isolate.",
      "**Update or reinstall** the VPN client and confirm the correct config/profile is loaded.",
      "**Group membership:** add the user to the VPN security group if missing, then retry.",
      "**Connects but no drives:** check DNS/split-tunnel, reconnect mapped drives, confirm they can reach an internal server."
    ],
    escalate: [
      "**Firewall / VPN appliance config, certificates, or licences** → network/security team.",
      "Whole-site VPN outage."
    ],
    related: ["account-lockout", "slow-computer"],
    tags: ["vpn", "remote", "connect", "split tunnel", "dns", "tunnel", "work from home"]
  },

  {
    id: "slow-computer",
    title: "Slow / freezing computer",
    category: "Devices & Network",
    icon: "🐌",
    difficulty: "Easy",
    time: "15 min",
    summary: "The classic vague ticket — Task Manager tells you the truth about what's actually eating the machine.",
    symptom: "\"My computer is really slow\" — sluggish, freezing, or apps lagging.",
    askUser: [
      "**Everything, or one specific app?**",
      "**Since when** — gradual, or suddenly? **After an update?**",
      "**Worst at startup, or all the time?**",
      "**How old is the machine**, and roughly what spec?",
      "When did you **last restart** (not just log off)?"
    ],
    diagnose: [
      "**Open Task Manager** → what's pegged? **100% disk** is common on older HDDs / low RAM; a single process eating CPU points at a culprit.",
      "**Startup tab:** too many auto-start apps slow the boot and first few minutes.",
      "**Disk space:** below ~10–15% free, Windows slows noticeably.",
      "**Uptime:** weeks without a reboot, or **pending Windows updates**, cause sluggishness.",
      "Consider **malware** if it's sudden and unexplained."
    ],
    fix: [
      "**Reboot first** — genuinely fixes a lot; check uptime and pending updates.",
      "**Disable unnecessary startup apps** in Task Manager → Startup.",
      "**Free disk space:** Disk Cleanup / Storage Sense / clear temp files.",
      "**Install pending Windows and driver updates**, then reboot.",
      "**Run a full Defender scan** for malware.",
      "**Kill a runaway process** if Task Manager shows one pinning the CPU."
    ],
    escalate: [
      "**Hardware upgrade/replacement** (SSD, more RAM, old machine) → procurement.",
      "**Confirmed malware** needing remediation → security."
    ],
    related: ["printer-not-working", "vpn-wont-connect"],
    tags: ["slow", "performance", "freezing", "task manager", "startup", "disk", "ram", "lag"]
  },

  /* ---------------- Endpoint & Intune (MD-102) ---------------- */
  {
    id: "intune-enrollment-fail",
    title: "Device won't enrol in Intune",
    category: "Endpoint & Intune",
    icon: "📲",
    difficulty: "Medium",
    time: "15 min",
    summary: "A new or reset Windows device won't finish enrolling into Intune — usually a licence, an enrollment restriction, or the wrong join type.",
    symptom: "Setup fails at \"Setting up your device / for work or school\", an enrollment error appears, or the device never shows up in the Intune admin center.",
    askUser: [
      "**What account** are they signing in with — a work account (`name@company`) or a personal Microsoft account?",
      "**What's the exact error or error code** on screen?",
      "**Is this a brand-new device, a reset, or a personal (BYOD) one** they're adding?",
      "**Are other new devices** enrolling OK, or is it just this one? (Rules out a tenant-wide setting.)"
    ],
    diagnose: [
      "**Licence check** — the user needs an **Intune licence** (it's included in Business Premium / M365 E3/E5). No licence = enrollment is blocked. Check in the 365 admin center → the user → Licenses.",
      "**Enrollment restrictions** — Intune admin center → **Devices → Enrollment → Enrollment restrictions**. A platform (e.g. personal Windows) or device-limit restriction can block it.",
      "**Join type** — is the device meant to be **Microsoft Entra joined** (corporate) or **Entra registered** (BYOD)? Wrong choice = wrong (or no) management. **Automatic enrollment** (Entra → Mobility (MDM) → Intune, MDM user scope) is what auto-enrols on Entra join.",
      "**Device limit** — the user may have hit the max number of enrolled devices."
    ],
    fix: [
      "**Assign the Intune licence** to the user, wait a few minutes, then retry.",
      "**Check MDM auto-enrollment scope** — Entra admin center → Mobility (MDM and MAM) → Microsoft Intune → **MDM user scope = All** (or a group the user is in).",
      "**Loosen the enrollment restriction** if the platform/type is being blocked for a legitimate device.",
      "**Raise or clear the device limit** if they've hit the cap (remove an old stale device).",
      "**Retry enrollment**: Settings → Accounts → **Access work or school** → Connect (BYOD), or re-run **Autopilot/OOBE** for a corporate device.",
      "**Confirm** the device appears in Intune admin center → Devices → All devices."
    ],
    escalate: [
      "**Autopilot profile / hardware-hash** problems on a corporate deployment → whoever owns Autopilot.",
      "**Conditional Access** is blocking the enrollment sign-in itself.",
      "Suspected **tenant-wide MDM/Entra misconfiguration**."
    ],
    related: ["device-not-compliant", "autopilot-deployment", "password-reset"],
    tags: ["intune", "enrollment", "enrol", "mdm", "entra join", "byod", "licence", "autopilot", "md-102", "endpoint"]
  },

  {
    id: "device-not-compliant",
    title: "Device shows \"Not compliant\" / blocked from email",
    category: "Endpoint & Intune",
    icon: "🛡️",
    difficulty: "Medium",
    time: "15 min",
    summary: "A user is blocked from Outlook/Teams/SharePoint because their device is Not compliant — the compliance policy failed a check and Conditional Access is enforcing it.",
    symptom: "\"You can't get there from here\" / \"Your device does not meet compliance\", or access to email/files is blocked on one device.",
    askUser: [
      "**Which device** — their work laptop, a phone, or a personal machine?",
      "**What's the exact message**, and which app were they opening (Outlook, Teams, a SharePoint site)?",
      "**Did it work before**, or is this a new device / after a change?",
      "**Is it just them**, or a whole group? (A group = a policy change; one person = their device.)"
    ],
    diagnose: [
      "**Key concept:** the **compliance policy** is the health check (BitLocker on? password set? encrypted? up to date?). **Conditional Access** is what actually *blocks* access when the device is Not compliant. Compliance alone blocks nothing — the two work together.",
      "**Find the failing setting** — Intune admin center → **Devices → All devices → (device) → Device compliance**. It lists each rule as pass/fail, so you can see exactly *why* it's Not compliant (e.g. BitLocker off).",
      "**Check it's checked in** — compliance is evaluated **at check-in**, not instantly. A device that just changed may not have re-evaluated yet.",
      "**Tenant setting** — *Devices → Compliance → Compliance settings → \"Mark devices with no compliance policy as\"*. If set to **Not compliant** and a device has no policy, it gets blocked."
    ],
    fix: [
      "**Fix the failing rule on the device** — e.g. turn on **BitLocker**, set a password, install pending updates — whatever the compliance report flagged.",
      "**Force a sync** so it re-evaluates: on the device, Settings → Accounts → **Access work or school** → (account) → Info → **Sync**. Or Intune admin center → the device → **Sync**.",
      "**Grace period** — if it's a policy just rolled out, the *Mark device noncompliant* action's schedule may give users days to remediate before blocking.",
      "**Confirm** the device flips to **Compliant** and access returns."
    ],
    escalate: [
      "The **compliance policy or Conditional Access policy itself** is misconfigured and blocking many users → policy owner / security.",
      "A **break-glass / lockout** situation where admins are locked out too.",
      "The device **genuinely can't meet** a required control (old hardware, no TPM for BitLocker)."
    ],
    related: ["intune-enrollment-fail", "bitlocker-recovery", "mfa-reset"],
    tags: ["compliance", "not compliant", "conditional access", "intune", "bitlocker", "blocked", "md-102", "endpoint", "device health"]
  },

  {
    id: "autopilot-deployment",
    title: "New laptop — Autopilot deployment",
    category: "Endpoint & Intune",
    icon: "🚀",
    difficulty: "Medium",
    time: "30 min",
    summary: "Set up a brand-new laptop with zero manual imaging using Windows Autopilot — the user unboxes it, signs in, and Intune does the rest.",
    symptom: "A new starter or replacement laptop needs configuring, or an Autopilot deploy is stuck on the Enrollment Status Page (ESP).",
    askUser: [
      "**Is the device already registered** for Autopilot (hardware hash uploaded / bought through a registered supplier)?",
      "**Which user or profile** is it for — does the right **Autopilot deployment profile** target it?",
      "**Where's it stuck** — network/OOBE, sign-in, or the Enrollment Status Page installing apps?",
      "**Is it on a stable network** with internet? Autopilot is 100% cloud."
    ],
    diagnose: [
      "**Registration** — Intune admin center → **Devices → Enrollment → Devices (Windows Autopilot)**. If the device's hardware hash isn't there, Autopilot can't claim it.",
      "**Deployment profile** — check a profile is **assigned** to the device's group and the **mode** is right (user-driven, self-deploying, or pre-provisioning).",
      "**Enrollment Status Page (ESP)** — this is what shows progress and can **block** the desktop until required apps/policies land. A stuck ESP usually means a required app is failing or timing out.",
      "**Naming / groups** — dynamic group membership and the device-name template apply here."
    ],
    fix: [
      "**Register the device** if missing — import the hardware hash (CSV) under Windows Autopilot devices, then assign it to the right group.",
      "**Confirm the deployment profile** is assigned and correct; sync so the device picks it up.",
      "**Stuck ESP:** check which **required app** is failing (Intune → the app → device install status). Fix or make the app non-blocking; you can also allow reset/retry on the ESP.",
      "**Network:** move to a reliable connection; corporate Wi-Fi with tight filtering can break OOBE.",
      "**Confirm** the device lands on the desktop, is Entra-joined, Intune-managed, and Compliant."
    ],
    escalate: [
      "**Hardware-hash / OEM registration** issues with the supplier.",
      "**Autopilot profile design** or app-packaging problems → whoever owns the Intune build.",
      "Network/firewall blocking the **Autopilot & Windows endpoints**."
    ],
    related: ["intune-enrollment-fail", "company-portal-app-fail", "new-user-onboarding"],
    tags: ["autopilot", "deployment", "esp", "enrollment status page", "oobe", "new laptop", "provisioning", "md-102", "endpoint", "intune"]
  },

  {
    id: "company-portal-app-fail",
    title: "App won't install from Company Portal",
    category: "Endpoint & Intune",
    icon: "📦",
    difficulty: "Easy",
    time: "15 min",
    summary: "A user can't install an app Intune is supposed to deliver — assignment, dependencies, or the device not checking in are the usual suspects.",
    symptom: "An app is missing, shows \"Install pending\" forever, or fails in the Company Portal / doesn't auto-install.",
    askUser: [
      "**Which app**, and is it **Required** (auto-installs) or **Available** (they install it from Company Portal)?",
      "**What does Company Portal show** — Pending, Failed, or nothing at all?",
      "**Just them, or others** who should get the same app?",
      "**Is the device online and checked in** recently?"
    ],
    diagnose: [
      "**Assignment** — Intune admin center → **Apps → the app → Properties → Assignments**. Is the user/device in a **Required** or **Available** group? If it's not assigned to them, it'll never appear.",
      "**Install status** — the app's **Device/User install status** shows per-device success/failure and an error code.",
      "**Dependencies & supersedence** — a Win32 app may need a dependency installed first, or be superseded by another version.",
      "**Detection rules** — a misconfigured detection rule makes Intune think it's installed (or never installed). Common cause of \"stuck\".",
      "**Check-in** — the device must sync to receive the app."
    ],
    fix: [
      "**Fix the assignment** — add the user/device to the right group (Required to force it, Available for opt-in).",
      "**Force a sync** (device → Sync in Intune, or Company Portal → Settings → Sync) so it pulls the assignment.",
      "**Win32 apps:** verify the **detection rule** actually matches what the installer leaves behind, and that **dependencies** are also assigned.",
      "**Reinstall:** in Company Portal, retry; for Required apps, the next check-in retries automatically.",
      "**Confirm** the app installs and shows **Installed** in the app's device status."
    ],
    escalate: [
      "**App packaging** (bad `.intunewin`, wrong install command, broken detection) → whoever packages apps.",
      "**Licensing** for store/VPP apps (Apple VPP, Microsoft Store).",
      "A failure **affecting every targeted device** → likely the package, not the user."
    ],
    related: ["autopilot-deployment", "intune-enrollment-fail", "slow-computer"],
    tags: ["company portal", "app deployment", "win32", "intune", "required", "available", "detection rule", "md-102", "endpoint"]
  },

  {
    id: "bitlocker-recovery",
    title: "BitLocker recovery key needed",
    category: "Endpoint & Intune",
    icon: "🔐",
    difficulty: "Easy",
    time: "10 min",
    summary: "A device is stuck on the blue BitLocker recovery screen asking for a 48-digit key — you can retrieve it from Intune/Entra if the device is managed.",
    symptom: "Boot stops at \"BitLocker recovery — Enter the recovery key\" with a Key ID, and the user can't get into Windows.",
    askUser: [
      "**⚠️ Verify identity first** — a recovery key unlocks the whole disk; treat it like a password.",
      "**What's the Key ID** shown on the recovery screen (the first 8 characters identify which key)?",
      "**What triggered it** — a firmware/BIOS update, hardware change, or docking change? (Helps prevent a repeat.)",
      "**Is the device Intune/Entra managed** (a work laptop)? That's how we'll find the key."
    ],
    diagnose: [
      "**Where the key lives** — for an Entra-joined/Intune-managed device, the recovery key is **escrowed** to Entra ID / Intune. You look it up; you don't need it stored on paper.",
      "**Match the Key ID** — the recovery screen shows a Key ID so you hand over the *correct* key if there are several.",
      "**Root cause** — BitLocker triggers recovery when it sees a change it doesn't trust (TPM/boot change, BIOS update, hardware change)."
    ],
    fix: [
      "**Retrieve the key:** Intune admin center → **Devices → (the device) → Recovery keys**, or **Entra admin center → Devices → (device) → BitLocker keys**, or the user's own **myaccount / Company Portal** device page.",
      "**Match the Key ID** and read the 48-digit recovery key to the (verified) user.",
      "**Get them booted**, then investigate the trigger so it doesn't recur (e.g. suspend BitLocker before a planned BIOS update).",
      "**Rotate the key** afterwards if it may have been exposed: Intune → the device → **Rotate BitLocker keys**.",
      "**Confirm** they're back into Windows."
    ],
    escalate: [
      "**No key in Entra/Intune** (device wasn't managed or didn't escrow) → data-recovery decision with the business.",
      "**Repeated recovery prompts** pointing at failing hardware/TPM.",
      "Suspected **theft/compromise** of the device."
    ],
    related: ["device-not-compliant", "wipe-retire-device", "account-lockout"],
    tags: ["bitlocker", "recovery key", "encryption", "tpm", "intune", "entra", "rotate", "md-102", "endpoint"]
  },

  {
    id: "wipe-retire-device",
    title: "Wipe or retire a lost / returned device",
    category: "Endpoint & Intune",
    icon: "🧹",
    difficulty: "Medium",
    time: "10 min",
    summary: "Remotely clear a lost, stolen, or returned device from Intune — knowing the crucial difference between Wipe, Retire, and Fresh Start.",
    symptom: "A device is lost/stolen, or a leaver's laptop is back and needs clearing before reissue.",
    askUser: [
      "**Lost/stolen, or returned in-hand?** (Changes urgency and which action.)",
      "**Corporate-owned or personal (BYOD)?** BYOD changes what you're *allowed* to remove.",
      "**Whose device**, and has the account already been handled (see the offboarding runbook)?",
      "**Any data on it** that must be preserved first?"
    ],
    diagnose: [
      "**Know the three actions** (Intune → the device → remote actions):",
      "**Wipe** — factory-resets the device, removing **everything** (personal + company). For lost/stolen or full re-provision. Optionally keep it enrolled/retain user data.",
      "**Retire** — removes **only company data/policies** and unenrolls it, leaving personal data. The right choice for **BYOD**.",
      "**Fresh Start** — removes apps but keeps the device Entra-joined/managed and can keep user data — good for fixing a messy Windows install.",
      "**Lost mode / Locate** (where supported) can help find or lock a device before wiping."
    ],
    fix: [
      "**Verify authority** — wiping is destructive; confirm the request is legitimate (manager/HR/security).",
      "**Lost/stolen corporate:** **Wipe** it; if supported, **lock/locate** first.",
      "**BYOD:** **Retire** — pull company data only; you must not nuke someone's personal phone.",
      "**Returned corporate for reissue:** **Wipe** (or **Fresh Start**) to hand it on clean.",
      "**Coordinate with offboarding** — block sign-in, revoke sessions, reassign resources (see the leaver runbook).",
      "**Confirm** the action completes in Intune (status: Pending → done) and the device drops out of management."
    ],
    escalate: [
      "**Legal hold / investigation** — preserve, don't wipe; escalate first.",
      "Device **won't check in** to receive the wipe (offline/stolen) — may need conditional access block + credential reset instead.",
      "**Data recovery** needed before wipe."
    ],
    related: ["user-offboarding", "bitlocker-recovery", "device-not-compliant"],
    tags: ["wipe", "retire", "fresh start", "lost", "stolen", "byod", "remote action", "intune", "md-102", "endpoint"]
  },

  {
    id: "windows-update-ring",
    title: "Device not getting Windows updates",
    category: "Endpoint & Intune",
    icon: "🔄",
    difficulty: "Medium",
    time: "15 min",
    summary: "A managed device is behind on updates or stuck on an old build — usually its update ring, a deferral/pause, or it not checking in.",
    symptom: "A device is missing security updates, stuck on an old Windows version, or a feature update won't roll out.",
    askUser: [
      "**Which device**, and what build is it on now vs. what it should be? (`winver` shows the build.)",
      "**Is it just this device**, or a whole group behind? (A group = a ring/policy; one = that device.)",
      "**Is it online and used regularly**, or a laptop that's rarely on?",
      "**Any error** in Settings → Windows Update?"
    ],
    diagnose: [
      "**Update rings** — Intune admin center → **Devices → Manage updates → Windows 10 and later updates → Update rings**. A ring sets **deferral** (how many days quality/feature updates wait) and **active hours**. The device may simply be inside its deferral window.",
      "**Pause** — a ring or a feature-update policy may be **paused**, holding updates back on purpose.",
      "**Feature updates** are controlled separately (a **Feature updates** policy sets the target version, e.g. Windows 11 23H2).",
      "**Check-in** — a device that's rarely online just hasn't had the time/connectivity to pull updates. Compliance/updates need check-ins.",
      "**Delivery Optimization / bandwidth** and disk space can also stall updates."
    ],
    fix: [
      "**Confirm the ring assignment** — the device's group should be assigned an update ring; check the **deferral days** aren't unexpectedly long.",
      "**Resume** any paused ring or feature-update policy.",
      "**Set/confirm the target build** in the **Feature updates** policy if it needs moving to a newer version.",
      "**Force a check-in** (Intune → device → Sync) and on the device run **Settings → Windows Update → Check for updates**.",
      "**Free disk space** and ensure it's online long enough to download and reboot.",
      "**Confirm** the device reports back up to date (Intune update reports / `winver`)."
    ],
    escalate: [
      "**Ring / feature-update policy design** affecting many devices → whoever owns the update strategy.",
      "**Autopatch / Hotpatch** configuration issues.",
      "A specific update **failing to install** with an error across devices (bad update / compatibility)."
    ],
    related: ["device-not-compliant", "slow-computer", "company-portal-app-fail"],
    tags: ["windows update", "update ring", "deferral", "feature update", "autopatch", "patching", "intune", "md-102", "endpoint"]
  }

];
