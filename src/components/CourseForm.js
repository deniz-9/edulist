import React, { useState } from "react";
import { useData } from "../context/DataContext";

const CourseForm = () => {
  const { courses, addCourse, deleteCourse, examResults } = useData();
  const [formData, setFormData] = useState({
    name: "",
  });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      setMessage("Lütfen ders adını girin.");
      return;
    }

    addCourse(formData);
    setFormData({
      name: "",
    });
    setMessage("Ders başarıyla eklendi!");
    setTimeout(() => setMessage(""), 3000);
  };

  const handleDeleteCourse = (courseId, courseName) => {
    const examCount = examResults.filter(
      (er) => er.course_id === courseId
    ).length;
    const warning =
      examCount > 0
        ? `Bu dersin ${examCount} adet sınav notu bulunmaktadır. Ders silindiğinde tüm sınav notları da silinecektir.`
        : "";

    if (
      window.confirm(
        `${courseName} adlı dersi silmek istediğinize emin misiniz? ${warning}Bu işlem geri alınamaz.`
      )
    ) {
      deleteCourse(courseId);
    }
  };

  const getCourseExamCount = (courseId) => {
    return examResults.filter((er) => er.course_id === courseId).length;
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">
          Yeni Ders Ekle
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ders Adı
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Örn: Matematik"
            />
          </div>
          {message && (
            <div
              className={`p-3 rounded-md ${
                message.includes("başarıyla")
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {message}
            </div>
          )}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-200 font-medium"
          >
            Ders Ekle
          </button>
        </form>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Ders Listesi</h2>
        {courses.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            Henüz ders eklenmemiş.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ders Adı
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Sınav Notu Sayısı
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    İşlem
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {courses.map((course) => (
                  <tr key={course.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {course.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {getCourseExamCount(course.id)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button
                        onClick={() =>
                          handleDeleteCourse(course.id, course.name)
                        }
                        className="text-red-600 hover:text-red-800 font-medium"
                      >
                        Sil
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseForm;
