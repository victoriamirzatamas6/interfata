import React from 'react';

function FeedbackTable({ feedbacks }) {
  // Funcție helper pentru formatarea datei
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="feedback-table-container">
      <h2>Feedback</h2>
      <table className="feedback-table">
        <thead>
          <tr>
            <th>User</th>
            <th>Feedback</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {feedbacks.map(feedback => (
            <tr key={feedback._id}>
              <td>{feedback.username}</td>
              <td>{feedback.text}</td>
              <td>{formatDate(feedback.createdAt)}</td> {/* Aici aplicăm formatarea */}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default FeedbackTable;
