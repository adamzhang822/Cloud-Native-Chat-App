## Starter application disclosure:

This app is based on previous work in Web Development (MPCS 52553) in which I created a Slack clone using React and SQLite. 
To migrate databse from SQLite to Firestore, I used a [Youtube tutorial](https://www.youtube.com/watch?v=zQyrwxMPm88&ab_channel=Fireship) as a reference.
I also used some of the CSS files from the above tutorial to apply minimum CSS.
The above tutorial gave me the idea for using react-firebase-hooks for realtime polling of chat data. 
The rest of the application organization including React Components designs are from my previous Web Dev projects.

## Group Member:
This is an individual project.

## Application Instructions: 
The usage for this app should be clear from its organization.
This is a simple Slack clone. 
You can sign up / login with your email account or through Google account, pick a Channel on the left bar (or create a new Channel), and then starting 
posting messages in the channel. If you are the ownser of a message, you can edit, delete, or attach image to the message. 
You can also check replies to a particular message and post replies yourself.
After you sign up, you will receive hourly update email on any new channels created that you have not opened. (Please make sure you authorize Mailgun to send you the emails in order to receive them).
There are also community guidelines and you cannot type the word "taboo" or any sentences / strings containing this word. Any message violating this rule will be censored.

