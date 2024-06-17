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

# Define the base directory
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# Load data
recipes_path = os.path.join(BASE_DIR, '../../models/recipes_cleaned_ids.csv')
ingredients_path = os.path.join(BASE_DIR, '../../models/just_ingredients.csv')

df = pd.read_csv(recipes_path)
df1 = pd.read_csv(ingredients_path)

nlp = spacy.load("en_core_web_sm")

def commatokenizer(text):
    return text.split(', ')

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

def process_ingredients(row):
    nouns = get_nouns(row)
    combined = [row, nouns]
    return mytokenizer(combined)

df1['TokenizedIngredients'] = df1['IngredientsRemovedAdj'].apply(process_ingredients)

def user_tokenize(ingreds):
    nouns = get_nouns(ingreds)
    ingredscombined = [ingreds, nouns]
    ingredstokenized = mytokenizer(ingredscombined)
    return ingredstokenized

vectorizer = TfidfVectorizer(tokenizer=commatokenizer, stop_words='english', min_df=7, max_df=0.4, token_pattern=None)
docs = df1['TokenizedIngredients']
doc_word = vectorizer.fit_transform(docs)

nmf_model = NMF(20, random_state=10, max_iter=1000)
doc_topic = nmf_model.fit_transform(doc_word)
topic_word = nmf_model.components_

key_ingredients_weights = {
    'beef': 10,
    'chicken': 10,
    'shrimp': 10,
    'crab': 10,
    'venison': 10,
    # Add more key ingredients and their specific weights
}

def generate_recommendations(useringreds):
    usertokens = user_tokenize(useringreds)
    user_vec = vectorizer.transform([usertokens])

    feature_names = vectorizer.get_feature_names_out()
    for ingredient, weight in key_ingredients_weights.items():
        if ingredient in usertokens:
            index = feature_names.tolist().index(ingredient)
            user_vec[0, index] *= weight

    topic_vec = nmf_model.transform(user_vec)
    indices = pairwise_distances(topic_vec, doc_topic, metric='cosine').argsort().ravel()

    recommendations = []
    for index in indices[:5]:
        recommendations.append({
            "title": df.iloc[index].Title,
            "ingredients": df.iloc[index]["All Ingredients"],
            "image": df.iloc[index].Image
        })

    return recommendations

if __name__ == "__main__":
    user_input = sys.argv[1]
    recommendations = generate_recommendations(user_input)
    print(json.dumps(recommendations))
