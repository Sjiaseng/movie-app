import React from 'react'

/*
const person = {
  name: "John",
  age: 25,
  location: "United States"
}

const {name, age, location} = person;

console.log(name, age, location); // destructure the object [Same as the props objects]
*/

// child shouldn't able to change the props
// props are immutable
// only can use setter to mutate it

const Search = ({searchTerm, setSearchTerm}) => {
  return (
    <div className = "search">
        <div>
            <img src="search.svg" />
            <input 
                type="text" 
                placeholder="Search Here"
                onChange={(e) => setSearchTerm(e.target.value)} // Use handler to change instead of Manually Doing It
                value = {searchTerm}
            />
        </div>
    </div>
  )
}

export default Search