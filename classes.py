import sqlite3

class Player:
    def __init__(self, info):
        self.id = int(info[0])
        self.username = info[2]
        self.characterId = info[5]
        if self.characterId != '':
            self.characterId = int(self.characterId)

class Character:
    def __init__(self, info):
        self.id = int(info[0])
        self.name = info[1]
        self.gender = info[2]
        self.hp = int(info[3])
        self.hpMax = int(info[4])
        self.loc = int(info[5])
        self.age = int(info[8])
        self.coins = int(info[9])
        self.level = int(info[10])
        if info[11] != '':
            self.XP = int(info[11])
        self.role = info[12]
        self.title = info[13]

class Location:
    def __init__(self, info):
        self.id = int(info[0])
        self.name = info[1]
        self.description = info[2]
        self.quarter = info[3]
        self.town = info[4]
        self.province = info[5]
        if info[6] != '':
            self.ownerId = int(info[6])

class Skill:
    def __init__(self, info):
        self.id = int(info[0])
        self.name = info[1]
        self.minutes = int(info[2])
        self.XPMod = int(info[3])
        self.categoryId = int(info[4])

class Category:
    def __init__(self, info):
        self.id = int(info[0])
        self.name = info[1]
        self.playerId = int(info[2])

class DBConn:
    def __init__(self, dbName):
        self.fn = dbName

    def connect(self):
        self.conn = sqlite3.connect(self.fn)

    def query(self, query, args=[]):
        self.connect()
        self.cursor = self.conn.cursor()
        self.cursor.execute(query, args)
        results = []
        for thing in self.cursor:
            results.append(thing)
        self.conn.close()
        return results

    def execute(self, query, args=[]):
        self.connect()
        self.conn.execute(query, args)
        self.conn.commit()
        self.conn.close()
        return

### Code from add-skill page. Can't work out how to interpret POStreceive data from radio buttons
#    <p>Is this skill easy, hard, or in between?
#    <label for="easy">Easy</label>
#    <input type="radio" id="easy" name="difficulty" required>
#    <label for="moderate">Moderate</label>
#    <input type="radio" id="moderate" name="difficulty" required>
#    <label for="difficult">Difficult</label>
#    <input type="radio" id="difficult" name="difficulty" required>
#    </p>
#    <p>What category do you want to add this skill to?</p>
#    {% for k,v in cats.items() %}
#    <p>
#    <label for="{{k}}">{{v}}</label>
#    <input type="radio" id="{{k}}" name="category" required>
#    </p>
#    {% endfor %}
