const fs = require("fs");
const path = require("path");
const bcrypt = require("bcryptjs");

const DATA_DIR = path.join(__dirname, "data");
const USERS_FILE = path.join(DATA_DIR, "users.json");

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

async function seedDatabase() {
  try {
    const password = "password123";
    const hashedPassword = await bcrypt.hash(password, 10);

    const users = {
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
        {
          id: 4,
          name: "Database Teacher",
          email: "db_teacher@college.in",
          password: hashedPassword,
          subjects: ["Database"],
          classes: ["5A", "5B"],
        },
      ],
      students: [
        {
          id: 101,
          name: "Aarav Sharma",
          email: "aarav@college.in",
          password: hashedPassword,
          className: "5A",
        },
        {
          id: 102,
          name: "Vivaan Kumar",
          email: "vivaan@college.in",
          password: hashedPassword,
          className: "5A",
        },
        {
          id: 103,
          name: "Aditya Rao",
          email: "aditya@college.in",
          password: hashedPassword,
          className: "5B",
        },
        {
          id: 104,
          name: "Sai Singh",
          email: "sai@college.in",
          password: hashedPassword,
          className: "5B",
        },
        {
          id: 105,
          name: "Arjun Iyer",
          email: "arjun@college.in",
          password: hashedPassword,
          className: "5C",
        },
        {
          id: 106,
          name: "Priya Rao",
          email: "priya@college.in",
          password: hashedPassword,
          className: "5C",
        },
        {
          id: 107,
          name: "Anjali Bose",
          email: "anjali@college.in",
          password: hashedPassword,
          className: "5D",
        },
        {
          id: 108,
          name: "Maya Bhat",
          email: "maya@college.in",
          password: hashedPassword,
          className: "5D",
        },
      ],
    };

    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), "utf8");

    console.log("✅ Database seeded successfully!\n");
    console.log("📋 Test Credentials (all use password: password123):\n");
    console.log("👨‍💼 ADMIN:");
    console.log("   Email: admin@college.in");
    console.log("   Password: password123\n");

    console.log("👨‍🏫 TEACHERS:");
    console.log("   Email: toc_teacher@college.in");
    console.log("   Email: cn_teacher@college.in");
    console.log("   Email: db_teacher@college.in");
    console.log("   Password: password123 (for all)\n");

    console.log("👨‍🎓 STUDENTS:");
    users.students.forEach((student) => {
      console.log(`   Email: ${student.email} (Class: ${student.className})`);
    });
    console.log("   Password: password123 (for all)\n");
  } catch (err) {
    console.error("❌ Error seeding database:", err);
    process.exit(1);
  }
}

seedDatabase();
