import React, { useState } from "react";
import { useData } from "../context/DataContext";
import { FaArrowLeft, FaEdit, FaTrash, FaPlus, FaSave } from "react-icons/fa";

const CourseForm = () => {
  const { courses, addCourse, deleteCourse, updateCourse, examResults } =
    useData();
  const [formData, setFormData] = useState({
    name: "",
  });
  const [message, setMessage] = useState("");
  const [editingCourse, setEditingCourse] = useState(null);
  const [editFormData, setEditFormData] = useState({ name: "" });

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

  const handleEditClick = (course) => {
    setEditingCourse(course);
    setEditFormData({ name: course.name });
    setMessage("");
  };

  const handleEditChange = (e) => {
    setEditFormData({ name: e.target.value });
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();

    if (!editFormData.name.trim()) {
      setMessage("Lütfen ders adını girin.");
      return;
    }

    // Duplicate kontrolü - mevcut dersi hariç tut
    const otherCourses = courses.filter((c) => c.id !== editingCourse.id);
    const isDuplicate = otherCourses.some(
      (c) => c.name.toLowerCase() === editFormData.name.toLowerCase().trim()
    );

    if (isDuplicate) {
      setMessage("Bu ders adı zaten kullanılıyor.");
      return;
    }

    updateCourse(editingCourse.id, { name: editFormData.name.trim() });
    setEditingCourse(null);
    setEditFormData({ name: "" });
    setMessage("Ders başarıyla güncellendi!");
    setTimeout(() => setMessage(""), 3000);
  };

  const handleCancelEdit = () => {
    setEditingCourse(null);
    setEditFormData({ name: "" });
    setMessage("");
  };

  return (
    <div className="space-y-6">
      {editingCourse ? (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">
            Ders Düzenle
          </h2>
          <button
            onClick={handleCancelEdit}
            className="mb-4 text-blue-600 hover:text-blue-800 font-medium flex items-center"
          >
            <FaArrowLeft className="mr-2" />
            Listeye Dön
          </button>
          <form onSubmit={handleEditSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ders Adı
              </label>
              <input
                type="text"
                name="name"
                value={editFormData.name}
                onChange={handleEditChange}
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
            <div className="flex space-x-3">
              <button
                type="submit"
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-200 font-medium flex items-center justify-center"
              >
                <FaSave className="mr-2" />
                Güncelle
              </button>
              <button
                type="button"
                onClick={handleCancelEdit}
                className="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-300 transition duration-200 font-medium"
              >
                İptal
              </button>
            </div>
          </form>
        </div>
      ) : (
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
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-200 font-medium flex items-center justify-center"
            >
              <FaPlus className="mr-2" />
              Ders Ekle
            </button>
          </form>
        </div>
      )}

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
                      <div className="flex space-x-3">
                        <button
                          onClick={() => handleEditClick(course)}
                          className="text-green-600 hover:text-green-800 font-medium flex items-center"
                        >
                          <FaEdit className="mr-1" />
                          Düzenle
                        </button>
                        <button
                          onClick={() =>
                            handleDeleteCourse(course.id, course.name)
                          }
                          className="text-red-600 hover:text-red-800 font-medium flex items-center"
                        >
                          <FaTrash className="mr-1" />
                          Sil
                        </button>
                      </div>
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
