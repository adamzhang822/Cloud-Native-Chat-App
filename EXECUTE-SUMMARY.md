### High-Level Overview:

The application is a Slack clone organizing chats and messages into channels and reply threads.
Each channel contain messages that can be attached with images.
Users can then reply to the messages under reply thread for each message.
The application polls for new channels, messages, and replies using React hooks listening to Firebase realtime updates.

### Functionality Breakdown:

Most of the backend functionality is handled by Firebase.

- The database schema uses NoSQL database of Firestore with two primary collections (users and channels).
  Each channel document in channels collection has subcollection for messages documents, and each message document has a subcollection for replies document.
  To reduce Firestore reads, data is de-normalized appropriately. For example, user's profile pic URL is replicated and stored in each message document to reduce queries to users collection when
  rendering messages. Each user document contains an array of channels they have visited already, which is used when sending update emails notifying them of new, unvisited channels.

- The client performs CRUD on Firestore database through Firebase SDK. Client attaches listeners to Firestore realtime updates on certain collections and documents to render new messages and updates in realtime

- An hourly update to each user about new channels available that they have not opened yet is sent to them through email using MailGun services. The task is scheduled through AppEngine's cron tasks and logic for constructing the email is encapsulated in functions under tasks microservice
- Analytics is done through Google Analytics available through Firebase. Events are logged at the client app. Aside from standard events logged by Google Analytics like page view and new user sign up, 3 custom events are logged at the client:

  - new_image-upload: Whenever user uploads an image attachment to their posts, the event is triggered to keep track of whether users are using the app for more text-based communication or image-based communication / sharing
  - censor_event: Whenever someone says something bad in their posts that trigger the cloud function for censoring, this event is triggered. This event is logged to keep track of how many users are making uncivil posts and measure general level of community htealth
  - censor_reply: Whenever someone replies to another message with banned words, this event is triggered. This event measures how civil the discussions are. User might not make uncivil posts, but they might make lots of uncivil replies and this event is meant to trakc these users down

- Cloud function is implemented through Firebase. For this app, there is only one cloud function, which does censoring of messages whenever a new channel is created or a new message / reply has been posted. All channel names, messages, and replies to messages containig the string "taboo" will be automatically censored, and show up "censored!" on the screen.

### Estimated monthly cost to run backend service based on 1,000,000 unique monthly users

Estimated monthly cost to run backend service is $14,614.726/month with 1M unique monthly users.

Assumptions and computation details are as follow:

Assume the following usage pattern for a user:

- About 200 channels are active each month
- Message sizes are very small
- About 10% of messages contain images which is about 10KB each
- Each user posts 2 posts a day, and 5 replies a day
- User checks the app about 3 times a day, during each check
- A user is checks about 3 channels for each visit, and for each channel, they stay long enough to trigger change listeners 3 times hence they read the channel data 3 times for each channels
- Only the 25 most recent messages for each channel is shown (a feature not implemented for the deployed version)
- Automatically deletes messages when messages + replies in a channel exceeds 25
- A user deletes about 10% of their post
- A user edit about 20% of their post
- Email updates is sent every week at Saturday night to all users instead of hourly (it is set to hourly now to satisfy project specification)
- Cloud function is ran for each create / write operations

The pricing per month from Firestore:

Number of CRUD on Firestore:

Read:

```
1M (users) x 3 (checks) x 3 (channels) x 3 (listener updates) x 25 (messages) = 657M reads per day
675M - 50,000 (free) = 674.95M reads charged
674.95M / 100,000) x $0.06 = $404.97 per day
```

Writes

```
((1M (users) x [2 (posts) + 5 (replies)]) - 20K ) 100k x $0.18 = $12.564 per day
```

Deletes:

```
(1M x 7 (posts) x 0.1(percentage of delete) - 20K) / 100K) x $0.02 = $0.136 per day for new deletes
200 (channels) _ 35000 (messages automatically deleted everyday, computed from estimated writes from users, assuming 25 messages are retained at end of day) = 7M extra deletes
7M / 100K _ 0.02 = $1.4
```

Firestore cost per month:
(404.97 + 12.564 + 0.136 + 1.4) \* 30 = $12,531.5 per month

Storage:

```
1M (users) x 1KB (user document size) = 1GB
200 (channels) x 25(message and reply docs stored) x 5KB (message and reply docs size) = 0.025 GB
200 (channels) x 25(message and reply docs stored) x 0.1 (percentage with images) x 10KB(avg size of img) = 0.005 GB
(1 + 0.025 + 0.005)GB \* $0.026 = $0.026
```

Cloud Functions:

```
(1M _ 7 (writes) _ 30 (days) - 2M (free) / 1M) \* 0.4 = $83.2 per month
```

cron tasks:

```
$0.1 per job per month + ~$2000 for millions of email sent (precise cost cannot be calculated as service of this scale requires custom quote from the service provider).
```

Total cost:

```
12,531.5 (Firestore) + 83.2 (cloud functions) + 2000 (emails) + 0.026 (storage) = $14,614.726 / month
```
