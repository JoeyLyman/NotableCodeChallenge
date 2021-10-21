# Notable Integrations Engineer Software Challenge Solution

This is the software challenge solution by Joseph Lyman, for the Integrations Engineer job position. https://boards.greenhouse.io/notablehealth/jobs/4530210002.

Challenge date: Oct 20, 2021, from 3pm-5pm PST.

## API

examples:

- GET /
- GET /appointments/:doctorID/:mm/:dd/:yyyy
- GET /doctors
- DELETE /appointments/:id
- POST /appointments/:doctorID/:mm/:dd/:yyyy/:hh/:min/:patientFirstName/:patientLastName/:kind

## Database

database is locally stored in /database and has two files

- appointments.json
- doctors.json

## Testing

- this was not finished and is not extensive

## TODO

- test all edge cases and make sure date inputs are good with UTC and timezones
  NOTE: running tests should reset the DB files if you change them.

## Info

- Default port is 3000, unless changed in .env file
- App should be accessible at localhost:3000 after setup and run with either local Node.js or in a Docker container

## Running app locally with Node.js

#### Install

Locally with Node (tested with latest version, 16.11.1):

- `git clone <this_repository_url> <chosen-repo-name>`
- `cd <chosen-repo-name>`
- `npm install`

#### Commands

- Start server in production
  - `npm start`
- Start server in development mode (hot reloading)
  - `npm run dev`
- Run tests
  - ` npm test`

## Running the App in a Docker container

#### Build

- `docker build . -t joeylyman/notable-code-challenge`

#### Run

- `docker run -p 3000:3000 joeylyman/notable-code-challenge`

THANKS!!!!
