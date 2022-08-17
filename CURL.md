# Auth

You must login with a valid account and use the ID_token given in HTTP response when calling any of the CRUD APIs.

Therefore, to test any of the CRUD CURL commands, please run the command below and obtain the token

For purpose of testing, the script below logs into special admin account created for testing purpose.

```
curl "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyDRwanyZyGiSwKeHYPaArNwAKuu_ftu3P8" \
-H 'Content-Type: application/json' \
--data-binary '{"email":"admin@hotmail.com", "password":"password", "returnSecureToken":true}'
```

# CRUD

The CRUD API is exposed by Firebase's Firestore REST API.

Since CRUD operations are the same for any collection / document, I will illustrate the CRUD API with doing CRUD operation on message in particular channel

Please replace {YOUR_TOKEN} with the ID token obtained from above.

Post new message to a channel

```
curl -X POST \
-H "X-Api-Key:AIzaSyDRwanyZyGiSwKeHYPaArNwAKuu_ftu3P8" \
-H 'Content-Type: application/json' \
-H "Authorization: Bearer {YOUR_TOKEN}" \
-d '{"fields": {"uid": {"stringValue": "w0hiYxOGvWZawf6eWSLdPKNYWuj1"},"text": {"stringValue": "Random stuff from CURL"},"email": {"stringValue": "admin@hotmail.com"}}}' \
"https://firestore.googleapis.com/v1/projects/belay-351316/databases/(default)/documents/channels/CwWjgdC4PIsDQjjC7FX7/messages"
```

Read all messages in a channel

```
curl -X GET \
-H "X-Api-Key:AIzaSyDRwanyZyGiSwKeHYPaArNwAKuu_ftu3P8" \
-H "Authorization: Bearer {YOUR_TAKEN}" \
"https://firestore.googleapis.com/v1/projects/belay-351316/databases/(default)/documents/channels/CwWjgdC4PIsDQjjC7FX7/messages"
```

Update / edit a message in a channel. Please note that since we need to supply an ID that is auto-generated, you need to replace the {PREVIOUSLY_CREATED_MSG_ID} below with the id of the message you posted in POST command in this script to make sure things will work properly.

```
curl -X PATCH \
-H "X-Api-Key:AIzaSyDRwanyZyGiSwKeHYPaArNwAKuu_ftu3P8" \
-H 'Content-Type: application/json' \
-H "Authorization: Bearer {YOUR_TOKEN}" \
-d '{"fields": {"text": {"stringValue": "Edited text!"}}}' \
"https://firestore.googleapis.com/v1/projects/belay-351316/databases/(default)/documents/channels/CwWjgdC4PIsDQjjC7FX7/messages/{PREVIOUSLY_CREATED_MSG_ID}?updateMask.fieldPaths=text"
```

Delete a message in a channel. Again, supply your own {PREVIOUSLY_CREATED_MSG_ID}.

```
curl -X DELETE \
-H "X-Api-Key:AIzaSyDRwanyZyGiSwKeHYPaArNwAKuu_ftu3P8" \
-H "Authorization: Bearer {YOUR_TOKEN}" \
"https://firestore.googleapis.com/v1/projects/belay-351316/databases/(default)/documents/channels/CwWjgdC4PIsDQjjC7FX7/messages/{PREVIOUSLY_CREATED_MSG_ID}"
```
