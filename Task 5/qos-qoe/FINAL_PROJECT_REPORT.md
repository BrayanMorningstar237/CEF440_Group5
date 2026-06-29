# UNIVERSITY OF BUEA

# FACULTY OF ENGINEERING AND TECHNOLOGY

# DEPARTMENT OF COMPUTER ENGINEERING

## DESIGN AND IMPLEMENTATION OF A MOBILE APP FOR COLLECTION OF USER EXPERIENCE DATA FROM MOBILE NETWORK SUBSCRIBERS

**Course:** CEF440 - Internet and Mobile Programming  
**Option:** Software Engineering  
**Project Type:** Mobile Application Development  
**Project Repository:** https://github.com/BrayanMorningstar237/CEF440_Group5  

**Group Members**

| Name | Matricule |
|---|---|
| Mugha Brayan Aya-ah Ndefru | FE23A097 |
| Ako McPeace Njoh | FE23A009 |
| Eyong Akago Anelka Nelvine | FE23A056 |
| Ngolien Lucy Ethel Libog | FE22A261 |

**Academic Year:** 2025/2026

---

## Certification of Originality

We the undersigned hereby certify that this report entitled "Design and Implementation of a Mobile App for Collection of User Experience Data from Mobile Network Subscribers" has been carried out by the members of Group 5 in the Department of Computer Engineering, Faculty of Engineering and Technology, University of Buea.

This work is authentic and represents the result of our analysis, design, implementation, testing, and documentation efforts.

Date: ______________________

Student Representative: ______________________

Supervisor: ______________________

Head of Department: ______________________

---

## Acknowledgement

We acknowledge the Department of Computer Engineering, Faculty of Engineering and Technology, University of Buea, for providing the academic environment and course structure that made this project possible. We also acknowledge our course instructor and supervisors for their guidance throughout the requirements gathering, system design, implementation, and review phases.

We are grateful to the mobile network subscribers who participated in the requirements gathering exercise. Their responses helped us understand practical network experience problems such as slow internet speed, unstable connectivity, weak signal strength, user privacy concerns, battery sensitivity, and willingness to provide feedback.

Finally, we acknowledge the contribution of every group member in research, data collection, analysis, frontend development, backend development, database design, testing, and report preparation.

---

## Abstract

Mobile network subscribers in Cameroon and other developing regions frequently experience poor or inconsistent network performance, including slow data speeds, high latency, unstable connectivity, and intermittent service availability. Traditional Quality of Service monitoring methods used by network operators often focus on technical network-side indicators and do not sufficiently capture the real experience of subscribers. This creates a gap between what network systems report and what users actually experience when browsing, streaming, communicating, or using mobile applications.

This project presents the design and implementation of a mobile application for collecting Quality of Experience data from mobile network subscribers. The application combines subjective user feedback with objective Quality of Service measurements. The system allows a subscriber to register, log in, collect network samples, rate the experience, store records locally, and upload them to a backend server. The mobile client was implemented using React Native with Expo, while the backend was implemented using Node.js, Express, MongoDB, and Mongoose. The application collects metrics such as network type, connectivity state, IP address, latency, jitter, packet loss, upload speed, download speed, location, timestamp, and user feedback. It also supports local SQLite storage, background collection with user consent, bilingual English/French interface labels, admin dashboards, location-based heatmap visualization, and filtered measurement retrieval.

The project followed a structured development process beginning with requirement gathering through questionnaires, followed by requirement analysis, system modelling, UI design, database design, implementation, and maintenance planning. The resulting solution demonstrates how mobile devices can act as distributed measurement agents for collecting real network experience data. The system contributes to network performance evaluation by linking measured technical metrics with user perception, thereby supporting better decision-making by network operators, researchers, and regulators.

**Keywords:** Quality of Experience, Quality of Service, mobile application, React Native, Expo, MongoDB, SQLite, network monitoring, latency, packet loss, subscriber feedback.

---

## Table of Contents

1. Chapter One: General Introduction  
2. Chapter Two: Literature Review and Mobile App Development Process  
3. Chapter Three: Requirements Gathering, Analysis, and System Design  
4. Chapter Four: Implementation and Results  
5. Chapter Five: Maintenance, Conclusion, and Further Work  
6. References  
7. Appendices  

---

## List of Tables

| Table | Title |
|---|---|
| Table 1 | Group members |
| Table 2 | Functional requirements |
| Table 3 | Non-functional requirements |
| Table 4 | Requirement prioritization |
| Table 5 | Main database entities |
| Table 6 | Main API endpoints |
| Table 7 | Tools and technologies used |
| Table 8 | Maintenance plan |

---

## List of Figures

| Figure | Title |
|---|---|
| Figure 1 | Requirements gathering workflow |
| Figure 2 | Mobile operating system distribution |
| Figure 3 | Dual-SIM usage distribution |
| Figure 4 | Common network issues reported |
| Figure 5 | Preferred feedback frequency |
| Figure 6 | Preferred feedback method |
| Figure 7 | Privacy concern distribution |
| Figure 8 | Battery and data usage sensitivity |
| Figure 9 | System context diagram |
| Figure 10 | Data flow diagram |
| Figure 11 | Use case diagram |
| Figure 12 | Sequence diagram for measurement upload |
| Figure 13 | Class diagram |
| Figure 14 | Deployment diagram |
| Figure 15 | Entity relationship diagram |
| Figure 16 | Login and registration screen |
| Figure 17 | Subscriber collection screen |
| Figure 18 | Subscriber heatmap screen |
| Figure 19 | Subscriber records screen |
| Figure 20 | Settings and consent screen |
| Figure 21 | Admin dashboard screen |
| Figure 22 | Admin heatmap screen |

---

## List of Abbreviations

