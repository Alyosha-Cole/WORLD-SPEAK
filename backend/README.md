# WorldSpeak Language Analysis Feature

This document provides instructions for installing and setting up the new language analysis feature in the WorldSpeak application.

## Overview

The language analysis feature allows users to analyze the linguistic structure of conversations in the app. Users can click on words to see their part of speech, lemma (base form), and other grammatical information. This helps language learners understand sentence structure and grammar in a more interactive way.

## Prerequisites

- Node.js (v14 or higher)
- Python (v3.8 or higher)
- pip (Python package manager)

## Installation Steps

### 1. Install Python Dependencies

You'll need to install spaCy and the required language models:

```bash
# Install spaCy
pip install spacy

# Run the download script to get required language models
python backend/download_models.py
```

This will download the small language models for Spanish, Russian, and English. If you need additional languages, you can add them to the script.

### 2. Install Node.js Dependencies

Add the required Node.js packages to the backend:

```bash
cd backend
npm install python-shell
```

### 3. Create Required Directories

Make sure the scripts directory exists:

```bash
mkdir -p backend/scripts
```

### 4. Test the NLP Service

Run the test script to verify that the NLP service is working correctly:

```bash
cd backend
node test/test-nlp.js
```

You should see output showing token analysis for test phrases in different languages.

## Usage

1. Start the backend server:

   ```bash
   cd backend
   npm run dev
   ```

2. Start the frontend application:

   ```bash
   cd frontend
   npm run dev
   ```

3. Open the application in your browser and navigate to a chat with a conversation partner.

4. Look for the "Analysis Mode" button in the language toolbar above the chat area.

5. When in analysis mode, you can click on any assistant message to analyze it, then click on individual words to see detailed grammatical information.

## Troubleshooting

- **Python Not Found**: Make sure Python is in your PATH. Try running `python --version` to verify.
- **Models Not Loading**: Check that the language models were downloaded correctly. You can try installing them manually with: `python -m spacy download es_core_news_sm`
- **Error in NLP Processing**: Check the console logs for specific error messages. It might be related to paths, permissions, or missing dependencies.

## Adding More Languages

To add support for additional languages:

1. Add the language model to the download script:

   ```python
   languages = ["es", "en", "ru", "fr"]  # Add 'fr' for French
   ```

2. Run the download script again:

   ```bash
   python backend/download_models.py
   ```

3. Add the language to the `LANGUAGE_MODELS` mapping in `backend/services/nlpService.js`:

   ```javascript
   const LANGUAGE_MODELS = {
     spanish: "es_core_news_sm",
     russian: "ru_core_news_sm",
     english: "en_core_web_sm",
     french: "fr_core_news_sm", // Add this line
   };
   ```

4. Update the language detection in the chat component to recognize the new language.
