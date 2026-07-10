/* =====================================================================
   Dynamics 365 course — Ticket Lab dataset (Microsoft-admin edition)
   50 realistic IT support tickets weighted to the Microsoft ecosystem an
   all-Microsoft service desk actually works: Intune & endpoint, Active
   Directory & Entra ID, Microsoft 365 & licensing, Exchange Online, Teams
   (incl. Teams Phone), SharePoint/OneDrive, Defender/Conditional Access.

   Real portals referenced: Microsoft Intune admin center
   (intune.microsoft.com), Microsoft Entra admin center (entra.microsoft.com),
   Microsoft 365 admin center (admin.microsoft.com), Exchange admin center,
   Teams admin center, SharePoint admin center, Microsoft Defender portal.
   Your employer's tenant, roles and policies will differ — follow theirs.

   window.DYN_TICKETS = [ {..} x50 ]
   Ticket shape: id, cat, difficulty (Starter|Core|Advanced),
     priority (low|normal|high|critical),
     ticket:{ from, org, subject, body }, task, ask:[..], steps:[..],
     note, escalate, check:{ q, options:[..], answer, explain }
   Fictional organisations/people only. Never record passwords, MFA codes
   or BitLocker recovery keys in a ticket.
   ===================================================================== */

window.DYN_TICKET_CATS = [
  "Active Directory & Entra ID", "Intune & Endpoint", "Microsoft 365 & Licensing",
  "Exchange & Email", "Teams & Collaboration", "SharePoint & OneDrive",
  "Security & Compliance", "Networking & Connectivity"
];