| Abbreviation | Meaning |
|---|---|
| API | Application Programming Interface |
| DBMS | Database Management System |
| DFD | Data Flow Diagram |
| ERD | Entity Relationship Diagram |
| GPS | Global Positioning System |
| HTTP | Hypertext Transfer Protocol |
| HTTPS | Hypertext Transfer Protocol Secure |
| ISP | Internet Service Provider |
| JWT | JSON Web Token |
| QoE | Quality of Experience |
| QoS | Quality of Service |
| REST | Representational State Transfer |
| SRS | Software Requirements Specification |
| UI | User Interface |

---

# CHAPTER ONE: GENERAL INTRODUCTION

## 1.1 Background and Context of the Study

Mobile networks have become an essential part of modern communication, education, business, entertainment, and public service delivery. In Cameroon, mobile internet access is one of the main ways through which people connect to online services. Users depend on mobile networks for messaging, online learning, banking, social media, video streaming, and work-related communication.

However, mobile subscribers frequently experience inconsistent service quality. Common problems include slow browsing speed, unstable connectivity, weak signal strength, high latency, packet loss, and temporary service interruptions. These issues are especially visible in developing regions where network infrastructure, coverage density, device diversity, and environmental conditions vary widely across urban, semi-urban, and rural areas.

Network operators usually monitor Quality of Service through infrastructure-side measurements such as traffic volume, cell utilization, signal coverage, and service availability. While these indicators are important, they do not always represent the user's real experience. A network may appear operational from the operator's perspective while users still experience poor video streaming, delayed web responses, failed uploads, or unstable application performance.

Quality of Experience focuses on the user's perceived satisfaction with a service. It considers both technical performance and human perception. For example, latency and packet loss are QoS metrics, while a user's rating of browsing speed or streaming quality is a QoE metric. Combining both forms of data gives a more complete understanding of network performance.

This project therefore focuses on designing and implementing a mobile application that collects user experience data from mobile network subscribers. The application acts as a measurement and feedback tool. It records objective network metrics from the device and allows users to submit simple ratings about their experience.

## 1.2 Problem Statement

Mobile network subscribers in Cameroon often experience poor or inconsistent network performance, but network operators and researchers do not always have enough real user-level data to understand where, when, and how these problems occur. Existing monitoring methods are often operator-centered and may not collect direct feedback from subscribers.

The absence of an accessible mobile tool for collecting both technical network metrics and subjective user feedback makes it difficult to evaluate subscriber experience accurately. Without this data, operators may struggle to identify areas of poor quality, users may continue to experience unresolved problems, and researchers may lack practical datasets for network performance analysis.

The problem addressed by this project is therefore the lack of a mobile-based system that can collect, store, and transmit QoS and QoE data from subscribers in a user-friendly, privacy-aware, and scalable manner.

## 1.3 Objectives of the Study

### 1.3.1 General Objective

The general objective of this project is to design and implement a mobile application for collecting Quality of Experience data from mobile network subscribers by combining user feedback with automatically collected network performance metrics.

### 1.3.2 Specific Objectives

The specific objectives are:

1. To gather and analyze requirements from mobile network subscribers.
2. To identify the key QoS and QoE metrics needed for network experience evaluation.
3. To design a mobile application architecture that supports local storage, data collection, background sampling, and backend synchronization.
4. To implement a mobile frontend for subscribers and administrators.
5. To implement a backend API for authentication, data upload, data storage, and admin retrieval.
6. To design and implement a database structure for users, measurements, and network cell/location information.
7. To evaluate the implemented system against the project requirements.
8. To propose maintenance and future improvement strategies.

## 1.4 Proposed Methodology

The project followed a practical software engineering methodology with the following phases:

1. Requirement gathering through questionnaires, brainstorming, and review of similar network monitoring systems.
2. Requirement analysis to classify functional and non-functional requirements.
3. System modelling using context diagrams, data flow diagrams, use cases, sequence diagrams, class diagrams, deployment diagrams, and entity relationship diagrams.
4. UI design for subscriber and administrator workflows.
5. Mobile implementation using React Native and Expo.
6. Backend implementation using Node.js, Express, JWT authentication, MongoDB, and Mongoose.
7. Local storage implementation using Expo SQLite and AsyncStorage.
8. Testing and evaluation of registration, login, measurement collection, local storage, upload, heatmap, and admin filtering.
9. Maintenance planning for bug fixes, schema migration, performance improvements, and future analytics.

## 1.5 Research Questions

The project was guided by the following questions:

1. What network experience problems are commonly faced by mobile subscribers?
2. What technical and subjective data should be collected to represent QoS and QoE?
3. How can a mobile application collect network metrics while minimizing user disruption?
4. How can the system store data locally and upload it when network conditions allow?
5. How can administrators analyze collected subscriber measurements?
6. What privacy and trust issues must be considered when collecting background network data?

## 1.6 Significance of the Study

The project is significant because it provides a practical method for collecting real user network experience data. The system can support:

1. Network operators in identifying poor service areas.
2. Researchers in studying the relationship between QoS metrics and QoE ratings.
3. Regulators in understanding subscriber-level service quality.
4. Users in viewing their own network experience records.
5. Developers in learning how mobile applications can collect, store, and upload telemetry data.

## 1.7 Scope of the Study

The scope of this project includes:

1. A mobile client for user registration, login, measurement collection, feedback rating, local storage, upload, records viewing, heatmap display, and settings.
2. An admin interface for viewing measurements, filtering data, and visualizing user data on a heatmap.
3. A backend REST API for authentication, measurement upload, and data retrieval.
4. A MongoDB database for storing users, measurements, and network cell/location records.
5. A local SQLite database for offline-first storage on the mobile device.

The project does not include direct integration with mobile network operator infrastructure. Some advanced mobile network details, such as real cell tower identifiers and exact radio signal strength, may require deeper native Android/iOS modules or telecom permissions that are beyond the current Expo implementation.

## 1.8 Delimitation of the Study

