import { PythonShell } from "python-shell";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

// Get directory name in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to our Python script that will do the actual NLP processing
const PYTHON_SCRIPT_PATH = path.join(
  __dirname,
  "..",
  "scripts",
  "process_text.py"
);

// Maps language codes to spaCy model names
const LANGUAGE_MODELS = {
  spanish: "es_core_news_sm",
  russian: "ru_core_news_sm",
  english: "en_core_web_sm",
  // Add more languages as needed
};

// Cache to avoid reprocessing the same text
const nlpCache = new Map();

// Ensure Python script directory exists
function ensureScriptDirectory() {
  const scriptDir = path.join(__dirname, "..", "scripts");
  if (!fs.existsSync(scriptDir)) {
    fs.mkdirSync(scriptDir, { recursive: true });
  }
  return scriptDir;
}

// Create the Python script if it doesn't exist
function createPythonScript() {
  const scriptDir = ensureScriptDirectory();
  const scriptPath = path.join(scriptDir, "process_text.py");

  const pythonScript = `
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
`;

  fs.writeFileSync(scriptPath, pythonScript);
  return scriptPath;
}

// Process text using spaCy through Python
async function processText(text, language) {
  // Get model name for the language
  const modelName = LANGUAGE_MODELS[language.toLowerCase()] || "en_core_web_sm";

  // Create cache key
  const cacheKey = `${language}:${text}`;

  // Check cache first
  if (nlpCache.has(cacheKey)) {
    return nlpCache.get(cacheKey);
  }

  // Ensure Python script exists
  createPythonScript();

  // Prepare the options for PythonShell
  const options = {
    mode: "json",
    pythonOptions: ["-u"], // unbuffered output
    args: [],
    stdin: true, // To provide input via stdin
  };

  try {
    const pyshell = new PythonShell(PYTHON_SCRIPT_PATH, options);

    // Send the text and model to process
    pyshell.send({ text, model: modelName });

    return new Promise((resolve, reject) => {
      pyshell.on("message", (message) => {
        if (message.success) {
          // Store in cache and return results
          nlpCache.set(cacheKey, message.tokens);
          resolve(message.tokens);
        } else {
          reject(new Error(message.error));
        }
      });

      pyshell.on("error", (err) => {
        reject(err);
      });

      pyshell.end((err) => {
        if (err) reject(err);
      });
    });
  } catch (error) {
    console.error("Error processing text with NLP:", error);
    throw error;
  }
}

export { processText, LANGUAGE_MODELS };
