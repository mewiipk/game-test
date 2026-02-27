# Story Game Builder (Prototype)

A lightweight browser app to create a branching story game:

- Write your own narrative script in JSON (NPC dialogue + choices + endings).
- Add custom characters with role, avatar URL, and optional GenAI prompt text.
- Preview and play your branching game instantly in-browser.

## Run locally

Because this is a static app, you can open `index.html` directly, or run a simple server:

```bash
python -m http.server 4173
```

Then open <http://localhost:4173>.

## Story script format

```json
{
  "start": "node_id",
  "nodes": [
    {
      "id": "node_id",
      "speaker": "NPC Name",
      "text": "Dialogue text",
      "choices": [
        { "text": "Choice shown to player", "next": "next_node_id" }
      ]
    }
  ]
}
```

A node with an empty `choices` array is treated as an ending.

## Avatar workflow options

- **Manual:** add a hosted image URL for each character.
- **GenAI-assisted:** use the built-in prompt template to generate an image in your preferred image model, then paste the URL.
