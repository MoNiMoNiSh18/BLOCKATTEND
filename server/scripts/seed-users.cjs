// scripts/seed-users.cjs
// Run: node scripts/seed-users.cjs
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

const DATA_DIR = path.join(process.cwd(), 'server', 'data');
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

const usersFile = path.join(DATA_DIR, 'users.json');
const attendanceFile = path.join(DATA_DIR, 'attendance.json');
const credentialsFile = path.join(DATA_DIR, 'credentials.txt');

function mkId(n){ return Date.now() + n; }

const admins = [
  { id: mkId(1), name: "Admin", email: "admin@college.in", password: "admin123" }
];

// Subjects and departments
const subjects = ["TOC","CN","RMIPR","EVS","WTL","CNLAB","SEPM"];
const departments = ["CSE","ECE","MECH"];
// Teachers: create one teacher per subject, email = subjectname_teacher@college.in password = subjectname123
const teachers = subjects.map((s,i) => {
  return {
    id: mkId(100+i),
    name: s + " Teacher",
    email: `${s.toLowerCase()}_teacher@college.in`,
    password: `${s.toLowerCase()}123`,
    subjects: [s],
    classes: ["5A","5B","5C","5D"]
  };
});

// Students: 30 per each class (5A..5D)
const classNames = ["5A","5B","5C","5D"];
const firstNames = ["Aarav","Vivaan","Aditya","Sai","Arjun","Ishaan","Kabir","Rohan","Karan","Dev",
"Akash","Nikhil","Manish","Pranav","Naveen","Siddharth","Ritika","Priya","Ananya","Sana","Meera",
"Divya","Kavya","Sneha","Anjali","Maya","Rhea","Nia","Ira","Diya"];
const lastNames = ["Sharma","Patel","Kumar","Gupta","Rao","Nair","Singh","Joshi","Iyer","Desai",
"Choudhary","Malhotra","Menon","Verma","Kapoor","Khan","Reddy","Das","Bose","Rana",
"Bhat","Sethi","Mishra","Shah","Naik","Bhatt","Jain","Bhardwaj","Tripathi","Srivastava"];

const students = [];
let sid = 1000;
for(const cls of classNames){
  for(let i=0;i<30;i++){
    const fname = firstNames[i % firstNames.length];
    const lname = lastNames[(i*2) % lastNames.length];
    const emailLocal = `${fname.toLowerCase()}${lname.toLowerCase()}${sid}`;
    const plainPass = `${fname.toLowerCase()}${sid}123`;
    students.push({
      id: mkId(sid),
      name: `${fname} ${lname}`,
      email: `${emailLocal}@college.in`,
      password: plainPass,
      className: cls,
      profilePic: null
    });
    sid++;
  }
}

// Hash all passwords and write users.json
async function seed(){
  const all = { admins: [], teachers: [], students: [], requests: [] };
  for(const a of admins){
    a.password = await bcrypt.hash(a.password, 10);
    all.admins.push(a);
  }
  for(const t of teachers){
    t.password = await bcrypt.hash(t.password, 10);
    all.teachers.push(t);
  }
  const creds = [];
  for(const s of students){
    const plain = s.password;
    s.password = await bcrypt.hash(plain, 10);
    all.students.push(s);
    creds.push(`${s.email} -> ${plain}`);
  }
  // write
  fs.writeFileSync(usersFile, JSON.stringify(all, null, 2), 'utf8');
  fs.writeFileSync(attendanceFile, JSON.stringify({ records: [] }, null, 2), 'utf8');
  const credText = [
    "Admin: admin@college.in -> admin123",
    "",
    "Teachers (email -> password):",
    ...teachers.map(t=>`${t.email} -> ${t.email.split('@')[0].replace('_teacher','')}123`),
    "",
    "Students (email -> password):",
    ...creds
  ].join('\\n');
  fs.writeFileSync(credentialsFile, credText, 'utf8');
  console.log('✅ Seed completed. Files written to server/data/');
  console.log('  - users.json, attendance.json, credentials.txt');
  console.log('  - To re-seed, run: node scripts/seed-users.cjs');
}
seed().catch(e=>{ console.error(e); process.exit(1); });