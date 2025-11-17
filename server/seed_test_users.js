const fs = require("fs");
const path = require("path");
const bcrypt = require("bcryptjs");

const DATA_DIR = path.join(__dirname, "data");
const USERS_FILE = path.join(DATA_DIR, "users.json");

// Ensure data dir exists
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

async function seedUsers() {
  try {
    // Simple test password
    const testPassword = "password123";
    const hashedPassword = await bcrypt.hash(testPassword, 10);

    const testUsers = {
      admins: [
        {
          id: 1,
          name: "Admin",
          email: "admin@college.in",
          password: hashedPassword,
        },
      ],
      teachers: [
        {
          id: 2,
          name: "TOC Teacher",
          email: "toc_teacher@college.in",
          password: hashedPassword,
          subjects: ["TOC"],
          classes: ["5A", "5B", "5C", "5D"],
        },
        {
          id: 3,
          name: "CN Teacher",
          email: "cn_teacher@college.in",
          password: hashedPassword,
          subjects: ["CN"],
          classes: ["5A", "5B", "5C", "5D"],
        },
      ],
      students: [
        {
          id: 4,
          name: "Aarav Sharma",
          email: "aaravsharma1000@college.in",
          password: hashedPassword,
          className: "5A",
          profilePic: null,
        },
        {
          id: 5,
          name: "Vivaan Kumar",
          email: "vivaankumar1001@college.in",
          password: hashedPassword,
          className: "5A",
          profilePic: null,
        },
        {
          id: 6,
          name: "Aditya Rao",
          email: "adityarao1002@college.in",
          password: hashedPassword,
          className: "5A",
          profilePic: null,
        },
      ],
      requests: [],
    };

    fs.writeFileSync(USERS_FILE, JSON.stringify(testUsers, null, 2), "utf8");
    console.log("✅ Test users seeded successfully!");
    console.log("\n📝 Test Credentials:");
    console.log("====================");
    console.log(`\n🔑 Admin:`);
    console.log(`   Email: admin@college.in`);
    console.log(`   Password: ${testPassword}`);
    console.log(`\n🔑 Teacher:`);
    console.log(`   Email: toc_teacher@college.in`);
    console.log(`   Password: ${testPassword}`);
    console.log(`\n🔑 Student:`);
    console.log(`   Email: aaravsharma1000@college.in`);
    console.log(`   Password: ${testPassword}`);
  } catch (err) {
    console.error("❌ Error seeding users:", err);
    process.exit(1);
  }
}

seedUsers();
