from transformers import pipeline
import sys
import json

# Initialize generator once
generator = pipeline("text-generation", model="distilgpt2")

def respond(question):
    outputs = generator(
        question,
        max_new_tokens=50,
        do_sample=True,
        top_k=20
    )
    generated = outputs[0]['generated_text']
    return generated[len(question):].strip() if generated.startswith(question) else generated.strip()

if __name__ == "__main__":
    # Read from stdin for Node.js communication
    for line in sys.stdin:
        try:
            data = json.loads(line)
            result = respond(data['question'])
            print(json.dumps({"response": result}), flush=True)
        except Exception as e:
            print(json.dumps({"error": str(e)}), flush=True)
