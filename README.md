# Bandi Server

This repository contains the infrastructure for managing micropayment transactions. This project is intended to work in tandem with Bandi Events. Think of it like a rewards program: as users stream micropayments, they'll earn bonus points (set at a rate your control). This project contains a number of APIs for managing these events:

**Auth:** Actions for login/logout as well as creating authorization http-cookies and authenticating with jwts.

**Users:** A set of CRUD actions for managing users.

**Transactions:** Actions for dealing with creating & reading transactions.

**Balances:** Actions for managing user balances.

A third project Bandi Admin offers a web interface that provides analytics and visualizations on user transactions.

Bandi Server is not intended to be a fully-featured framework. It will always remain unopinionated about how data should be used—it is simply a set of APIs for managing transactions. Whether you decide to use the points in a custom marketplace or to create a tiered architecture for your supporters (think Patreon), this package was designed to be decoupled from any specific systems implementation.

## Application Architecture

**prisma** - The Prisma schema, database seeds, and migrations data.

**configs** - Contains environment specific configurations.

**controllers** - Handles input events and invokes the service layer.

**dtos** - The data transfer objects.

**exceptions** - Any functions related to managing application exceptions.

**logs** - The folder where application logs are written to.

**middlewares** - Middleware for handling things like authorization checks, data validation, and exception handling.

**routes** - Contains the application routes. Uses an Express Router to map routes to controller actions and attaches any necessary validation middleware.

**services** - The layer above data access that holds the core business processing logic. Interacts directly with the ORM.

**utils** - Helper functions for different functional boundaries of the application.

## Getting Started

Clone this repo: `git clone https://github.com/Bandi-Events/bandi-server.git`

Start the app by running `npm run dev`

(Note: `docker-compose.yml` contains a step for spinning up a local MySQL instance for local development)
