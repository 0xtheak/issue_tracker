Issue Tracker

The Issue Tracker is a web application built with Node.js and EJS that allows you to efficiently track issues and bugs for your projects. With its elegant user interface and powerful features, it enables seamless management of project-related issues and promotes effective collaboration within your team.
Features

    Home Page: View a list of projects and easily create new projects, apply filters by labels and authors, and search by title and description.
    Project Detail Page: Explore project-specific issues, author can resolved the issues or reject them.
    Create Issue Page: Create new issues for a project, including title, description, labels, and author information.

Technologies Used

    Node.js
    Express.js
    EJS (Embedded JavaScript) for templating
    MongoDB (or any other preferred database) for data storage

Getting Started

Follow the steps below to set up and run the Issue Tracker application:

    Clone the repository:
    git clone https://github.com/0xtheak/issue_tracker

Install dependencies:

    cd issue-tracker
    npm install

Configure the environment variables:

Create a .env file in the root directory of the project and set the following variables:


    use these variables

    MONGODBURL=The URI for your MongoDB database
    SessionSecret= session token generator key
    SessionSecretName= session token name
    GoogleClientID=""
    GoogleClientSecret=""
    GoogleCallbackURL="http://localhost:3000/auth/google/callback"

Ensure that you set these variables appropriately in the .env file before running the application.

Run the application:


    npm start

    Access the application:
    Open your preferred web browser and go to http://localhost:3000 to access the Issue Tracker.


Contributing

Contributions to enhance the Issue Tracker application are always welcome. If you have any ideas, suggestions, or bug reports, please open an issue or submit a pull request. Your contributions will be highly appreciated.
License

The Issue Tracker application is licensed under the MIT License. You are free to modify, distribute, and use the codebase in accordance with the terms specified in the license.