The application focuses on collecting subscriber-side data. It does not replace professional telecom drive-test systems or operator-grade radio planning tools. It is designed as a user-facing and research-oriented tool for collecting real experience data.

The implemented version uses Expo APIs and web-based test endpoints to estimate metrics such as latency, jitter, packet loss, upload speed, and download speed. More precise low-level radio metrics can be added in future versions using native modules.

## 1.9 Definition of Keywords and Terms

**Quality of Service:** Technical performance of a network, measured using indicators such as latency, jitter, packet loss, throughput, and availability.

**Quality of Experience:** The user's perceived satisfaction when using a service.

**Latency:** The time taken for a request to travel from the device to a server and receive a response.

**Jitter:** Variation in latency between successive network samples.

**Packet Loss:** Percentage of requests or packets that fail during transmission.

**Throughput:** The amount of data transferred per unit time, usually measured in Mbps.

**Heatmap:** A visual representation of data intensity or quality over geographical locations.

## 1.10 Organization of the Report

Chapter One introduces the project background, problem, objectives, methodology, scope, and significance. Chapter Two reviews mobile application development concepts, technologies, architectures, requirement engineering, and cost estimation. Chapter Three presents requirements gathering, analysis, system design, and modelling. Chapter Four describes implementation details and results. Chapter Five presents maintenance, conclusion, recommendations, challenges, and future work.

---

# CHAPTER TWO: LITERATURE REVIEW AND MOBILE APP DEVELOPMENT PROCESS

## 2.1 Introduction

This chapter discusses the concepts and technologies related to the project. It covers mobile application types, programming languages, frameworks, architectures, design patterns, requirement engineering, cost estimation, and related systems for QoS/QoE monitoring.

## 2.2 Types of Mobile Applications

Mobile applications can be classified into native applications, web applications, hybrid applications, and cross-platform applications.

Native applications are built specifically for a platform such as Android or iOS. Android native apps are commonly built with Kotlin or Java, while iOS native apps are built with Swift or Objective-C. Native applications provide strong access to device APIs but require separate codebases.

Web applications run in a mobile browser and are built with web technologies such as HTML, CSS, and JavaScript. They are easy to distribute but have limited access to device capabilities compared to native apps.

Hybrid applications use web technologies inside a native container. They allow reuse of web code but may suffer from performance or integration limitations.

Cross-platform applications use frameworks that allow one codebase to run on multiple platforms. React Native, Flutter, Ionic, and Xamarin are examples. This project uses React Native with Expo because it supports Android and iOS development, provides access to useful device APIs, and reduces development time for a student project.

## 2.3 Mobile App Programming Languages

Common mobile programming languages include:

1. Kotlin and Java for Android development.
2. Swift and Objective-C for iOS development.
3. JavaScript and TypeScript for React Native and hybrid frameworks.
4. Dart for Flutter.
5. C++ and Rust for performance-critical native modules.

JavaScript was selected for this project because both the frontend and backend could be developed using the same language ecosystem. The mobile application uses React Native and Expo, while the backend uses Node.js and Express.

## 2.4 Mobile App Development Frameworks

Several frameworks were considered:

1. **Native Android:** Provides strong access to Android APIs but does not directly support iOS.
2. **Flutter:** Provides high-performance cross-platform development using Dart.
3. **React Native:** Allows cross-platform mobile development using JavaScript and native components.
4. **Expo:** Provides tooling and APIs on top of React Native, including location, network, background tasks, SQLite, status bar handling, and development server support.

React Native with Expo was selected because it supports rapid development, cross-platform deployment, and easy integration with device APIs required for this project.

## 2.5 Mobile App Architectures and Design Patterns

The system uses a client-server architecture. The mobile client collects and stores measurements locally, then uploads them to the backend API. The backend validates, authenticates, processes, and stores the data in MongoDB.

The mobile client follows a component-based architecture. Screens such as `AuthScreen`, `UserApp`, and `AdminApp` manage major workflows. Reusable UI components such as `MetricCard`, `RatingRow`, `RecordCard`, `Heatmap`, `SettingToggle`, and `Speedometer` provide consistent presentation.

The backend follows a REST API architecture. Express routes expose endpoints for authentication, user profile retrieval, measurement upload, personal measurement retrieval, and admin measurement filtering.

The database follows a normalized model with three main collections: User, Measurement, and NetworkCell. This reduces duplication and supports better querying.

## 2.6 Requirement Engineering Process

Requirement engineering is the process of discovering, analyzing, documenting, validating, and managing system requirements. In this project, the process involved:

1. Identifying stakeholders.
2. Gathering data using questionnaires.
3. Cleaning and interpreting responses.
4. Identifying user needs and technical constraints.
5. Classifying requirements into functional and non-functional groups.
6. Prioritizing requirements.
7. Validating requirements against project objectives and stakeholder expectations.

## 2.7 Mobile App Development Cost Estimation

Cost estimation considers time, complexity, tools, human resources, deployment, testing, and maintenance. For this academic project, financial cost was reduced by using open-source tools and free development frameworks.

Major cost factors include:

1. Development time for frontend screens.
2. Backend API and database setup.
3. Requirements gathering and analysis.
4. UI/UX design.
5. Testing on mobile devices.
6. Server hosting and database hosting for production.
7. Maintenance and future updates.

Since the system uses open-source tools such as React Native, Expo, Node.js, Express, and MongoDB, the main project cost is developer effort rather than software licensing.

## 2.8 Related Works

Existing network monitoring systems include operator-side performance monitoring, speed test applications, and customer complaint systems. Speed test applications collect objective metrics such as latency, download speed, and upload speed, but they may not collect detailed subjective user feedback. Complaint systems collect user frustration but may not include accurate technical measurements at the time of the problem.

The proposed system combines both approaches by collecting device-side network metrics and user ratings together with timestamp and location. This makes the collected data more useful for QoE analysis.

## 2.9 Partial Conclusion

