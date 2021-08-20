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

const Notification = ({ message, error }) => {
  if (message === null) {
    return null;
  }

  let messageStyle;

  const successStyle = {
    color: 'green',
    background: 'lightgrey',
    fontSize: 20,
    borderStyle: 'solid',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10
  }
  const errorStyle = {
    color: 'red',
    background: 'lightgrey',
    fontSize: 20,
    borderStyle: 'solid',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10
  }

  error ? messageStyle = errorStyle : messageStyle = successStyle;

  return (
    <div style={messageStyle}>
      {message}
    </div>
  )
}

const App = () => {
  const [persons, setPersons] = useState([]);
  const [name, setName] = useState("");
  const [number, setNumber] = useState("");
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [feedback, setFeedback] = useState(null);
  const [requestError, setRequestError] = useState(false);

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
        ? duplicateAlert(personObject)
        : phonebookServices.create(personObject).then((createdPerson) => {
            setPersons(persons.concat(createdPerson));
            clearNameAndNumber();
            return createdPerson;
          })
          .then((person) => {
            setFeedback(
              `Added ${person.name}`
            )
            setTimeout(() => {
              setFeedback(null)
            }, 5000)
          });
    }
  };

  const handleDelete = (event) => {
    let deletion = window.confirm(`Delete ${event.target.value} ?`);
    if (deletion) {
      phonebookServices.remove(event.target.id);
      setPersons(
        persons.filter((person) => person.name !== event.target.value)
      );
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

  const duplicateAlert = (duplicatePerson) => {
    let replace = window.confirm(
      `${duplicatePerson.name} is already added to phonebook, replace the old number with a new one?`
    );
    if (replace) {
      updateNumber(duplicatePerson);
    }
    clearNameAndNumber();
  };

  const updateNumber = (updatePerson) => {
    let personToUpdate = persons.find(
      (p) => p.name.toUpperCase() === updatePerson.name.toUpperCase()
    );
    let changedPerson = { ...personToUpdate, number: updatePerson.number };

    phonebookServices
      .update(changedPerson.id, changedPerson)
      .then((returnedPerson) => {
        setPersons(
          persons.map((p) => (p.id === returnedPerson.id ? returnedPerson : p))
        );
        return returnedPerson;
      })
      .then((person) => {
        setFeedback(
          `Changed number for ${person.name}`
        )
        setTimeout(() => {
          setFeedback(null);
        }, 5000)
      })
      .catch((error) => {
        setRequestError(true)
        setFeedback(
          `Information for ${name} has already been removed from server`
        )
        setTimeout(() => {
          setFeedback(null);
          setRequestError(false);
        }, 5000)
      });
  };

  const emptyName = () => alert("Please enter a name");
  const emptyNumber = () => alert("Please enter a number");
  const clearNameAndNumber = () => {
    setName("");
    setNumber("");
  };

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={feedback} error={requestError} />
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
