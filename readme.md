# CP-Question-Finder

User friendly flask based Information retrieval system (lnc.ltc based) to search programming questions from leetcode using keywords
Deployed on render : [Click here for live version](https://cp-question-finder.onrender.com/) 
- Type some keyword to get question
- solve
- repeat

New : Added support for programmer friendly dark theme \[monokai\]
## Instructions to run it locally

- Clone repository
- Navigate to code directory and run ```pip install -r requirements.txt```
- Run ```python app.py```

Happy coding !


## Instructions to rebuild using updated data

Run the files in following order:

- scrapLinksLeetcode.js
- scrapData
- tf_idf.py

And you are good to go !