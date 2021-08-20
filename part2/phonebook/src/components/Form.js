import React from "react";

const PersonForm = ({
  addPerson,
  handleNameChange,
  handleNumberChange,
  name,
  number,
}) => (
  <form onSubmit={addPerson}>
    <FormName name={name} handleNameChange={handleNameChange} />
    <FormNumber number={number} handleNumberChange={handleNumberChange} />
    <FormButton />
  </form>
);

const FormName = ({ name, handleNameChange }) => (
  <div>
    name: <input value={name} onChange={handleNameChange} />
  </div>
);

const FormNumber = ({ number, handleNumberChange }) => (
  <div>
    number: <input value={number} onChange={handleNumberChange} />
  </div>
);

const FormButton = () => (
  <div>
    <button type="submit">add</button>
  </div>
);

export default PersonForm;
