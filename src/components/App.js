import React, { useState, useEffect } from "react";
import AdminNavBar from "./AdminNavBar";
import QuestionForm from "./QuestionForm";
import QuestionList from "./QuestionList";

function App() {
  const [page, setPage] = useState("List");
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    fetch("http://localhost:4000/questions")
      .then((r) => r.json())
      .then(setQuestions);
  }, []);

  function addQuestion(newQuestion) {
    setQuestions([...questions, newQuestion]);
  }

  function updateQuestion(updated) {
    const updatedQuestions = questions.map((q) =>
      q.id === updated.id ? updated : q
    );
    setQuestions(updatedQuestions);
  }

  function deleteQuestion(id) {
    setQuestions(questions.filter((q) => q.id !== id));
  }

  return (
    <main>
      <AdminNavBar onChangePage={setPage} />
      {page === "Form" ? (
        <QuestionForm onAddQuestion={addQuestion} />
      ) : (
        <QuestionList
          questions={questions}
          onUpdate={updateQuestion}
          onDelete={deleteQuestion}
        />
      )}
    </main>
  );
}

export default App;
