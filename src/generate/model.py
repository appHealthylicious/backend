import pandas as pd
import numpy as np
import sys
import json
import os
from sklearn.feature_extraction.text import TfidfVectorizer
from nltk import bigrams
from nltk.tokenize import RegexpTokenizer
import spacy
from sklearn.decomposition import NMF
from sklearn.metrics import pairwise_distances
import joblib


nlp = spacy.load("en_core_web_sm")

def commatokenizer(text):
    return text.split(', ')

# Define the base directory
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# Load precomputed data
vectorizer = joblib.load(os.path.join(BASE_DIR, '../../genmodels/vectorizer.joblib'))
nmf_model = joblib.load(os.path.join(BASE_DIR, '../../genmodels/nmf_model.joblib'))
doc_topic = joblib.load(os.path.join(BASE_DIR, '../../genmodels/doc_topic.joblib'))
recipes_df = joblib.load(os.path.join(BASE_DIR, '../../genmodels/recipes_df.joblib'))

# Define the key ingredients weights
key_ingredients_weights = {
    'beef': 10,
    'chicken': 10,
    'shrimp': 10,
    'crab': 10,
    'venison': 10,
}

def get_nouns(text):
    tokens = RegexpTokenizer(r'\w+').tokenize(text)
    nouns = {'NN', 'NNS', 'NNP', 'NNPS', 'NOUN', 'PROPN', 'NE', 'NNE', 'NR'}
    nounlist = [token for token in tokens if nlp(token)[0].tag_ in nouns]
    return ', '.join(nounlist)

def mytokenizer(combinedlist):
    ingredlist = combinedlist[0].split(', ')
    nounlist = combinedlist[1].split(', ')
    bigramlist = []
    for ingred in ingredlist:
        bigrms = [bi for bi in bigrams(ingred.split())]
        for bi in bigrms:
            if (bi[0] in nounlist) or (bi[1] in nounlist):
                bigramlist.append(' '.join((bi[0], bi[1])))
    return ', '.join(bigramlist + nounlist)

def user_tokenize(ingreds):
    nouns = get_nouns(ingreds)
    ingredscombined = [ingreds, nouns]
    ingredstokenized = mytokenizer(ingredscombined)
    return ingredstokenized

def get_recommendations(user_ingredients):
    usertokens = user_tokenize(user_ingredients)
    user_vec = vectorizer.transform([usertokens])

    # Adjust weights for key ingredients
    feature_names = vectorizer.get_feature_names_out()
    for ingredient, weight in key_ingredients_weights.items():
        if ingredient in usertokens:
            index = feature_names.tolist().index(ingredient)
            user_vec[0, index] *= weight

    # Transform user vector into topic space
    topic_vec = nmf_model.transform(user_vec)

    # Compute similarity and get recommendations
    indices = pairwise_distances(topic_vec, doc_topic, metric='cosine').argsort().ravel()
    recommendations = [{"title": recipes_df.iloc[index].Title, 
    "ingredients": recipes_df.iloc[index]["All Ingredients"], 
    "image":recipes_df.iloc[index].Image} for index in indices[:5]]

    return recommendations

if __name__ == "__main__":
    ingredients = sys.argv[1]
    recommendations = get_recommendations(ingredients)
    print(json.dumps(recommendations))