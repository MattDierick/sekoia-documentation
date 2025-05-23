uuid: d719e8b5-85a1-4dad-bf71-46155af56570
name: WatchGuard Firebox
type: intake

## Overview

WatchGuard Firebox is a serie of high-performance firewalls to protect computer networks.
Sending WatchGuard Firebox logs to Sekoia.io enables the discovering of potential network security threats. Spotted threats are contextualized by means of  Sekoia.io's Cyber Threat Intelligence (CTI).


- **Vendor** :WatchGuard
- **Supported environment**: On prem
- **Version compatibility**: 12.4.1
- **Detection based on**: Telemetry
- **Supported application or feature**: Network device logs, Network intrusion detection system


## Configure

### Prerequisites

An internal log concentrator (Rsyslog) is required to collect and forward events to Sekoia.io.

### Enable Syslog forwarding

Log on your Firebox appliance and follow [this guide](https://www.watchguard.com/help/docs/help-center/en-US/Content/Integration-Guides/General/ubuntu_rsyslog.html) to enable syslog forwarding.

!!! warning
	Make sure that you didn't check the "time stamp" box in your Syslog Server configuration.

Configure the event forwarding to use the IBM LEEF format (for more information, please read the [associated documentation](http://www.watchguard.com/help/docs/fireware/12/en-us/Content/en-US/logging/send_logs_to_syslog_c.html)).

## Create the intake

Go to the [intake page](https://app.sekoia.io/operations/intakes) and create a new intake from the format WatchGuard Firebox.

## Forward logs to Sekoia.io

Please consult the [Rsyslog Transport](/integration/ingestion_methods/syslog/overview.md) documentation or [Syslog Forwarding](/integration/ingestion_methods/syslog/sekoiaio_forwarder.md) documentation to forward these logs to Sekoia.io.


{!_shared_content/operations_center/integrations/generated/d719e8b5-85a1-4dad-bf71-46155af56570_sample.md!}


{!_shared_content/integration/detection_section.md!}

{!_shared_content/operations_center/detection/generated/suggested_rules_d719e8b5-85a1-4dad-bf71-46155af56570_do_not_edit_manually.md!}
{!_shared_content/operations_center/integrations/generated/d719e8b5-85a1-4dad-bf71-46155af56570.md!}

## Further Readings
- [Watchguard Firebox Rsyslog Integration Overview](https://www.watchguard.com/help/docs/help-center/en-US/Content/Integration-Guides/General/ubuntu_rsyslog.html)
