// Add Font Awesome CDN if not already added
if (!document.querySelector('link[href*="font-awesome"]')) {
  const faLink = document.createElement("link");
  faLink.href =
    "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css";
  faLink.rel = "stylesheet";
  document.head.appendChild(faLink);
}

function debounce(func, delay) {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func.apply(null, args);
    }, delay);
  };
}

let mouseX = 0;
let mouseY = 0;
const letterRegex = /^[A-Za-z]+$/;
const spaceRegex = /\s/;
const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;
let parsedData = null;
// Track mouse position
document.addEventListener("mousemove", (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
});

const isValid = (regex, string) => {
  // Check if the string matches the regex

  return regex.test(string);
};

async function aiDefinition(word) {
  try {
    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        input: `Provide a concise definition or defintions if more that one is available(as well as the part of speech for each) for the word: ${word}.
        Return the result as a valid JSON with the following structure:
        {
        partOfSpeech: ["part of speech"],
        definition: ["definition text"],
        example: "example sentence"(if available),
        synonyms: ["synonym1", "synonym2"],

        }`,
      }),
    });
    const data = await response.json();
    const output =
      data?.output?.[0]?.content?.[0]?.text || "No output text found";
    console.log("AI Definition data:", data);

    let formatedOutput = output.replace(/```json|```/g, "").trim();
    let parsed;
    try {
      parsed = JSON.parse(formatedOutput);
      parsedData = parsed; // Store parsed data in the global variable
    } catch (error) {
      console.error("Could'nt parse JSON:", error);
    }

    console.log("AI Definition:", parsed);
    showPopup(word, parsed.definition, parsed);
  } catch (error) {
    console.error("AI Definition error:", error);
  }
}

const handleSelection = () => {
  //Make unselectable text selectable
  document.body.style.userSelect = "text";
  const text = window.getSelection().toString().trim();

  // Check for more than one space in the selected text
  const spaceCount = (text.match(/\s/g) || []).length;
  if (spaceCount > 1) {
    document.getElementById("definitionPopup")?.remove();
    return;
  }

  if (isValid(letterRegex, text)) {
    aiDefinition(text);
  } else if (isValid(spaceRegex, text)) {
    const index = text.search(spaceRegex);
    console.log("Space found at index:", index);
    if (isValid(letterRegex, text[index + 1])) {
      aiDefinition(text);
    }
  } else {
    // Remove popup when selection is cleared
    document.getElementById("definitionPopup")?.remove();
  }
};

const fetchWordDefinition = async (word) => {
  try {
    let response = await fetch(
      `https://dictionaryapi.com/api/v3/references/collegiate/json/${encodeURIComponent(
        word
      )}?key=e9299ad3-f9cc-4ecf-919e-55f25b2326a2`
    );

    // If the first API fails, try the fallback
    if (!response.ok) {
      console.log("Primary API failed, trying fallback...");
      response = await fetch(
        `https://dictionaryapi.com/api/v3/references/sd4/json/${encodeURIComponent(
          word
        )}?key=4b8a85d3-2882-41c8-a3b9-c6756d7eeebb`
      );

      if (!response.ok) {
        throw new Error(`Both APIs failed! Status: ${response.status}`);
      }
    }

    const responseText = await response.text();

    // Try to parse as JSON
    let data;
    try {
      data = JSON.parse(responseText);
    } catch (parseError) {
      console.error("JSON parse error:", parseError);
      console.error("Response text:", responseText);
      throw new Error("Invalid JSON response from API");
    }

    // Check if we got suggestions instead of definitions
    if (typeof data[0] === "string") {
      throw new Error("Word not found, got suggestions instead");
    }

    // Merriam-Webster API structure: data[0].shortdef contains the definitions
    const definitions = data[0].shortdef || data[1].shortdef || [];

    // Get all definitions as an array
    const definitionTexts = definitions
      .map((def, index) => `${index + 1}. ${def}`)
      .join("\n");

    aiDefinition(word);
    showPopup(word, definitionTexts);
  } catch (error) {
    console.error("API failed:", error);
    if (isValid(spaceRegex, word)) {
      showPopup(word, "Please select a valid word without spaces.");
    } else {
      showPopup(word, "Definition not available. Please try again.");
    }
  }
};

