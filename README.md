# Play Tic Tac Toe

[https://playtictactoe.page](https://playtictactoe.page) source code.

## Rationale

This project was to test out the validity of using the VueFire library in conjunction with Cloud Firestore as a socket connection for real time gaming. Throughout the process, it became easier to use some Firebase functions to handle
security instead of scripting Firestore rules. That, however, can sometimes lead to slow-downs.

### Things to Change

With all new technology implementations, hopefully you learn some stuff and you solidify some other knowledge.  Here are some notes for if I do this again:

- Always represent things on the client side first. Then send it to the server.  For something simple like tic tac toe, you could calculate wins/ties immediately, and then let the server confirm them.
- Consider if you could write even more of this client side and write stronger rules in cloud firestore rules instead (like if the current player is X, and there are even or odd amount of marks, that would let you know if you could update it, etc)
- Consider using triggers on database to check for wins/losses versus the heavy / slow cloud functions

## Project setup
```
npm install
```

* Create a Firebase project named after the environment
* Create a web project named after the project
* Copy `.env.example` to `.env.local` and fill in values
* Create a cloud firestore database
* Enable the billing account by upgrading from Spark to Blaze (and putting a notification for budget of $25)

### Deploy

* Deploy code to Netlify with environment variables set
* Change to production Firebase project locally `firebase use prod`
* Deploy functions `firebase deploy --only functions`
* Deploy firebase rules `firebase deploy --only firestore:rules`

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```
