import { PlusIcon } from "lucide-react";
import { Accordion as AccordionPrimitive } from "radix-ui";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
} from "@/components/ui/accordion";

export default function SearchAccordion({ result }) {
  const items = [
    {
      id: "1",
      title: (
        <h2 className="uppercase text-2xl font-bold">
          {result?.word || "Loading..."}
        </h2>
      ),
      content: (
        <div className="space-y-3">
          {/* Part of Speech */}
          {result?.partOfSpeech && (
            <p className="text-sm font-medium italic text-muted-foreground">
              {Array.isArray(result.partOfSpeech)
                ? result.partOfSpeech.join(", ")
                : result.partOfSpeech}
            </p>
          )}

          {/* Definition(s) */}
          <div>
            {result?.definition ? (
              Array.isArray(result.definition) ? (
                <ol className="list-decimal list-inside space-y-1">
                  {result.definition.map((def, index) => (
                    <li key={index} className="text-foreground">
                      {def}
                    </li>
                  ))}
                </ol>
              ) : (
                <p className="text-foreground">{result.definition}</p>
              )
            ) : (
              <p className="text-muted-foreground">No definition to give.</p>
            )}
          </div>

          {/* Example */}
          {result?.example && (
            <div className="bg-muted/30 p-3 rounded-md border-l-4 border-primary/30">
              <p className="italic text-foreground">"{result.example}"</p>
            </div>
          )}

          {/* Synonyms */}
          {result?.synonyms && (
            <div>
              <span className="text-sm font-medium text-muted-foreground">
                Synonyms:{" "}
              </span>
              <span className="text-foreground">
                {Array.isArray(result.synonyms)
                  ? result.synonyms.join(", ")
                  : result.synonyms}
              </span>
            </div>
          )}
        </div>
      ),
    },
    // {
    //   id: "2",
    //   title: "How can I customize the components?",
    //   content:
    //     "Use our CSS variables for global styling, or className and style props for component-specific changes. We support CSS modules, Tailwind, and dark mode out of the box.",
    // },
  ];
  return (
    <div className="space-y-4">
      <Accordion
        type="single"
        collapsible
        className="w-[90%] m-auto"
        defaultValue="1"
      >
        {items.map((item) => (
          <AccordionItem value={item.id} key={item.id} className="py-2">
            <AccordionPrimitive.Header className="flex">
              <AccordionPrimitive.Trigger className="focus-visible:border-ring focus-visible:ring-ring/50 flex flex-1 items-center justify-between gap-4 rounded-md py-2 text-left text-sm text-[15px] leading-6 font-semibold transition-all outline-none focus-visible:ring-[3px] disabled:pointer-events-none disabled:opacity-50 [&>svg>path:last-child]:origin-center [&>svg>path:last-child]:transition-all [&>svg>path:last-child]:duration-200 [&[data-state=open]>svg]:rotate-180 [&[data-state=open]>svg>path:last-child]:rotate-90 [&[data-state=open]>svg>path:last-child]:opacity-0">
                {item.title}
                <PlusIcon
                  size={16}
                  className="pointer-events-none shrink-0 opacity-60 transition-transform duration-200"
                  aria-hidden="true"
                />
              </AccordionPrimitive.Trigger>
            </AccordionPrimitive.Header>
            <AccordionContent className="text-muted-foreground pb-2">
              {item.content}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