window.DYN_TICKETS = [
  /* ============ Active Directory & Entra ID (9) ============ */
  {
    id: "TCK-01", cat: "Active Directory & Entra ID", difficulty: "Starter", priority: "normal",
    ticket: { from: "Sam Doyle", org: "Northstar Retail", subject: "Forgotten my password",
      body: "I can't remember my password and can't sign in this morning. Can you reset it?" },
    task: "Verify the caller, then reset the password safely (prefer self-service).",
    ask: ["Confirm identity using your company's verification procedure", "Exact username / UPN?", "Is Self-Service Password Reset (SSPR) enabled for them?"],
    steps: [
      "Verify identity per policy BEFORE any change — password resets are a top social-engineering target.",
      "If SSPR is enabled, point them to aka.ms/sspr to reset it themselves.",
      "Otherwise reset in the Microsoft 365 / Entra admin center: Users → select user → Reset password.",
      "Tick 'require change at next sign-in' so only they end up knowing the password.",
      "Deliver the temporary password over a secure channel and confirm they can sign in."
    ],
    note: "Verified identity per policy. Reset password for Sam Doyle in Entra with change-at-next-sign-in. User confirmed sign-in. Recommended SSPR enrolment to self-serve next time.",
    escalate: "Escalate if the account is mastered on-prem in AD you can't reach, or identity can't be verified.",
    check: { q: "What must you do before resetting a password?", options: ["Reset it fast so they're not blocked", "Verify the caller's identity per policy", "Ask for their old password", "Disable MFA"], answer: 1, explain: "Identity verification first — resets are a prime social-engineering target." }
  },
  {
    id: "TCK-02", cat: "Active Directory & Entra ID", difficulty: "Core", priority: "normal",
    ticket: { from: "Priya Shah", org: "Guardian Risk Ltd", subject: "Account keeps locking",
      body: "You unlock my account and it locks again minutes later. Every day now." },
    task: "Unlock the account AND find the source re-locking it.",
    ask: ["Which devices/apps use this account (phone mail, mapped drives, saved Wi-Fi)?", "Recent password change?", "When exactly does it re-lock?"],
    steps: [
      "Verify identity, then unlock the account (AD Users & Computers on-prem, or Entra as applicable).",
      "Check Entra sign-in logs (and AD lockout events/Event ID 4740) for the failing source app/IP/device.",
      "Classic cause: a phone or a mapped drive still using the OLD cached password.",
      "Update/remove the stale credential on that device (re-add the mail account, refresh saved password).",
      "Unlock again and confirm it stays unlocked."
    ],
    note: "Unlocked Priya Shah's account. Entra sign-in logs showed repeated failures from her mobile mail app using the old password. Re-added the account on the phone; account stayed unlocked.",
    escalate: "Route to Security if failures come from an unknown IP/location (possible attack).",
    check: { q: "An account re-locks seconds after each unlock. Most likely cause?", options: ["A broken server", "A device/app still using the old cached password", "A Windows update", "The user typing slowly"], answer: 1, explain: "A cached old password (often a phone) keeps retrying and re-locks the account." }
  },
  {
    id: "TCK-03", cat: "Active Directory & Entra ID", difficulty: "Core", priority: "high",
    ticket: { from: "Aziz Khan", org: "Guardian Risk Ltd", subject: "New phone, no Authenticator",
      body: "New phone and now I can't approve MFA — I'm locked out of everything." },
    task: "Securely get the user back in and re-registered for MFA.",
    ask: ["Verify identity strongly (MFA reset is high-risk)", "Do they still have the old phone?", "Is a Temporary Access Pass (TAP) available?"],
    steps: [
      "Verify identity per your strict MFA-reset procedure.",
      "In Entra → the user → Authentication methods, review current methods.",
      "Issue a Temporary Access Pass (TAP) so they can sign in once without the old method.",
      "Have them install Microsoft Authenticator and register at aka.ms/mfasetup.",
      "Remove the old/lost method and confirm the new one prompts correctly. Never record the TAP or codes in the ticket."
    ],
    note: "Verified identity per MFA policy. Issued a TAP in Entra; Aziz re-registered Authenticator on the new phone and the old method was removed. Confirmed MFA works.",
    escalate: "If identity can't be strongly verified, do NOT reset — escalate to Security/team lead.",
    check: { q: "A Temporary Access Pass (TAP) is used to…", options: ["Grant permanent admin rights", "Bootstrap/recover an account, e.g. register a new Authenticator", "Bypass Conditional Access forever", "Reset a mailbox"], answer: 1, explain: "A TAP is a time-limited passcode to get a user back in and re-register MFA." }
  },
  {
    id: "TCK-04", cat: "Active Directory & Entra ID", difficulty: "Advanced", priority: "normal",
    ticket: { from: "HR (Nadia Rees)", org: "MaxNova Tech", subject: "New account not in cloud yet",
      body: "I created the new starter in our on-prem system but they still can't sign in to Microsoft 365." },
    task: "Diagnose an on-prem → Entra ID sync delay (hybrid identity).",
    ask: ["Was the account created in on-prem AD (which syncs to Entra)?", "How long ago?", "Is the account in a synced OU?"],
    steps: [
      "Confirm the account was created in an OU that's in scope for Entra Connect sync.",
      "Sync runs on a schedule (typically ~30 min) — a new object may not have synced yet.",
      "Force a sync from the Entra Connect server if needed: Start-ADSyncSyncCycle -PolicyType Delta.",
      "Check the account now appears in the Entra admin center and has the right UPN.",
      "Assign licence/groups, then confirm sign-in."
    ],
    note: "New MaxNova starter existed on-prem but hadn't synced to Entra yet. Confirmed correct OU, ran a delta sync (Start-ADSyncSyncCycle). Account appeared in Entra; assigned licence and confirmed sign-in.",
    escalate: "Escalate to the identity/server team if Entra Connect shows sync errors or the OU isn't in scope.",
    check: { q: "A hybrid on-prem account isn't in Microsoft 365 yet. Likely cause?", options: ["The internet is down", "Entra Connect hasn't synced the new object yet", "The user forgot their password", "A printer issue"], answer: 1, explain: "On-prem changes sync to Entra on a schedule; a delta sync speeds it up." }
  },
  {
    id: "TCK-05", cat: "Active Directory & Entra ID", difficulty: "Core", priority: "normal",
    ticket: { from: "Tom Blake", org: "Northstar Retail", subject: "Still can't open the finance share",
      body: "You added me to the Finance group yesterday but I still get 'access denied'." },
    task: "Work out why group-based access isn't applying yet.",
    ask: ["Which group grants that access, and is the user actually a member now?", "Is it a security group or M365 group?", "Have they signed out/in since?"],
    steps: [
      "Confirm the user is really in the correct group (Entra or AD) that grants the resource.",
      "Group membership changes need a fresh token — have them sign out and back in (or restart).",
      "For on-prem/file shares, a full sign-out or 'gpupdate /force' + relogon refreshes the token/Kerberos ticket.",
      "Verify the group itself has the needed permission on the resource.",
      "Confirm access after re-authentication."
    ],
    note: "Tom was correctly in the Finance security group but hadn't re-authenticated, so his token lacked the new membership. Signed out/in; access to the finance share confirmed.",
    escalate: "Route to the resource owner if the group's permission on the share is wrong.",
    check: { q: "A user was added to an access group but still can't get in. First thing to try?", options: ["Rebuild their PC", "Sign out/in to refresh their token/membership", "Reset their password", "Reinstall Office"], answer: 1, explain: "Group changes only take effect on a new sign-in/token." }
  },
  {
    id: "TCK-06", cat: "Active Directory & Entra ID", difficulty: "Advanced", priority: "normal",
    ticket: { from: "IT Manager", org: "Caledonia Legal", subject: "Dynamic group missing a user",
      body: "Our 'All Solicitors' dynamic group should include Jo but it doesn't." },
    task: "Diagnose why a dynamic-group membership rule isn't matching a user.",
    ask: ["What's the group's membership rule (which attribute/value)?", "Does the user's attribute actually match it?"],
    steps: [
      "In Entra, open the group → Dynamic membership rules and read the rule (e.g. department eq 'Legal').",
      "Check the user's attributes match exactly (department/jobTitle spelling, case).",
      "If a value is wrong/missing on the user, correct it (on-prem attribute may need to sync first).",
      "Dynamic membership re-evaluates automatically but can take time to process.",
      "Confirm the user now appears in the group."
    ],
    note: "'All Solicitors' rule matched department eq 'Legal' but Jo's department was blank in Entra. Corrected the attribute (synced from on-prem); dynamic group processed and added her. Confirmed membership.",
    escalate: "Escalate to identity admins for rule changes or persistent dynamic-processing failures.",
    check: { q: "A user is missing from a DYNAMIC group. Check…", options: ["Their password", "Whether their attributes match the group's membership rule", "The printer", "Their licence only"], answer: 1, explain: "Dynamic groups add users whose attributes match the rule — check the attribute." }
  },
  {
    id: "TCK-07", cat: "Active Directory & Entra ID", difficulty: "Advanced", priority: "high",
    ticket: { from: "Ellie Grant", org: "Caledonia Legal", subject: "Blocked signing in from home",
      body: "I can sign in fine at the office but from home I get 'you can't access this'." },
    task: "Investigate a likely Conditional Access block — don't just disable policy.",
    ask: ["Exact message/error?", "What's different at home (network, device, location)?", "Is their device compliant/managed?"],
    steps: [
      "In Entra → Sign-in logs, find the failed sign-in and open it.",
      "Check the 'Conditional Access' tab — it names which policy applied and why it blocked.",
      "Common causes: policy requires a compliant/hybrid-joined device, a trusted location, or MFA the user hasn't satisfied.",
      "If the block is correct policy (e.g. needs a managed device), guide the user to the compliant path — don't just turn CA off.",
      "If it's a genuine misconfiguration, gather the sign-in log evidence and escalate to identity admins."
    ],
    note: "Ellie's home sign-in was blocked by a Conditional Access policy requiring a compliant device; her personal laptop isn't Intune-managed. Explained the managed-device requirement and provided the sign-in log to identity admins. Did not disable CA.",
    escalate: "Escalate CA changes to identity/security admins — never disable a Conditional Access policy on first line.",
    check: { q: "A user is blocked from a location/device. Where do you find WHY?", options: ["Task Manager", "Entra Sign-in logs → Conditional Access tab", "The printer queue", "Their mailbox"], answer: 1, explain: "The sign-in log's Conditional Access tab shows which policy blocked and why." }
  },
  {
    id: "TCK-08", cat: "Active Directory & Entra ID", difficulty: "Core", priority: "normal",
    ticket: { from: "IT Manager", org: "Caledonia Legal", subject: "Contractor needs access for 3 months",
      body: "External contractor starts today, needs the case-files site for 3 months only." },
    task: "Provision least-privilege, time-bound guest (B2B) access.",
    ask: ["Exactly which resources and access level?", "Internal account or Entra B2B guest?", "End date?"],
    steps: [
      "For an external person, invite them as an Entra B2B guest (Entra → Users → Invite external user).",
      "Add the guest only to the specific group that grants the case-files site (least privilege).",
      "Set an access review / expiration for the 3-month end so access is removed automatically.",
      "Confirm the guest can reach only what they should.",
      "Document the authorisation and notify the requester."
    ],
    note: "Invited the contractor as an Entra B2B guest at Caledonia Legal. Added to the case-files group only (least privilege) and set access to expire at the 3-month date. Authorisation recorded; requester notified.",
    escalate: "Escalate to identity/security for guest-governance policy or Conditional Access on guests.",
    check: { q: "The cleanest way to give an EXTERNAL contractor limited access is…", options: ["Share your own login", "An Entra B2B guest account with least-privilege group access", "Global Admin", "A shared mailbox"], answer: 1, explain: "B2B guest + least privilege + an expiry is the governed approach." }
  },
  {
    id: "TCK-09", cat: "Active Directory & Entra ID", difficulty: "Starter", priority: "normal",
    ticket: { from: "Ruth Bell", org: "Harbour Dental", subject: "Account disabled after leave",
      body: "Back from two weeks off and my account says it's disabled." },
    task: "Confirm why it's disabled before re-enabling.",
    ask: ["Was it disabled deliberately (long-absence/leaver process)?", "Confirm active employment with HR/manager"],
    steps: [
      "Verify identity and confirm current employment with HR/manager.",
      "Check the account status in Entra/AD and any sign-in block.",
      "If disabled by policy during leave and they're a confirmed active employee, re-enable it.",
      "Confirm licences/group membership are intact, then have them sign in.",
      "Record who authorised the re-enable."
    ],
    note: "HR confirmed Ruth Bell is an active returning employee; account had been disabled during extended leave per policy. Re-enabled, verified licence/groups, user signed in. Authorisation recorded.",
    escalate: "Escalate if you can't confirm the account should be active — never re-enable on the user's word alone.",
    check: { q: "A user says their account is 'disabled'. First establish…", options: ["Re-enable it immediately", "Why it was disabled and whether they should be active", "Reset the password", "Delete and recreate it"], answer: 1, explain: "Find out why first — it may have been disabled deliberately." }
  },

  /* ============ Intune & Endpoint (11) ============ */
  {
    id: "TCK-10", cat: "Intune & Endpoint", difficulty: "Core", priority: "normal",
    ticket: { from: "Dana Fox", org: "MaxNova Tech", subject: "New laptop won't enrol",
      body: "Setting up my new laptop and it won't enrol into the company system — enrolment fails." },
    task: "Diagnose a failed Intune enrolment.",
    ask: ["What's the exact enrolment error/code?", "Are they signing in with their work account?", "Is there an enrolment restriction or device limit?"],
    steps: [
      "Confirm they're using their licensed work account (not a personal one) to enrol.",
      "Check the user has an Intune licence and is allowed by enrolment restrictions (platform/device cap).",
      "In Intune → Devices, check whether the device partially enrolled or hit the per-user device limit.",
      "Verify MDM auto-enrolment / user scope is set for the user's group.",
      "Retry enrolment (Settings → Accounts → Access work or school → Connect); confirm it appears as compliant in Intune."
    ],
    note: "Dana's enrolment failed on the device limit. Confirmed Intune licence and enrolment restrictions; removed a stale device from her list, re-enrolled. Device now shows enrolled in Intune. Confirmed access.",
    escalate: "Escalate to endpoint admins for enrolment-restriction/auto-enrolment policy changes.",
    check: { q: "A device won't enrol in Intune. A common first-line check is…", options: ["Reinstall Windows blindly", "The user's Intune licence and enrolment restrictions", "The printer", "Their mailbox size"], answer: 1, explain: "No Intune licence or a blocking enrolment restriction stops enrolment." }
  },
  {
    id: "TCK-11", cat: "Intune & Endpoint", difficulty: "Core", priority: "high",
    ticket: { from: "Aziz Khan", org: "Guardian Risk Ltd", subject: "Blocked — device not compliant",
      body: "I'm getting told my device isn't compliant and I can't reach my email." },
    task: "Find why the device is non-compliant and bring it back into compliance.",
    ask: ["Which compliance policy is failing (and which setting)?", "Has the device synced recently?"],
    steps: [
      "In Intune → Devices → the device → Device compliance, see which policy/setting fails.",
      "Common causes: BitLocker not on, OS below the required build, Defender/antivirus off, or not encrypted.",
      "Remediate the failing setting (e.g. enable BitLocker, run Windows Update, turn on Defender).",
      "Force a sync: Company Portal → Settings → Sync, or Settings → Access work or school → Info → Sync.",
      "Confirm the device flips to Compliant and access (via Conditional Access) is restored."
    ],
    note: "Aziz's device failed compliance because the OS build was below policy. Ran Windows Update to the required build and synced in Company Portal; device now Compliant and email access restored.",
    escalate: "Escalate to endpoint admins if the compliance policy setting looks wrong or blocks legitimately-configured devices.",
    check: { q: "A user is blocked because their device is 'not compliant'. Where do you look?", options: ["The mailbox", "Intune → device → Device compliance (which setting failed)", "The router", "Their password"], answer: 1, explain: "The device's compliance blade shows exactly which policy/setting failed." }
  },
  {
    id: "TCK-12", cat: "Intune & Endpoint", difficulty: "Advanced", priority: "high",
    ticket: { from: "HR (Nadia Rees)", org: "MaxNova Tech", subject: "New PC stuck on setup",
      body: "The new starter's laptop is stuck for ages on the company setup screen." },
    task: "Troubleshoot a stalled Autopilot / Enrollment Status Page (ESP).",
    ask: ["Which phase is it stuck on (Device prep, Device setup, Account setup)?", "Is there good network during setup?", "Any error/timeout shown?"],
    steps: [
      "Confirm the device is a registered Autopilot device and on a stable network (wired is best).",
      "The Enrollment Status Page (ESP) waits for required apps/policies — a heavy or failing required app can stall it.",
      "Check Intune for the device's app/policy assignments and any app install failures.",
      "If an app is failing/blocking, adjust the ESP's blocking-app list or fix the app (endpoint admins).",
      "Restart the provisioning if permitted; confirm it completes to the desktop."
    ],
    note: "MaxNova new-PC stuck on the ESP 'Account setup' waiting on a required app that was failing to install. Escalated to endpoint admins who fixed the app assignment; re-ran provisioning and it completed. Confirmed the device is set up.",
    escalate: "Escalate to endpoint admins for Autopilot profile/ESP configuration and failing required-app fixes.",
    check: { q: "An Autopilot device hangs on the setup screen. That screen is the…", options: ["BIOS", "Enrollment Status Page (ESP) waiting on apps/policies", "Screensaver", "A virus"], answer: 1, explain: "The ESP blocks the desktop until required apps/policies finish — a failing app stalls it." }
  },
  {
    id: "TCK-13", cat: "Intune & Endpoint", difficulty: "Core", priority: "normal",
    ticket: { from: "Jo Reid", org: "Caledonia Legal", subject: "Company Portal app won't install",
      body: "I need our case app but it never installs from Company Portal." },
    task: "Get a managed app to deploy from Intune/Company Portal.",
    ask: ["Is the app 'Available' or 'Required' for their group?", "Any install error in Company Portal?", "Has the device synced?"],
    steps: [
      "Confirm the app is assigned to the user's/device's group in Intune (Available or Required).",
      "In Intune → Apps → the app → check the device's install status and any error code.",
      "Have the user open Company Portal → the app → Install; then Sync the device.",
      "Check dependencies (e.g. required framework) and that OS/space requirements are met.",
      "Confirm the app installs and opens."
    ],
    note: "Jo's case app wasn't assigned to her group in Intune. Added the assignment (Required), synced the device; app installed from Company Portal. Confirmed it opens.",
    escalate: "Escalate to endpoint admins for app packaging/assignment fixes or persistent install failures.",
    check: { q: "A required app isn't installing from Company Portal. First check?", options: ["The user's password", "That the app is assigned to their group in Intune, and the install status", "The printer", "The VPN"], answer: 1, explain: "No assignment (or a failed install status) is the usual cause — check Intune Apps." }
  },
  {
    id: "TCK-14", cat: "Intune & Endpoint", difficulty: "Core", priority: "high",
    ticket: { from: "Morgan Lee", org: "Bright Roots Learning", subject: "Laptop wants a BitLocker recovery key",
      body: "My laptop booted to a blue BitLocker screen asking for a recovery key. I don't have it!" },
    task: "Retrieve the correct recovery key securely — without recording it in the ticket.",
    ask: ["Verify identity", "What's the Key ID shown on the BitLocker recovery screen?", "Any recent hardware/firmware/boot change that triggered it?"],
    steps: [
      "Verify identity, then match the Key ID on screen to the device's recovery key in Entra (Devices → the device → BitLocker keys) or Intune.",
      "Read the correct key to the user securely — do NOT paste the recovery key into the ticket or email it insecurely.",
      "Once booted, investigate what triggered recovery (TPM change, firmware/BIOS update, boot-order change).",
      "Resume protection if it's suspended, and confirm the device is still encrypted/compliant.",
      "Note only that the key was provided securely — never the key value itself."
    ],
    note: "Verified identity. Matched the on-screen Key ID to Morgan's device recovery key in Entra and provided it securely (key value NOT recorded). Device booted; a firmware update had triggered recovery. Confirmed BitLocker still active. Key value deliberately omitted from this note.",
    escalate: "Escalate to endpoint admins if the key isn't escrowed in Entra/Intune, or recovery recurs.",
    check: { q: "Handling a BitLocker recovery key, you must NEVER…", options: ["Verify the Key ID", "Record the recovery key in the ticket or email it insecurely", "Retrieve it from Entra", "Provide it to the verified user"], answer: 1, explain: "Recovery keys are secrets — never store them in a ticket; provide securely only." }
  },
  {
    id: "TCK-15", cat: "Intune & Endpoint", difficulty: "Core", priority: "normal",
    ticket: { from: "Tom Blake", org: "Northstar Retail", subject: "My PC is way behind on updates",
      body: "Security says my laptop is missing updates but Windows Update does nothing." },
    task: "Get a managed device back onto its update ring.",
    ask: ["Is the device assigned an Intune Update ring / Windows Update for Business policy?", "Is it checking in with Intune?", "Enough disk space / recent reboot?"],
    steps: [
      "Confirm the device is Intune-managed and assigned an Update ring (Intune → Devices → Windows → Update rings).",
      "Check the device is syncing/checking in (a device offline for weeks won't get policy).",
      "Sync the device (Company Portal → Settings → Sync) and force a check: Settings → Windows Update → Check for updates.",
      "Ensure enough free disk space and that the device can reach the update sources; reboot to finish pending installs.",
      "Confirm updates apply and it reports healthy in Intune."
    ],
    note: "Tom's laptop hadn't checked in for a while. Synced it in Company Portal, confirmed it was on the correct Update ring, freed disk space and rebooted; pending updates installed. Device now current.",
    escalate: "Escalate to endpoint admins if the device has no update ring assigned or updates keep failing.",
    check: { q: "In Intune, Windows updates are governed by…", options: ["The printer queue", "Update rings (Windows Update for Business)", "Conditional Access", "The mailbox"], answer: 1, explain: "Update rings/WUfB policies control when managed devices get updates." }
  },
  {
    id: "TCK-16", cat: "Intune & Endpoint", difficulty: "Advanced", priority: "normal",
    ticket: { from: "Dana Fox", org: "MaxNova Tech", subject: "Company Wi-Fi profile not appearing",
      body: "My managed laptop doesn't have the company Wi-Fi that everyone else gets automatically." },
    task: "Work out why an Intune configuration profile isn't applying to one device.",
    ask: ["Is the device compliant and checking in?", "Is the Wi-Fi profile assigned to the device's/user's group?", "Any assignment filter excluding it?"],
    steps: [
      "In Intune → Devices → the device → check its group membership and sync status.",
      "Open the Wi-Fi configuration profile → Assignments; confirm the device/user group is included and not excluded by a filter.",
      "Check the profile's per-device status for a 'failed'/'error' and any conflict with another profile.",
      "Force a sync (Company Portal → Sync) and wait for policy to apply.",
      "Confirm the Wi-Fi profile appears and connects."
    ],
    note: "Dana's laptop was excluded from the Wi-Fi profile by an assignment filter (device model). Corrected the group/filter with endpoint admins, synced the device; the Wi-Fi profile applied and connected.",
    escalate: "Escalate to endpoint admins for profile assignment/filter changes or profile conflicts.",
    check: { q: "An Intune config profile isn't applying to one device. Check…", options: ["The user's password", "Its assignment (group/filter) and the device's sync/compliance", "The printer", "Their mailbox"], answer: 1, explain: "Assignment scope (groups/filters) and sync status decide whether a profile lands." }
  },
  {
    id: "TCK-17", cat: "Intune & Endpoint", difficulty: "Core", priority: "high",
    ticket: { from: "Aziz Khan", org: "Guardian Risk Ltd", subject: "Lost my work laptop on the train",
      body: "I left my work laptop on the train. It has company data on it." },
    task: "Reduce risk from a lost managed device.",
    ask: ["When/where lost? Is it BitLocker-encrypted (it should be)?", "Company-owned or personal?", "Confirm the correct device in Intune"],
    steps: [
      "Follow the lost-device process promptly.",
      "In Intune → Devices, select the correct device and issue a remote action: Wipe (company-owned) or Retire (remove company data).",
      "Revoke the user's sign-in sessions in Entra as a precaution.",
      "Note the device is BitLocker-encrypted (data at rest protected) and record actions/timeline.",
      "Escalate to Security and arrange a replacement."
    ],
    note: "Aziz's company laptop lost. Confirmed it's BitLocker-encrypted; issued a remote Wipe from Intune and revoked his sessions in Entra. Escalated to Security and logged the timeline. Replacement being arranged.",
    escalate: "Escalate to Security for lost/stolen devices; involve endpoint admins for the wipe if you lack the action.",
    check: { q: "For a lost Intune-managed laptop, a key action is to…", options: ["Do nothing until found", "Issue a remote Wipe/Retire from Intune and revoke sessions", "Reset the printer", "Buy new licences"], answer: 1, explain: "Remote wipe/retire + session revocation contains the risk." }
  },
  {
    id: "TCK-18", cat: "Intune & Endpoint", difficulty: "Core", priority: "normal",
    ticket: { from: "Ellie Grant", org: "Caledonia Legal", subject: "Can't copy from work email on my phone",
      body: "On my personal phone I can't copy text out of Outlook or save attachments." },
    task: "Explain/confirm this is an App Protection Policy (MAM), not a fault.",
    ask: ["Is this their personal (BYOD) phone?", "Which app (Outlook/Teams)?", "What exactly is blocked (copy/paste, save-as)?"],
    steps: [
      "Recognise this as an App Protection Policy (MAM) restriction, not a bug — it protects company data on personal devices.",
      "Confirm the phone is BYOD with the policy applied to the work apps.",
      "Explain the intended behaviour (e.g. copy/paste and save-to-personal blocked by policy).",
      "If they have a legitimate business need, route the request to review — don't weaken the policy on first line.",
      "Confirm the app otherwise works within policy."
    ],
    note: "Ellie's personal phone is under an App Protection Policy blocking copy-out/save-to-personal in Outlook — working as designed. Explained the data-protection reason; no change needed. Logged the query.",
    escalate: "Route policy-exception requests to endpoint/security admins — don't relax MAM on first line.",
    check: { q: "Copy/paste is blocked from work Outlook on a personal phone. This is usually…", options: ["A broken app", "An App Protection Policy (MAM) protecting company data", "A dead battery", "A network fault"], answer: 1, explain: "App Protection Policies restrict data movement on BYOD by design." }
  },
  {
    id: "TCK-19", cat: "Intune & Endpoint", difficulty: "Core", priority: "normal",
    ticket: { from: "Sam Doyle", org: "Northstar Retail", subject: "My laptop isn't getting company settings",
      body: "IT says my laptop hasn't 'checked in' for weeks and it's missing stuff." },
    task: "Get a managed device checking in with Intune again.",
    ask: ["When did it last sync (Intune → device → Last check-in)?", "Is it powered on and online regularly?", "Signed in with the work account?"],
    steps: [
      "In Intune → Devices, check the device's Last check-in time.",
      "Ensure the device is online and the user is signed in with the work account.",
      "Force a sync: Settings → Accounts → Access work or school → Info → Sync (or Company Portal → Sync).",
      "If it still won't check in, confirm the MDM connection is healthy (not disconnected from work/school).",
      "Confirm it checks in and starts receiving policy/apps."
    ],
    note: "Sam's laptop hadn't checked in for weeks (mostly powered off). Reconnected the work account and forced a sync; device checked in and began pulling policy/apps. Confirmed healthy in Intune.",
    escalate: "Escalate to endpoint admins if the MDM enrolment is broken and won't re-establish.",
    check: { q: "A managed device 'hasn't checked in'. Quickest fix to try?", options: ["Reinstall Windows", "Force a sync in Company Portal / Access work or school", "Reset the password", "Replace the laptop"], answer: 1, explain: "A manual sync re-establishes the Intune check-in and pulls policy." }
  },
  {
    id: "TCK-20", cat: "Intune & Endpoint", difficulty: "Core", priority: "normal",
    ticket: { from: "HR (Nadia Rees)", org: "MaxNova Tech", subject: "Is this a company or personal device?",
      body: "A user connected their own PC to work — should it be fully managed or not?" },
    task: "Distinguish Entra registered (BYOD) vs Entra joined (company) and set the right expectation.",
    ask: ["Is the device company-owned or personal?", "What access do they actually need?"],
    steps: [
      "Clarify ownership: personal (BYOD) devices are usually Entra registered with App Protection (MAM), not fully managed.",
      "Company-owned devices are Entra joined (or hybrid-joined) and fully Intune-managed.",
      "In Entra → Devices, check the join type to see how it's currently registered.",
      "Set the correct path: don't fully enrol a personal device unless policy allows; use MAM instead.",
      "Advise the user and document the decision."
    ],
    note: "Confirmed the PC is personally owned. Left it as Entra registered with App Protection (MAM) rather than fully enrolling it, per BYOD policy. Explained the difference to HR and the user; documented.",
    escalate: "Escalate to endpoint admins if policy on BYOD vs corporate enrolment needs clarifying.",
    check: { q: "A personal (BYOD) device is typically…", options: ["Entra joined and fully managed", "Entra registered, protected with App Protection (MAM)", "Never allowed any access", "Given Global Admin"], answer: 1, explain: "BYOD is usually Entra registered + MAM; corporate devices are Entra/hybrid joined + full MDM." }
  },

  /* ============ Microsoft 365 & Licensing (5) ============ */
  {
    id: "TCK-21", cat: "Microsoft 365 & Licensing", difficulty: "Core", priority: "normal",
    ticket: { from: "HR (Nadia Rees)", org: "MaxNova Tech", subject: "New hire has no Office or Teams",
      body: "Our new starter can sign in but has no Word/Excel/Teams — says 'no licence'." },
    task: "Assign the correct licence so apps and services activate.",
    ask: ["Which licence/plan should this role have?", "Are licences available?", "Is the user's usage location set?"],
    steps: [
      "Confirm the correct plan for the role with the requester.",
      "In the Microsoft 365 admin center → Users → the user → Licenses and apps.",
      "Set the usage location if missing, then assign the licence (and only the service plans they need).",
      "Have the user sign out/in; Office/Teams provision within a short time.",
      "Confirm the apps open and are activated."
    ],
    note: "New MaxNova starter had no licence. Set usage location and assigned the staff plan in the M365 admin center. User signed out/in; Office and Teams activated. Confirmed working.",
    escalate: "Escalate if no licences are available (procurement) or activation fails after assignment.",
    check: { q: "A user has 'no licence' for Office apps. Fix?", options: ["Reinstall Windows", "Assign the correct licence in the M365 admin center", "Reset the password", "Replace the laptop"], answer: 1, explain: "Office/Teams activation requires an assigned licence." }
  },
  {
    id: "TCK-22", cat: "Microsoft 365 & Licensing", difficulty: "Starter", priority: "normal",
    ticket: { from: "Jo Reid", org: "Caledonia Legal", subject: "Word says product deactivated",
      body: "Word shows 'Product Deactivated' and I can't edit." },
    task: "Reactivate Microsoft 365 Apps for the signed-in user.",
    ask: ["Are they signed into Office with the licensed work account?", "Was a licence recently changed/removed?"],
    steps: [
      "Check File → Account: is the licensed WORK account signed in (not a personal one)?",
      "Verify a licence is assigned in the M365 admin center.",
      "Sign out and back in within Office to refresh activation.",
      "If needed, remove and re-add the account in File → Account.",
      "Confirm the apps show 'Product Activated'."
    ],
    note: "Jo's Office was signed into a personal account. Signed in with the licensed work account; Office reactivated. Confirmed editing works.",
    escalate: "Escalate if a valid licence is assigned but activation still fails.",
    check: { q: "'Product Deactivated' in Office usually means…", options: ["The PC is broken", "A licensing/sign-in issue — check the account and licence", "A virus", "The printer is offline"], answer: 1, explain: "Confirm the signed-in account and its assigned licence." }
  },
  {
    id: "TCK-23", cat: "Microsoft 365 & Licensing", difficulty: "Core", priority: "normal",
    ticket: { from: "IT Manager", org: "Guardian Risk Ltd", subject: "Reuse the leaver's licence",
      body: "Someone left last week — can we give their licence to the new starter to save cost?" },
    task: "Reclaim a licence from a leaver and reassign it correctly.",
    ask: ["Is the leaver's account already disabled/offboarded?", "Does mailbox data need preserving first?"],
    steps: [
      "Confirm the leaver is offboarded and any mailbox/OneDrive data is preserved (e.g. mailbox converted to shared, or on hold).",
      "Note: removing a licence can start data deletion timers — preserve first.",
      "Remove the licence from the leaver in the M365 admin center.",
      "Assign it to the new starter (usage location + correct service plans).",
      "Confirm the new user's apps/services activate."
    ],
    note: "Confirmed the leaver was offboarded and mailbox converted to shared (under 50 GB, no licence needed). Reclaimed the licence and assigned it to the new starter; confirmed activation.",
    escalate: "Escalate to ensure retention/hold requirements are met before removing a licence.",
    check: { q: "Before removing a leaver's licence to reuse it, you should…", options: ["Nothing — just remove it", "Preserve their mailbox/OneDrive data first", "Delete their whole account", "Reset all passwords"], answer: 1, explain: "Removing a licence can trigger data deletion — preserve data first." }
  },
  {
    id: "TCK-24", cat: "Microsoft 365 & Licensing", difficulty: "Starter", priority: "normal",
    ticket: { from: "Dana Fox", org: "MaxNova Tech", subject: "How do I install Office on my new PC?",
      body: "Got a new PC, need Word/Excel/Outlook installed." },
    task: "Get Microsoft 365 Apps installed for a licensed user.",
    ask: ["Do they have a licence with the desktop apps?", "Is this a managed device (Intune may push it)?"],
    steps: [
      "Confirm they have a licence that includes Microsoft 365 Apps.",
      "On a managed device, Intune usually deploys Office automatically — check Company Portal.",
      "Otherwise, have them sign in at office.com / microsoft365.com → Install apps.",
      "Run the installer, then activate by signing in with the work account.",
      "Confirm the apps open and are activated."
    ],
    note: "Dana had the right licence. Installed Microsoft 365 Apps from microsoft365.com and activated with her work account. Confirmed Word/Excel/Outlook open and are activated.",
    escalate: "Escalate to endpoint admins if it should deploy via Intune but doesn't.",
    check: { q: "A licensed user installs Microsoft 365 Apps from…", options: ["A random website", "microsoft365.com/office.com → Install apps (or via Intune)", "The BIOS", "The printer"], answer: 1, explain: "Install from the official portal or let Intune deploy it." }
  },
  {
    id: "TCK-25", cat: "Microsoft 365 & Licensing", difficulty: "Core", priority: "normal",
    ticket: { from: "Aziz Khan", org: "Guardian Risk Ltd", subject: "I don't have the feature my colleague has",
      body: "A colleague has a feature (advanced Teams/Intune access) that I don't." },
    task: "Identify a licence/plan mismatch behind a missing feature.",
    ask: ["Which exact feature is missing?", "What licences do the two users have?"],
    steps: [
      "Compare the two users' assigned licences/service plans in the M365 admin center.",
      "Many features are gated by a specific plan (e.g. a premium add-on) or a service plan that's turned off.",
      "If the user's role warrants it, request/assign the correct licence or enable the service plan.",
      "Have the user sign out/in to pick up the change.",
      "Confirm the feature now appears."
    ],
    note: "Aziz lacked the add-on plan his colleague had. Confirmed his role warranted it, assigned the correct licence, he signed out/in and the feature appeared. Confirmed working.",
    escalate: "Escalate for licence procurement or if entitlement needs manager/security approval.",
    check: { q: "A user is missing a feature a colleague has. Likely cause?", options: ["A broken keyboard", "A licence/service-plan difference between the two", "A dead battery", "The printer"], answer: 1, explain: "Features are often gated by the assigned licence or service plan." }
  },

  /* ============ Exchange & Email (7) ============ */
  {
    id: "TCK-26", cat: "Exchange & Email", difficulty: "Starter", priority: "normal",
    ticket: { from: "Jo Reid", org: "Caledonia Legal", subject: "Outlook won't receive email",
      body: "Outlook hasn't received anything since this morning. Is the server down?" },
    task: "Isolate mailbox vs desktop client.",
    ask: ["Does Outlook on the web (OWA) work?", "Send, receive, or both?", "Any error/connection status?"],
    steps: [
      "Check OWA at outlook.office.com — if mail is there, the mailbox is fine; it's the client.",
      "In Outlook, check the connection status and whether 'Work Offline' is on.",
      "Restart Outlook; try safe mode if it persists.",
      "If OWA is also empty, investigate mail flow with a message trace.",
      "Confirm mail resumes and record the fix."
    ],
    note: "OWA received normally — mailbox healthy. 'Work Offline' was enabled in Outlook desktop; disabled it and mail flowed. User confirmed.",
    escalate: "If OWA is also affected, route to Exchange/M365 with message-trace evidence.",
    check: { q: "Best first diagnostic for 'Outlook won't receive'?", options: ["Reinstall Office", "Check webmail (OWA)", "Reset the password", "Rebuild the profile"], answer: 1, explain: "OWA instantly separates a client problem from a mailbox problem." }
  },
  {
    id: "TCK-27", cat: "Exchange & Email", difficulty: "Core", priority: "normal",
    ticket: { from: "Ruth Bell", org: "Harbour Dental", subject: "Client never got my email",
      body: "I emailed a client 2 hours ago; they say it never arrived. Other mail works." },
    task: "Prove what happened using message trace, not guesswork.",
    ask: ["Exact recipient and send time?", "Any bounce-back (NDR)?"],
    steps: [
      "Get the recipient address and approximate send time.",
      "Run a message trace in the Exchange admin center for that sender/recipient/time.",
      "Read the outcome: Delivered, Failed, Pending or Quarantined.",
      "If quarantined/blocked, review why and release/advise appropriately.",
      "Report the finding with evidence."
    ],
    note: "Message trace showed the message quarantined by the spam filter (attachment type). Reviewed and released it, advised the sender. Confirmed delivery.",
    escalate: "Escalate to M365/Security for quarantine/policy decisions beyond your remit.",
    check: { q: "Which tool proves whether an email was delivered, blocked or quarantined?", options: ["Task Manager", "Message trace", "ipconfig", "Sign-in logs"], answer: 1, explain: "Message trace in Exchange is the evidence tool for 'they never got it'." }
  },
  {
    id: "TCK-28", cat: "Exchange & Email", difficulty: "Core", priority: "normal",
    ticket: { from: "Reception", org: "Harbour Dental", subject: "Can't open the shared bookings inbox",
      body: "Our team needs the 'bookings' mailbox but I can't open it." },
    task: "Grant shared-mailbox access to the right people.",
    ask: ["Which shared mailbox?", "Who needs access?", "Did permissions/team change recently?"],
    steps: [
      "Confirm the shared mailbox and who needs access.",
      "In the Exchange admin center → the shared mailbox → Delegation.",
      "Grant Full Access (and Send As if they need to send as the mailbox).",
      "Re-open Outlook — auto-mapping usually adds it shortly; else add manually via Account Settings.",
      "Confirm access."
    ],
    note: "Granted Full Access (and Send As) to reception staff on the 'bookings' shared mailbox in Exchange. Auto-mapped after restart; users confirmed access.",
    escalate: "Route to M365 if permissions look right but access still fails (sync/licensing).",
    check: { q: "Does a shared mailbox under 50 GB need its own licence?", options: ["Yes, always", "No", "Only with a calendar", "Only for guests"], answer: 1, explain: "Shared mailboxes under 50 GB are free." }
  },
  {
    id: "TCK-29", cat: "Exchange & Email", difficulty: "Core", priority: "normal",
    ticket: { from: "Sam Doyle", org: "Northstar Retail", subject: "Mailbox almost full",
      body: "I keep getting 'mailbox almost full' and can't send." },
    task: "Reduce mailbox size and restore sending.",
    ask: ["Size vs quota?", "Large folders (Sent, Deleted, big attachments)?", "Is online archive available?"],
    steps: [
      "Check mailbox size vs quota in the Exchange admin center.",
      "Empty Deleted Items and clear obvious large items via Outlook's Mailbox Cleanup (sort by size).",
      "Enable/use the online archive if licensed, rather than deleting important mail.",
      "Confirm size drops below quota.",
      "Confirm the user can send again."
    ],
    note: "Sam's mailbox was near quota. Emptied Deleted Items, removed large attachments and enabled the online archive. Size dropped below quota; sending resumed.",
    escalate: "Route to M365 for a quota change or archive licensing.",
    check: { q: "A 'mailbox almost full' warning is a…", options: ["Server outage", "Storage-quota issue — clean up or archive", "Password problem", "Virus"], answer: 1, explain: "It's storage quota — clean up or use the online archive." }
  },
  {
    id: "TCK-30", cat: "Exchange & Email", difficulty: "Advanced", priority: "high",
    ticket: { from: "Multiple users", org: "Guardian Risk Ltd", subject: "Emails to a client domain bouncing",
      body: "Several of us get bounce-backs (NDRs) emailing one client domain." },
    task: "Diagnose why mail to one external domain fails.",
    ask: ["Exact NDR code/text (e.g. 550)?", "One recipient or the whole domain?", "When did it start?"],
    steps: [
      "Collect the exact NDR code/text — it states the reason.",
      "Run a message trace to confirm where delivery stops.",
      "Interpret: unknown recipient, blocked by their filter, or a sender-reputation/DNS issue your side.",
      "If it's their side (blocked/greylisted), advise users to contact the recipient; keep evidence.",
      "If it's your side (reputation/connector/DNS), escalate with the NDR and trace."
    ],
    note: "550 NDRs to a client domain. Message trace showed the recipient rejecting for reputation. Provided evidence, advised users to contact the client's IT, and escalated to the mail team.",
    escalate: "Escalate to M365/mail-flow specialists for connectors, DNS or domain reputation.",
    check: { q: "What is an NDR?", options: ["A network report", "A Non-Delivery Report (bounce-back)", "A new device request", "A DNS record"], answer: 1, explain: "The bounce-back; its code tells you why delivery failed." }
  },
  {
    id: "TCK-31", cat: "Exchange & Email", difficulty: "Starter", priority: "low",
    ticket: { from: "Ellie Grant", org: "Caledonia Legal", subject: "Set up out-of-office while I'm away",
      body: "Going on leave Friday — can you set my automatic replies?" },
    task: "Configure automatic replies (or guide the user).",
    ask: ["Dates for the auto-reply?", "Internal-only or external too, and the wording?"],
    steps: [
      "Best practice: show the user how to self-serve (Outlook → File → Automatic Replies).",
      "If setting it for them, use the Exchange admin center or OWA on their behalf per policy.",
      "Set the date range and separate internal/external messages as requested.",
      "Avoid over-sharing in the external message (no detailed whereabouts).",
      "Confirm it's scheduled correctly."
    ],
    note: "Set Ellie's automatic replies for her leave dates (internal + a brief external message) via OWA on her behalf per policy, and showed her how to do it herself next time. Confirmed scheduled.",
    escalate: "No escalation normally needed.",
    check: { q: "Where does a user set their own out-of-office?", options: ["The BIOS", "Outlook → File → Automatic Replies (or OWA)", "Task Manager", "The printer"], answer: 1, explain: "Automatic Replies in Outlook/OWA — encourage self-service." }
  },
  {
    id: "TCK-32", cat: "Exchange & Email", difficulty: "Core", priority: "normal",
    ticket: { from: "Tom Blake", org: "Northstar Retail", subject: "Expecting an email that never came",
      body: "A supplier says they sent an invoice but it's not in my inbox or junk." },
    task: "Check quarantine/mail flow for an inbound message.",
    ask: ["Sender address and rough time?", "Checked Junk and Deleted?"],
    steps: [
      "Confirm the sender address and time; have them check Junk/Deleted.",
      "Run a message trace (inbound) for that sender/recipient/time.",
      "If it was quarantined by Defender, review the quarantine (security.microsoft.com) and release if legitimate.",
      "If blocked by a rule/connector, note why and advise.",
      "Confirm the message arrives."
    ],
    note: "Trace showed the supplier's invoice quarantined by Defender as suspected spam. Reviewed and released it (legitimate), and it delivered. Advised the user.",
    escalate: "Escalate to Security/M365 for repeated false quarantines or policy tuning.",
    check: { q: "An expected inbound email is missing (not in Junk). Check…", options: ["The printer", "Message trace and the Defender quarantine", "The user's password", "The BIOS"], answer: 1, explain: "Trace it; it may be quarantined by Defender and need releasing." }
  },

  /* ============ Teams & Collaboration (6) ============ */
  {
    id: "TCK-33", cat: "Teams & Collaboration", difficulty: "Starter", priority: "normal",
    ticket: { from: "Morgan Lee", org: "Bright Roots Learning", subject: "Teams stuck loading",
      body: "Teams just spins on the sign-in screen and never loads." },
    task: "Get Teams signing in again.",
    ask: ["Does Teams on the web work?", "Any error code?"],
    steps: [
      "Try teams.microsoft.com to confirm the account is fine.",
      "Fully quit Teams (check the system tray/Task Manager).",
      "Clear the Teams cache (sign out / clear cached credentials/app cache) and reopen.",
      "Confirm the client is updated or reinstall if needed.",
      "Confirm sign-in and normal function."
    ],
    note: "Teams web worked (account healthy). Cleared the desktop Teams cache and restarted; the sign-in loop cleared. User confirmed.",
    escalate: "Route to M365 if web Teams also fails (account/licensing/Conditional Access).",
    check: { q: "Teams stuck on sign-in/loading. Common fix?", options: ["Reinstall Windows", "Clear the Teams cache and restart", "Reset the password", "Buy more licences"], answer: 1, explain: "Clearing the Teams cache resolves most sign-in/loading loops." }
  },
  {
    id: "TCK-34", cat: "Teams & Collaboration", difficulty: "Core", priority: "normal",
    ticket: { from: "Aziz Khan", org: "Guardian Risk Ltd", subject: "No audio in Teams calls",
      body: "In Teams calls I see people but can't hear them and they can't hear me." },
    task: "Fix Teams audio device configuration.",
    ask: ["Which speaker/mic is selected in Teams?", "Does audio work in Windows sound test?", "Headset plugged/paired?"],
    steps: [
      "Run a Teams test call (Settings → Devices → Make a test call).",
      "Select the correct speaker and microphone in Teams Devices.",
      "Check Windows sound settings: correct default output/input, not muted.",
      "Reconnect/re-pair the headset; confirm app mic permissions.",
      "Retest and confirm two-way audio."
    ],
    note: "Wrong output device was selected and the headset wasn't default. Set the correct devices in Teams and Windows; test call passed. Confirmed two-way audio.",
    escalate: "Route to Hardware if the headset is faulty, or M365 if Teams device settings are locked.",
    check: { q: "No audio in Teams but you can see people. First check?", options: ["Reinstall Windows", "The selected speaker/mic device in Teams", "The password", "The VPN"], answer: 1, explain: "Wrong device selection is the most common Teams audio cause." }
  },
  {
    id: "TCK-35", cat: "Teams & Collaboration", difficulty: "Core", priority: "normal",
    ticket: { from: "Reception", org: "Harbour Dental", subject: "Can't make external calls in Teams",
      body: "We use Teams for phones but I can't dial out to normal phone numbers." },
    task: "Diagnose Teams Phone external-calling (dial pad missing / no calling plan).",
    ask: ["Is there a dial pad in Teams Calls?", "Do they have a phone number and a Calling Plan/Direct Routing enabled?", "Just them or everyone?"],
    steps: [
      "Check whether the Teams dial pad appears (no dial pad usually means no PSTN entitlement).",
      "In the Teams admin center, confirm the user has a phone number and a voice licence/Calling Plan (or Direct Routing) and a voice-routing policy.",
      "Confirm they're enterprise-voice enabled.",
      "Have them sign out/in to Teams after any change.",
      "Test an external call and confirm."
    ],
    note: "Reception user had Teams Phone but no Calling Plan assigned, so no dial pad. Assigned the voice licence/number and voice-routing policy in the Teams admin center; user signed out/in and could dial externally. Confirmed.",
    escalate: "Escalate to voice/Teams admins for number assignment, Calling Plans or Direct Routing config.",
    check: { q: "No dial pad in Teams Calls usually means…", options: ["A broken headset", "No PSTN entitlement (Calling Plan/number/voice policy) assigned", "A dead battery", "A printer fault"], answer: 1, explain: "External calling needs a phone number + Calling Plan/Direct Routing and voice policy." }
  },
  {
    id: "TCK-36", cat: "Teams & Collaboration", difficulty: "Core", priority: "normal",
    ticket: { from: "Dana Fox", org: "MaxNova Tech", subject: "External guest can't join our meeting",
      body: "A client couldn't join our Teams meeting — got stuck or blocked." },
    task: "Resolve external/guest meeting-join issues.",
    ask: ["Was the client joining anonymously or as a guest?", "What did they see (lobby, blocked)?", "Are external/anonymous joins allowed by policy?"],
    steps: [
      "Confirm how they joined (browser/app, anonymous vs guest) and the exact message.",
      "Check meeting options: who can bypass the lobby and whether anonymous users are allowed.",
      "Verify org policy (Teams admin center) permits external/anonymous meeting join.",
      "Advise the organiser to admit them from the lobby, or adjust meeting options.",
      "Confirm the guest can join."
    ],
    note: "The client was waiting in the lobby and meeting options only admitted internal people. Advised the organiser to admit from the lobby / adjust 'who can bypass lobby'. Confirmed the guest joined.",
    escalate: "Escalate to Teams admins if org policy blocks external/anonymous join and it should be allowed.",
    check: { q: "An external guest is 'stuck' joining a Teams meeting. Often it's…", options: ["A dead battery", "The lobby / meeting options not admitting them", "A printer issue", "A password reset"], answer: 1, explain: "Lobby and meeting-option settings commonly hold external attendees." }
  },
  {
    id: "TCK-37", cat: "Teams & Collaboration", difficulty: "Starter", priority: "normal",
    ticket: { from: "Nadia Rees", org: "MaxNova Tech", subject: "Add new starter to our Team",
      body: "Please add our new colleague to the 'Projects' Team so they see the channels." },
    task: "Add a user to a Team (membership grants channel access).",
    ask: ["Which Team, and member or owner?", "Should it be via the underlying M365 group?"],
    steps: [
      "Identify the Team and the required role (member vs owner).",
      "Add the user as a member (Team → Manage team → Add member), which also adds them to the backing M365 group.",
      "For consistency you can manage membership via the M365 group in the admin center.",
      "Confirm they see the standard channels (private channels need separate membership).",
      "Confirm access with the user."
    ],
    note: "Added the new starter as a member of the 'Projects' Team; they can see the standard channels. Noted a private channel needs separate membership. Confirmed access.",
    escalate: "Route to the Team owner if their approval is required to add members.",
    check: { q: "Adding someone to a Team as a member also adds them to…", options: ["The BIOS", "The Team's underlying Microsoft 365 group", "The printer queue", "Global Admins"], answer: 1, explain: "A Team is backed by an M365 group; membership grants channel access." }
  },
  {
    id: "TCK-38", cat: "Teams & Collaboration", difficulty: "Advanced", priority: "normal",
    ticket: { from: "Reception", org: "Harbour Dental", subject: "One-way audio on Teams calls",
      body: "On calls we can hear the caller but they can't hear us (or vice versa)." },
    task: "Diagnose one-way audio (device vs network/media path).",
    ask: ["Which direction is missing?", "One user/handset or all?", "Recent network/firewall change?"],
    steps: [
      "If it's one user, check their mic selection/mute and app permissions first.",
      "If it's everyone, the media (RTP) path is likely blocked one way — firewall/NAT/QoS.",
      "Confirm Teams media traffic/ports aren't being blocked by a recent firewall change.",
      "Use the Teams call analytics / call health to see media details.",
      "If it's a network/firewall media issue, gather evidence and escalate."
    ],
    note: "One-way audio affected all reception calls — call setup fine but media blocked one direction after a firewall change. Gathered call-analytics evidence and escalated to Networking to review the Teams media path.",
    escalate: "Escalate to Networking for firewall/NAT/QoS affecting the Teams media (RTP) path.",
    check: { q: "All Teams calls have one-way audio. Likely cause?", options: ["Wrong password", "The media (RTP) path blocked one way — firewall/NAT", "The mailbox is full", "A DNS record"], answer: 1, explain: "Signalling connects the call; blocked media one-way = firewall/NAT." }
  },

  /* ============ SharePoint & OneDrive (4) ============ */
  {
    id: "TCK-39", cat: "SharePoint & OneDrive", difficulty: "Core", priority: "normal",
    ticket: { from: "Morgan Lee", org: "Bright Roots Learning", subject: "Access denied to a SharePoint site",
      body: "I click the team's SharePoint link and get 'you don't have access'." },
    task: "Grant appropriate SharePoint access via the correct group.",
    ask: ["Which site?", "What access level?", "Grant via the site's group?"],
    steps: [
      "Identify the site and required permission level (usually via a group).",
      "Prefer adding the user to the site's Members group / M365 group rather than a direct grant.",
      "Get the site owner's approval if required.",
      "Have the user retry after membership propagates (may need a sign-out/in).",
      "Confirm access at the correct level (not over-permissioned)."
    ],
    note: "Added Morgan to the site's Members group (owner-approved) rather than a direct grant. Access confirmed at the correct level.",
    escalate: "Escalate to the site owner for approval or M365 for tenant sharing policy.",
    check: { q: "Best practice for granting SharePoint access is to…", options: ["Give direct one-off permissions", "Add the user to the appropriate group", "Make everyone an owner", "Email the files"], answer: 1, explain: "Group-based access is cleaner, auditable and easy to revoke." }
  },
  {
    id: "TCK-40", cat: "SharePoint & OneDrive", difficulty: "Core", priority: "normal",
    ticket: { from: "Sam Doyle", org: "Northstar Retail", subject: "OneDrive stuck syncing",
      body: "OneDrive shows a spinning icon and my files aren't updating." },
    task: "Get OneDrive syncing without losing data.",
    ask: ["Any error on the OneDrive icon?", "A problem file (bad characters/long path/huge file)?", "Disk space?"],
    steps: [
      "Check the OneDrive icon for a specific error/paused state; resume if paused.",
      "Look for problem files (unsupported characters, very long paths, very large files) and fix/rename.",
      "Check local disk space and free some if low.",
      "Restart OneDrive; if needed reset the client (keeps files) to rebuild sync.",
      "Confirm sync completes and files are up to date."
    ],
    note: "A file with unsupported characters blocked Sam's OneDrive sync. Renamed it; sync resumed and completed. Confirmed files current.",
    escalate: "Route to M365 if a reset doesn't clear a persistent sync error.",
    check: { q: "OneDrive won't finish syncing. A common culprit is…", options: ["A dead battery", "A problem file (bad characters/long path) or full disk", "The wrong password", "A printer"], answer: 1, explain: "Unsupported names, long paths and low disk space commonly block sync." }
  },
  {
    id: "TCK-41", cat: "SharePoint & OneDrive", difficulty: "Starter", priority: "normal",
    ticket: { from: "Jo Reid", org: "Caledonia Legal", subject: "Deleted a file by accident",
      body: "I deleted an important document from our SharePoint library — can I get it back?" },
    task: "Restore a deleted file from the recycle bin / version history.",
    ask: ["Which library and file?", "Roughly when was it deleted?"],
    steps: [
      "Check the SharePoint site's Recycle Bin (site contents → Recycle bin) for the file.",
      "If not there, check the site collection (second-stage) recycle bin.",
      "Restore the file to its original location.",
      "For an overwritten (not deleted) file, use Version history to restore an earlier version.",
      "Confirm the file is back and correct."
    ],
    note: "Restored Jo's deleted document from the SharePoint Recycle Bin to its original library location. Confirmed it opens and is the right version.",
    escalate: "Escalate to M365/admins if it's past retention or in neither recycle bin.",
    check: { q: "First place to recover a recently deleted SharePoint file?", options: ["The BIOS", "The site Recycle Bin (then second-stage)", "Task Manager", "The printer"], answer: 1, explain: "Deleted items sit in the recycle bin (two stages) before permanent deletion." }
  },
  {
    id: "TCK-42", cat: "SharePoint & OneDrive", difficulty: "Advanced", priority: "normal",
    ticket: { from: "Dana Fox", org: "MaxNova Tech", subject: "My Desktop/Documents aren't backing up",
      body: "I thought my Desktop and Documents saved to OneDrive but they're not." },
    task: "Check Known Folder Move (KFM) / folder backup for OneDrive.",
    ask: ["Is OneDrive signed in and syncing?", "Are Desktop/Documents/Pictures set to back up?", "Is this device managed (KFM may be policy-driven)?"],
    steps: [
      "Confirm OneDrive is signed in and healthy.",
      "OneDrive → Settings → Sync and back up → Manage backup; ensure Desktop/Documents/Pictures are backing up (Known Folder Move).",
      "On managed devices, KFM is often enforced via Intune — check policy is applied.",
      "Turn on the folders to back up and let it sync.",
      "Confirm the known folders now show the OneDrive/cloud status."
    ],
    note: "Dana's Known Folder Move wasn't enabled. Turned on Desktop/Documents backup in OneDrive (aligned with Intune policy); folders synced to OneDrive. Confirmed cloud backup status.",
    escalate: "Escalate to endpoint admins if KFM policy should be enforced by Intune but isn't applying.",
    check: { q: "Backing up Desktop/Documents to OneDrive is called…", options: ["BitLocker", "Known Folder Move (KFM) / folder backup", "Conditional Access", "A message trace"], answer: 1, explain: "KFM/folder backup redirects known folders into OneDrive, often via Intune." }
  },

  /* ============ Security & Compliance (6) ============ */
  {
    id: "TCK-43", cat: "Security & Compliance", difficulty: "Core", priority: "critical",
    ticket: { from: "Ellie Grant", org: "Caledonia Legal", subject: "MFA prompts I didn't start",
      body: "I keep getting 'approve sign-in?' prompts but I'm not signing in anywhere." },
    task: "Treat as a possible compromise — do NOT tell them to approve.",
    ask: ["Are they approving any? (They must NOT.)", "When did it start?"],
    steps: [
      "Tell the user to DENY all prompts — approving may hand an attacker access (MFA-fatigue attack).",
      "Treat as a possible account compromise.",
      "Follow the incident process: reset the password, revoke sessions in Entra, review sign-in logs / risky sign-ins.",
      "Escalate to Security immediately; record the facts (never record codes).",
      "Do not close as user error — confirm the account is secured."
    ],
    note: "Ellie reported unsolicited MFA prompts — possible MFA-fatigue attack. Advised her to deny all. Reset password, revoked sessions in Entra and reviewed risky sign-ins; escalated to Security per incident policy.",
    escalate: "Escalate to Security at once — suspected compromise is never a first-line-only close.",
    check: { q: "A user gets MFA prompts they didn't start. Tell them to…", options: ["Approve one to make it stop", "Deny all; treat as possible compromise and escalate", "Ignore it", "Turn off MFA"], answer: 1, explain: "Approving could grant an attacker access — deny and escalate to Security." }
  },
  {
    id: "TCK-44", cat: "Security & Compliance", difficulty: "Core", priority: "high",
    ticket: { from: "Tom Blake", org: "Northstar Retail", subject: "I think I got phished",
      body: "An email asked me to 'verify my password' and I think I entered it on the link." },
    task: "Contain a possible credential compromise.",
    ask: ["Did they enter credentials on the linked page?", "Is the email still available to report?", "What exactly did they submit?"],
    steps: [
      "If credentials were entered, treat the account as compromised: reset password and revoke sessions in Entra immediately.",
      "Have them report the email via your phishing-report process (don't just delete it).",
      "Review sign-in logs / risky sign-ins for suspicious activity.",
      "Consider whether it's a wider campaign; block sender/URL if in remit.",
      "Escalate to Security and record the timeline."
    ],
    note: "Tom likely entered credentials on a phishing page. Reset his password, revoked sessions and reviewed sign-in logs. Reported the email for analysis and escalated to Security. Advised on spotting phishing.",
    escalate: "Escalate to Security for any credential-entry phishing and for wider campaigns.",
    check: { q: "A user entered their password on a phishing page. First action?", options: ["Delete the email and move on", "Reset the password and revoke sessions immediately", "Wait and see", "Tell them off"], answer: 1, explain: "Assume compromise — reset and revoke, then escalate to Security." }
  },
  {
    id: "TCK-45", cat: "Security & Compliance", difficulty: "Advanced", priority: "high",
    ticket: { from: "Defender alert", org: "MaxNova Tech", subject: "Risky user flagged",
      body: "Automated Microsoft Defender/Entra alert: a user account is flagged as high risk." },
    task: "Respond to an Entra ID Protection / Defender risk alert.",
    ask: ["What risk detections are listed?", "Is there any confirmed malicious activity?"],
    steps: [
      "Open the alert in the Microsoft Defender / Entra portal and read the risk detections.",
      "Review the user's recent sign-ins (locations, devices, impossible travel).",
      "Follow the incident runbook: confirm/require secure password change, revoke sessions, require MFA re-registration if needed.",
      "Contact the user via a trusted channel to confirm activity.",
      "Escalate to Security and document; only dismiss risk if genuinely benign per policy."
    ],
    note: "High-risk user alert on a MaxNova account with an unfamiliar sign-in location. Reviewed detections, revoked sessions and forced a secure password reset + MFA re-registration; escalated to Security and documented. Awaiting Security's confirmation before dismissing risk.",
    escalate: "Always involve Security for risk alerts — don't dismiss risk unilaterally on first line.",
    check: { q: "A Defender/Entra 'risky user' alert should be…", options: ["Ignored — usually false", "Investigated per the incident runbook and escalated to Security", "Resolved as user error", "Deleted"], answer: 1, explain: "Risk alerts indicate possible compromise — investigate and escalate." }
  },
  {
    id: "TCK-46", cat: "Security & Compliance", difficulty: "Core", priority: "high",
    ticket: { from: "Aziz Khan", org: "Guardian Risk Ltd", subject: "Lost my work phone with Authenticator",
      body: "I left my work phone on the train. It has my email and Authenticator." },
    task: "Reduce risk from a lost device holding company access + MFA.",
    ask: ["When/where lost? PIN/biometric protected?", "Company or personal? Confirm in Intune"],
    steps: [
      "Follow the lost-device process promptly.",
      "In Intune, issue a Wipe (company) or Retire/selective wipe (personal) on the correct device.",
      "In Entra, revoke the user's sessions and remove the lost Authenticator method.",
      "Issue a TAP so they re-register MFA on a replacement; consider a precautionary password reset.",
      "Escalate to Security and record actions (never record codes/keys)."
    ],
    note: "Aziz's work phone lost (mail + Authenticator). Issued a wipe in Intune, revoked sessions and removed the lost MFA method in Entra; issued a TAP to re-register MFA on a replacement. Escalated to Security and documented.",
    escalate: "Escalate to Security for lost/stolen devices with company access; involve endpoint admins for the wipe.",
    check: { q: "A work phone with mail + Authenticator is lost. Key action?", options: ["Do nothing until found", "Wipe/retire in Intune, revoke sessions, re-register MFA elsewhere", "Reset the printer", "Buy new licences"], answer: 1, explain: "Contain: wipe/retire + revoke sessions, then re-establish MFA securely." }
  },
  {
    id: "TCK-47", cat: "Security & Compliance", difficulty: "Core", priority: "normal",
    ticket: { from: "Ellie Grant", org: "Caledonia Legal", subject: "Can I install this free tool?",
      body: "I found a free PDF converter online and want it installed today to finish a task." },
    task: "Apply software policy — don't install unvetted software.",
    ask: ["Is it on the approved list / is there an approved equivalent?", "What's the actual task?", "Does policy require manager/security approval?"],
    steps: [
      "Don't install unvetted downloads on request.",
      "Check the approved software list / Company Portal for an equivalent that does the job.",
      "If nothing exists, follow the approval/request process (manager/security sign-off).",
      "Offer a safe alternative (e.g. built-in 'Print to PDF' or an approved app) to meet today's deadline.",
      "Document the decision."
    ],
    note: "Requested unapproved PDF converter. Not on the approved list; offered built-in 'Print to PDF' / an approved tool that met the need today, and logged the request for approval. No unvetted software installed.",
    escalate: "Route to Security/software-approval if no approved equivalent exists.",
    check: { q: "A user wants an unapproved free tool installed today. You…", options: ["Just install it", "Follow the approval process and offer an approved alternative", "Ignore the request", "Install it and hide it"], answer: 1, explain: "Unvetted software is a security risk — follow policy, offer alternatives." }
  },
  {
    id: "TCK-48", cat: "Security & Compliance", difficulty: "Advanced", priority: "normal",
    ticket: { from: "Sam Doyle", org: "Northstar Retail", subject: "Email blocked — 'sensitive info'",
      body: "I tried to email a spreadsheet and got blocked saying it has sensitive information." },
    task: "Handle a Purview DLP block correctly — don't just bypass it.",
    ask: ["What did the block/policy tip say?", "Does the file genuinely contain sensitive data (e.g. card/ID numbers)?", "Is the recipient authorised?"],
    steps: [
      "Recognise this as a Data Loss Prevention (DLP) policy block, not a fault.",
      "Read the policy tip — it names what was detected (e.g. financial/ID data).",
      "If sending is genuinely inappropriate, advise a compliant method (secure/approved channel).",
      "If it's a legitimate business need with a false positive or an allowed override, follow the documented override/justification process — never coach the user to strip data to dodge DLP.",
      "Escalate policy questions to Security/Compliance; document."
    ],
    note: "Sam's email was blocked by a Purview DLP policy detecting financial data. Confirmed the send wasn't appropriate over normal mail; advised the approved secure method and logged it. Referred the policy question to Compliance. Did not bypass DLP.",
    escalate: "Escalate to Security/Compliance for DLP policy decisions and legitimate override requests.",
    check: { q: "An email is blocked for 'sensitive information'. This is…", options: ["A broken mailbox", "A Purview DLP policy — handle per compliance, don't just bypass", "A virus", "A printer fault"], answer: 1, explain: "DLP protects sensitive data — follow the compliant path, don't coach a bypass." }
  },

  /* ============ Networking & Connectivity (2) ============ */
  {
    id: "TCK-49", cat: "Networking & Connectivity", difficulty: "Advanced", priority: "high",
    ticket: { from: "Several staff", org: "Guardian Risk Ltd", subject: "VPN certificate expired warning",
      body: "A few of us get a 'certificate expired' warning connecting to the VPN. Is it safe?" },
    task: "Handle a likely expired/replaced VPN certificate — and the security judgement.",
    ask: ["Exact warning text (expired vs untrusted)?", "How many remote users affected?", "Did the VPN/cert recently change?"],
    steps: [
      "Do NOT tell users to click through security warnings.",
      "Confirm how many are affected and the exact wording.",
      "Check whether the VPN gateway certificate (or the profile cert pushed via Intune) has expired/changed.",
      "Certificate renewal/redeploy is a server/endpoint-admin task, not a first-line click-through.",
      "Escalate to Networking/endpoint admins to renew/redeploy the certificate; advise users to hold off."
    ],
    note: "Multiple remote users at Guardian Risk report 'certificate expired' on VPN; webmail still works. Did not advise bypassing. Confirmed multi-user and escalated to Networking/endpoint admins to renew the VPN certificate. High priority.",
    escalate: "Escalate to Networking/endpoint admins — certificate renewal is not a first-line click-through.",
    check: { q: "Users get a VPN certificate warning. You should…", options: ["Tell them to click 'ignore'", "Confirm the cert status and escalate to renew it", "Reset their passwords", "Close the ticket"], answer: 1, explain: "Never coach users past security warnings — verify and escalate the cert renewal." }
  },
  {
    id: "TCK-50", cat: "Networking & Connectivity", difficulty: "Core", priority: "normal",
    ticket: { from: "Tom Blake", org: "Northstar Retail", subject: "No internet at my desk",
      body: "Only my PC has no internet — everyone around me is fine." },
    task: "Fix single-user connectivity (others fine = local issue).",
    ask: ["Wired or Wi-Fi?", "Any network icon warning?", "Worked earlier / anything change?"],
    steps: [
      "Others are fine → it's local to this device, not the network.",
      "Check the physical cable / Wi-Fi connection and adapter status.",
      "Run ipconfig: valid IP, or a 169.254 (APIPA) address meaning no DHCP?",
      "ipconfig /release then /renew, or reconnect the adapter/Wi-Fi.",
      "Flush DNS (ipconfig /flushdns) if names don't resolve; confirm browsing works."
    ],
    note: "Only Tom's PC affected; ipconfig showed a 169.254 APIPA address (no DHCP). Reseated the cable and ran release/renew; got a valid IP and internet returned. Confirmed browsing.",
    escalate: "Route to Networking if the switch port is faulty or many users are affected.",
    check: { q: "One user has no internet but everyone else is fine. This points to…", options: ["A company-wide outage", "A local device/connection issue", "A password problem", "A licensing issue"], answer: 1, explain: "If only one is affected, the fault is local, not the network." }
  }
];