The literature and technology review show that mobile QoE collection requires a cross-platform, device-aware, privacy-sensitive, and offline-capable system. React Native with Expo, Node.js, Express, SQLite, and MongoDB provide a practical technology stack for implementing such a solution.

---

# CHAPTER THREE: REQUIREMENTS GATHERING, ANALYSIS, AND SYSTEM DESIGN

## 3.1 Introduction

This chapter presents the requirements gathering process, stakeholder analysis, requirement classification, software requirement specification, and system modelling. It covers the movement from user research to system design.

## 3.2 Stakeholder Identification

The main stakeholders are:

1. **Mobile subscribers:** They use the application to submit feedback and collect network samples.
2. **System administrators:** They view submitted records, filter data, and analyze heatmaps.
3. **Network operators:** They can use the collected data to understand service quality problems.
4. **Researchers and students:** They can use the data for QoS/QoE analysis.
5. **Developers and maintainers:** They improve the application, backend, and database.
6. **Regulators:** They may use aggregated insights to understand service quality trends.

## 3.3 Requirement Gathering Techniques

The project used the following techniques:

1. **Questionnaires:** Used to gather information from mobile subscribers about devices, network problems, feedback preferences, privacy concerns, and adoption motivation.
2. **Brainstorming:** Used by the development team to define possible features and technical implementation strategies.
3. **Reverse engineering:** Existing speed test and network monitoring applications were reviewed conceptually to identify common features.
4. **Document review:** The project brief and course task requirements were analyzed.
5. **Prototype review:** Early implementation decisions were refined as the team built and tested the application.

## 3.4 Data Gathering

The questionnaire collected information about:

1. Mobile operating system used by respondents.
2. Android/iOS version distribution.
3. Dual-SIM usage.
4. Common network issues.
5. Willingness to provide feedback.
6. Preferred feedback method.
7. Privacy concerns.
8. Battery and data usage sensitivity.
9. Language preference.
10. Motivation for keeping the app installed.

**Figure 1: Requirements gathering workflow**  
[Insert screenshot/diagram here showing the flow: questionnaire design -> distribution -> responses -> cleaning -> analysis -> requirements.]

## 3.5 Data Cleaning

Data cleaning involved checking responses for completeness, removing irrelevant or duplicate responses where necessary, grouping similar answers, and converting survey responses into meaningful categories. For example, network problems such as "slow browsing", "slow internet", and "poor speed" were grouped under slow data speed. Privacy concerns were grouped under location tracking, background activity, and personal data access.

## 3.6 User Reluctance Assessment

The survey showed that user reluctance is mainly caused by:

1. Fear of location tracking.
2. Concern about background data collection.
3. Concern about battery drain.
4. Concern about mobile data usage.
5. Lack of trust in how collected data will be used.

These concerns influenced the system design. The application includes explicit background collection consent, settings for automatic upload, local storage, and a simple explanation of collection behavior through UI settings.

## 3.7 Analysis of User Technical Environment

Survey results indicated that most respondents use Android-based smartphones. About 75.9% of respondents reported Android usage, and a significant portion of Android users were on Android 13 or higher. However, a meaningful minority use iOS, which supports the decision to use a cross-platform framework.

**Figure 2: Mobile operating system distribution**  
[Insert screenshot/chart here showing Android, iOS, and other operating system distribution.]

Many respondents also use dual-SIM devices. This matters because users may switch between providers depending on network quality, cost, and location.

**Figure 3: Dual-SIM usage distribution**  
[Insert screenshot/chart here showing dual-SIM and single-SIM usage.]

The system should therefore support provider identification and should later be improved to detect active SIM and cellular network identity more precisely where platform permissions allow.

## 3.8 Analysis of Network Experience

Respondents reported common problems including slow internet speed, weak signal strength, unstable connectivity, intermittent disconnection, and poor streaming performance.

**Figure 4: Common network issues reported**  
[Insert screenshot/chart here showing most common network problems.]

These findings justify the need to collect metrics such as latency, jitter, packet loss, download speed, upload speed, network type, and location.

## 3.9 User Interaction and Feedback Preferences

Most users preferred quick and non-intrusive feedback methods. They were more willing to provide feedback occasionally than frequently. Rating scales and simple feedback forms were preferred because they require little time.

**Figure 5: Preferred feedback frequency**  
[Insert screenshot/chart here showing preferred feedback frequency.]

**Figure 6: Preferred feedback method**  
[Insert screenshot/chart here showing rating scale, emoji feedback, text feedback, and other options.]

The implemented application uses rating rows and an optional comment box to reduce user effort.

## 3.10 Privacy and Trust Analysis

Privacy was a major concern. Users were particularly concerned about location tracking and background data collection. The application therefore requires location permission and explicit user opt-in before background collection is enabled.

**Figure 7: Privacy concern distribution**  
[Insert screenshot/chart here showing privacy concerns.]

The system should collect only necessary data, avoid personal message or call access, protect uploads with authentication, and anonymize or aggregate data for reporting where possible.

## 3.11 Battery and Data Usage Sensitivity

Users are sensitive to battery and data consumption. The system addresses this by making automatic collection optional, storing data locally, and allowing upload only when appropriate.

**Figure 8: Battery and data usage sensitivity**  
[Insert screenshot/chart here showing user sensitivity to battery and data usage.]

## 3.12 Language and Localization

Survey results showed that 49.1% of respondents preferred English, while 43.4% preferred bilingual English/French support. Because Cameroon is bilingual, the application includes English and French labels through a language toggle.

## 3.13 Requirement Analysis

The gathered requirements were reviewed based on completeness, clarity, technical feasibility, dependency relationships, inconsistencies, ambiguities, and missing information.

Completeness was improved by ensuring that requirements covered collection, storage, upload, feedback, admin viewing, security, and privacy. Clarity was improved by converting broad needs such as "network is slow" into measurable requirements such as latency, jitter, packet loss, upload speed, and download speed. Technical feasibility was assessed based on Expo APIs, backend support, and database design.

