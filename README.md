🔧 GearGuard — The Ultimate Maintenance Tracker

GearGuard is a smart maintenance management system designed to help organizations efficiently track assets, manage maintenance requests, and coordinate teams.
It mirrors real-world enterprise tools like the Odoo Maintenance Module, making it ideal for hackathons, ERP projects, and resume-worthy applications.

🚀 Project Overview

GearGuard helps companies:

📦 Track all assets (machines, vehicles, laptops, printers, etc.)

🔧 Manage corrective and preventive maintenance

👨‍🔧 Assign the right maintenance teams and technicians

📊 Monitor status, time, and performance

🎯 Objective

Ensure that every company asset is:

Properly tracked

Maintained on time

Repaired efficiently

🧠 Core Philosophy

GearGuard is built around three core entities:

Entity	Purpose
Equipment	What needs maintenance
Maintenance Team	Who fixes it
Maintenance Request	The work to be done

Everything in the system revolves around connecting these three seamlessly.

🧩 Key Functional Areas
🅰️ Equipment (Asset Management)

A centralized database for all company-owned assets.

📦 Supported Equipment

CNC Machines

Vehicles

Computers

Printers

🔍 Equipment Tracking

Assets can be filtered or searched by:

Department (e.g., CNC Machine → Production)

Employee (e.g., Laptop → Maharshi Mehta)

👨‍🔧 Responsibility

Each equipment:

Is linked to one maintenance team

Can have a default technician

🧾 Key Fields
Field	Description
Equipment Name & Serial Number	Unique identification
Purchase Date	Asset age
Warranty Information	Free repair eligibility
Location	Physical location

📌 Why it matters:
When something breaks, the system already knows who should fix it.

🅱️ Maintenance Team

Defines who performs maintenance work.

👥 Teams

Mechanics

Electricians

IT Support

🧑‍🔧 Team Members

Each team consists of technicians (users)

Only team members can pick up assigned requests

🔄 Workflow Logic

IT Support requests → only IT technicians

Mechanical issues → only mechanics

This prevents incorrect assignments.

🅲 Maintenance Request (Core Workflow)

Represents a maintenance or repair job.

🔁 Request Types
Type	Description
Corrective	Unplanned repair (breakdown)
Preventive	Planned maintenance (routine check)
🔥 Functional Workflows
🔧 Flow 1: Breakdown (Corrective Maintenance)

Scenario: Equipment breaks unexpectedly.

Steps:

Any employee creates a maintenance request

User selects equipment → system auto-fills:

Equipment category

Maintenance team

Request starts in New state

Technician or manager assigns the request

Status changes to In Progress

Technician logs hours spent and marks it Repaired

✅ Job completed and recorded.

🔁 Flow 2: Routine Checkup (Preventive Maintenance)

Scenario: Planned inspection or servicing.

Steps:

Manager creates a request (type: Preventive)

Sets a scheduled date

Request appears in the Calendar View

📅 This helps avoid unexpected breakdowns.

🎨 User Interface & UX Features
🧲 Kanban View (Drag & Drop)

Requests shown as cards

Columns:

New

In Progress

Repaired

Drag & drop to update status

🎯 Visual Indicators
Indicator	Meaning
Technician Avatar	Assigned technician
Red Highlight	Overdue request
📆 Calendar View

Displays all Preventive Maintenance

Click a date to schedule new maintenance

Ideal for planning and workload management

📊 Reports (Optional / Advanced)

Requests per team

Breakdowns per equipment type

Useful for:

Performance tracking

Management decisions

⭐ Smart Features (Odoo-like)
🔘 Smart Button (Equipment Form)

Maintenance button opens all requests related to that equipment

Badge shows number of open requests

Example: Maintenance (3)

🗑 Scrap Logic

When equipment is beyond repair:

Request moved to Scrap

Equipment marked as Not Usable

System logs a note or flag

Prevents:

Future maintenance requests

Incorrect usage of damaged assets

🧠 Final Summary

GearGuard is a complete solution that acts as:

📦 Asset Tracker

🔧 Maintenance Manager

👨‍🔧 Team Coordinator

📊 Performance Analyzer

Perfect for:

Hackathons

ERP systems

College projects

Resume and portfolio showcases

📜 License

This project is open-source and free to use for learning and development purposes.

⭐ Support

If you find this project useful:

⭐ Star the repository

🍴 Fork it

🚀 Build something amazing
