/* =====================================================================
   IT Engineer Learning Hub — cheatsheets-data.js
   Copy-paste references for mid-ticket use. Each sheet has items with a
   `cmd` (the thing to copy) and a plain-English `desc`.
   ===================================================================== */
window.CHEATSHEETS = [
  {
    id: "windows-net",
    title: "Windows network & repair",
    icon: "🪟",
    desc: "Run these in Command Prompt or PowerShell (some need 'Run as administrator').",
    items: [
      { cmd: "ipconfig /all", desc: "Show full network config — IP, gateway, DNS, MAC. First stop for any network issue." },
      { cmd: "ipconfig /flushdns", desc: "Clear the DNS cache. Fixes 'can't reach a site that everyone else can'." },
      { cmd: "ipconfig /release && ipconfig /renew", desc: "Drop and re-request an IP address from DHCP." },
      { cmd: "ping 8.8.8.8", desc: "Test raw internet connectivity to an IP (rules out DNS)." },
      { cmd: "ping google.com", desc: "Test connectivity by name — if the IP ping works but this fails, it's DNS." },
      { cmd: "nslookup outlook.office.com", desc: "Check what a name resolves to — confirms DNS is answering." },
      { cmd: "tracert google.com", desc: "Show the hops to a destination — spot where a connection dies." },
      { cmd: "sfc /scannow", desc: "Scan and repair corrupted Windows system files (admin)." },
      { cmd: "DISM /Online /Cleanup-Image /RestoreHealth", desc: "Repair the Windows image when sfc alone can't (admin)." },
      { cmd: "gpupdate /force", desc: "Force a Group Policy refresh — pulls down new drive maps, printers, policies." },
      { cmd: "chkdsk C: /f", desc: "Check and fix disk errors on C: (schedules for next reboot)." }
    ]
  },
  {
    id: "spooler",
    title: "Printers & services",
    icon: "🖨️",
    desc: "The print-spooler restart clears most stuck-queue tickets.",
    items: [
      { cmd: "net stop spooler", desc: "Stop the Print Spooler service." },
      { cmd: "net start spooler", desc: "Start it again — the two together clear a jammed print queue." },
      { cmd: "services.msc", desc: "Open the Services console to restart Print Spooler, or any other service, by hand." },
      { cmd: "printmanagement.msc", desc: "Print Management — view printers, drivers and queues on the machine/server." },
      { cmd: "control printers", desc: "Open Devices and Printers quickly." }
    ]
  },
  {
    id: "exo-powershell",
    title: "Exchange Online PowerShell",
    icon: "📧",
    desc: "Install once with: Install-Module ExchangeOnlineManagement. Then connect and run these.",
    items: [
      { cmd: "Connect-ExchangeOnline -UserPrincipalName admin@tenant.onmicrosoft.com", desc: "Sign in to Exchange Online PowerShell." },
      { cmd: "Get-Mailbox -Identity user@domain.com | Format-List", desc: "Show all details of a mailbox." },
      { cmd: "Get-Mailbox user@domain.com | Select DisplayName,PrimarySmtpAddress,ProhibitSendQuota", desc: "Quick check of a mailbox's address and quota." },
      { cmd: "Add-MailboxPermission -Identity shared@domain.com -User bob@domain.com -AccessRights FullAccess", desc: "Grant Full Access to a shared mailbox." },
      { cmd: "Add-RecipientPermission -Identity shared@domain.com -Trustee bob@domain.com -AccessRights SendAs", desc: "Grant Send As on a mailbox." },
      { cmd: "Get-MessageTrace -SenderAddress user@domain.com -StartDate (Get-Date).AddDays(-2) -EndDate (Get-Date)", desc: "Trace recent messages from a sender to see if mail delivered or was blocked." },
      { cmd: "Set-Mailbox user@domain.com -Type Shared", desc: "Convert a leaver's mailbox to a shared mailbox (do this before removing the licence)." },
      { cmd: "Disconnect-ExchangeOnline -Confirm:$false", desc: "Close the session cleanly when done." }
    ]
  },
  {
    id: "graph-entra",
    title: "Microsoft Graph / Entra PowerShell",
    icon: "🔷",
    desc: "Install once with: Install-Module Microsoft.Graph. Modern replacement for the old MSOnline/AzureAD modules.",
    items: [
      { cmd: "Connect-MgGraph -Scopes \"User.ReadWrite.All\",\"Group.ReadWrite.All\"", desc: "Sign in to Graph with the permissions you need." },
      { cmd: "Get-MgUser -UserId user@domain.com", desc: "Look up a user account." },
      { cmd: "Update-MgUser -UserId user@domain.com -AccountEnabled:$false", desc: "Block a user's sign-in (e.g. a leaver)." },
      { cmd: "Get-MgUserMemberOf -UserId user@domain.com", desc: "List every group a user belongs to." },
      { cmd: "Disconnect-MgGraph", desc: "Close the Graph session." }
    ]
  },
  {
    id: "admin-urls",
    title: "Admin portal URLs",
    icon: "🔗",
    desc: "Every console you'll live in. Copy and paste into the browser.",
    items: [
      { cmd: "https://admin.microsoft.com", desc: "Microsoft 365 admin center — users, licences, service health." },
      { cmd: "https://entra.microsoft.com", desc: "Entra admin center — identity, sign-in logs, MFA, Conditional Access." },
      { cmd: "https://admin.exchange.microsoft.com", desc: "Exchange admin center — mailboxes, mail flow, message trace." },
      { cmd: "https://admin.teams.microsoft.com", desc: "Teams admin center — policies, phone, provisioning." },
      { cmd: "https://[tenant]-admin.sharepoint.com", desc: "SharePoint admin center — sites, sharing, storage (replace [tenant])." },
      { cmd: "https://security.microsoft.com", desc: "Defender / Security portal — quarantine, threats, alerts." },
      { cmd: "https://intune.microsoft.com", desc: "Intune admin center — device and app management." },
      { cmd: "https://admin.powerplatform.microsoft.com", desc: "Power Platform admin center — environments, Dataverse, flows." }
    ]
  },
  {
    id: "shortcuts",
    title: "Keyboard shortcuts",
    icon: "⌨️",
    desc: "Speed the L1 basics don't teach you — these make you look fast.",
    items: [
      { cmd: "Win + L", desc: "Lock the screen instantly (always do this when you step away)." },
      { cmd: "Win + Shift + S", desc: "Snip part of the screen — perfect for attaching a screenshot to a ticket." },
      { cmd: "Ctrl + Shift + Esc", desc: "Open Task Manager directly (the slow-computer starting point)." },
      { cmd: "Win + R", desc: "Run box — launch cmd, services.msc, control, etc. fast." },
      { cmd: "Win + E", desc: "Open File Explorer." },
      { cmd: "Win + . (period)", desc: "Emoji/symbol picker." },
      { cmd: "Ctrl + Alt + Del", desc: "Security screen — change password, sign out, Task Manager on a locked/RDP box." },
      { cmd: "F5 in Outlook", desc: "Force a send/receive." }
    ]
  }
];
