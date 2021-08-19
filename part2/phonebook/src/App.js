import React, { useState, useEffect } from "react";
import phonebookServices from "./services/backend.js";

const Filter = ({ search, handleFilter }) => (
  <div>
    filter shown with <input value={search} onChange={handleFilter} />
  </div>
);

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

const List = ({ persons, handleDelete }) => {
  return persons.map((person) => (
    <Person key={person.name} person={person} handleDelete={handleDelete} />
  ));
};

const Person = ({ person, handleDelete }) => (
  <p>
    {person.name} {person.number}
    <DeleteButton
      id={person.id}
      name={person.name}
      handleDelete={handleDelete}
    />
  </p>
);

const DeleteButton = ({ id, name, handleDelete }) => (
  <button id={id} value={name} onClick={handleDelete}>
    delete
  </button>
);

const App = () => {
  const [persons, setPersons] = useState([]);
  const [name, setName] = useState("");
  const [number, setNumber] = useState("");
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);

  useEffect(() => {
    phonebookServices
      .getAll()
      .then((initialPersons) => setPersons(initialPersons));
  }, []);

  const handleNameChange = (event) => {
    console.log(event.target.value);
    setName(event.target.value);
  };

  const handleNumberChange = (event) => {
    console.log(event.target.value);
    setNumber(event.target.value);
  };

  const handleFilter = (event) => {
    let query = event.target.value;
    setSearch(query);
    let result = persons.filter((person) =>
      person.name.toUpperCase().includes(query.toUpperCase())
    );
    setSearchResult(result);
  };

  const addPerson = (event) => {
    event.preventDefault();
    if (!name) {
      emptyName();
    } else if (!number) {
      emptyNumber();
    } else {
      const personObject = {
        name: name,
        number: number,
      };
      sameName(name)
        ? duplicateAlert(name)
        : phonebookServices.create(personObject).then((createdPerson) => {
            setPersons(persons.concat(createdPerson));
            setName("");
            setNumber("");
          });
    }
  };

  const sameName = (nameInput) => {
    let same = false;
    persons.forEach((person) => {
      if (nameInput.toUpperCase() === person.name.toUpperCase()) {
        same = true;
      }
    });
    return same;
  };

  const duplicateAlert = (name) =>
    alert(`${name} is already added to phonebook`);
  const emptyName = () => alert("Please enter a name");
  const emptyNumber = () => alert("Please enter a number");

  const handleDelete = (event) => {
    let deletion = window.confirm(`Delete ${event.target.value} ?`);
    if (deletion) {
      phonebookServices.remove(event.target.id);
      setPersons(
        persons.filter((person) => person.id !== parseInt(event.target.id))
      );
    }
  };

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter search={search} handleFilter={handleFilter} />
      <h3>Add a new</h3>
      <PersonForm
        addPerson={addPerson}
        handleNameChange={handleNameChange}
        handleNumberChange={handleNumberChange}
        name={name}
        number={number}
      />
      <h3>Numbers</h3>
      {search ? (
        <List persons={searchResult} handleDelete={handleDelete} />
      ) : (
        <List persons={persons} handleDelete={handleDelete} />
      )}
    </div>
  );
};

export default App;
