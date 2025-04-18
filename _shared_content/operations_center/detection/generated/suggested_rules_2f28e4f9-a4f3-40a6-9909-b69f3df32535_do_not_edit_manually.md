### Related Built-in Rules

The following Sekoia.io built-in rules match the intake **Gatewatcher AionIQ V103**. This documentation is updated automatically and is based solely on the fields used by the intake which are checked against our rules. This means that some rules will be listed but might not be relevant with the intake.

[SEKOIA.IO x Gatewatcher AionIQ V103 on ATT&CK Navigator](https://mitre-attack.github.io/attack-navigator/#layerURL=https%3A%2F%2Fraw.githubusercontent.com%2FSEKOIA-IO%2Fdocumentation%2Fmain%2F_shared_content%2Foperations_center%2Fdetection%2Fgenerated%2Fattack_2f28e4f9-a4f3-40a6-9909-b69f3df32535_do_not_edit_manually.json){ .md-button }
??? abstract "Advanced IP Scanner"
    
    Detects the use of Advanced IP Scanner. Seems to be a popular tool for ransomware groups.
    
    - **Effort:** master

??? abstract "Bazar Loader DGA (Domain Generation Algorithm)"
    
    Detects Bazar Loader domains based on the Bazar Loader DGA
    
    - **Effort:** elementary

??? abstract "Certify Or Certipy"
    
    Detects the use of certify and certipy which are two different tools used to enumerate and abuse Active Directory Certificate Services.
    
    - **Effort:** advanced

??? abstract "Cobalt Strike Default Beacons Names"
    
    Detects the default names of Cobalt Strike beacons / payloads.
    
    - **Effort:** intermediate

??? abstract "Covenant Default HTTP Beaconing"
    
    Detects potential Covenant communications through the user-agent and specific urls
    
    - **Effort:** intermediate

??? abstract "Credential Dump Tools Related Files"
    
    Detects processes or file names related to credential dumping tools and the dropped files they generate by default.
    
    - **Effort:** advanced

??? abstract "Cryptomining"
    
    Detection of domain names potentially related to cryptomining activities.
    
    - **Effort:** master

??? abstract "Discord Suspicious Download"
    
    Discord is a messaging application. It allows users to create their own communities to share messages and attachments. Those attachments have little to no overview and can be downloaded by almost anyone, which has been abused by attackers to host malicious payloads.
    
    - **Effort:** advanced

??? abstract "Download Files From Non-Legitimate TLDs"
    
    Detects file downloads from non-legitimate TLDs. Additional legitimates TLDs should be filtered according to the business habits.
    
    - **Effort:** master

??? abstract "Dynamic DNS Contacted"
    
    Detect communication with dynamic dns domain. This kind of domain is often used by attackers. This rule can trigger false positive in non-controlled environment because dynamic dns is not always malicious.
    
    - **Effort:** master

??? abstract "EvilProxy Phishing Domain"
    
    Detects subdomains potentially generated by the EvilProxy adversary-in-the-middle phishing platform. Inspect the other subdomains of the domain to identify the landing page, and determine if the user submitted credentials. This rule has a small percentage of false positives on legitimate domains.
    
    - **Effort:** intermediate

??? abstract "Exfiltration Domain"
    
    Detects traffic toward a domain flagged as a possible exfiltration vector.
    
    - **Effort:** master

??? abstract "Gatewatcher AionIQ V103 Active CTI"
    
    Detects whan an event related to CTI is raised by Gatewatcher V103. An attacker may be gathering information with this event.
    
    - **Effort:** master

??? abstract "Gatewatcher AionIQ V103 Beacon Detect"
    
    Detects a suspicious beacon.
    
    - **Effort:** master

??? abstract "Gatewatcher AionIQ V103 Dga Detect"
    
    Detects when an event related to dga is raised by gatewatcher. An attacker can use this to generate a new domain for C2.
    
    - **Effort:** master

??? abstract "Gatewatcher AionIQ V103 Malcore"
    
    Detects a malcore alert by Gatewatcher AionIQ V103 related to documents with passwords.
    
    - **Effort:** master

??? abstract "Gatewatcher AionIQ V103 Malicious Powershell Detect"
    
    Detects malicious powershell by Gatewatcher V103.
    
    - **Effort:** master

??? abstract "Gatewatcher AionIQ V103 Network Behavior Analytics"
    
    Detects when network behavior analytics were requested.
    
    - **Effort:** master

??? abstract "Gatewatcher AionIQ V103 Ransomware Detect"
    
    Detects when a ransomware is detected by gatewatcherV103.
    
    - **Effort:** master

??? abstract "Gatewatcher AionIQ V103 Retrohunt"
    
    Detects when a retrohunt event is raised by GatewatcherV103.
    
    - **Effort:** master

??? abstract "Gatewatcher AionIQ V103 Shellcode Detect"
    
    Detects when a suspicious shellcode is used.
    
    - **Effort:** master

??? abstract "Gatewatcher AionIQ V103 Sigflow Alert"
    
    Detects a sigflow alert by Gatewatcher AionIQ V103.
    
    - **Effort:** master

??? abstract "HackTools Suspicious Names"
    
    Quick-win rule to detect the default process names or file names of several HackTools.
    
    - **Effort:** advanced

??? abstract "Koadic MSHTML Command"
    
    Detects Koadic payload using MSHTML module
    
    - **Effort:** intermediate

??? abstract "Nimbo-C2 User Agent"
    
    Nimbo-C2 Uses an unusual User-Agent format in its implants.
    
    - **Effort:** intermediate

??? abstract "PasswordDump SecurityXploded Tool"
    
    Detects the execution of the PasswordDump SecurityXploded Tool
    
    - **Effort:** elementary

??? abstract "Potential Azure AD Phishing Page (Adversary-in-the-Middle)"
    
    Detects an HTTP request to an URL typical of the Azure AD authentication flow, but towards a domain that is not one the legitimate Microsoft domains used for Azure AD authentication.
    
    - **Effort:** intermediate

??? abstract "Potential Bazar Loader User-Agents"
    
    Detects potential Bazar loader communications through the user-agent
    
    - **Effort:** elementary

??? abstract "Potential Lemon Duck User-Agent"
    
    Detects LemonDuck user agent. The format used two sets of alphabetical characters separated by dashes, for example "User-Agent: Lemon-Duck-[A-Z]-[A-Z]".
    
    - **Effort:** elementary

??? abstract "Potential LokiBot User-Agent"
    
    Detects potential LokiBot communications through the user-agent
    
    - **Effort:** intermediate

??? abstract "RTLO Character"
    
    Detects RTLO (Right-To-Left character) in file and process names.
    
    - **Effort:** elementary

??? abstract "Remote Access Tool Domain"
    
    Detects traffic toward a domain flagged as a Remote Administration Tool (RAT).
    
    - **Effort:** master

??? abstract "Remote Monitoring and Management Software - AnyDesk"
    
    Detect artifacts related to the installation or execution of the Remote Monitoring and Management tool AnyDesk.
    
    - **Effort:** master

??? abstract "SEKOIA.IO Intelligence Feed"
    
    Detect threats based on indicators of compromise (IOCs) collected by SEKOIA's Threat and Detection Research team.
    
    - **Effort:** elementary

??? abstract "Sekoia.io EICAR Detection"
    
    Detects observables in Sekoia.io CTI tagged as EICAR, which are fake samples meant to test detection.
    
    - **Effort:** master

??? abstract "Suspicious Email Attachment Received"
    
    Detects email containing a suspicious file as an attachment, based on its extension.
    
    - **Effort:** advanced

??? abstract "Suspicious File Name"
    
    Detects suspicious file name possibly linked to malicious tool.
    
    - **Effort:** advanced

??? abstract "Suspicious PROCEXP152.sys File Created In Tmp"
    
    Detects the creation of the PROCEXP152.sys file in the application-data local temporary folder. This driver is used by Sysinternals Process Explorer but also by KDU (https://github.com/hfiref0x/KDU) or Ghost-In-The-Logs (https://github.com/bats3c/Ghost-In-The-Logs), which uses KDU. Note - Clever attackers may easily bypass this detection by just renaming the driver filename. Therefore just Medium-level and don't rely on it.
    
    - **Effort:** advanced

??? abstract "TOR Usage"
    
    Detects TOR usage, based on the IP address and the destination port (filtered on NTP). TOR is short for The Onion Router, and it gets its name from how it works. TOR intercepts the network traffic from one or more apps on user’s computer, usually the user web browser, and shuffles it through a number of randomly-chosen computers before passing it on to its destination. This disguises user location, and makes it harder for servers to pick him/her out on repeat visits, or to tie together separate visits to different sites, this making tracking and surveillance more difficult. Before a network packet starts its journey, user’s computer chooses a random list of relays and repeatedly encrypts the data in multiple layers, like an onion. Each relay knows only enough to strip off the outermost layer of encryption, before passing what’s left on to the next relay in the list.
    
    - **Effort:** master

??? abstract "TOR Usage Generic Rule"
    
    Detects TOR usage globally, whether the IP is a destination or source. TOR is short for The Onion Router, and it gets its name from how it works. TOR intercepts the network traffic from one or more apps on user’s computer, usually the user web browser, and shuffles it through a number of randomly-chosen computers before passing it on to its destination. This disguises user location, and makes it harder for servers to pick him/her out on repeat visits, or to tie together separate visits to different sites, this making tracking and surveillance more difficult. Before a network packet starts its journey, user’s computer chooses a random list of relays and repeatedly encrypts the data in multiple layers, like an onion. Each relay knows only enough to strip off the outermost layer of encryption, before passing what’s left on to the next relay in the list.
    
    - **Effort:** master

??? abstract "TrevorC2 HTTP Communication"
    
    Detects TrevorC2 HTTP communication based on the HTTP request URI and the user-agent. 
    
    - **Effort:** elementary

??? abstract "WCE wceaux.dll Creation"
    
    Detects wceaux.dll creation while Windows Credentials Editor (WCE) is executed.
    
    - **Effort:** intermediate
