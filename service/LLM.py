import sys
import json
from multiprocessing import Pool
import torch 
from transformers import AutoModelForCausalLM, AutoTokenizer

# Choose your model checkpoint (can be replaced with another supported model)
MODEL_CHECKPOINT = "distilbert/distilgpt2"

# Load model and tokenizer
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
tokenizer = AutoTokenizer.from_pretrained(MODEL_CHECKPOINT)
model = AutoModelForCausalLM.from_pretrained(MODEL_CHECKPOINT).to(device)

# Optional: Set padding token if missing (common for GPT2 variants)
if tokenizer.pad_token is None:
  tokenizer.pad_token = tokenizer.eos_token


def process_question(question):
  # Tokenize input
  inputs = tokenizer(question, return_tensors="pt", truncation=True, padding=True)
  inputs = {k: v.to(device) for k, v in inputs.items()}

  # Generate response
  output = model.generate(
  **inputs,
  max_length=inputs["input_ids"].shape[-1] + max_new_tokens,
  do_sample=True,
  top_k=top_k,
  pad_token_id=tokenizer.eos_token_id
  )
  # Decode and return only the generated part (excluding the prompt)
  decoded = tokenizer.decode(output[0], skip_special_tokens=True)
  # Optionally, remove the prompt from the output
  answer = decoded[len(question):].strip()
  return answer

if __name__ == "__main__":
    with Pool(processes=4) as pool:
        for line in iter(sys.stdin.readline, ''):
            try:
                data = json.loads(line.strip())  # Add strip() to remove newlines
                if not isinstance(data, dict):
                    raise ValueError("Input is not a JSON object")
                    
                result = pool.apply_async(process_question, (data["question"],))
                print(json.dumps({
                    "id": data.get("id", ""),
                    "answer": result.get()
                }))
                
            except Exception as e:
                print(json.dumps({
                    "id": data.get("id", "") if isinstance(data, dict) else "unknown",
                    "error": str(e)
                }))
                
            sys.stdout.flush()
