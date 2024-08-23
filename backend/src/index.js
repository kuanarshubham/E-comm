import app from "./app.js";
import 'dotenv/config'
import {db} from "./db/dbConnect.db.js";

db();

app.listen(process.env.PORT, () => {
    console.log("Hello");
});