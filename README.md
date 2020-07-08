# Senior Challenge - Price Survey (2020)
This repository must be forked to your personal account and through there the challenge must be executed.


# Description:
Your goal on this challenge is to create a dashboard where crawlers / web scrappers can be managed and their extracted data can be verified on the screen.
Our main tech stack is currently [Node.js v10.x](https://nodejs.org/), [TypeScript](https://www.typescriptlang.org/) and [React.js](https://reactjs.org/). 

Feel free to use whatever UI library, framework, etc that you feel happy developing with, on top of the stack above.

This repo has a base project structure to get you started, you can reorganize it anyway you want to fit your architecture of wish. You **won't** be needing to develop a crawler for this challenge. It's already created inside the `/crawler` directory, and there's a [README.md](./crawler/README.md) explaining how to properly run the robot.

**HINT**: Try running `node build/drogasil/runCrawler.js` inside the `crawler` folder (Check the [Crawler README](./crawler/README.md) first.).


# Goals:
## Backend/API:
About the db, you can choose any db you want, just remember to tell us how to configure it on the SETUP.md documentation file. Just to let you know, MongoDB is a dependency of the crawler, so if you don't want to have multiple databases running, you can use it too.

List of the API features:
- Authentication (using JWT);
- List crawlers registered in the system;
- Start a crawler execution;
- Stop a crawler execution;
- Fetch status information of the crawler:
  - Number of links found;
  - Number of product details extracted so far (if running or finished);
  - Status of execution (Idle | Running | Stopped | Finished | Failed)
  - Timestamp or datetime for the start of the crawler
  - Duration in minutes (if the crawler is running or finished)
- Fetch list of results extracted


## Frontend:
Don't be too hard on yourself if design/ui/ux is not your main skill, we just need to test it and see that's working!

- Login view (email and password);
- Crawlers list with the actions (Here be free to use your creativity, but a simple table would be enough):
  - Start/Stop
  - Status check
  - Results check
- Crawler Results


## DevOPS:
- Docker to separate the services and docker-compose to run everything with `docker-compose up` (The db is not mandatory to be in a separate service).
- Don't worry about CI/CD just yet, focus on the features.
  

## General:
- Document the frontend and backend in different README.md files, we really want to see how you came up with this cool project!
- Create a general SETUP.md file explaining how to boot up your project and start executing/testing everything
- Tests for the backend are mandatory, we'll let you decide which tests and which type of tests is better suited for each part of the project. Tests for the frontend is a bonus point.


# Bonus:
If you develop a test step for the crawler results this will be very appreciated. (Check if the fields that must be fetched are being populated) 

**Hint**: Test the case that have a promotional price and the case without promotional price ;)


# Time-frame:
The amount of time you have to develop this project is 7 days counting after the date you receive this repository. If you need more time don't hesitate to contact us on: arthurpires@pricesurvey.io


# Contact Info:
If you have any problems with the base project, please contact us at: arthurpires@pricesurvey.io
