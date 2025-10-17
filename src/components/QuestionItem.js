import React, { useState, useEffect } from "react";

function QuestionItem({ question, onDelete, onUpdate }) {
  const { id, prompt, answers, correctIndex } = question;

  // Add local state to reflect dropdown value immediately
  const [selectedIndex, setSelectedIndex] = useState(correctIndex);

  useEffect(() => {
    setSelectedIndex(correctIndex); // Keep in sync with parent prop
  }, [correctIndex]);

  function handleDelete() {
    fetch(`http://localhost:4000/questions/${id}`, {
      method: "DELETE",
    }).then(() => onDelete(id));
  }

  function handleCorrectAnswerChange(e) {
    const newIndex = parseInt(e.target.value);
    setSelectedIndex(newIndex); // Update local state immediately

    fetch(`http://localhost:4000/questions/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ correctIndex: newIndex }),
    })
      .then((res) => res.json())
      .then((updatedQuestion) => {
        onUpdate(updatedQuestion);
      });
  }

  return (
    <li>
      <h4>{prompt}</h4>
      <ul>
        {answers.map((answer, index) => (
          <li
            key={index}
            style={{
              fontWeight: index === correctIndex ? "bold" : "normal",
            }}
          >
            {answer}
          </li>
        ))}
      </ul>
      <label>
        Correct Answer:
        <select
          aria-label="Correct Answer"
          value={selectedIndex}
          onChange={handleCorrectAnswerChange}
        >
          {answers.map((_, index) => (
            <option key={index} value={index}>
              Answer {index + 1}
            </option>
          ))}
        </select>
      </label>
      <button onClick={handleDelete}>Delete Question</button>
    </li>
  );
}

export default QuestionItem;