Some requirements, such as exact signal strength and active SIM detection, were identified as partially feasible in Expo and better suited for future native module integration.

## 3.14 Functional Requirements

**Table 2: Functional requirements**

| ID | Requirement |
|---|---|
| FR1 | The system shall allow users to register and log in. |
| FR2 | The system shall store authenticated sessions locally. |
| FR3 | The system shall collect network metrics from the mobile device. |
| FR4 | The system shall collect user feedback ratings. |
| FR5 | The system shall store measurements locally using SQLite. |
| FR6 | The system shall upload pending measurements to the backend. |
| FR7 | The system shall allow users to view their collected records. |
| FR8 | The system shall display user measurements on a heatmap. |
| FR9 | The system shall allow background collection only after user consent. |
| FR10 | The system shall allow administrators to view all uploaded measurements. |
| FR11 | The system shall allow administrators to filter records by user, provider, network, quality, and location. |
| FR12 | The system shall support English and French interface labels. |

## 3.15 Non-Functional Requirements

**Table 3: Non-functional requirements**

| ID | Requirement |
|---|---|
| NFR1 | The application should be easy to use and require minimal feedback time. |
| NFR2 | The system should protect user data using authentication. |
| NFR3 | The system should work with unstable connectivity by storing data offline. |
| NFR4 | The system should minimize battery and data usage. |
| NFR5 | The backend should support scalable data storage. |
| NFR6 | The database should support efficient location-based queries. |
| NFR7 | The system should be maintainable and modular. |
| NFR8 | The UI should be responsive on mobile screens. |

## 3.16 Requirement Prioritization

**Table 4: Requirement prioritization**

| Priority | Requirements |
|---|---|
| High | Authentication, metric collection, local storage, user feedback, upload, backend storage |
| Medium | Heatmap, admin dashboard, filters, bilingual labels, background collection |
| Low | Advanced analytics, exact active SIM detection, native radio signal metrics, predictive reports |

## 3.17 Software Requirement Specification Summary

The system shall provide a mobile application where subscribers can create accounts, log in, collect network samples, rate their experience, store samples locally, view records, and upload data. Administrators shall be able to view uploaded data, filter records, and inspect geographic distribution using heatmaps. The backend shall authenticate users, receive bulk measurement uploads, prevent duplicate uploads using user/local record references, and store records in MongoDB.

## 3.18 Requirement Validation with Stakeholders

Requirements were validated by comparing the implemented features with the survey findings and course task expectations. User privacy concerns were addressed through opt-in background collection. User preference for quick feedback was addressed through rating controls. Need for offline support was addressed through SQLite. Need for analysis was addressed through the admin dashboard and heatmap.

## 3.19 System Context Diagram

**Figure 9: System context diagram**  
[Insert designed context diagram screenshot here.]

Textual description:

```text
Mobile Subscriber -> Mobile App -> Backend API -> MongoDB Database
Administrator -> Mobile/Admin App -> Backend API -> MongoDB Database
Mobile App -> External Probe Servers -> QoS Measurements
Mobile App -> Device Location/Network APIs -> Location and connectivity data
```

## 3.20 Data Flow Diagram

**Figure 10: Data flow diagram**  
[Insert DFD screenshot here.]

Textual Level 1 flow:

```text
1. User registers/logs in.
2. Mobile app stores session token.
3. User collects sample or background task runs.
4. App reads network, location, and probe response data.
5. App combines metrics with user feedback.
6. App stores the record in SQLite.
7. App uploads pending records to backend.
8. Backend validates JWT token.
9. Backend maps records into MongoDB schema.
10. Admin retrieves and filters uploaded measurements.
```

## 3.21 Use Case Diagram

**Figure 11: Use case diagram**  
[Insert use case diagram screenshot here.]

Main actors:

1. Subscriber.
2. Administrator.
3. Backend API.
4. Database.

Main use cases:

1. Register account.
2. Login.
3. Collect network sample.
4. Submit rating.
5. View records.
6. Upload measurements.
7. Enable background collection.
8. View heatmap.
9. Filter measurements.
10. Manage/administer data.

## 3.22 Sequence Diagram

**Figure 12: Sequence diagram for measurement upload**  
[Insert sequence diagram screenshot here.]

Textual sequence:

```text
Subscriber -> Mobile App: Tap collect sample
Mobile App -> Expo Network API: Get network state
Mobile App -> Probe URL: Measure latency/jitter/packet loss
Mobile App -> Download URL: Estimate download speed
Mobile App -> Location API: Get GPS and reverse geocode data
Mobile App -> SQLite: Save measurement locally
Mobile App -> Backend API: POST /api/measurements/bulk
Backend API -> JWT Middleware: Validate token
Backend API -> MongoDB: Upsert measurement and network cell
Backend API -> Mobile App: Return saved count
Mobile App -> SQLite: Mark records as uploaded
```

## 3.23 Class Diagram

**Figure 13: Class diagram**  
[Insert class diagram screenshot here.]

Main classes/components:

1. User.
2. Measurement.
3. NetworkCell.
4. AuthScreen.
5. UserApp.
6. AdminApp.
7. DatabaseService.
8. MetricsService.
9. UploadService.
10. ApiService.

## 3.24 Deployment Diagram

**Figure 14: Deployment diagram**  
[Insert deployment diagram screenshot here.]

Textual deployment:

```text
Mobile Device
  - React Native/Expo app
  - SQLite local database
  - AsyncStorage settings/session
  - Location and network APIs

Backend Server
  - Node.js runtime
  - Express API
  - JWT authentication
  - Mongoose ODM

Database Server
  - MongoDB database
  - Users collection
  - Measurements collection
  - NetworkCells collection
```

## 3.25 Database Conceptual Design

The database has three main entities:

**Table 5: Main database entities**

