# Al-Naqel Fare Card System

## Project Overview

The Al-Naqel Fare Card System is a Spring Boot-based transit payment system for managing travel cards used across trains and buses. The system allows commuters to register cards, recharge balances, swipe in and out of stations, calculate fares, and view station-zone information.

This project was completed as part of the SWE 473 Software Maintenance and Evolution course. The original system was maintained, refactored, documented, extended with new features, connected to a MySQL database, and integrated with a refreshed frontend.

## Main Features

- Register a new travel card
- Recharge an existing travel card
- Swipe card at journey start and journey end
- Automatic fare calculation based on travel zones
- Maximum fare hold and refund logic
- Stations and zones API
- MySQL database persistence
- Swagger API documentation
- SonarQube/SonarLint refactoring
- Refreshed AL NAQEEL frontend interface

## Technologies Used

### Backend
- Java
- Spring Boot
- Spring Web
- Spring Data JPA
- MySQL
- Maven
- Swagger / OpenAPI
- JUnit
- SonarQube / SonarLint

### Frontend
- React
- Vite
- Material UI
- Axios

### Tools
- IntelliJ IDEA
- MySQL Workbench
- GitHub
- Jira
- Postman / Swagger UI

## Project Structure

```text
card-system-service/
│
├── src/
│   ├── main/
│   │   ├── java/com/demo/travelcardsystem/
│   │   │   ├── businessrule/
│   │   │   ├── config/
│   │   │   ├── constant/
│   │   │   ├── controller/
│   │   │   ├── entity/
│   │   │   ├── exception/
│   │   │   ├── model/
│   │   │   ├── repository/
│   │   │   └── service/
│   │   └── resources/
│   │       └── application.properties
│   │
│   └── test/
│
├── FRONTENDCARDSYSTEM/
│   └── frontend-integration-files/
│
├── pom.xml
├── mvnw
├── mvnw.cmd
└── README.md
