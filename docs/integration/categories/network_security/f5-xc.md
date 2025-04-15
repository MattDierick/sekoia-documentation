name: F5 Distributed Cloud
type: intake

## Overview

F5 Distributed Cloud is a cloud-native platform that provides integrated solutions for application delivery, security, and multi-cloud networking. The platform combines capabilities like API security, DDoS protection, bot defense, load balancing, and global traffic management with centralized visibility and control.

- **Vendor**: F5
- **Supported environment**: SaaS
- **Detection based on**: Security Alerts, Telemetry
- **Supported application or feature**: Security, Request, DNS and Audit event logs

## High-Level Architecture Diagram

- **Type of integration**: Outbound (PUSH to Sekoia.io)
- **Schema**

![f5_bigip_architecture](/assets/integration/f5_bigip_architecture.png){: style="max-width:100%"}

## Specification

### Prerequisites

- **Resource**:
    - F5XC Global Log Receiver
- **Permissions**:
    - Administrator to F5XC Console

### Transport Protocol/Method

- **HTTP Receiver**

### Logs details

- **Supported functionalities**: See section [Overview](#overview)
- **Supported type(s) of structure**: JSON, key-value

## Step-by-Step Configuration Procedure

### Instructions on the 3rd Party Solution

To configure F5 Distributed Cloud to send Security, Request, DNS or Audit logs, you need to follow these steps.

#### Configure a Global Log Receiver destination

1. Log in to the F5XC Console
2. Go to `Shared Configuration > Manage > Global Log Receiver`.
3. Create a new Global Log Receiver with the following settings
    1. Log Type: `Security Events`
    2. Log Message Selection: choose the Namespace(s) from where the logs will be sent
    3. Receiver Configuration: HTTP Receiver
        1. HTTP Uri: https://intake.sekoia.io/plain/batch
        2. Authentication: `BASIC`
            1. Username: `None`
            2. Password: YOUR_SEKOIA_KEY


5. Save your Global Log Receiver object.

Please find more information on how to configure remote loging [here](https://docs.cloud.f5.com/docs-v2/multi-cloud-network-connect/how-tos/others/global-log-streaming?searchQuery=global%20log%20receiver).

#### Specifically send only certain types of logs

You can create another Global Log Receiver object for each kind of log (Request, DNS and Audit)

### Instruction on Sekoia

{!_shared_content/integration/intake_configuration.md!}

{!_shared_content/operations_center/integrations/generated/a14b1141-2d61-414b-bf79-da99b487b1af_sample.md!}

{!_shared_content/integration/detection_section.md!}

{!_shared_content/operations_center/detection/generated/suggested_rules_a14b1141-2d61-414b-bf79-da99b487b1af_do_not_edit_manually.md!}

{!_shared_content/operations_center/integrations/generated/a14b1141-2d61-414b-bf79-da99b487b1af.md!}