| Entity | Description |
|---|---|
| User | Stores subscriber and admin account information. |
| Measurement | Stores QoS metrics, QoE ratings, timestamp, source, and location coordinates. |
| NetworkCell | Stores normalized provider and location information associated with measurements. |

## 3.26 Entity Relationship Diagram

**Figure 15: Entity relationship diagram**  
[Insert ERD screenshot here. Use the diagram from `ERD_DOCUMENTATION.md` or redraw it clearly.]

Relationship summary:

1. One User can have many Measurements.
2. Many Measurements can reference one NetworkCell.
3. Measurements contain GeoJSON coordinates for geospatial queries.

## 3.27 Global Architecture of the Solution

The global architecture is an offline-first client-server system. The mobile app collects metrics and stores them locally first. Uploading is performed manually or automatically when the connection is considered good. This design is important because the target environment includes unstable network connectivity.

The backend receives data through authenticated API endpoints and stores it in MongoDB. Admin users can query the data for analysis.

## 3.28 Partial Conclusion

The analysis and design phase converted user needs into clear system requirements and models. The design supports practical constraints such as privacy, unstable connectivity, battery sensitivity, cross-platform access, local storage, and administrator analysis.

---

# CHAPTER FOUR: IMPLEMENTATION AND RESULTS

## 4.1 Introduction

This chapter presents the tools, implementation process, frontend implementation, backend implementation, database implementation, and results obtained from the completed system.

## 4.2 Tools and Materials Used

**Table 7: Tools and technologies used**

| Tool/Technology | Purpose |
|---|---|
| React Native | Mobile UI development |
| Expo | Mobile development tooling and device APIs |
| JavaScript | Frontend and backend programming language |
| Expo Location | Location and reverse geocoding |
| Expo Network | Network state and IP address detection |
| Expo SQLite | Local offline measurement storage |
| Expo Background Task | Background collection scheduling |
| Expo Task Manager | Background task definition |
| AsyncStorage | Local settings and session persistence |
| Node.js | Backend runtime |
| Express | REST API framework |
| MongoDB | Cloud/backend database |
| Mongoose | MongoDB object modelling |
| JWT | Authentication token mechanism |
| bcryptjs | Password hashing |
| CORS | Cross-origin request handling |

## 4.3 App Identity

The application is branded as **KILObYTES** in the implemented authentication screen. It is presented as a QoS/QoE intelligence tool that helps collect subscriber experience samples, visualize coverage quality, and review network signals.

**Figure 16: Login and registration screen**  
[Insert screenshot here showing the KILObYTES welcome/login/register screen.]

## 4.4 Visual Design

The UI uses a clean mobile dashboard style with panels, metric cards, rating rows, heatmap views, and tab navigation. The design separates subscriber workflows from admin workflows.

The subscriber interface contains tabs for:

1. Collect.
2. Map.
3. Records.
4. Settings.

The admin interface contains tabs for:

1. Dashboard.
2. Heatmap.
3. Records.

The app also includes a language toggle for English and French labels.

## 4.5 Frontend Implementation

The frontend is implemented in the `src` directory. The root component loads the saved session and decides whether to show the authentication screen, subscriber app, or admin app.

Main files include:

1. `App.js`: Wraps the application with `SafeAreaProvider`.
2. `src/Root.js`: Loads sessions and routes users by role.
3. `src/screens/AuthScreen.js`: Handles registration and login.
4. `src/screens/UserApp.js`: Handles subscriber collection, heatmap, records, and settings.
5. `src/screens/AdminApp.js`: Handles admin dashboard, filters, heatmap, and records.
6. `src/services/metrics.js`: Collects network and location metrics.
7. `src/services/database.js`: Manages SQLite local storage.
8. `src/services/upload.js`: Uploads pending records.
9. `src/tasks/backgroundSampler.js`: Defines the background collection task.

## 4.6 Authentication Implementation

Users can register and log in using name, email, and password. The backend hashes passwords using bcrypt and returns a JWT token after successful authentication. The mobile app stores the session locally and uses the token for protected API requests.

The app supports two roles:

1. **user:** Can collect and upload measurements.
2. **admin:** Can view and filter uploaded measurements.

## 4.7 Subscriber Collection Implementation

The subscriber collection screen allows the user to:

1. View latest sample metrics.
2. See total samples and uploaded records.
3. Rate signal stability, browsing speed, and streaming quality.
4. Add optional comments.
5. Collect and save a network sample.
6. Upload pending records.

**Figure 17: Subscriber collection screen**  
[Insert screenshot here showing the collect tab with speedometer, metrics, ratings, comment box, and buttons.]

## 4.8 Metric Collection Implementation

The app collects the following measurements:

1. Timestamp.
2. Network type.
3. Connection status.
4. Internet reachability.
5. IP address.
6. ISP/provider label.
7. Latency.
8. Jitter.
9. Packet loss.
10. Download speed.
11. Upload speed.
12. Latitude and longitude.
13. Location accuracy.
14. Country, region, city, district, and street where available.

Latency and jitter are estimated using repeated probe requests. Packet loss is estimated based on failed probe requests. Download speed is estimated by downloading a fixed-size file. Upload speed is estimated by posting a test payload.

## 4.9 Local Storage Implementation

The mobile app uses Expo SQLite to store measurements locally in a `measurements` table. This supports offline-first operation. If the network is poor, the app can still collect and store samples. Records are later uploaded when the user chooses to upload or when automatic upload is enabled and connection quality is acceptable.

The app also uses AsyncStorage for session and settings data.

## 4.10 Background Collection Implementation

The background task is defined using Expo Task Manager and registered using Expo Background Task. It only runs when:

1. The user is logged in as a normal subscriber.
2. Automatic collection is enabled.
3. The user has given background consent.
4. Required permissions are granted.

This design responds to the privacy concerns discovered during requirement gathering.

**Figure 20: Settings and consent screen**  
[Insert screenshot here showing automatic collection, automatic upload, pop-up notification, and threshold settings.]

