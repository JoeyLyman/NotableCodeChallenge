const app = require("./app");

app.disable("x-powered-by");
app.set("port", process.env.PORT || 3000);
app.listen(app.get("port"), () => {
  console.log(`Express started on PORT: ${app.get("port")}.`);
});
