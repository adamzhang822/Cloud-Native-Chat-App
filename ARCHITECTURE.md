# Architecture 

The project is deployed on AppEngine and consist of 2 microservices.

### default Service:

The default service is simply the client application written in React and running on Node.js 16 runtime on AppEngine. 
The service can be accessed through https://belay-351316.uc.r.appspot.com/
The service uses Firestore as the database, and Firebase Cloud Funtions for certain serverless computation (such as enforcing censorship on messages sent). 
Since Firestore already exposes CRUD APIs, there is no separate microservice for the APIs.

### tasks Service:

The tasks service contain routes and functions for certain cron tasks. It is written in Flask framework running on Python runtime. 
The service can be accessed through https://belay-351316.uc.r.appspot.com/tasks 

### analytics:

The project uses Google Analytics to log general and custom events. The analytics dashboard can be accessed by invited users through Firebase console.
