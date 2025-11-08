import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";

const DataContext = createContext();

const STORAGE_KEYS = {
  students: "edulist_students",
  courses: "edulist_courses",
  examResults: "edulist_examResults",
};

const initialStudents = [
  {
    id: 1,
    full_name: "Ahmet Yılmaz",
    number: "2021001",
    email: "ahmet@example.com",
    gsm_number: "05551234567",
  },
  {
    id: 2,
    full_name: "Ayşe Demir",
    number: "2021002",
    email: "ayse@example.com",
    gsm_number: "05559876543",
  },
  {
    id: 3,
    full_name: "Mehmet Kaya",
    number: "2021003",
    email: "mehmet@example.com",
    gsm_number: "05555555555",
  },
];

const initialCourses = [
  { id: 1, name: "Matematik" },
  { id: 2, name: "Fizik" },
  { id: 3, name: "Kimya" },
  { id: 4, name: "Biyoloji" },
];

const initialExamResults = [
  { id: 1, student_id: 1, course_id: 1, score: 85 },
  { id: 2, student_id: 1, course_id: 1, score: 90 },
  { id: 3, student_id: 1, course_id: 1, score: 88 },
  { id: 4, student_id: 1, course_id: 2, score: 75 },
  { id: 5, student_id: 1, course_id: 2, score: 80 },
  { id: 6, student_id: 1, course_id: 2, score: 82 },
  { id: 7, student_id: 2, course_id: 1, score: 95 },
  { id: 8, student_id: 2, course_id: 1, score: 92 },
  { id: 9, student_id: 2, course_id: 1, score: 98 },
  { id: 10, student_id: 2, course_id: 3, score: 88 },
  { id: 11, student_id: 2, course_id: 3, score: 85 },
  { id: 12, student_id: 2, course_id: 3, score: 90 },
];

const loadFromStorage = (key, defaultValue) => {
  try {
    const item = localStorage.getItem(key);
    if (item) {
      return JSON.parse(item);
    }
  } catch (error) {
    console.error(`Error loading ${key} from localStorage:`, error);
  }
  return defaultValue;
};

const saveToStorage = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error saving ${key} to localStorage:`, error);
  }
};

export const DataProvider = ({ children }) => {
  const [students, setStudents] = useState(() =>
    loadFromStorage(STORAGE_KEYS.students, initialStudents)
  );
  const [courses, setCourses] = useState(() =>
    loadFromStorage(STORAGE_KEYS.courses, initialCourses)
  );
  const [examResults, setExamResults] = useState(() =>
    loadFromStorage(STORAGE_KEYS.examResults, initialExamResults)
  );

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.students, students);
  }, [students]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.courses, courses);
  }, [courses]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.examResults, examResults);
  }, [examResults]);

  const addStudent = useCallback((student) => {
    setStudents((prevStudents) => {
      const newStudent = {
        ...student,
        id: Math.max(...prevStudents.map((s) => s.id), 0) + 1,
      };
      return [...prevStudents, newStudent];
    });
  }, []);

  const addCourse = useCallback((course) => {
    setCourses((prevCourses) => {
      const newCourse = {
        ...course,
        id: Math.max(...prevCourses.map((c) => c.id), 0) + 1,
      };
      return [...prevCourses, newCourse];
    });
  }, []);

  const addExamResult = useCallback((examResult) => {
    setExamResults((prevExamResults) => {
      const newExamResult = {
        ...examResult,
        id: Math.max(...prevExamResults.map((e) => e.id), 0) + 1,
      };
      return [...prevExamResults, newExamResult];
    });
  }, []);

  const deleteStudent = useCallback((studentId) => {
    setStudents((prevStudents) =>
      prevStudents.filter((s) => s.id !== studentId)
    );
    // Öğrenci silindiğinde, o öğrenciye ait sınav notları da silinmeli
    setExamResults((prevExamResults) =>
      prevExamResults.filter((er) => er.student_id !== studentId)
    );
  }, []);

  const deleteCourse = useCallback((courseId) => {
    setCourses((prevCourses) => prevCourses.filter((c) => c.id !== courseId));
    // Ders silindiğinde, o derse ait sınav notları da silinmeli
    setExamResults((prevExamResults) =>
      prevExamResults.filter((er) => er.course_id !== courseId)
    );
  }, []);

  const deleteExamResult = useCallback((examResultId) => {
    setExamResults((prevExamResults) =>
      prevExamResults.filter((er) => er.id !== examResultId)
    );
  }, []);

  const getCompletedCourses = useCallback(
    (studentId) => {
      const studentResults = examResults.filter(
        (er) => er.student_id === studentId
      );
      const courseCounts = {};

      studentResults.forEach((result) => {
        if (!courseCounts[result.course_id]) {
          courseCounts[result.course_id] = [];
        }
        courseCounts[result.course_id].push(result.score);
      });

      const completed = [];
      Object.keys(courseCounts).forEach((courseId) => {
        if (courseCounts[courseId].length >= 3) {
          const course = courses.find((c) => c.id === parseInt(courseId));
          const scores = courseCounts[courseId];
          const average =
            scores.reduce((sum, score) => sum + score, 0) / scores.length;
          completed.push({
            course,
            average: average.toFixed(2),
            scores,
          });
        }
      });

      return completed;
    },
    [examResults, courses]
  );

  const value = useMemo(
    () => ({
      students,
      courses,
      examResults,
      addStudent,
      addCourse,
      addExamResult,
      deleteStudent,
      deleteCourse,
      deleteExamResult,
      getCompletedCourses,
    }),
    [
      students,
      courses,
      examResults,
      addStudent,
      addCourse,
      addExamResult,
      deleteStudent,
      deleteCourse,
      deleteExamResult,
      getCompletedCourses,
    ]
  );

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
};
