import sys
import json
from concurrent.futures import ThreadPoolExecutor
import torch
from transformers import AutoModelForCausalLM, AutoTokenizer

# Initialize model and tokenizer once
MODEL_CHECKPOINT = "distilbert/distilgpt2"
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
tokenizer = AutoTokenizer.from_pretrained(MODEL_CHECKPOINT)
model = AutoModelForCausalLM.from_pretrained(MODEL_CHECKPOINT).to(device)

if tokenizer.pad_token is None:
    tokenizer.pad_token = tokenizer.eos_token

# Use ThreadPool instead of Process Pool
executor = ThreadPoolExecutor(max_workers=4)  # Adjust based on CPU cores


def process_question(question):
   # Tokenize input
    inputs = tokenizer(question, return_tensors="pt", truncation=True, padding=True)
    inputs = {k: v.to(device) for k, v in inputs.items()}

    # Generate response
    output = model.generate(
        **inputs,
        max_new_tokens=50,  # Use max_new_tokens instead of max_length for clarity
        do_sample=True,
        top_k=50,
        pad_token_id=tokenizer.eos_token_id
    )
    # Only decode the generated tokens, not the prompt
    generated_tokens = output[0][inputs["input_ids"].shape[-1]:]
    answer = tokenizer.decode(generated_tokens, skip_special_tokens=True).strip()
    return answer

if __name__ == "__main__":
    for line in iter(sys.stdin.readline, ''):
        try:
            data = json.loads(line.strip())
            future = executor.submit(process_question, data["question"])
            print(json.dumps({
                "id": data.get("id", ""),
                "answer": future.result()  # This will block until ready
            }))
        except Exception as e:
            print(json.dumps({
                "id": data.get("id", "") if isinstance(data, dict) else "unknown",
                "error": str(e)
            }))
        sys.stdout.flush()