from flask import Flask, render_template, jsonify, redirect,flash,request
from flask_wtf import FlaskForm
from wtforms import StringField, SubmitField,SelectField
from wtforms.validators import DataRequired
import json
import re
from search import getResults

app = Flask(__name__)
app.config['SECRET_KEY'] = 'how are you doing?'
app.config['MESSAGE_FLASHING_OPTIONS'] = {'duration': 5}

class SearchForm(FlaskForm):
    # search = StringField('Enter a keyword',render_kw={'class': 'input-field'})
    search = StringField('Enter a keyword')
    # submit = SubmitField('Search',render_kw={'class': 'submit-button'})
    submit = SubmitField('Search',validators=[DataRequired()])
    numb = SelectField('Number of problems', coerce=int, validators=[DataRequired()],default=10)

    def __init__(self):
        super(SearchForm, self).__init__()
        self.numb.choices = [(numb, str(numb)) for numb in range(1, 201)]



@app.route("/<query>/<int:num>",methods=['GET', 'POST'])
def return_links(query,num):
    form = SearchForm()
    tempResults = getResults(query,num)
    results = makeResult(tempResults)
    # if form.validate_on_submit():
    #     # print("Hello!")
    #     query = form.search.data
    #     numb = form.numb.data
    #     return redirect(f"/{query}/{numb}")
    if request.method=='POST':
        errors = []
        query = form.search.data
        numb = form.numb.data
        if not query:
            errors.append("please enter the keyword to search")

        if errors:
            return render_template('result.html', form=form, errors=errors,results=results)
        else:
            return redirect(f"/{query}/{numb}")
    
    form.search.data = query
    form.numb.data = num
    return render_template('result.html', form=form, results=results)
    # return jsonify(getResults(query,num))


def makeResult(tempResults):
    results = {}
    if tempResults[list(tempResults.keys())[0]]==0:
        return results
    for question in tempResults:
        link = "https://leetcode.com" + question
        if len(data[question])<=246:
            qText = data[question]
        else:
            qText = data[question][:250] + "...."
        match = re.search(r"/problems/([^/]+)/", question)
        qName = match.group(1).replace('-',' ').lower().capitalize()
        results[qName] = [link,qText]
    return results
    

@app.route("/", methods=['GET', 'POST'])
def home():
    
    form = SearchForm()
    results = []
    # print("Hi")
    # if form.validate_on_submit():
    #     # print("Hello!")
    #     query = form.search.data
    #     numb = form.numb.data
    #     return redirect(f"/{query}/{numb}")

    if request.method=='POST':
        # print("Hello!")
        errors = []
        query = form.search.data
        numb = form.numb.data
        if not query:
            errors.append("please enter the keyword to search")

        if errors:
            return render_template('index.html', form=form, errors=errors)
        else:
            return redirect(f"/{query}/{numb}")

    return render_template('index.html', form=form)


if __name__ == "__main__":
    with open('data.json') as file:
        # Load the contents of the file into a dictionary
        data = json.load(file)
    data  = {key:' '.join([s for s in val if s]).replace('\xa0', ' ') for key,val in data.items() }
    app.run(debug=True)