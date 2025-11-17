const axios = require('axios');

async function run() {
  try {
    const resp = await axios.post('http://localhost:5000/api/teacher/mark', {
      teacherEmail: 'toc_teacher@college.in',
      subject: 'Math',
      className: '5A',
      studentEmail: 'aarav@college.in',
      date: new Date().toISOString().slice(0,10),
      present: true
    }, { timeout: 10000 });
    console.log('API response:', resp.data);
  } catch (e) {
    if (e.response) console.error('API error:', e.response.status, e.response.data);
    else console.error('Request failed:', e.message);
  }
}

run();
