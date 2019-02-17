# Work with Python 3.6
import discord
import urllib
import requests
import json
from rake_nltk import Rake

r = Rake()

TOKEN = 'NTE2MDAzNDI5ODk4OTExNzYy.Dttj2g.y8fgdQpe2C9r5-0vS0BWFufBa_I'

client = discord.Client()
rake_object = ""

@client.event
async def on_message(message):
    # we do not want the bot to reply to itself
    if message.author == client.user:
        return
    if message.content == "!end":
        await client.send_message(message.channel, "Goodbye")
        quit(0)
    # if message.content == "!setup":
    #     inital()
    if message.content.endswith('?'):
        global r
        content = str(message.content)
        r.extract_keywords_from_text(content)
        z = r.get_ranked_phrases()
        x = "%20".join(z)
        x = x.replace(" ", "%20")
        print(x)
        # content = content.replace(" ", "%20")
        msg = requests.get('http://localhost:8170/Earleking/science-questions/questions/?query=' + x)
        # msg = 'Hello {0.author.mention}'.format(message)
        jsonText = json.loads(msg.text)
        if(jsonText == "No Answer found"):
            # Try again -1
            x = "%20".join(z[0].split(" ")[:-1])
            x = x.replace(" ", "%20")
            print(z)
            # content = content.replace(" ", "%20")
            msg = requests.get('http://localhost:8170/Earleking/science-questions/questions/?query=' + x)
            jsonText = json.loads(msg.text)
            if(jsonText == "No Answer found"):
                await client.send_message(message.channel, msg.text)
            else:
                # jsonText = json.loads(msg.text)
                print(jsonText)
                await client.send_message(message.channel, "We think this question may be similar to your question")
                await client.send_message(message.channel, "Question: " + jsonText["question"])
                await client.send_message(message.channel, "Answer:")
                string = jsonText["answer"]
                for chunk in [string[i:i+2000] for i in range(0, len(string), 2000)]:
                    await client.send_message(message.channel, chunk)

        else:
            # jsonText = json.loads(msg.text)
            print(jsonText)
            string = jsonText["answer"]
            await client.send_message(message.channel, "We think this question may be similar to your question")
            await client.send_message(message.channel, "Question: " + jsonText["question"])
            
            await client.send_message(message.channel, "Answer:")
            for chunk in [string[i:i+2000] for i in range(0, len(string), 2000)]:
                await client.send_message(message.channel, chunk)

@client.event
async def on_ready():
    print('Logged in as')
    print(client.user.name)
    print(client.user.id)
    print('------')
    


client.run(TOKEN)