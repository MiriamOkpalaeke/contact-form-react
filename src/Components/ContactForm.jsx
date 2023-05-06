import React, { useState } from "react";
import { useFormik } from "formik";
import * as yup from "yup"; //for validation
import axios from "axios";
import { nanoid } from "nanoid";
import loadingIcon from '../spinner.gif'

const ContactForm = () => {
  //success state
  const [submitted, setSubmitted] = useState(null);

  // error state
  const [error, setError] = useState(null);

  // loading state
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
    //to handle the validation of the fields
    validationSchema: yup.object({
      name: yup.string().required("Name is Required"), //setting the rule
      email: yup.string().email("Invalid email address").required("Required"),
      message: yup.string().required("Please type a message"),
    }),

    // to handle submit

    onSubmit: async (values, actions) => {
      try {
        setIsSubmitting(true);
        const response = await axios.post(
          "https://my-json-server.typicode.com/tundeojediran/contacts-api-server/inquiries",
          { id: nanoid(), ...values }
        ); // to post the form to API

        console.log(response);
        setSubmitted("Form submitted successfully"); //message to show it was successful
        setError(null);
        setIsSubmitting(false)
      } catch (error) {
        setSubmitted(false);
        setError("form could not be submitted");
        setIsSubmitting(false)
      }

      actions.resetForm(); //reset the form on submission
    },
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      {submitted && <h3>form submitted successfully</h3>}
      <div className="input-container">
        {error && <h4>form could not be submitted</h4>}
        <input
          type="text"
          id="name"
          name="name"
          placeholder="Your Name"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.name}
        />
        {formik.touched.name && formik.errors.name ? (
          <p>{formik.errors.name}</p>
        ) : null}{" "}
        {/*error message display*/}
      </div>

      {/*email input field */}
      <div className="input-container">
        <input
          type="email"
          id="email"
          name="email"
          placeholder="Your Email"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.email}
        />
        {formik.touched.email && formik.errors.email ? (
          <p>{formik.errors.email}</p>
        ) : null}
      </div>
      <div className="input-container">
        <label htmlFor="subject"></label>
        <select
          name="subject"
          id="subject"
          onChange={formik.handleChange}
          value={formik.values.subject}
        >
          <option value="">Please select a subject</option>
          <option value="option 1">Issues with Payment</option>
          <option value="option 2">Mobile App/Internet banking</option>
          <option value="option 3">Cash Transfer</option>
          <option value="option 4">Wrong Debit</option>
        </select>
        {formik.touched.subject}
      </div>

      <div className="input-container">
        <textarea
          id="message"
          name="message"
          rows="4"
          cols="38"
          placeholder="Your Message"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.message}
        />
        {formik.touched.message && formik.errors.message ? (
          <p>{formik.errors.message}</p>
        ) : null}
      </div>
      <button class="button" type="submit">{isSubmitting ? <img src={loadingIcon} alt="loading icon" /> : 'Submit'}</button>
    </form>
  );
};

export default ContactForm;
