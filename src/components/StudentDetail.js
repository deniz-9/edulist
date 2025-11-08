import React from 'react';
import { useData } from '../context/DataContext';

const StudentDetail = ({ student }) => {
  const { examResults, courses, getCompletedCourses, deleteExamResult } = useData();
  
  const studentResults = examResults.filter(er => er.student_id === student.id);
  const completedCourses = getCompletedCourses(student.id);

  const getCourseName = (courseId) => {
    const course = courses.find(c => c.id === courseId);
    return course ? course.name : 'Bilinmeyen Ders';
  };

  const getCourseResults = (courseId) => {
    return studentResults.filter(er => er.course_id === courseId);
  };

  const courseStats = {};
  studentResults.forEach(result => {
    if (!courseStats[result.course_id]) {
      courseStats[result.course_id] = [];
    }
    courseStats[result.course_id].push(result.score);
  });

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Öğrenci Detayı</h2>
      
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-lg font-semibold mb-2 text-gray-700">Kişisel Bilgiler</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <span className="text-sm text-gray-600">Ad Soyad:</span>
            <p className="font-medium text-gray-900">{student.full_name}</p>
          </div>
          <div>
            <span className="text-sm text-gray-600">Öğrenci Numarası:</span>
            <p className="font-medium text-gray-900">{student.number}</p>
          </div>
          <div>
            <span className="text-sm text-gray-600">E-posta:</span>
            <p className="font-medium text-gray-900">{student.email}</p>
          </div>
          <div>
            <span className="text-sm text-gray-600">GSM Numarası:</span>
            <p className="font-medium text-gray-900">{student.gsm_number}</p>
          </div>
        </div>
      </div>

      {completedCourses.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3 text-gray-700">Tamamlanan Dersler ve Ortalamalar</h3>
          <div className="space-y-3">
            {completedCourses.map((item, index) => (
              <div key={index} className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-semibold text-gray-900">{item.course.name}</h4>
                    <p className="text-sm text-gray-600">
                      Notlar: {item.scores.join(', ')}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Ortalama</p>
                    <p className="text-2xl font-bold text-green-600">{item.average}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div>
        <h3 className="text-lg font-semibold mb-3 text-gray-700">Tüm Sınav Sonuçları</h3>
        {studentResults.length === 0 ? (
          <p className="text-gray-500">Henüz sınav sonucu bulunmamaktadır.</p>
        ) : (
          <div className="space-y-4">
            {Object.keys(courseStats).map((courseId) => {
              const courseIdNum = parseInt(courseId);
              const results = getCourseResults(courseIdNum);
              const isCompleted = results.length >= 3;
              
              return (
                <div
                  key={courseId}
                  className={`p-4 border rounded-lg ${
                    isCompleted
                      ? 'bg-green-50 border-green-200'
                      : 'bg-gray-50 border-gray-200'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold text-gray-900">
                      {getCourseName(courseIdNum)}
                    </h4>
                    {isCompleted && (
                      <span className="px-2 py-1 text-xs font-semibold bg-green-600 text-white rounded">
                        Tamamlandı
                      </span>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {results.map((result) => (
                      <div
                        key={result.id}
                        className="flex items-center gap-1 px-3 py-1 bg-white border border-gray-300 rounded text-sm font-medium"
                      >
                        <span>{result.score}</span>
                        <button
                          onClick={() => {
                            if (window.confirm(`Bu sınav notunu (${result.score}) silmek istediğinize emin misiniz?`)) {
                              deleteExamResult(result.id);
                            }
                          }}
                          className="text-red-600 hover:text-red-800 ml-1"
                          title="Notu Sil"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                  {results.length > 0 && (
                    <p className="text-sm text-gray-600 mt-2">
                      Toplam: {results.length} not
                      {results.length < 3 && ` (${3 - results.length} not daha tamamlanması gerekiyor)`}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentDetail;

