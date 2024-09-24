import React, { useState } from 'react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    contactNumber: '',
    category: '',
    message: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false); // Lazy loading state

  // Email validation function
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Contact number validation function (10 digits)
  const validateContactNumber = (contactNumber) => {
    const phoneRegex = /^[0-9]{10}$/;
    return phoneRegex.test(contactNumber);
  };

  // Handle form field changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setErrors({
      ...errors,
      [e.target.name]: '',
    });
  };

  // Validate the entire form
  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    // Validate name
    if (!formData.name) {
      newErrors.name = 'Name is required';
      isValid = false;
    }

    // Validate email
    if (!validateEmail(formData.email)) {
      newErrors.email = 'Invalid email format';
      isValid = false;
    }

    // Validate contact number
    if (!validateContactNumber(formData.contactNumber)) {
      newErrors.contactNumber = 'Contact number must be a 10-digit number';
      isValid = false;
    }

    // Validate category
    if (!formData.category) {
      newErrors.category = 'Please select a category';
      isValid = false;
    }

    // Validate message
    if (!formData.message) {
      newErrors.message = 'Message is required';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if the form is valid
    if (!validateForm()) {
      toast.error('Please fill in all required fields correctly.');
      return;
    }

    setIsSubmitting(true); // Start lazy loading

    try {
      // Prepare the payload for the API
      const payload = {
        user_name: formData.name,
        contact_no: formData.contactNumber,
        email_id: formData.email,
        category: formData.category,
        message: formData.message
      };

      // Make POST request with Axios
      const response = await axios.post('https://truck.truckmessage.com/contact_us', payload);

      if (response.status === 200) {
        toast.success('Form submitted successfully!');
        // Reset form fields after successful submission
        setFormData({
          name: '',
          email: '',
          contactNumber: '',
          category: '',
          message: ''
        });
      } else {
        toast.error('Failed to submit the form. Please try again later.');
      }
    } catch (error) {
      toast.error('An error occurred. Please try again.');
      console.error(error);
    } finally {
      setIsSubmitting(false); // End lazy loading
    }
  };

  return (
    <div className="container mt-5">
      <Toaster position="top-right" />
      <h2>Contact Us</h2>
      <form onSubmit={handleSubmit}>
        <div className="row">
          <div className="col-md-6">
            <div className="mb-2">
              <label htmlFor="name" className="form-label">Name</label>
              <input
                type="text"
                className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
              {errors.name && <div className="invalid-feedback">{errors.name}</div>}
            </div>
          </div>

          <div className="col-md-6">
            <div className="mb-2">
              <label htmlFor="contactNumber" className="form-label">Contact Number</label>
              <input
                type="number"
                className={`form-control ${errors.contactNumber ? 'is-invalid' : ''}`}
                id="contactNumber"
                name="contactNumber"
                value={formData.contactNumber}
                onChange={handleChange}
                required
              />
              {errors.contactNumber && <div className="invalid-feedback">{errors.contactNumber}</div>}
            </div>
          </div>
        </div>

        <div className="mb-2">
          <label htmlFor="email" className="form-label">Email</label>
          <input
            type="email"
            className={`form-control ${errors.email ? 'is-invalid' : ''}`}
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          {errors.email && <div className="invalid-feedback">{errors.email}</div>}
        </div>

        <fieldset className="mb-2">
          <legend className="col-form-label"><strong>Category</strong></legend>
          <div className="row">
            {['Lorry Owner', 'Logistics', 'Lorry Contractors', 'Load Booking Agent', 'Driver', 'Lorry Buy & Sell Dealer/Owner'].map((category) => (
              <div className="col-md-4" key={category}>
                <div className="form-check">
                  <input
                    className={`form-check-input ${errors.category ? 'is-invalid' : ''}`}
                    type="radio"
                    id={category}
                    name="category"
                    value={category}
                    checked={formData.category === category}
                    onChange={handleChange}
                    required
                  />
                  <label className="form-check-label" htmlFor={category}>{category}</label>
                </div>
              </div>
            ))}
          </div>
          {errors.category && <div className="invalid-feedback d-block">{errors.category}</div>}
        </fieldset>

        <div className="mb-3">
          <label htmlFor="message" className="form-label">Message</label>
          <textarea
            className={`form-control ${errors.message ? 'is-invalid' : ''}`}
            id="message"
            name="message"
            rows="4"
            value={formData.message}
            onChange={handleChange}
            required
          />
          {errors.message && <div className="invalid-feedback">{errors.message}</div>}
        </div>

        <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
          {isSubmitting ? 'Submitting...' : 'Submit'}
        </button>
      </form>
    </div>
  );
};

export default ContactForm;
