import React, { useState, useEffect } from "react";
import phonebookServices from "./services/backend.js";
import Filter from "./components/Filter";
import Form from "./components/Form";
import List from "./components/List";
import Notification from "./components/Notification";

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

  const feedbackContent = (message) => {
    setFeedback(message);
    setTimeout(() => {
      setFeedback(null)
      setRequestError(false);
    }, 5000)
  };

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
        : phonebookServices
            .create(personObject)
            .then((createdPerson) => {
              setPersons(persons.concat(createdPerson));
              clearNameAndNumber();
              return createdPerson;
            })
            .then((person) => {
              setRequestError(false)
              feedbackContent(`Added ${person.name}`);
            })
            .catch((error) => {
              setRequestError(true)
              feedbackContent(`Error, did not add ${personObject.name}`)
            })
    }
  };

  const handleDelete = (event) => {
    let personToDelete = event.target.value;
    let deletion = window.confirm(`Delete ${personToDelete} ?`);

    if (deletion) {
      phonebookServices.remove(event.target.id)
      .then(() => {
        setPersons(
          persons.filter((person) => person.name !== personToDelete)
        )
        return personToDelete;
      })
      .then((deletedPerson) => {
        setRequestError(false)
        feedbackContent(`Deleted ${deletedPerson}`)
      })
      .catch((error) => {
        setRequestError(true)
        setPersons(
          persons.filter((person) => person.name !== event.target.value)
        )
        feedbackContent(`Information for ${event.target.value} had already been deleted`)
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
        setRequestError(false)
        feedbackContent(`Changed number for ${person.name}`);
      })
      .catch((error) => {
        setRequestError(true);
        setPersons(
          persons.filter((p) => (p.name !== changedPerson.name))
        );
        feedbackContent(`Information for ${name} has already been removed from server`);
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
      <Form
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
