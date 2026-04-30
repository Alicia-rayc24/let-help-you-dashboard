# Project Plan: Daystar Theatre of Arts Group Website App

## 1. Introduction
This document outlines the plan for building a comprehensive group website application for the Daystar Theatre of Arts. The application aims to centralize member information, manage participation, facilitate financial contributions, share media, and streamline administrative tasks.

## 2. Core Features
The application will include the following key features:

### 2.1. User Management & Authentication
*   **Registration/Onboarding:** Initial member data capture.
*   **Login:** Secure login using Admission Number and Password.
*   **Password Management:** Ability for members to change their passwords.
*   **Role-Based Access Control:** Specific administrative privileges for Chairperson, Secretary, and Treasurer.

### 2.2. Member Profiles
*   **Personal Information:** Display of name, contact details, admission number, date of birth, current year, school state (active, inactive, graduate), groups of participation.
*   **Participation Tracking:** System to log and display semester, meeting, and yearly participation records.
*   **Financial Tracking:** Monitoring monthly/semester/yearly contributions, challenge payments, and outstanding dues.
*   **Profile Photo:** Feature to upload and manage profile pictures.

### 2.3. Admin Portal (Chairperson, Secretary, Treasurer only)
*   **Member Management:** Add, remove, and edit member information.
*   **Content Management:** Edit website content, background photos.
*   **Event Management:** Create, schedule, and manage semester calendar events, meeting details, and reminders.
*   **Financial Oversight:** Review contributions, manage payment statuses.
*   **Award Management:** Configure award categories, open/close voting periods, announce winners.
*   **Attendance Management:** Record attendance for meetings and events.

### 2.4. Financial Module
*   **Contribution System:**
    *   Active Members: Kshs 100/month or Kshs 300/semester.
    *   Inactive Members: Kshs 150/semester (with reason), Kshs 250/semester (without reason).
    *   Graduates: Kshs 150/yearly.
*   **Payment Detection:** System to track payments and alert members with dues.
*   **Money Challenge:** Functionality for weekly money challenges.
*   **Payment Method:** Designated phone number for money transfer (+254 715 788764).

### 2.5. Media Gallery
*   **Photo & Video Sharing:** Members and admins can upload and view photos and videos.
*   **Links:** Ability to create and share links to external media content.

### 2.6. Awards & Voting System
*   **Award Categories:**
    *   End of January/May Semester: Most Disciplined, Best Participant, Best Performer.
    *   End of Year/May Semester: Best Actor, Best Director, Leaders, Active Performer, Best Director of the Year.
*   **Voting Mechanism:**
    *   Leaders initiate award voting.
    *   Members vote using their Admission Number (one vote per member per award).
    *   Duration for voting periods.
    *   Winner announcement upon deadline.
*   **Points System:** Members earn points for participation and meeting attendance. Members with dues pay Kshs 200 to be eligible for awards.

### 2.7. Communication & Engagement
*   **Birthday Wishes:** A section for members to send birthday wishes, valid for 28 hours.
*   **Encouragement Messages:** A section for sending encouragement, valid for 1 week.
*   **Reviews:** Post-event reviews for members.

### 2.8. Bible Study Module
*   **Weekly Bible Study:** Schedule and conduct weekly bible studies, led by assigned members.

### 2.9. Group Categories
*   Defined roles/groups: Acting, PR, Writing, Leaders, Bible Study Leader, Director.

### 2.10. Dashboard
*   A central view displaying key information, upcoming events, recent activities, and member stats.

## 3. Technical Considerations
*   **Frontend:** To be developed using a modern JavaScript framework (e.g., React, Vue, Angular). The `frontend_engineer` is responsible for UI/UX design, component implementation, and ensuring responsiveness. **Crucially, the `generate_images_bulk` tool must be executed by the `frontend_engineer` before writing any files.**
*   **Backend & Database:** Supabase will be utilized for its integrated features:
    *   **Database:** For storing all application data (users, profiles, contributions, events, media, awards, etc.).
    *   **Authentication:** Managing user sign-up and login.
    *   **Storage:** For hosting uploaded photos and videos.
    *   **Edge Functions (Potentially):** For complex business logic, such as payment validation, award point calculations, or timed message expirations.
*   **Design:** The application should feature attractive background photos and a visually appealing theme, avoiding plain white or dark backgrounds. This includes designing good background photos not just white nor a dark colour.

## 4. Development Phases & Agent Assignments
1.  **Planning:** (Current Phase) - Architect defines the high-level plan.
2.  **Frontend Development:** `frontend_engineer` will be tasked with creating the UI/UX based on this plan. This includes generating necessary images and implementing components. **Ensure `generate_images_bulk` is run first.**
3.  **Backend Development:** `supabase_engineer` will be responsible for setting up the Supabase project, designing the database schema, implementing authentication, and developing any necessary edge functions.
4.  **Integration & Testing:** Frontend and backend components will be integrated and tested.
5.  **Validation:** The `validate_build` tool will be used to verify the complete implementation.

This plan provides a foundational structure. Detailed task breakdowns and specific implementation strategies will be determined by the assigned agents during their respective phases.
