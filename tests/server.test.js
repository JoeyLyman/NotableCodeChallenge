const supertest = require("supertest");
const fs = require("fs");
const path = require("path");
const app = require("../app");

// --- Setup ---
// beforeEach((done) => {
//   // Reset /database folder to data in /tests/testData
//   const pathname = path.join(__dirname, "..", "public");
//   fs.readdir(pathname, (err, files) => {
//     if (err) console.log(err);
//     for (const file of files) {
//       fs.unlink(path.join(pathname, file), (err) => {
//         if (err) console.log(err);
//       });
//     }
//     done();
//   });
// });

beforeEach((done) => {
  // Reset /database/appointments.json
  fs.copyFile(
    path.join(__dirname, "testData", "appointments.json"),
    path.join(__dirname, "..", "database", "appointments.json"),
    (err) => {}
  );

  fs.copyFile(
    path.join(__dirname, "testData", "doctors.json"),
    path.join(__dirname, "..", "database", "doctors.json"),
    (err) => {}
  );
  done();
});

// --- Tests ---
describe("Test API:", () => {
  test("GET /", async () => {
    await supertest(app).get("/").expect(200);
  });

  test("GET /doctors", async () => {
    await supertest(app).get("/doctors").expect(200);
  });

  // test("GET /appointments/:doctorID/:mm/:dd/:yyyy", async () => {
  //   const doctorID = "doctor001";
  //   const mm = "01";
  //   const dd = "01";
  //   const yyyy = "2022";

  //   // fetch file from url
  //   await supertest(app)
  //     .get(path.join(`appointments` + doctorID + mm + dd + yyyy))
  //     //.type("form")
  //     .expect(200);
  // });

  test("DELETE /appointments/:id", async () => {
    await supertest(app).delete("/appointments/appointment001").expect(200);
  });

  test("POST /appointments/:doctorID/:mm/:dd/:yyyy/:hh/:min/:patientFirstName/:patientLastName/:kind", async () => {
    await supertest(app)
      .post("/appointments/doctor001/01/01/2025/06/30/bill/burr/Patient")
      .expect(200);
  });
});
