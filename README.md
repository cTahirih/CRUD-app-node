# Shoes Store

> Shoe Store Management App
> By Tahirih Jaliri

## Description
This app allows users with role Admin to add, edit, and delete users, shoes and new categories to a database.

## Installation

* Clone this repository: run the command 

    ```git clone https://github.com/cTahirih/CRUD-app-node.git ``` .
 * Use npm to install dependencies: run command ```npm install ``` to download all dependencies.
 * Create a local database in mongoDB port 27017 and run in your local.

* Install nodemon for run de app: ```npm i nodemon --global```
* Start your server, run command ```nodemon server/server```.
* Use postman for test API REST
* For GET all users, use the next request:
    ```
    http://localhost:3000/users 
    ```
	* For pagination use:
	```
	http://localhost:3000/users?limit=10&from=3
	```
* For POST request and add a new user, use:
    ```
    http://localhost:3000/user
    body = {
        "name": "Martin Alfredo",
        "email": "test1@gmail.com",
        "password": "123456",
        "role": "USER_ROLE",
        "googleAccount": "false"
    }
    ```
* For PUT request and update user, use:
    ```
    http://localhost:3000/user/:id 
    body = {
        "name": "Martin Alfredo",
        "email": "test1@gmail.com",
        "role": "USER_ROLE",
        "googleAccount": "false"
    }
    ```

* For DELETE user, use:
    ```
    http://localhost:3000/user/:id 
    ```
---
## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.


