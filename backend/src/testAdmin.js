require("dotenv").config();
const Admin = require("./models/Admin");

(async () => {
  try {
    const admin = await Admin.findByEmail("admin@company.com");
    console.log(admin);
  } catch (error) {
    console.error(error.message);
  }
})();
