
import sys
import json
import spacy

def process_text(text, model_name):
    try:
        nlp = spacy.load(model_name)
        doc = nlp(text)
        
        tokens = []
        for token in doc:
            tokens.append({
                "text": token.text,
                "lemma": token.lemma_,
                "pos": token.pos_,
                "tag": token.tag_,
                "is_stop": token.is_stop,
                "is_punct": token.is_punct
            })
        
        return {
            "success": True,
            "tokens": tokens
        }
    except Exception as e:
        return {
            "success": False,
            "error": str(e)
        }

if __name__ == "__main__":
    # Read input as JSON
    input_data = json.loads(sys.stdin.read())
    text = input_data.get("text", "")
    model_name = input_data.get("model", "en_core_web_sm")
    
    result = process_text(text, model_name)
    print(json.dumps(result))
