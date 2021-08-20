import React from "react";

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

export default List;
