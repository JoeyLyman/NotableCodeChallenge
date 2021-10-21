const express = require("express");
const fs = require("fs");
const path = require("path");
const url = require("url");

// --- Server Setup ---
const app = express();
// body-parser allows us to parse encoded data whenever we are using POST
app.use(require("body-parser").urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "/database")));

// --- API ---
// Home
app.get("/", (req, res) => {
  res.send(
    "Server is live.  This is a server to look and book doctor appoitments.  Here is the API"
  );
});

// GET a list of all doctors
app.get("/doctors", (req, res) => {
  // Read file on server and generate file page with its filename and data
  fs.readFile(`./database/doctors.json`, function (err, data) {
    if (err) {
      console.log(`error in reading doctors database:`, err);
      return res.send({ error: "Error in reading database." });
    } else {
      res.send(data);
    }
  });
});

// GET a list of all appointments for a particular doctor and particular day
app.get("/appointments/:doctorID/:mm/:dd/:yyyy", (req, res) => {
  // test url: http://localhost:3000/appointments/doctor001/01/01/2022

  // Pull PARAMS from URL
  const doctorID = req.params.doctorID;
  const dateObject = new Date(req.params.yyyy, req.params.mm, req.params.dd);
  const dateValue = dateObject.valueOf();

  // Read DATABASE, FILTER, and RESPOND
  fs.readFile(`./database/appointments.json`, function (err, data) {
    if (err) {
      console.log(`error in reading appointment database:`, err);
      return res.send({ error: "Error in reading appointment database." });
    } else {
      const jsonData = JSON.parse(data);
      const appointmentsForSpecificDoctor = jsonData.filter(
        (appt) => appt.doctorID === doctorID && appt.date === dateValue
      );
      res.send(appointmentsForSpecificDoctor);
    }
  });
});

// DELETE appt by ID
app.delete("/appointments/:id", (req, res) => {
  // Pull PARAMS from URL
  const appointmentID = req.params.id;

  // Load DATABASE, FILTER, and REWRITE database without that appointment
  fs.readFile(`./database/appointments.json`, function (err, data) {
    if (err) {
      console.log(`error in reading appointment database:`, err);
      return res.send({ error: "Error in reading appointment database." });
    } else {
      const jsonData = JSON.parse(data);
      const remainingAppointmentsAfterDelete = jsonData.filter(
        (appt) => appt.id !== appointmentID
      );

      fs.writeFile(
        `./database/appointments.json`,
        JSON.stringify(remainingAppointmentsAfterDelete),
        function (err) {
          if (err) {
            return res.send({
              error: "Error in rewriting appointment database.",
            });
          } else {
            res.send("Successfully removed appointments with that ID");
          }
        }
      );
    }
  });
});

// POST new appointment to a doctors calendar
app.post(
  "/appointments/:doctorID/:mm/:dd/:yyyy/:hh/:min/:patientFirstName/:patientLastName/:kind",
  (req, res) => {
    // test url: http://localhost:3000/appointments/doctor001/01/01/2022/06/30
    const doctorID = req.params.doctorID;
    const patientFirstName = req.params.patientFirstName;
    const patientLastName = req.params.patientLastName;
    const kind = req.params.kind;

    const mm = req.params.mm;
    const dd = req.params.dd;
    const yyyy = req.params.yyyy;
    const hh = req.params.hh;
    const min = req.params.min;
    const dateObject = new Date(yyyy, mm, dd, hh, min);
    console.log(`dateObject:`, dateObject);
    const dateValue = dateObject.valueOf();
    console.log(`dateValue:`, dateValue);

    // Validate appointment time
    if (min !== "15" && min !== "30" && min !== "45" && min !== "00") {
      res.status(404);
      res.send({
        error: "Appointment time must be in an interval of 15mins",
      });
    }

    // Get all appointments for doctor
    fs.readFile(`./database/appointments.json`, function (err, data) {
      if (err) {
        res.status(500);
        console.log(`error in reading appointment database:`, err);
        return res.send({ error: "Error in reading appointment database." });
      } else {
        const jsonData = JSON.parse(data);
        const appointmentsForSpecificDoctor = jsonData.filter(
          (appt) => appt.doctorID === doctorID
        );
        const existingAppointmentsAtThisTime =
          appointmentsForSpecificDoctor.filter(
            (appt) => appt.date === dateValue
          );
        const numberOfExistingAppointmentsAtThisTime =
          existingAppointmentsAtThisTime.length;
        console.log(
          `numberOfExistingAppointmentsAtThisTime:`,
          numberOfExistingAppointmentsAtThisTime
        );

        if (numberOfExistingAppointmentsAtThisTime >= 3) {
          res.send({
            error:
              "Doctor already has 3 existing appointments at this time.  Please select another time.",
          });
        } else {
          // Load DATABASE, FILTER, and REWRITE database without that appointment
          fs.readFile(`./database/appointments.json`, function (err, data) {
            if (err) {
              console.log(`error in reading appointment database:`, err);
              return res.send({
                error: "Error in reading appointment database.",
              });
            } else {
              const jsonData = JSON.parse(data);
              const newDatabaseArray = [
                ...jsonData,
                {
                  id: `appointment${jsonData.length + 1}`,
                  patientFirstName,
                  patientLastName,
                  date: dateValue,
                  kind,
                  doctorID,
                },
              ];

              fs.writeFile(
                `./database/appointments.json`,
                JSON.stringify(newDatabaseArray),
                function (err) {
                  if (err) {
                    return res.send({
                      error: "Error in rewriting appointment database.",
                    });
                  } else {
                    res.send("Successfully removed appointments with that ID");
                  }
                }
              );
            }
          });

          res.send(200);
          // TODO: add appt to DB
        }
      }
    });

    // can only be at :15 minute intervals, i.e. 8:15 is a valid time but 8:20 is not
    // only 3 appointments max are allowed for a specific doctor at a specific time
    // TODO: check with team if we should validate to ensure new appointments are only in the future
  }
);
// --- End Routes ---

module.exports = app;
