import subprocess
import sys

# Define languages to download
languages = ["es", "en", "ru"]

# Download each model
for lang in languages:
    model_name = f"{lang}_core_news_sm"
    print(f"Downloading spaCy model: {model_name}")
    subprocess.call([sys.executable, "-m", "spacy", "download", model_name])

print("All models have been downloaded.")