## 4.11 Heatmap Implementation

The subscriber heatmap displays the user's own measurement points. The admin heatmap displays uploaded measurements from multiple users. This helps visualize areas where network quality is good, fair, or poor.

**Figure 18: Subscriber heatmap screen**  
[Insert screenshot here showing user heatmap.]

**Figure 22: Admin heatmap screen**  
[Insert screenshot here showing all-users heatmap.]

## 4.12 Records Implementation

The records screen displays stored measurements in descending order. Users can expand a record to inspect more details. Admins can view records from different subscribers.

**Figure 19: Subscriber records screen**  
[Insert screenshot here showing the records list and expanded record details.]

## 4.13 Backend Implementation

The backend is implemented in `backend/server.js` using Express. It provides authentication, authorization, measurement upload, and admin retrieval.

**Table 6: Main API endpoints**

| Endpoint | Method | Purpose |
|---|---|---|
| `/api/health` | GET | Check API health |
| `/api/auth/register` | POST | Register a new user |
| `/api/auth/login` | POST | Log in and receive JWT token |
| `/api/me` | GET | Get authenticated user profile |
| `/api/measurements/bulk` | POST | Upload local measurements |
| `/api/measurements/mine` | GET | Get current user's measurements |
| `/api/admin/measurements` | GET | Get and filter all measurements as admin |

The backend uses JWT middleware to protect routes. It also uses role-based access control so that only admins can access admin data.

## 4.14 Database Implementation

The backend database uses MongoDB and Mongoose. The main collections are User, Measurement, and NetworkCell.

The User collection stores account information, including name, email, password hash, and role.

The Measurement collection stores uploaded QoS/QoE records. It includes latency, jitter, packet loss, upload speed, download speed, network type, connection state, coordinates, ratings, comments, and source.

The NetworkCell collection stores normalized provider and location information. This avoids repeating long location strings in every measurement record.

The Measurement collection uses a GeoJSON Point field and a `2dsphere` index to support geospatial queries.

## 4.15 Connecting Database to Backend

The backend connects to MongoDB using the `MONGO_URI` environment variable. During startup, the server connects to MongoDB, optionally seeds an admin account from environment variables, and starts listening on the configured port.

Uploaded measurements are mapped from the mobile SQLite format into the backend MongoDB format. The backend uses an upsert operation to avoid duplicate uploads using the combination of `userId` and `localId`.

## 4.16 Admin Dashboard Implementation

The admin dashboard allows administrators to view:

1. Total number of samples.
2. Number of users represented in the results.
3. Number of poor samples.
4. Number of providers.

Admins can filter by:

1. User name or email.
2. Provider.
3. Network type.
4. Country.
5. Region.
6. City.
7. General location text.
8. Quality category: all, good, fair, or poor.

**Figure 21: Admin dashboard screen**  
[Insert screenshot here showing admin metrics and filters.]

## 4.17 Presentation and Interpretation of Results

The implemented system successfully demonstrates the complete flow from requirement gathering to a working mobile and backend application.

The authentication result shows that users can register, log in, and receive a persistent session.

The collection result shows that the application can collect network metrics and combine them with user feedback.

The local storage result shows that collected samples are preserved in SQLite even before upload.

The upload result shows that records can be sent to the backend in bulk and marked as uploaded.

The admin result shows that uploaded records can be retrieved and filtered.

The heatmap result shows that location-enabled measurements can be visualized geographically.

## 4.18 Evaluation of the Solution

The solution satisfies the major project objectives. It collects objective network metrics, collects subjective user feedback, supports local storage, uploads to a backend, and provides admin analysis features.

Strengths of the solution include:

1. Cross-platform mobile implementation.
2. Offline-first local storage.
3. User consent for background collection.
4. JWT-based authentication.
5. Role-based admin access.
6. MongoDB geospatial-ready schema.
7. Bilingual interface labels.
8. Heatmap visualization.

Current limitations include:

1. Exact cellular signal strength is not fully implemented in the Expo layer.
2. Active SIM detection requires native platform APIs.
3. Network generation and roaming fields exist in the database schema but require deeper frontend capture for full accuracy.
4. Some feedback naming should be aligned across the UI, local SQLite schema, and backend schema during maintenance.
5. Production deployment requires secure environment variables, HTTPS, and hosted MongoDB.

## 4.19 Partial Conclusion

The implementation phase produced a functional QoS/QoE mobile application and backend. The system meets the main academic and technical goals and creates a foundation for further development into a more advanced network experience analytics platform.

---

# CHAPTER FIVE: MAINTENANCE, CONCLUSION, AND FURTHER WORK

## 5.1 Maintenance Plan

Maintenance is necessary to keep the system reliable, secure, and useful after implementation. The maintenance plan covers corrective, adaptive, perfective, and preventive maintenance.

**Table 8: Maintenance plan**

| Maintenance Type | Activities |
|---|---|
| Corrective | Fix bugs in metric collection, upload, authentication, UI display, and backend queries. |
| Adaptive | Update Expo, React Native, Node.js, MongoDB, and platform-specific APIs when versions change. |
| Perfective | Add analytics, charts, better filters, improved heatmaps, and user reports. |
| Preventive | Add automated tests, improve error handling, secure environment variables, and monitor logs. |

## 5.2 Specific Maintenance Tasks

Important maintenance tasks include:

1. Align feedback fields across UI, SQLite, and MongoDB.
2. Add device model and OS version capture using appropriate Expo/device APIs.
3. Improve network generation detection.
4. Improve roaming detection where platform APIs allow.
5. Add automated backend tests for authentication and measurement upload.
6. Add validation for uploaded measurement payloads.
7. Add HTTPS and production deployment configuration.
8. Improve privacy documentation and consent messages.
9. Add database backup and recovery strategy.
10. Monitor backend logs and database performance.

## 5.3 Summary of Findings

