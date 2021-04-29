import { useState, useCallback } from "react";
import { useRouter } from "next/router";
import cities from "../data/cities.json";
import { Button, Checkbox, Form, Message } from "semantic-ui-react";
import toast from "../components/toast";

const AppForm = ({ formId }) => {
  const router = useRouter();
  const contentType = "application/json";
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const notify = useCallback((type, message) => {
    toast({ type, message });
  }, []);
  const [form, setForm] = useState({ for: [] });

  /* The POST method adds a new entry in the mongodb database. */
  const postData = async (form) => {
    try {
      const res = await fetch("/api/posts", {
        method: "POST",
        headers: {
          Accept: contentType,
          "Content-Type": contentType,
        },
        body: JSON.stringify(form),
      });

      // Throw error with status code in case Fetch API req failed
      if (!res.ok) {
        throw new Error(res.status);
      }
      notify("info", "Your post has been saved!");
      router.push("/");
    } catch (error) {
      notify("error", "Could not save your post!");
    }
  };

  const handleChange = (e, data) => {
    let value = data.value;
    let name = data.name;
    if (name == "for") {
      if (data.checked == true) {
        value = [...form.for, data.value];
      } else if (data.checked == false) {
        form.for.splice(form.for.indexOf(data.value), 1);
        value = [...form.for];
      }
    }
    if (name == "isVerified") {
      value = data.checked;
    }
    setForm({
      ...form,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = formValidate();
    setErrors({ ...errs });
    if (Object.keys(errs).length === 0) {
      postData(form);
    }
  };

  /* Makes sure pet info is filled for pet name, owner name, species, and image url*/
  const formValidate = () => {
    let err = {};
    if (!form.purpose) err.purpose = "Purpose is required";
    if (!form.for || form.for.length == 0)
      err.for = "Please select atleast one of the above";
    if (!form.city) err.city = "City is required";
    if (!form.contactName) err.contactName = "Contact Name is required";
    if (!form.contactNumber) err.contactNumber = "Contact Number is required";
    if (form.purpose == "request" && !form.patientName)
      err.patientName = "Patient Name is required";
    if (form.purpose == "request" && !form.patientAge)
      err.patientAge = "Patient Age is required";
    if (form.purpose == "request" && !form.patientGender)
      err.patientGender = "Patient Gender is required";
    return { ...err };
  };

  return (
    <>
      <Form onSubmit={handleSubmit}>
        <Form.Group inline>
          <label>I want to </label>
          <Form.Radio
            label="Provide"
            value="provide"
            name="purpose"
            checked={form.purpose === "provide"}
            onChange={handleChange}
            error={!!errors.purpose}
          />
          <Form.Radio
            label="Request"
            value="request"
            name="purpose"
            checked={form.purpose === "request"}
            onChange={handleChange}
            error={!!errors.purpose}
          />
        </Form.Group>
        <Form.Group inline>
          <label>For</label>
          <Form.Checkbox
            onChange={handleChange}
            name="for"
            value="beds"
            label="Beds"
            error={!!errors.for}
          />
          <Form.Checkbox
            onChange={handleChange}
            name="for"
            value="icu"
            label="ICU"
            error={!!errors.for}
          />
          <Form.Checkbox
            onChange={handleChange}
            name="for"
            value="oxygen"
            label="Oxygen"
            error={!!errors.for}
          />
          <Form.Checkbox
            onChange={handleChange}
            name="for"
            value="ventilator"
            label="Ventilator"
            error={!!errors.for}
          />
          <Form.Checkbox
            onChange={handleChange}
            name="for"
            value="tests"
            label="Tests"
            error={!!errors.for}
          />
          <Form.Checkbox
            name="for"
            onChange={handleChange}
            value="fabiflu"
            label="Fabiflu"
            error={!!errors.for}
          />
          <Form.Checkbox
            name="for"
            onChange={handleChange}
            value="remdesivir"
            label="Remdesivir"
            error={!!errors.for}
          />
          <Form.Checkbox
            name="for"
            onChange={handleChange}
            value="favipiravir"
            id="Favipiravir"
            label="Favipiravir"
            error={!!errors.for}
          />
          <Form.Checkbox
            name="for"
            onChange={handleChange}
            value="tocilizumab"
            label="Tocilizumab"
            error={!!errors.for}
          />
          <Form.Checkbox
            name="for"
            onChange={handleChange}
            value="plasma"
            label="Plasma"
            error={!!errors.for}
          />
          <Form.Checkbox
            name="for"
            onChange={handleChange}
            value="food"
            label="Food"
            error={!!errors.for}
          />
        </Form.Group>
        <Form.Select
          search
          label="In and around"
          placeholder="Select your city"
          options={cities.map((city) => {
            return {
              key: city,
              value: city,
              text: city,
            };
          })}
          name="city"
          error={!!errors.city}
          onChange={handleChange}
        />
        <Form.Group widths="equal">
          <Form.Input
            fluid
            label="Contact name"
            placeholder="Contact name"
            name="contactName"
            onChange={handleChange}
            error={!!errors.contactName}
          />
          <Form.Input
            type="text"
            fluid
            label="Contact Number"
            placeholder="Contact Number"
            name="contactNumber"
            onChange={handleChange}
            error={!!errors.contactNumber}
          />
          <Form.Input
            type="text"
            fluid
            label="Secondary Contact Number"
            placeholder="Secondary Contact Number"
            name="secondaryContactNumber"
            onChange={handleChange}
          />
        </Form.Group>
        {form.purpose == "request" && (
          <Form.Group widths="equal">
            <Form.Input
              fluid
              label="Patient name"
              placeholder="Patient name"
              name="patientName"
              onChange={handleChange}
              error={!!errors.patientName}
            />
            <Form.Input
              type="number"
              fluid
              label="Patient age"
              placeholder="Patient age"
              name="patientAge"
              onChange={handleChange}
              error={!!errors.patientAge}
            />
            <Form.Select
              fluid
              label="Patient Gender"
              options={[
                { key: "male", text: "Male", value: "male" },
                { key: "female", text: "Female", value: "female" },
                { key: "other", text: "Other", value: "other" },
              ]}
              placeholder="Patient Gender"
              name="patientGender"
              onChange={handleChange}
              error={!!errors.patientGender}
            />
          </Form.Group>
        )}
        <Form.TextArea
          label="Other details (optional)"
          placeholder="Other details..."
          name="otherDetails"
          onChange={handleChange}
        />
        <Form.Field>
          <Form.Checkbox
            name="isVerified"
            onChange={handleChange}
            value="true"
            label="I have verified this personally"
            error={!!errors.isVerified}
          />
        </Form.Field>
        <Button type="submit">Submit</Button>
      </Form>
      <p>{message}</p>
      {Object.keys(errors).length > 0 && (
        <Message negative>
          <Message.Header>Please fill the form carefully</Message.Header>
          {Object.keys(errors).map((err, index) => (
            <li key={index}>{errors[err]}</li>
          ))}
        </Message>
      )}
    </>
  );
};

export default AppForm;
