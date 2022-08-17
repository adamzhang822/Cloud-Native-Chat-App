The project uses Firebase Authentication and Cloud Firestore.
Therefore, all REST API endpoints are provided by Firebase REST API.

# Auth

For Auth, email signup+login and Google accounts authentications are enabled. Please refer to the REST API documentation (https://firebase.google.com/docs/reference/rest/auth) and CURL.md for example.

In particular, the APIs relevant for this project is:

- https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=[API_KEY]

  - Sign up with email and password

- https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=[API_KEY]

  - Sign in with email and password

- https://identitytoolkit.googleapis.com/v1/accounts:signInWithIdp?key=[API_KEY]
  - Sign in with Google accounts

All payloads and response code info are available on official documentation linked above.

# Database Schema and CRUD API

Since the entire project relies on Cloud Firestore for CRUD, all APIs are available through Firestore's REST API here:
https://cloud.google.com/firestore/docs/reference/rest

I will not replicate all information from the API website as the payloads and response codes info are all available there.
Here, I will simply lay out the database schema for the documents that are in the project, which will help you construct the request body for certain API requests to the relevant resources.

## Users

User documents are stored under "users" collection.

The schema for user document is:

```
{
    string: email,
    string: photoURL,
    string:uid,
    string[]: visited
}
```

"visited" field is an array of strings storing channel_ids (explained below) that keeps track of which channel the user has visited already

"photoURL" field is the URL for user's profile pic stored on Cloud Storage.

## Channels

channel documents are stored under "channels" collection.

The schema for channel document is:

```
{
    timestamp: createdAt,
    string: name,
    string: text
}
```

## Messages

message documents are stored under the subcollection "messages" under each channel documents.

The schema for message document is:

```
{
    timestamp: createdAt,
    string: email,
    string: photoURL,
    string: imgURL, (optional)
    string: text,
    string: uid
}
```

Some information about the posting user is replicated here to reduce the amount of read operations on Firestore when rendering messages.

"imgURL" field is optional. It is available when there is an image attached to the message

## Replies

reply documents are stored under the subcollection "replies" under each reply documents.

The schema for reply document is the same as message document, except no additional image attachment is allowed:

```
{
    timestamp: createdAt,
    string: email,
    string: photoURL,
    string: text,
    string: uid
}
```