The requirements gathering showed that users experience frequent network quality problems and are willing to provide feedback if the process is fast, transparent, and not intrusive. Users are sensitive to battery usage, data usage, privacy, and location tracking. The findings justified an offline-first, consent-based, and simple feedback design.

The implementation showed that React Native with Expo is suitable for building a cross-platform mobile QoS/QoE collection app. Node.js, Express, MongoDB, and SQLite provide a practical backend and storage architecture for this type of system.

## 5.4 Contribution to Engineering and Technology

This project contributes a practical prototype for subscriber-based network experience data collection. It demonstrates how mobile devices can be used as distributed QoS/QoE sensing points. The system links technical measurements with human feedback, which is important for understanding actual service quality.

The database design also contributes by normalizing network cell/location information and preparing measurement data for geospatial analysis using GeoJSON coordinates.

## 5.5 Recommendations

The following recommendations are proposed:

1. The system should be tested with a larger number of real users across different towns and network providers.
2. Native modules should be added for more accurate signal strength, active SIM, cell ID, and network generation detection.
3. The backend should be deployed with HTTPS and secure environment management.
4. Admin analytics should include charts for latency, download speed, packet loss, and satisfaction trends.
5. Privacy policies should be clearly communicated to users before large-scale deployment.
6. The project should include automated tests before production rollout.

## 5.6 Difficulties Encountered

The main difficulties encountered include:

1. Accessing low-level mobile network details through a cross-platform framework.
2. Balancing background data collection with privacy and battery concerns.
3. Designing a database schema that supports both local offline storage and backend analytics.
4. Handling unstable network conditions during upload.
5. Designing UI flows for both subscribers and administrators within one application.

## 5.7 Further Work

Future improvements include:

1. Implementing exact cellular signal strength and cell tower identification.
2. Adding active SIM detection for dual-SIM users.
3. Adding push notifications for severe network degradation.
4. Adding charts and downloadable reports for administrators.
5. Adding anonymized public dashboards.
6. Adding machine learning models to predict network quality based on location, time, and provider.
7. Adding stronger data anonymization and privacy controls.
8. Publishing the application as a production Android and iOS build.

## 5.8 Conclusion

This project successfully designed and implemented a mobile application for collecting Quality of Experience data from mobile network subscribers. The application collects both objective network performance metrics and subjective user feedback. It supports registration, login, local storage, upload, background collection with consent, heatmap visualization, bilingual labels, and admin filtering.

The project moved from requirement gathering to analysis, design, implementation, and maintenance planning. The final system demonstrates a practical way of collecting real user network experience data and provides a strong foundation for future improvements in mobile network monitoring and customer experience management.

---

# References

Android Developers. (2026). WorkManager documentation. https://developer.android.com/topic/libraries/architecture/workmanager

Apple Developer. (2026). BackgroundTasks documentation. https://developer.apple.com/documentation/backgroundtasks

Expo. (2026). Expo documentation. https://docs.expo.dev

GSM Association. (2025). The Mobile Economy: Sub-Saharan Africa 2025. GSMA Intelligence.

International Telecommunication Union. (2025). Measuring digital development: Facts and figures 2025. ITU.

MongoDB. (2026). MongoDB documentation. https://www.mongodb.com/docs

Node.js. (2026). Node.js documentation. OpenJS Foundation. https://nodejs.org

React Native. (2026). React Native documentation. Meta Open Source. https://reactnative.dev

Socket.IO Contributors. (2026). Socket.IO documentation. https://socket.io/docs

Telecommunications Regulatory Board Cameroon. (2025). Annual market report 2025.

---

# Appendices

## Appendix A: Screenshot Placement Checklist

Use the following screenshots in the final formatted Word/PDF version:

1. Login/register screen: place under Section 4.3.
2. Subscriber collect screen: place under Section 4.7.
3. Latest sample details: place under Section 4.8.
4. Subscriber heatmap: place under Section 4.11.
5. Subscriber records screen: place under Section 4.12.
6. Settings and consent screen: place under Section 4.10.
7. Admin dashboard: place under Section 4.16.
8. Admin heatmap: place under Section 4.11.
9. Admin records/filter screen: place under Section 4.16.
10. MongoDB collections screenshot: place under Section 4.14.
11. Backend terminal running successfully: place under Section 4.15.
12. Expo app running on mobile device/emulator: place under Section 4.5.

## Appendix B: Suggested Diagrams to Draw

1. Context diagram.
2. Data flow diagram.
3. Use case diagram.
4. Sequence diagram for measurement upload.
5. Class diagram.
6. Deployment diagram.
7. Entity relationship diagram.

## Appendix C: Project Run Summary

Frontend:

```text
npm install
npm run start
```

Backend:

```text
cd backend
npm install
npm run start
```

Required backend environment variables:

```text
MONGO_URI=<MongoDB connection string>
JWT_SECRET=<secure secret>
ADMIN_EMAIL=<admin email>
ADMIN_PASSWORD=<admin password>
PORT=4000
```

Required frontend environment variable for physical devices:

```text
EXPO_PUBLIC_API_URL=http://<computer-local-ip>:4000/api
```

## Appendix D: Course Task Coverage

| Course Task | Where Covered |
|---|---|
| Task 1: Mobile App Development Process | Chapter Two |
| Task 2: Requirement Gathering | Chapter Three, Sections 3.2 to 3.6 |
| Task 3: Requirement Analysis | Chapter Three, Sections 3.7 to 3.18 |
| Task 4: System Modelling and Design | Chapter Three, Sections 3.19 to 3.28 |
| Task 5: UI Design and Implementation | Chapter Four, Sections 4.3 to 4.12 |
| Task 6: Database Design and Implementation | Chapter Three Section 3.25, Chapter Four Sections 4.13 to 4.15 |
| Task 7: Final Project Presentation | Chapter Four results, Chapter Five conclusion, and screenshot checklist |

