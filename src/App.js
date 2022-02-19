import React, { useEffect, useState, useRef } from 'react'
import './App.css';

const url = "http://api.nobelprize.org/v1/prize.json";
function App() {
  const [cards, setCards] = useState([]);
  const [globalCards, setGlobalCards] = useState([]);
  const [specialCards, setSpecialCards] = useState([]);

  const getCards = async () => {
    const response = await fetch(url);
    const data = await response.json();
    // const cards = data.prizes.filter(item => item.year == "2021")
    // console.log(cards);

    let cardsList = [];
    for (const value of data.prizes) {
      if (value.laureates) {
        let items = value.laureates.filter(item => {
          if (Number(value.year) >= 1900 && Number(value.year) <= 2018) { return true }
          else { return false }
        }).map((item) => {
          let name = (item.surname) ? item.firstname + " " + item.surname : item.firstname
          let card = {
            id: item.id,
            name: name,
            category: value.category,
            year: value.year
          }
          return (card);
        });

        cardsList = [...cardsList, ...items]
      }
    }
    // console.log(cardsList)
    setCards(cardsList);
    setGlobalCards(cardsList);
  }

  const searchTextRef = useRef()
  const handleNameSearch = (e) => {
    const searchText = searchTextRef.current.value;
    // console.log(searchText)
    if (searchText === '' || searchText === null) setCards(globalCards)
    else {
      const searchedObjects = []
      globalCards.forEach(item => {
        // console.log(isNaN(Number(searchText)))
        if (!isNaN(Number(searchText)) && item['year'].toLowerCase().includes(searchText.toLowerCase())) {
          searchedObjects.push(item)
        } else if (item['name'].toLowerCase().includes(searchText.toLowerCase()) || item['category'].toLowerCase().includes(searchText.toLowerCase())) {
          searchedObjects.push(item)
        }
      })
      setCards(searchedObjects)
      // console.log(searchText);
    }

  }

  useEffect(() => {
    const checkDuplicate = () => {
      let duplicateIds = [];
      for (const item of globalCards) {
        let dups = globalCards.filter((card) => card.id === item.id);
        if (dups.length > 1 && !duplicateIds.includes(dups[0].id)) {
          duplicateIds.push(dups[0].id);
        }
      }

      let specialCardsList = [];
      for (const id of duplicateIds) {
        let dups = globalCards.filter((card) => card.id === id);
        let specialCard = {
          id: id,
          name: dups[0].name,
          count: dups.length
        }
        specialCardsList.push(specialCard)
      }
      setSpecialCards(specialCardsList)
    }
    checkDuplicate()
  }, [globalCards])

  useEffect(() => {
    getCards()
  }, [])

  return (
    <>
      <header>
        <h1>Nobel Price Winners</h1>
        <div className="auther">by Venkata Siva Krishna B</div>
      </header>
      <div className="main-body">
        <div className="special-pannel">
          <div className="header">More than 1 time Winners</div>
          <div className="special-cards-container">

            {specialCards.map((item, index) => {
              const { id, name, count } = item
              return (
                <div key={id} className='special-card'>
                  <p>{name}</p>
                  <span>{count}</span>
                </div>
              )
            })}

          </div>
        </div>
        <div className="main-content">
          <div className="header">
            <div className="search-box">
              <div>
                <input type="text" placeholder="Type Winner Name  (or)  Category  (or)  Year" ref={searchTextRef} onKeyUp={(e) => handleNameSearch(e)} />
                <button onClick={handleNameSearch}>Search</button>
              </div>
              <div className="search-results-count">({cards.length} results)</div>
            </div>
            <div className="filters">
              <button>Filters&ensp;<i className="fa fa-filter" aria-hidden="true"></i></button>
            </div>
          </div>
          <div className="content">
            <div className="items">
              {cards.map((item, index) => {
                const { category, year } = item
                return (
                  <div className="item" key={item.id + "-" + item.year}>
                    <div className="id">{item.id}</div>
                    <table>
                      <tbody>
                        <tr><td>Name</td><td>{item.name}</td></tr>
                        <tr><td>Category</td><td>{category}</td></tr>
                        <tr><td>Year</td><td>{year}</td></tr>
                      </tbody>
                    </table>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
