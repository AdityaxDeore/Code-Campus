const COURSES_STORAGE_KEY = 'codecampus_courses_v1';

const nowIso = () => new Date().toISOString();

const makeId = (prefix = 'id') => `${prefix}_${Math.random().toString(36).slice(2, 10)}`;

const seedCourses = [
  {
    id: 'course_cs201',
    name: 'Data Structures and Algorithms',
    code: 'CS201',
    term: 'Sem 4',
    status: 'active',
    inviteCode: 'CS201-2026',
    createdAt: nowIso(),
    sections: [
      { id: 'sec_cs201_a', name: 'Section A' },
      { id: 'sec_cs201_b', name: 'Section B' },
    ],
    students: [
      { id: 'stu_1', name: 'Aditya Deore', email: 'aditya@codecampus.edu', sectionId: 'sec_cs201_a', status: 'active' },
      { id: 'stu_2', name: 'Chinmay Ahire', email: 'chinmay@codecampus.edu', sectionId: 'sec_cs201_a', status: 'active' },
      { id: 'stu_3', name: 'Rahul Sharma', email: 'rahul@codecampus.edu', sectionId: 'sec_cs201_b', status: 'active' },
    ],
  },
  {
    id: 'course_cs202',
    name: 'Database Systems',
    code: 'CS202',
    term: 'Sem 4',
    status: 'active',
    inviteCode: 'CS202-2026',
    createdAt: nowIso(),
    sections: [
      { id: 'sec_cs202_a', name: 'Section A' },
    ],
    students: [
      { id: 'stu_4', name: 'Sneha Joshi', email: 'sneha@codecampus.edu', sectionId: 'sec_cs202_a', status: 'active' },
      { id: 'stu_5', name: 'Prathamesh Pawar', email: 'prathamesh@codecampus.edu', sectionId: 'sec_cs202_a', status: 'active' },
    ],
  },
];

const loadCourses = () => {
  try {
    const raw = localStorage.getItem(COURSES_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(COURSES_STORAGE_KEY, JSON.stringify(seedCourses));
      return [...seedCourses];
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [...seedCourses];
  } catch {
    return [...seedCourses];
  }
};

const saveCourses = (courses) => {
  localStorage.setItem(COURSES_STORAGE_KEY, JSON.stringify(courses));
};

export const getCourses = async ({ includeArchived = false } = {}) => {
  const courses = loadCourses();
  return {
    success: true,
    courses: includeArchived ? courses : courses.filter((course) => course.status !== 'archived'),
  };
};

export const createCourse = async ({ name, code, term = '' }) => {
  const courses = loadCourses();
  const normalizedCode = (code || '').trim().toUpperCase();

  if (!name || !normalizedCode) {
    return { success: false, error: 'Course name and code are required.' };
  }

  if (courses.some((course) => course.code === normalizedCode)) {
    return { success: false, error: 'Course code already exists.' };
  }

  const next = {
    id: makeId('course'),
    name: name.trim(),
    code: normalizedCode,
    term: term.trim(),
    status: 'active',
    inviteCode: `${normalizedCode}-${new Date().getFullYear()}`,
    createdAt: nowIso(),
    sections: [{ id: makeId('section'), name: 'Section A' }],
    students: [],
  };

  const updated = [next, ...courses];
  saveCourses(updated);
  return { success: true, course: next };
};

export const updateCourse = async (courseId, patch) => {
  const courses = loadCourses();
  const next = courses.map((course) => {
    if (course.id !== courseId) return course;
    return {
      ...course,
      ...patch,
      code: patch.code ? patch.code.trim().toUpperCase() : course.code,
      name: patch.name ? patch.name.trim() : course.name,
      term: typeof patch.term === 'string' ? patch.term.trim() : course.term,
      updatedAt: nowIso(),
    };
  });
  saveCourses(next);
  return { success: true };
};

export const archiveCourse = async (courseId) => {
  return updateCourse(courseId, { status: 'archived' });
};

export const addSection = async (courseId, sectionName) => {
  if (!sectionName || !sectionName.trim()) {
    return { success: false, error: 'Section name is required.' };
  }

  const courses = loadCourses();
  const next = courses.map((course) => {
    if (course.id !== courseId) return course;
    return {
      ...course,
      sections: [...course.sections, { id: makeId('section'), name: sectionName.trim() }],
      updatedAt: nowIso(),
    };
  });

  saveCourses(next);
  return { success: true };
};

const parseCsv = (csvText) => {
  return csvText
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => line.split(',').map((cell) => cell.trim()));
};

export const importRosterCsv = async (courseId, csvText) => {
  if (!csvText || !csvText.trim()) {
    return { success: false, error: 'CSV content is empty.' };
  }

  const rows = parseCsv(csvText);
  if (rows.length === 0) {
    return { success: false, error: 'No valid rows found.' };
  }

  let dataRows = rows;
  const header = rows[0].map((h) => h.toLowerCase());
  const hasHeader = header.includes('name') || header.includes('email') || header.includes('section');
  if (hasHeader) dataRows = rows.slice(1);

  const courses = loadCourses();
  const next = courses.map((course) => {
    if (course.id !== courseId) return course;

    const sectionByName = new Map(course.sections.map((section) => [section.name.toLowerCase(), section.id]));
    const newSections = [...course.sections];
    const newStudents = [...course.students];

    dataRows.forEach((row) => {
      const [nameRaw, emailRaw, sectionRaw] = row;
      const name = (nameRaw || '').trim();
      const email = (emailRaw || '').trim().toLowerCase();
      if (!name || !email) return;

      const sectionName = (sectionRaw || 'Section A').trim();
      let sectionId = sectionByName.get(sectionName.toLowerCase());
      if (!sectionId) {
        sectionId = makeId('section');
        sectionByName.set(sectionName.toLowerCase(), sectionId);
        newSections.push({ id: sectionId, name: sectionName });
      }

      const alreadyExists = newStudents.some((student) => student.email === email);
      if (alreadyExists) return;

      newStudents.push({
        id: makeId('student'),
        name,
        email,
        sectionId,
        status: 'active',
      });
    });

    return {
      ...course,
      sections: newSections,
      students: newStudents,
      updatedAt: nowIso(),
    };
  });

  saveCourses(next);
  return { success: true };
};

export const moveStudentToSection = async (courseId, studentId, sectionId) => {
  const courses = loadCourses();
  const next = courses.map((course) => {
    if (course.id !== courseId) return course;
    return {
      ...course,
      students: course.students.map((student) => {
        if (student.id !== studentId) return student;
        return { ...student, sectionId };
      }),
      updatedAt: nowIso(),
    };
  });

  saveCourses(next);
  return { success: true };
};
