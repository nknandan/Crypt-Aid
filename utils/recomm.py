import json
import requests
import sys

API_URL = "https://api-inference.huggingface.co/models/sentence-transformers/all-MiniLM-L6-v2"
headers = {"Authorization": "Bearer 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"}


def query(payload):
    response = requests.post(API_URL, headers=headers, json=payload)
    return response.json()


data = query(
    {
        "inputs": {
            # "source_sentence": "I'm very happy",
            "source_sentence": sys.argv[1],
            # "sentences": ["I'm filled with happiness", "I'm happy"]
            "sentences": sys.argv[2].split(',')

        }
    })

print(data)
src_sen = sys.argv[1]
