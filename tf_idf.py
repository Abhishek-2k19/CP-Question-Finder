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

UPDATE_TF_DOC = False
UPDATE_IDF = False
UPDATE_TF_IDF_DOC = False

def preprocess(sentence):
    sentence = sentence.lower()          
    sentence = re.sub(r'[^\w\s]', ' ', sentence).replace('_', ' ')
    
    text_tokens = word_tokenize(sentence)
    tokens_without_sw = [lemmatizer.lemmatize(word) for word in text_tokens if not word in stopwords.words()]
    
    return tokens_without_sw

def makeTf(key,val):
    sentence = key + val
    sentence = preprocess(sentence)
    # print("sentence: ",sentence)
    # print(sentence)
    word_count_dict = dict(Counter(sentence))
    # print(word_count_dict)
    return word_count_dict


if __name__=="__main__":
    with open('data.json') as file:
        # Load the contents of the file into a dictionary
        data = json.load(file)

    # print(len(data))

    # first_five = dict(itertools.islice(data.items(), 5))

    # # Print the first five elements
    # for key, value in first_five.items():
    #     print(key," : ", value)

    data  = {key:' '.join([s for s in val if s]).replace('\xa0', ' ') for key,val in data.items() }

    cleanData = {key:val for key,val in data.items() if val.strip()!=''}

    with open('cleanData.json', 'w') as f:
        json.dump(cleanData, f)
    # following lnc.ltc conventions

    # so here, for doc, we follow lnc, l->log for tf, n->no for idf, c-> cosine as similarity

    # term frequency
    tf_doc = {}

    if UPDATE_TF_DOC==True:
        for key,val in cleanData.items():
            tf_doc[key] = makeTf(key,val)
            tf_doc[key] = {word:1+math.log10(score) for word,score in tf_doc[key].items()}

        with open('tf_doc.pkl', 'wb') as file:
            pickle.dump(tf_doc, file)
    
    with open('tf_doc.pkl', 'rb') as file:
        tf_doc = pickle.load(file)

    
    # creating idf for general purpose, but using here only for n (no, i.e. 1 if word is present, 0 otherwise)
    idf = {}

    if UPDATE_IDF == True:
        for key,val in tf_doc.items():
            wordList = val.keys()
            for word in wordList:
                if word not in idf:
                    idf[word] = 0
                idf[word]+=1 

        for word in idf:
            idf[word] = math.log10(len(tf_doc)/idf[word])

        with open('idf.pkl', 'wb') as file:
            pickle.dump(idf, file)

    with open('idf.pkl', 'rb') as file:
        idf = pickle.load(file)


    # generate tf-idf
    tf_idf_doc = {}

    if UPDATE_TF_IDF_DOC==True:
        for key,val in tf_doc.items():
            tf_idf_doc[key] = {}
            for word,score in val.items():
                tf_idf_doc[key][word] = score*1     # following lnc convention, so no idf for doc 
            # normalize
            sum_of_squares = sum(value ** 2 for value in tf_idf_doc[key].values())
            sqrt_sum_of_squares = math.sqrt(sum_of_squares)
            tf_idf_doc[key] = {word: score / sqrt_sum_of_squares for word, score in tf_idf_doc[key].items()}

        with open('tf_idf_doc.pkl', 'wb') as file:
            pickle.dump(tf_idf_doc, file)

    with open('tf_idf_doc.pkl', 'rb') as file:
        tf_idf_doc = pickle.load(file)
    
    
    print(len(tf_idf_doc))

    # print(idf['program'])
    # first_five = dict(itertools.islice(tf_idf_doc.items(), 5))

    # # Print the first five elements
    # for key, value in first_five.items():
    #     print(key," : ", value)

    # print(cleanData)
    # print(len(cleanData))




