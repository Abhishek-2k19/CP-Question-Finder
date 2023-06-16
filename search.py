import json
import itertools
import nltk
import numpy
import glob
import json
import pickle
import math
import itertools
import operator
import pandas as pd
import gc
import os
import sys

from nltk.tokenize import word_tokenize
import nltk
from nltk.corpus import stopwords
nltk.download('punkt')
nltk.download('stopwords')
nltk.download('omw-1.4')
nltk.download('wordnet')
import re
from collections import Counter
from nltk.stem import WordNetLemmatizer
lemmatizer = WordNetLemmatizer()

from tf_idf import preprocess,makeTf

def getResults(query, numb):
    dummyStr = ""
    tf_query = makeTf(query,dummyStr)
    tf_query = {word:1+math.log10(score) for word,score in tf_query.items()}
    # print(tf_query)

    # load the word idf
    idf = {}
    with open('idf.pkl', 'rb') as file:
        idf = pickle.load(file)
    
    tf_idf_query = {}
    for word,freq in tf_query.items():
        if word in idf:
            tf_idf_query[word] = freq*idf[word]
    
    # normalize
    sum_of_squares = sum(value ** 2 for value in tf_idf_query.values())
    sqrt_sum_of_squares = math.sqrt(sum_of_squares)
    if sqrt_sum_of_squares==0:
        tf_idf_query = {word: 0 for word, score in tf_idf_query.items()}
    else:
        tf_idf_query = {word: score / sqrt_sum_of_squares for word, score in tf_idf_query.items()}

    # load tf_idf_doc
    tf_idf_doc = {}
    with open('tf_idf_doc.pkl', 'rb') as file:
        tf_idf_doc = pickle.load(file)
    
    # calculate the score and rank the best
    ranking = {}
    for doc,vec in tf_idf_doc.items():
        ranking[doc] = 0
        for word,score in tf_idf_query.items():
            if word in vec:
                ranking[doc]+=vec[word]*tf_idf_query[word]
    
    # topk = sorted(ranking, key=ranking.get, reverse=True)[:20]
    # topk = sorted(ranking.items(), key=lambda x: x[1], reverse=True)[:20]

    # Create a Counter object from the dictionary
    counter = Counter(ranking)

    # Get the top 20 key-value pairs based on the values
    topk = counter.most_common(numb)

    # Convert the list of tuples back to a dictionary
    topk = dict(topk)
    return topk
    


if __name__=="__main__":
    # following lnc.ltc conventions
    # so here, for query, following ltc, l->log for tf, t->log(n/df) for idf, c->cosine similarity
    
    query = input("Please enter the query : ")
    topk = getResults(query,8)
    for key,val in topk.items():
        print(key," => ",val)



