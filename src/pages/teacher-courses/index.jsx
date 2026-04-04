import React, { useEffect, useMemo, useState } from 'react';
import { Helmet } from 'react-helmet';
import Header from '../../components/ui/Header';
import Icon from '../../components/AppIcon';
import {
  addSection,
  archiveCourse,
  createCourse,
  getCourses,
  importRosterCsv,
  moveStudentToSection,
} from '../../lib/courseService';

const TeacherCourses = () => {
  const [courses, setCourses] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [newCourse, setNewCourse] = useState({ name: '', code: '', term: '' });
  const [newSectionName, setNewSectionName] = useState('');
  const [rosterCsv, setRosterCsv] = useState('');
  const [notice, setNotice] = useState('');

  const refreshCourses = async () => {
    const result = await getCourses({ includeArchived: true });
    if (result.success) {
      setCourses(result.courses);
      if (!selectedCourseId && result.courses.length > 0) {
        setSelectedCourseId(result.courses[0].id);
      }
      if (selectedCourseId && !result.courses.some((course) => course.id === selectedCourseId)) {
        setSelectedCourseId(result.courses[0]?.id || '');
      }
    }
  };

  useEffect(() => {
    refreshCourses();
    // Intentionally run once to initialize page state.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const selectedCourse = useMemo(() => {
    return courses.find((course) => course.id === selectedCourseId) || null;
  }, [courses, selectedCourseId]);

  const sectionNameById = useMemo(() => {
    if (!selectedCourse) return new Map();
    return new Map(selectedCourse.sections.map((section) => [section.id, section.name]));
  }, [selectedCourse]);

  const handleCreateCourse = async () => {
    const result = await createCourse(newCourse);
    if (!result.success) {
      setNotice(result.error || 'Failed to create course.');
      return;
    }

    setNotice('Course created successfully.');
    setNewCourse({ name: '', code: '', term: '' });
    await refreshCourses();
    setSelectedCourseId(result.course.id);
  };

  const handleArchiveCourse = async (courseId) => {
    await archiveCourse(courseId);
    setNotice('Course archived.');
    await refreshCourses();
  };

  const handleAddSection = async () => {
    if (!selectedCourse) return;
    const result = await addSection(selectedCourse.id, newSectionName);
    if (!result.success) {
      setNotice(result.error || 'Failed to add section.');
      return;
    }

    setNotice('Section added.');
    setNewSectionName('');
    await refreshCourses();
  };

  const handleImportRoster = async () => {
    if (!selectedCourse) return;
    const result = await importRosterCsv(selectedCourse.id, rosterCsv);
    if (!result.success) {
      setNotice(result.error || 'Failed to import roster.');
      return;
    }

    setNotice('Roster imported successfully.');
    setRosterCsv('');
    await refreshCourses();
  };

  const handleMoveStudent = async (studentId, sectionId) => {
    if (!selectedCourse) return;
    await moveStudentToSection(selectedCourse.id, studentId, sectionId);
    await refreshCourses();
  };

  const activeCount = courses.filter((course) => course.status === 'active').length;
  const archivedCount = courses.filter((course) => course.status === 'archived').length;

  return (
    <>
      <Helmet>
        <title>Teacher Courses - CodeCampus</title>
      </Helmet>

      <div className="min-h-screen bg-[#f7f8fa]">
        <Header />

        <main className="pt-16">
          <div className="max-w-[1200px] mx-auto px-5 py-7 space-y-5">
            <div>
              <h1 className="text-[22px] font-semibold text-slate-900 tracking-tight">Courses and Class Management</h1>
              <p className="text-[13px] text-slate-500 mt-0.5">Create courses, manage sections, invite students, import roster, and move students between sections.</p>
            </div>

            {notice && (
              <div className="bg-blue-50 border border-blue-200 text-blue-700 rounded-lg px-4 py-2.5 text-[13px]">
                {notice}
              </div>
            )}

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="bg-white rounded-lg border border-slate-200/80 px-4 py-3.5"><p className="text-[11px] text-slate-400">Total Courses</p><p className="text-[20px] font-semibold text-slate-900">{courses.length}</p></div>
              <div className="bg-white rounded-lg border border-slate-200/80 px-4 py-3.5"><p className="text-[11px] text-slate-400">Active</p><p className="text-[20px] font-semibold text-emerald-600">{activeCount}</p></div>
              <div className="bg-white rounded-lg border border-slate-200/80 px-4 py-3.5"><p className="text-[11px] text-slate-400">Archived</p><p className="text-[20px] font-semibold text-slate-700">{archivedCount}</p></div>
              <div className="bg-white rounded-lg border border-slate-200/80 px-4 py-3.5"><p className="text-[11px] text-slate-400">Students</p><p className="text-[20px] font-semibold text-indigo-600">{courses.reduce((sum, c) => sum + c.students.length, 0)}</p></div>
            </div>

            <div className="grid lg:grid-cols-[380px_1fr] gap-4">
              <div className="space-y-4">
                <div className="bg-white rounded-lg border border-slate-200/80 p-4">
                  <h2 className="text-[14px] font-semibold text-slate-800 mb-3 flex items-center gap-1.5">
                    <Icon name="PlusCircle" size={14} className="text-blue-600" /> Create Course
                  </h2>
                  <div className="space-y-2.5">
                    <input
                      type="text"
                      value={newCourse.name}
                      onChange={(e) => setNewCourse((prev) => ({ ...prev, name: e.target.value }))}
                      placeholder="Course name"
                      className="w-full border border-slate-300 rounded-md px-3 py-2 text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="text"
                      value={newCourse.code}
                      onChange={(e) => setNewCourse((prev) => ({ ...prev, code: e.target.value }))}
                      placeholder="Course code (e.g. CS301)"
                      className="w-full border border-slate-300 rounded-md px-3 py-2 text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="text"
                      value={newCourse.term}
                      onChange={(e) => setNewCourse((prev) => ({ ...prev, term: e.target.value }))}
                      placeholder="Term/Semester"
                      className="w-full border border-slate-300 rounded-md px-3 py-2 text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button onClick={handleCreateCourse} className="w-full px-3 py-2 bg-blue-600 text-white text-[12px] font-medium rounded-md hover:bg-blue-700 transition-colors">
                      Create Course
                    </button>
                  </div>
                </div>

                <div className="bg-white rounded-lg border border-slate-200/80 overflow-hidden">
                  <div className="px-4 py-3 border-b border-slate-100">
                    <h2 className="text-[14px] font-semibold text-slate-800">Courses</h2>
                  </div>
                  <div className="divide-y divide-slate-100 max-h-[460px] overflow-y-auto">
                    {courses.map((course) => (
                      <button
                        key={course.id}
                        onClick={() => setSelectedCourseId(course.id)}
                        className={`w-full text-left px-4 py-3 hover:bg-slate-50 transition-colors ${selectedCourseId === course.id ? 'bg-slate-50' : ''}`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <div>
                            <p className="text-[13px] font-medium text-slate-900">{course.name}</p>
                            <p className="text-[11px] text-slate-500">{course.code} {course.term ? `• ${course.term}` : ''}</p>
                          </div>
                          <span className={`text-[10px] px-1.5 py-0.5 rounded ${course.status === 'active' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>
                            {course.status}
                          </span>
                        </div>
                      </button>
                    ))}
                    {courses.length === 0 && (
                      <div className="px-4 py-8 text-center text-[12px] text-slate-500">
                        No courses yet.
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                {!selectedCourse ? (
                  <div className="bg-white rounded-lg border border-slate-200/80 p-10 text-center text-slate-500 text-[13px]">
                    Select a course to manage sections and roster.
                  </div>
                ) : (
                  <>
                    <div className="bg-white rounded-lg border border-slate-200/80 p-4">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                        <div>
                          <h2 className="text-[16px] font-semibold text-slate-900">{selectedCourse.name}</h2>
                          <p className="text-[12px] text-slate-500">{selectedCourse.code} {selectedCourse.term ? `• ${selectedCourse.term}` : ''}</p>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleArchiveCourse(selectedCourse.id)}
                            className="px-3 py-1.5 text-[11px] font-medium rounded border border-red-200 text-red-700 hover:bg-red-50 transition-colors"
                          >
                            Archive Course
                          </button>
                        </div>
                      </div>

                      <div className="mt-4 grid sm:grid-cols-2 gap-3">
                        <div className="bg-slate-50 rounded-md border border-slate-200 p-3">
                          <p className="text-[11px] text-slate-500">Invite Code</p>
                          <p className="text-[13px] font-semibold text-slate-800 mt-0.5">{selectedCourse.inviteCode}</p>
                        </div>
                        <div className="bg-slate-50 rounded-md border border-slate-200 p-3">
                          <p className="text-[11px] text-slate-500">Invite Link</p>
                          <p className="text-[12px] font-medium text-blue-700 mt-0.5 break-all">https://codecampus.app/join?code={selectedCourse.inviteCode}</p>
                        </div>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="bg-white rounded-lg border border-slate-200/80 p-4">
                        <h3 className="text-[14px] font-semibold text-slate-800 mb-2 flex items-center gap-1.5">
                          <Icon name="Layers" size={14} className="text-indigo-500" /> Sections
                        </h3>
                        <div className="space-y-2 mb-3">
                          {selectedCourse.sections.map((section) => (
                            <div key={section.id} className="flex items-center justify-between px-3 py-2 rounded-md border border-slate-200 text-[12px]">
                              <span className="text-slate-700">{section.name}</span>
                              <span className="text-slate-500">{selectedCourse.students.filter((student) => student.sectionId === section.id).length} students</span>
                            </div>
                          ))}
                        </div>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={newSectionName}
                            onChange={(e) => setNewSectionName(e.target.value)}
                            placeholder="New section name"
                            className="flex-1 border border-slate-300 rounded-md px-3 py-2 text-[12px] focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                          <button onClick={handleAddSection} className="px-3 py-2 bg-indigo-600 text-white text-[12px] rounded-md hover:bg-indigo-700 transition-colors">
                            Add
                          </button>
                        </div>
                      </div>

                      <div className="bg-white rounded-lg border border-slate-200/80 p-4">
                        <h3 className="text-[14px] font-semibold text-slate-800 mb-2 flex items-center gap-1.5">
                          <Icon name="Upload" size={14} className="text-purple-500" /> Import Roster (CSV)
                        </h3>
                        <p className="text-[11px] text-slate-500 mb-2">Format: name,email,section</p>
                        <textarea
                          value={rosterCsv}
                          onChange={(e) => setRosterCsv(e.target.value)}
                          rows={6}
                          placeholder="name,email,section&#10;Aarav Shah,aarav@example.com,Section A&#10;Siya Patil,siya@example.com,Section B"
                          className="w-full border border-slate-300 rounded-md px-3 py-2 text-[12px] focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                        />
                        <button onClick={handleImportRoster} className="mt-2 px-3 py-2 bg-purple-600 text-white text-[12px] rounded-md hover:bg-purple-700 transition-colors">
                          Import CSV
                        </button>
                      </div>
                    </div>

                    <div className="bg-white rounded-lg border border-slate-200/80 overflow-hidden">
                      <div className="px-4 py-3 border-b border-slate-100">
                        <h3 className="text-[14px] font-semibold text-slate-800">Roster</h3>
                      </div>
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="bg-slate-50 border-b border-slate-200">
                              <th className="text-left text-[11px] font-semibold text-slate-500 px-4 py-3">Student</th>
                              <th className="text-left text-[11px] font-semibold text-slate-500 px-4 py-3">Email</th>
                              <th className="text-left text-[11px] font-semibold text-slate-500 px-4 py-3">Status</th>
                              <th className="text-left text-[11px] font-semibold text-slate-500 px-4 py-3">Section</th>
                            </tr>
                          </thead>
                          <tbody>
                            {selectedCourse.students.map((student) => (
                              <tr key={student.id} className="border-b border-slate-100 hover:bg-slate-50/60">
                                <td className="px-4 py-3 text-[13px] font-medium text-slate-900">{student.name}</td>
                                <td className="px-4 py-3 text-[12px] text-slate-600">{student.email}</td>
                                <td className="px-4 py-3">
                                  <span className="text-[11px] px-2 py-0.5 rounded bg-emerald-50 text-emerald-700">{student.status}</span>
                                </td>
                                <td className="px-4 py-3">
                                  <select
                                    value={student.sectionId}
                                    onChange={(e) => handleMoveStudent(student.id, e.target.value)}
                                    className="border border-slate-300 rounded px-2 py-1 text-[12px] focus:outline-none focus:ring-2 focus:ring-blue-500"
                                  >
                                    {selectedCourse.sections.map((section) => (
                                      <option key={section.id} value={section.id}>{section.name}</option>
                                    ))}
                                  </select>
                                </td>
                              </tr>
                            ))}
                            {selectedCourse.students.length === 0 && (
                              <tr>
                                <td colSpan={4} className="px-4 py-10 text-center text-[13px] text-slate-500">
                                  No students in roster yet.
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                      <div className="px-4 py-2 text-[11px] text-slate-500 border-t border-slate-100">
                        Total students: {selectedCourse.students.length} • Sections: {selectedCourse.sections.length} • Active section: {sectionNameById.get(selectedCourse.students[0]?.sectionId) || selectedCourse.sections[0]?.name || 'None'}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default TeacherCourses;
