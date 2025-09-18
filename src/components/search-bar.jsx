import { useId } from "react";
import { ArrowRightIcon, SearchIcon } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
// SearchAccordion should not be rendered inside the SearchBar.
// Import it where you want to display search results (e.g., App.jsx or a separate panel).

const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

export default function SearchBar() {
  const id = useId();
  // SearchBar is only responsible for input and triggering searches.

  return (
    <div className="*:not-first:mt-2">
      <div className="relative ">
        <Input
          id={id}
          className="peer  ps-9 pe-9"
          placeholder={` Search...`}
          type="search"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              aiDefinition(e.target.value).then((parsed) => {
                // If you want to handle parsed results here, do so via a callback or an event.
                console.log("Parsed result (from SearchBar):", parsed);
              });
            }
          }}
        />
        <div className="text-muted-foreground/80 pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 peer-disabled:opacity-50">
          <SearchIcon size={16} />
        </div>
        <button
          className="text-muted-foreground/80 hover:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-md transition-[color,box-shadow] outline-none focus:z-10 focus-visible:ring-[3px] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
          aria-label="Submit search"
          type="submit"
          onClick={() => aiDefinition(document.getElementById(id)?.value)}
        >
          <ArrowRightIcon size={16} aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}

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
    let parsed = null;
    try {
      parsed = JSON.parse(formatedOutput);
    } catch (error) {
      console.error("Could'nt parse JSON:", error);
    }
    console.log("Parsed Data:", parsed?.definition);
    return parsed;
  } catch (error) {
    console.error("AI Definition error:", error);
  }
}
