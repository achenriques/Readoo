# Readoo

A react-redux project with express-mySQL back to manage an application about share books.

The main idea for this project is to create a social network to keep alive the old-fashined culture of read books. Users can upload books covers with its title, author and opinions.
The rest of the users will see the books and can share opinions with others throw the commentaries. When a user likes a book, this user will be able to chat with the user who has upload the book. So people that its interested in the same book can chat and privatly and meet phisicaly to share books or just to have a coffe.

### *Configuration of the project*
Readoo is a MVC project and it is compoud of two main projects (Front and Back).
The Front side is made with React-Redux Framework and part of the visual components are from Material-UI. The styles are personalized with CSS.
The Back side is a Node-JS application made with Express-js in oder to create multiple REST controllers, that provide the data from the MySQL data base thanks to the MySQL.js API. Besides there are another components like cors or jimp (A visual API used to reduce the size and weigth of the images uploaded by the users).

### *Instalation*
 * For developers:
  After clone or download and extract the code. The next steps for install the application in a localhost enviroment are very simple.
  First of all you must have installed in your machine the next tools: Node-JS ^6.0, MySQL server ^8.0. (NPM is neccessary for the FRONT prject, but it is included with NODE.js).
  Then, open a command prompt and go to the project folder. In the project directory, you must follow the next steps.
    - Run the next command: mysql -u root -p readoo_db < DB_update.sql    (In Windows, if you write mysql in the console and no program is found, you must included mySQL bin folder into PATH variables).
    - Enter the BACK directory (ReadooRestProvider) and tip the command: npm install.
    - To start the server run: node index.js
    - Enter the FRONT directory (ReadooClient) and tip the command: npm install. 
    - To start the application run: npm start.
    
  After executed the commands before, you are able to open the application in the next URL: http://localhost:3000
  
  * For production:
   NOT AVAILABLE YET! Sorry for the inconveniences.
