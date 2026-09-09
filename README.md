# Laika Club - Operator Module

## Overview
This repository contains the official Operator module for the Laika Club ecosystem. It provides the essential tools required by field staff and operational teams during the execution of events.

## Features
* Real-time ticket validation and entry control systems.
* Incident reporting and resolution tracking.
* Operational dashboards for staff coordination.
* Secure and rapid access to attendee verification data.

## Architecture
This frontend application is completely decoupled from the legacy Laika Club monolith. All data transactions and operational commands are routed securely through the central Pilgrim API Gateway to the backend microservices.

## Usage
This module is strictly for use by authorized event staff and operators. Authentication is mandatory, and access control is enforced at the Gateway level to ensure operational security during live events.
