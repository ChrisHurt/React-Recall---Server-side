# React Recall - Server-side

## Table of Contents

* [About the Project](#about-the-project)
  * [Built With](#built-with)
* [Roadmap](#roadmap)
* [License](#license)
* [Contact](#contact)
* [Acknowledgements](#acknowledgements)

## About The Project

A react app for remembering people's names and faces (or other data).

What is this useful for?
- Memorise people's names and faces
- Memorise mushroom names based on their photos
- Memorising any arbitrary pairing of text and photo you can imagine

### Built With
* [React](https://reactjs.org/)
* [SASS](https://sass-lang.com/)
* [Jest](https://jestjs.io/)
* [MongoDB](https://www.mongodb.com/)
* [Express](https://expressjs.com/)
* [Node](https://nodejs.org/en/)

## Roadmap
### Sprint 1 -- Completed 28/09/19
Implement Schema in MongoDB with Mongoose

### Sprint 2 -- Completed 28/09/19
Create core API endpoints for client-side axios calls

### Sprint 3 -- Completed 02/10/19
Bug test all endpoints


### Schema Design
The schema design has 5 tables
- **Users**
  - have many *DataCollections* 
  - have many *GuessSessions*
- **DataCollections**
  - belong to a *User* (May need another table for sharing data collections between users)
  - have many *DataPoints*
  - have many *GuessSessions*
- **GuessSessions**
  - belong to a *User*
  - belong to a *DataCollection*
  - have many *Guesses*
- **Guesses**
  - belong to a *GuessSession*
  - belong to a *DataPoint*
- **DataPoints**
  - belong to a *DataCollection*
  - have many *Guesses*
  

### Future Implementation
Look into methods for collecting data to integrate into the UI for testing
  - Consider:
    - Facebook & Instagram API's - Rejected, not enough time to implement
    - LinkedIn API - Pending Decision
    - Any other API's or accessible data that can be applied in this context - No suitable options found, Pending Decision
  - Look into methods for allowing user input and storage of this data as appropriate and if needed
    - Postgresql with node or ruby backend - Under consideration

## License

Distributed under the MIT License. See `LICENSE` for more information.

<!-- CONTACT -->
## Contact

Chris Hurt - chrishcoding@gmail.com
## Live Demo
### Demo User
 - username: Carla
 - password: 123
 - Link: [https://github.com/ChrisHurt/React-Recall---Server-side](https://github.com/ChrisHurt/React-Recall---Server-side)

<!-- ACKNOWLEDGEMENTS -->
## Acknowledgements
* [kasun-maldeni - Debugging](https://github.com/kasun-maldeni)
* [DT (epoch) - Debugging](https://github.com/epoch)
* [othnieldrew - README template](https://github.com/othneildrew/Best-README-Template)