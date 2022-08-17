import os, datetime, json
import firebase_admin
from firebase_admin import credentials 
from firebase_admin import firestore
from flask import Flask, request, jsonify, abort
import requests
import logging

app = Flask(__name__)

#Key ID: fe066263-aa0b3b53 
# URL: https://belay-351316.uc.r.appspot.com/

cred = credentials.Certificate('belay-351316-e63cc8ee08b7.json');
firebase_admin.initialize_app(cred)
db = firestore.client()


def send_email(text, to):
    api_key_mailgun = "68e4a0b7786edb8481fd24af5670c9da-fe066263-aa0b3b53"
    api_base_url = "https://api.mailgun.net/v3/sandbox0e9ca4687fde4b5f860daa8f71f4c472.mailgun.org"
    return requests.post(
        f"{api_base_url}/messages",
        auth=("api", api_key_mailgun),
        data={"from": "Adam Zhang <mailgun@sandbox0e9ca4687fde4b5f860daa8f71f4c472.mailgun.org>",
			"to": to,
			"subject": "New Channels! - Belay",
			"text": text}
    )

@app.route("/tasks/unread_chats")
def unread_chats():
    
    try:
        users_ref = db.collection(u'users')
        user_docs = users_ref.stream()
        user_list = {}
        for doc in user_docs:
            user_list[doc.id] = doc.to_dict()
        
        channels_ref = db.collection(u'channels')
        channel_docs = channels_ref.stream()
        channel_list = {}
        for doc in channel_docs:
            channel_list[doc.id] = doc.to_dict()
    except Exception as e:
        return "something went wrong when retrieving data for email updates", 400
    

    try:
        for user in user_list:
            # Step 1: Check if user has any visited at all
            text = "You don't have any unread channels!"
            if (not ("visited" in user_list[user])):
                text = f'You have {len(channel_list)} unopened channels:\n'
                for channel in channel_list:
                    text += f'{channel_list[channel]["name"]}\n'
                send_email(text, user_list[user]["email"])
            else:
                visited = set(user_list[user]["visited"])
                num_not_visited = len(channel_list) - len(visited)
                if num_not_visited > 0:
                    text = f'You have {num_not_visited} unopenened channels:\n'
                    for id in channel_list:
                        if id not in visited:
                            text += f'{channel_list[id]["name"]}\n'
                send_email(text,user_list[user]["email"])
    except Exception as e:
        return "something went wrong with email updates!", 400

    return "successful!", 200

if __name__ == '__main__':
  app.run(debug=True, port=5005)