const starterScript = {
  start: "village_gate",
  nodes: [
    {
      id: "village_gate",
      speaker: "Guard Toma",
      text: "Traveler, the forest ahead is dangerous. Will you seek the healer or the blacksmith first?",
      choices: [
        { text: "Find the healer", next: "healer_hut" },
        { text: "Find the blacksmith", next: "forge" }
      ]
    },
    {
      id: "healer_hut",
      speaker: "Healer Mira",
      text: "Take this charm. It may save you when fear takes over.",
      choices: [{ text: "Thank her and head to the ruins", next: "ruins" }]
    },
    {
      id: "forge",
      speaker: "Blacksmith Rook",
      text: "I can sharpen your blade, but you must choose speed or power.",
      choices: [
        { text: "Choose speed", next: "ruins" },
        { text: "Choose power", next: "ruins" }
      ]
    },
    {
      id: "ruins",
      speaker: "Shadow Voice",
      text: "At the final gate, your choices echo. Do you protect the village or claim the relic?",
      choices: [
        { text: "Protect the village", next: "good_ending" },
        { text: "Claim the relic", next: "dark_ending" }
      ]
    },
    {
      id: "good_ending",
      speaker: "Narrator",
      text: "Good Ending: You return as a quiet hero, and the village thrives.",
      choices: []
    },
    {
      id: "dark_ending",
      speaker: "Narrator",
      text: "Bad Ending: Power consumes you, and the ruins awaken.",
      choices: []
    }
  ]
};

const editor = document.getElementById("scriptEditor");
const gameView = {
  speaker: document.getElementById("speaker"),
  text: document.getElementById("text"),
  choices: document.getElementById("choices")
};

const characters = [];

function loadEditorFromStorage() {
  const stored = localStorage.getItem("story-script");
  editor.value = stored || JSON.stringify(starterScript, null, 2);
}

function saveScript() {
  localStorage.setItem("story-script", editor.value);
  alert("Script saved to local storage.");
}

function parseScript() {
  try {
    const data = JSON.parse(editor.value);
    if (!data.start || !Array.isArray(data.nodes)) {
      throw new Error("Script must include 'start' and 'nodes'.");
    }
    return data;
  } catch (error) {
    alert(`Script parse error: ${error.message}`);
    return null;
  }
}

function renderNode(node, nodeMap) {
  gameView.speaker.textContent = node.speaker || "Narrator";
  gameView.text.textContent = node.text || "...";
  gameView.choices.innerHTML = "";

  if (!node.choices || node.choices.length === 0) {
    const done = document.createElement("div");
    done.textContent = "The End. Edit your script to add more branches.";
    gameView.choices.appendChild(done);
    return;
  }

  node.choices.forEach((choice) => {
    const button = document.createElement("button");
    button.textContent = choice.text;
    button.addEventListener("click", () => {
      const nextNode = nodeMap.get(choice.next);
      if (!nextNode) {
        alert(`Missing node: ${choice.next}`);
        return;
      }
      renderNode(nextNode, nodeMap);
    });
    gameView.choices.appendChild(button);
  });
}

function runGame() {
  const script = parseScript();
  if (!script) {
    return;
  }

  const nodeMap = new Map(script.nodes.map((node) => [node.id, node]));
  const startNode = nodeMap.get(script.start);

  if (!startNode) {
    alert(`Start node '${script.start}' not found.`);
    return;
  }

  renderNode(startNode, nodeMap);
}

function renderCharacters() {
  const list = document.getElementById("characterList");
  list.innerHTML = "";

  characters.forEach((char) => {
    const item = document.createElement("li");
    item.innerHTML = `<strong>${char.name}</strong>
      <div class="char-meta">${char.role || "No role set"}</div>
      <div class="char-meta">Prompt: ${char.prompt || "(none)"}</div>`;

    if (char.avatar) {
      const img = document.createElement("img");
      img.src = char.avatar;
      img.alt = `${char.name} avatar`;
      img.className = "char-avatar";
      item.appendChild(img);
    }

    list.appendChild(item);
  });
}

document.getElementById("loadTemplateBtn").addEventListener("click", () => {
  editor.value = JSON.stringify(starterScript, null, 2);
});

document.getElementById("saveBtn").addEventListener("click", saveScript);
document.getElementById("runBtn").addEventListener("click", runGame);

document.getElementById("characterForm").addEventListener("submit", (event) => {
  event.preventDefault();

  characters.push({
    name: document.getElementById("charName").value.trim(),
    role: document.getElementById("charRole").value.trim(),
    avatar: document.getElementById("charAvatar").value.trim(),
    prompt: document.getElementById("charPrompt").value.trim()
  });

  event.target.reset();
  renderCharacters();
});

loadEditorFromStorage();
renderCharacters();
