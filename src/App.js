import React, { useState } from "react";
import { DataProvider } from "./context/DataContext";
import StudentForm from "./components/StudentForm";
import CourseForm from "./components/CourseForm";
import ExamResultForm from "./components/ExamResultForm";
import StudentList from "./components/StudentList";
import { FaUsers, FaUserPlus, FaBook, FaClipboardList } from "react-icons/fa";

function App() {
  const [activeTab, setActiveTab] = useState("students");

  const tabs = [
    { id: "students", label: "Öğrenci Listesi", icon: FaUsers },
    { id: "addStudent", label: "Öğrenci Ekle", icon: FaUserPlus },
    { id: "addCourse", label: "Ders Ekle", icon: FaBook },
    { id: "addExam", label: "Sınav Notu Ekle", icon: FaClipboardList },
  ];

  return (
    <DataProvider>
      <div className="min-h-screen bg-gray-100">
        <header className="bg-white shadow-md">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <h1 className="text-3xl font-bold text-gray-900">EduList</h1>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-6">
            <nav className="flex space-x-2 bg-white p-2 rounded-lg shadow-sm">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 px-4 py-2 rounded-md font-medium transition duration-200 flex items-center justify-center ${
                    activeTab === tab.id
                      ? "bg-blue-600 text-white shadow-md"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  <tab.icon className="mr-2" />
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="mt-6">
            {activeTab === "students" && <StudentList />}
            {activeTab === "addStudent" && <StudentForm />}
            {activeTab === "addCourse" && <CourseForm />}
            {activeTab === "addExam" && <ExamResultForm />}
          </div>
        </main>

        <footer className="bg-white border-t mt-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <p className="text-center text-gray-600 text-sm"></p>
          </div>
        </footer>
      </div>
    </DataProvider>
  );
}

export default App;
