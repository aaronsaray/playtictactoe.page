# Play Tic Tac Toe

[https://playtictactoe.page](https://playtictactoe.page) source code.

## Rationale

This project was to test out the validity of using hte VueFire library in conjunction with Cloud Firestore as a socket connection for real time gaming. Throughout the process, it became easier to use some Firebase functions to handle
security instead of scripting Firestore rules. That, however, can sometimes lead to slow-downs.

## Project setup
```
npm install
```

* Create a Firebase project named after the environment
* Create a web project named after the project
* Copy `.env.example` to `.env.local` and fill in values
* Create a cloud firestore database


### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```
