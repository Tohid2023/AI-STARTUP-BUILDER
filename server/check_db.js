const mongoose = require("mongoose");
const Startup = require("./models/Startup");
require("dotenv").config();

async function check() {
  await mongoose.connect(process.env.MONGO_URI);
  const startups = await Startup.find().sort({ createdAt: -1 }).limit(2);
  for (const s of startups) {
    console.log(s.title);
    console.log("DB category:", s.category);
    console.log("AI category:", s.aiResponse?.category);
  }
  process.exit();
}
check();
