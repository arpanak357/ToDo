const express = require('express')
const dotenv = require('dotenv')
dotenv.config({});
const app = express();
const port = 3000;
const path = require("path");
const bodyparser = require("body-parser");
const {google} = require('googleapis');
const { calendar } = require('googleapis/build/src/apis/calendar');
const pg = require("pg");

app.use(express.static("public"));

const csspath = path.join(__dirname, "/public/css");
const jspath = path.join(__dirname, "/public/js");
const imgpath = path.join(__dirname, "/public/image");

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));
app.use("/js", express.static(jspath));
app.use("/css", express.static(csspath));
app.use("/image", express.static(imgpath));
app.set("view engine", "ejs");
app.set("views", "./views");

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "todo",
  password: "alpha987BET@",
  port: 5432
});
db.connect();

let items=[];


app.get("/", async(req, res) => {
  //query for each table
  try{
      const TodayQuery = await db.query("SELECT * FROM itemtoday ORDER BY idt ASC");
      const ThisWeekQuery = await db.query("SELECT * FROM itemweek ORDER BY idw ASC");
      const ThisMonthQuery = await db.query("SELECT * FROM itemmonth ORDER BY idm ASC");
      item_today = TodayQuery.rows;
      item_week = ThisWeekQuery.rows;
      item_month = ThisMonthQuery.rows;
    
    res.render("index", {
      todayItem: item_today, 
      weekItem: item_week,
      monthItem: item_month
    });
  }
  catch (err) {
    console.error('error running query:', err);
    res.status(500).send('Error fetching data');
  }
});


//Today

  app.post("/addToday", async (req, res) => {
    const item = req.body.newItemToday;
    // items.push({title: item});
    try {
      await db.query("INSERT INTO itemtoday (titlet) VALUES ($1)", [item]);
      res.redirect("/");
    } catch (err) {
      console.log(err);
    }
  });
  
  app.post("/editToday", async (req, res) => {
    const item = req.body.updatedItemTitleToday;
    const id = req.body.updatedItemIdToday;
  
    try {
      await db.query("UPDATE itemtoday SET titlet = ($1) WHERE idt = $2", [item, id]);
      res.redirect("/");
    } catch (err) {
      console.log(err);
    }
  });
  
  app.post("/deleteToday", async (req, res) => {
    const id = req.body.deleteItemIdToday;
    try {
      await db.query("DELETE FROM itemToday WHERE idt = $1", [id]);
      res.redirect("/");
    } catch (err) {
      console.log(err);
    }
  });




  //For this week
  app.post("/addWeek", async (req, res) => {
    const item = req.body.newItemWeek;
    // items.push({title: item});
    try {
      await db.query("INSERT INTO itemweek (titlew) VALUES ($1)", [item]);
      res.redirect("/");
    } catch (err) {
      console.log(err);
    }
  });
  
  app.post("/editWeek", async (req, res) => {
    const item = req.body.updatedItemTitleWeek;
    const id = req.body.updatedItemIdWeek;
  
    try {
      await db.query("UPDATE itemweek SET titlew = ($1) WHERE idw = $2", [item, id]);
      res.redirect("/");
    } catch (err) {
      console.log(err);
    }
  });
  
  app.post("/deleteWeek", async (req, res) => {
    const id = req.body.deleteItemIdWeek;
    try {
      await db.query("DELETE FROM itemWeek WHERE idw = $1", [id]);
      res.redirect("/");
    } catch (err) {
      console.log(err);
    }
  });



  //for this month
  app.post("/addMonth", async (req, res) => {
    const item = req.body.newItemMonth;
    // items.push({title: item});
    try {
      await db.query("INSERT INTO itemmonth (titlem) VALUES ($1)", [item]);
      res.redirect("/");
    } catch (err) {
      console.log(err);
    }
  });
  
  app.post("/editMonth", async (req, res) => {
    const item = req.body.updatedItemTitleMonth;
    const id = req.body.updatedItemIdMonth;
  
    try {
      await db.query("UPDATE itemmonth SET titlem = ($1) WHERE idm = $2", [item, id]);
      res.redirect("/");
    } catch (err) {
      console.log(err);
    }
  });
  
  app.post("/deleteMonth", async (req, res) => {
    const id = req.body.deleteItemIdMonth;
    try {
      await db.query("DELETE FROM itemmonth WHERE idm = $1", [id]);
      res.redirect("/");
    } catch (err) {
      console.log(err);
    }
  });

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})