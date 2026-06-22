

from flask import Flask, request, jsonify
from flask_cors import CORS
import requests

app = Flask(__name__)
CORS(app)

@app.route('/chat', methods=['POST'])
def chat():

    user_message = request.json.get("message")

    response = requests.post(
        "http://localhost:11434/api/generate",
        json={
            #"model": "llama3",-----------------> I CHANGE THIS MODEL BECAUSE THE 7B MODEL IS TOO HEAVY FOR MY GPU, I USE THE 3B MODEL INSTEAD. BUT THIS MODEL IS NOT AS GOOD AS THE 7B MODEL, SO I NEED TO ADJUST THE PROMPT TO GET BETTER RESULTS.
            "model": "llama3.2:3b", 
             "prompt": f"""
You are an experienced veterinary doctor with experience treating cows, buffaloes, goats, dogs, cats, poultry, and farm animals.

Your job is to:

1. Analyze the symptoms carefully.
2. Ask follow-up questions if information is missing.
3. Identify the most likely disease.
4. Explain the disease in simple language.
5. Suggest medicines with dosage whenever possible.
6. Mention precautions and home care.
7. Tell the user when immediate veterinary attention is required.
8. Give the response in a structured format.

Response Format:

Animal:
Possible Disease:
Reason:
Recommended Medicines:
Dosage:
Home Care:
Warning Signs:
When to Contact a Veterinarian:

Important:
- Be practical and specific.
- Always suggest treatment if enough symptoms are provided.
- If symptoms are unclear, ask questions before prescribing.
- Focus on livestock animals, especially cows and buffaloes.

User: {user_message}
""",
            #"prompt": f"You are a veterinary doctor. Answer clearly in easy language. Also prescribe medication if necessary.\nUser: {user_message}",
            "stream": False,
            "options": {
              "num_predict": 150
            }
        }
    )

    answer = response.json()["response"]

    return jsonify({
        "response": answer
    })

if __name__ == "__main__":
    app.run(debug=True, port=5000)