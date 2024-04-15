import React, { useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function FeedbackForm({ username }) {
    const [feedback, setFeedback] = useState('');

    const handleSubmit = async (event) => {
      event.preventDefault();
      if (!username) {
        toast.error('Username is missing. Please log in.');
        return;
      }
      try {
        const response = await axios.post('http://localhost:3000/feedback', {
          text: feedback,
          username // Aici se utilizează prop-ul username
        });
        console.log('Feedback submitted successfully', response.data);
        setFeedback(''); // Curăță formularul după trimitere
        toast.success('Feedback submitted successfully!');
      } catch (error) {
        console.error('Error submitting feedback:', error);
        toast.error('Failed to submit feedback. Please try again.');
      }
    };
  
    return (
      <>
        <ToastContainer position="top-center" autoClose={5000} />
        <form onSubmit={handleSubmit}>
          <textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="Type your feedback here..."
            required
          />
          <button type="submit">Submit Feedback</button>
        </form>
      </>
    );
}

export default FeedbackForm;