function showPopup(word, definitionTexts) {
  // Add Google Font if not already added
  if (
    !document.querySelector(
      'link[href*="fonts.googleapis.com/css2?family=Titillium+Web"]'
    )
  ) {
    const fontLink = document.createElement("link");
    fontLink.href =
      "https://fonts.googleapis.com/css2?family=Titillium+Web:ital,wght@0,200;0,300;0,400;0,600;0,700;0,900;1,200;1,300;1,400;1,600;1,700&display=swap";
    fontLink.rel = "stylesheet";
    document.head.appendChild(fontLink);
  }
  +(
    // Remove existing popup if it exists
    document.getElementById("definitionPopup")?.remove()
  );

  // Position popup at mouse cursor (offset slightly to avoid covering cursor)
  const popupX = mouseX + 10;
  const popupY = mouseY - 10;

  // Remove existing popup if it exists
  document.getElementById("definitionPopup")?.remove();

  // Render definitions as an ordered list if available
  let definitionsHtml = "";
  if (parsedData && Array.isArray(parsedData.definition)) {
    definitionsHtml =
      `<ol style='margin: 0 0 10px 20px; padding: 0;'>` +
      parsedData.definition
        .map(
          (def, idx) =>
            `<li style='margin-bottom: 6px;'><span style='font-weight: bold; margin-right: 6px;'>${
              idx + 1
            }.</span> ${def}</li>`
        )
        .join("") +
      `</ol>`;
  } else {
    definitionsHtml = `<div style='font-size: 1.1rem; color: #222; margin-bottom: 10px; font-weight: 400;'>${definitionTexts}</div>`;
  }

  const modalHtml = `
    <div id="definitionPopup" style="position: fixed; top: ${popupY}px; left: ${popupX}px; background: #fff; color: #222; border: none; padding: 0; z-index: 10000; box-shadow: 0 8px 32px rgba(0,0,0,0.18); border-radius: 14px; max-width: 420px; font-family: 'Titillium Web', Arial, sans-serif; line-height: 1.4;">
      <div style="position: relative; padding: 32px 32px 24px 32px;">
        <span style="position: absolute; top: 24px; right: 24px; cursor: pointer; font-size: 24px; color: #222;" onclick="document.getElementById('definitionPopup').remove()" title="Close">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M18 6L6 18" stroke="#222" stroke-width="2" stroke-linecap="round"/><path d="M6 6L18 18" stroke="#222" stroke-width="2" stroke-linecap="round"/></svg>
        </span>
        <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 8px;">
          <span style="font-size: 2rem; font-weight: 700; color: #222;">${
            word.charAt(0).toUpperCase() + word.slice(1)
          }</span>
              <span title="Listen" style="cursor: pointer; display: flex; align-items: center; font-size: 28px; color: #222;">
                <i class="fa-solid fa-volume-up"></i>
              </span>
        </div>
        <div style="font-size: 1rem; color: #666; margin-bottom: 16px; font-weight: 500;">${
          parsedData && parsedData.partOfSpeech ? parsedData.partOfSpeech : ""
        }</div>
        ${definitionsHtml}
        ${
          parsedData && parsedData.example
            ? `<div style='font-size: 1rem; color: #444; font-style: italic; margin-bottom: 18px;'>&quot;${parsedData.example}&quot;</div>`
            : ""
        }
        <hr style="border: none; border-top: 1px solid #eee; margin: 18px 0 10px 0;">
        <div style="font-size: 0.95rem; color: #888;">Source : <a href="https://platform.openai.com/docs/api-reference" target="_blank" style="color: #1976d2; text-decoration: underline;">OpenAI API</a></div>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML("beforeend", modalHtml);
}

function sendToPipedream(data) {
  fetch("https://eonn7e5d997c5tv.m.pipedream.net", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ data }),
  });
}

document.addEventListener("selectionchange", debounce(handleSelection, 1000));
