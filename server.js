import express from "express";
import cors from "cors";
import records from "./routes/record.js";


const PORT = 5050;
const app = express();


app.use(cors());
app.use(express.json());
app.use("/books", records);


// start the Express server
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});