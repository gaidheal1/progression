from flask import Flask, request, url_for, make_response, session, redirect, escape, render_template
import bcrypt
from classes import Player, Character, Location, DBConn, Skill, Category
#import pandas as pd
#import sqlite3

app = Flask(__name__)
app.secret_key = 'any random string'


db = DBConn('progression.db')


@app.route('/')
def index():

    if 'username' in session:
    #    print(session)
        user = session['username']

    #    return 'Logged in as ' + username + '<br>' + "<b><a href='/logout'>click here to log out</a></b>"
    else: user = None
    return render_template('index2.html', user = user)
    #else:
    #    return "You are not logged in <br> <b><a href='/login'>Click here to log in</a></b"

#### Getting ValueError: Invalid Salt
@app.route('/login', methods = ['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password'].encode('utf-8')
        results = db.query('SELECT Username, Password from players')
        for thing in results:
            if username in thing:
                if bcrypt.checkpw(password, thing[1]):
                    session['username'] = username
                return redirect(url_for('index'))

    return render_template('login.html')

@app.route('/coming-soon', methods = ['GET', 'POST'])
def comingSoon():
    return "<h1>Progression</h1> <p>Coming soon! <a href='/home'>Go home</a> </p>"

@app.route('/create-account', methods = ['GET', 'POST'])
def createAccount():
    if request.method == 'POST':
        username_taken = False
        email_taken = False
        email = request.form['email']
        username = request.form['username']
        password = request.form['password'].encode('utf-8')
        results = db.query('SELECT Email, Username from players')
        for thing in results:
            if email_taken and username_taken:
                break
            if email in thing:
                email_taken = True
            if username in thing:
                username_taken = True
        if email_taken or username_taken:
            return render_template('create-account.html', email = email_taken, username = username_taken)
        else:
            hashedPassword = bcrypt.hashpw(password, bcrypt.gensalt())
            db.execute(" INSERT INTO players (Email, Username, Password) VALUES(?, ?, ?)", [email, username, hashedPassword])
            results = db.query(" SELECT PlayerId FROM players WHERE Username = ?", [username])
            db.execute(" INSERT INTO categories (Name, PlayerId) VALUES (?, ?)", ["General", results[0][0]])
            session['username'] = username
            user = username
            return render_template('create-character.html', user = user)
    return render_template('create-account.html')

@app.route('/create-character', methods = ['GET', 'POST'])
def createCharacter():
    if 'username' in session:
        user = session['username']
        player = db.query("SELECT * FROM players WHERE USERNAME = ?", [user])
        if request.method == 'POST':
            charName = request.form['charname']
            gender = request.form['gender']
            db.execute(" INSERT INTO characters (FirstName, Gender, HP, HPMax, LocationId, Age, Coins, Level, XP, Role, PlayerId) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", [charName, gender, 100, 100, 1200, 20, 1, 0, 0, "Miscreant", player[0][0]])
            results = db.query(" SELECT CharacterId FROM characters WHERE PlayerId = ?", [player[0][0]])
            db.execute(" UPDATE players SET CharacterId = ? WHERE PlayerId = ?", [results[0][0], player[0][0]])
            return redirect(url_for('index'))

    else:
        user = None
        return render_template('create-account.html')

@app.route('/home')
def home():
    if 'username' in session:
    #    print(session)
        user = session['username']
        player = db.query("SELECT * FROM players WHERE USERNAME = ?", [user])

        character = db.query("SELECT * FROM characters WHERE PlayerId = ?", [player[0][0]])
        p = Character(character[0])
        location = db.query("SELECT * FROM locations WHERE LocationId = ?", [p.loc])

        l = Location(location[0])
        characters = db.query("SELECT * FROM characters WHERE LocationId = ?", [l.id])

        character_list = []
        for item in characters:
            if item[0] != p.id:
                character_list.append(Character(item))

        return render_template('home.html', user = p, loc = l, characters = character_list)
    else:
        user = None
        return redirect(url_for('login'))

@app.route('/categories', methods = ['GET', 'POST'])
def dispCategories():
    if 'username' in session:
        player = db.query("SELECT * FROM players WHERE Username = ?", [session['username']])
        p = Player(player[0])
        results = db.query(" SELECT * FROM categories WHERE PlayerId = ?", [p.id])
        cat_list = {}
        for thing in results:
            cat_list[thing[0]] = thing[1]
            skill_results = db.query(" SELECT * FROM skills WHERE CategoryId = ?", [thing[0]])
            skills = {}
            for skill_thing in skill_results:
                skills[skill_thing[0]] = Skill(skill_thing)

        print('cat_list:', cat_list)
        #print('skill_list:', skill_list)
        return render_template('categories.html', categories = cat_list, skills = skills)
    else:
        user = None
        return redirect(url_for('login'))

@app.route('/skills')
def dispSkills():
    if 'username' in session:
        print("session['username']", session['username'])
        player = db.query("SELECT * FROM players WHERE Username = ?", [session['username']])
        p = Player(player[0])
        results = db.query(" SELECT CategoryId, Name FROM categories WHERE PlayerId = ?", [p.id])
        cat_list = {}
        #for thing in results:
    #        cat_list[thing[0]] = thing[1]
    #    results = db.query(" SELECT * FROM skills WHERE PlayerId = ?", [p.id])
    #    skill_list = {}
    #    for thing in results:
    #        skill_list[thing[0]] = thing[1]

    return render_template('skills.html', skills = 'farts')

@app.route('/add-skill', methods = ['GET', 'POST'])
def addSkill():
    if 'username' in session:
        #print("session['username']", session['username'])
        player = db.query("SELECT * FROM players WHERE Username = ?", [session['username']])
        p = Player(player[0])
        general_cat = db.query(" SELECT * FROM categories WHERE PlayerId = ? AND Name = ?", [p.id, "General"])
        if request.method == 'POST':
            s_name = request.form['skillname']
            s_minutes = request.form['minutes']

            ## Here goes code to add new skill to database
            db.execute(" INSERT INTO skills (Name, Minutes, XPMod, CategoryId) VALUES(?, ?, ?, ?)", [s_name, s_minutes, 1, general_cat[0][0]])
            return redirect(url_for('dispCategories'))
        return render_template('add-skill.html')
    else:
        return redirect(url_for('index'))

@app.route('/change-loc', methods = ['GET', 'POST'])
def changeLoc():
    if 'username' in session:
        player = db.query("SELECT * FROM players WHERE Username = ?", [session['username']])
        p = Player(player[0])
        locations = db.query(" SELECT * FROM locations")
        locs = {}
        for thing in locations:
            locs[thing[0]] = Location(thing)
        return render_template('locations.html', locs = locs)


@app.route('/logout')
def logout():
    #remove username from session if there
    session.pop('username', None)
    return redirect(url_for('index'))

if __name__ == '__main__':
    app.run(debug = True)
