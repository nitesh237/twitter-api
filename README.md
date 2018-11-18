
# Twitter Api   &middot; ![](https://img.shields.io/npm/v/npm.svg) ![](https://img.shields.io/node/v/@stdlib/stdlib/latest.svg?registry_uri=https%3A%2F%2Fregistry.npmjs.com)

## Contents
- [About](#about)
- [Requirements](#requirements)
- [Documentation](#documentation)
- [Usage](#usage)
    - [Install Dependencies](#install-dependencies)
    - [Run](#run)
    - [Test](#test)


## About
An application Similar to twitter with sessions and basic functionalities register, login and logout. Other features include creating a tweet, reading tweets, deleting tweets and following/unfollowing users.
The above project is an back end implementation of the application and can be accessed using rest api calls.

## Requirements
- Node.js
- MongoDB

## Documentation
  Through out the documentatio, we will be assuming our server is running at port-`3000` in localhost.
- **Registering a user**
  ```
  curl -X POST http://localhost:3000/register -H 'Content-Type: application/json' -d '{"name":"Nitesh Gupta", "username": "nitesh237", "password": "1234"}'
  ```
  **Note:** Registering only creates your account. You will have to log in again to access further functionality.
  
- **Logging in**
  ```
  curl -X POST http://localhost:3000/login -c <cookie_name>.txt -H 'Content-Type:application/json' -d '{"username": "nitesh237", "password": "1234"}'
  ```
  **Note:** The file <cookie_name>.txt is created in the current terminal directory. The file saves the session data for the user logged in and this it is necessary to keep the file untouched till one session.
  
- **Logging Out**
  ```
  curl -X GET http://localhost:3000/logout -b <cookie_name>.txt
  ```
  **Note:** The file <cookie_name.txt> should be same as used during logging in.
  
- **Follow Other Users**

  For this example we have assumed there is a user with username `postman`
  ```
  curl -X POST http://localhost:3000/user/follow -b <cookie_name>.txt -H 'Content-Type:application/json' -d '{"username": "postman"}'
  ```
  **Note:** The file <cookie_name.txt> should be same as used during logging in.
  
- **Unfollow Users**

  For this example we have assumed there is a user with username `postman`
  ```
  curl -X POST http://localhost:3000/user/unfollow -b <cookie_name>.txt -H 'Content-Type:application/json' -d '{"username": "postman"}'
  ```
  **Note:** The file <cookie_name.txt> should be same as used during logging in.
  
- **Get Followers**
  ```
  curl -X POST http://localhost:3000/user/followers -b <cookie_name>.txt
  ```
  **Note:** The file <cookie_name.txt> should be same as used during logging in.
  
- **Get Followings**
  ```
  curl -X POST http://localhost:3000/user/following -b <cookie_name>.txt
  ```
  **Note:** The file <cookie_name.txt> should be same as used during logging in.
  
- **Creating Tweet**
  ```
  curl -X POST http://localhost:3000/tweet/new -b <cookie_name>.txt -H 'Content-Type:application/json' -d '{"text": "My First Tweet"}'
  ```
  **Note:** The file <cookie_name.txt> should be same as used during logging in.
  
- **Reading your own tweets**
  ```
  curl -X GET http://localhost:3000/tweet/mytweets -b <cookie_name>.txt
  ```
  **Note:** The file <cookie_name.txt> should be same as used during logging in.
  
- **Reading your newsfeeds**

  This will return tweet of all the people that are followed by the user.
  ```
  curl -X GET http://localhost:3000/tweet/newsfeed -b <cookie_name>.txt
  ```
  **Note:** The file <cookie_name.txt> should be same as used during logging in.
  
- **Deleting Tweets**
  ```
  curl -X DELETE http://localhost:3000/tweet/<tweet_id> -b <cookie_name>.txt
  ```
  **Note:** The file <cookie_name.txt> should be same as used during logging in. <Tweet-Id> shall be among the _id property of tweets return by mytweets api call.

## Usage

Open the folder in terminal. Modify the configs in `config.js` as per your need and make sure you have mongoDB installed on your system

- **Install dependencies**
    
    npm:
    ```
    npm install
    ```
- **Run**
    ```
    npm run start
    ```
- **Stop**
    ```
    npm run stop
    ```
    

