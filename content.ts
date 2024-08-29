
import { Storage } from "@plasmohq/storage"
import cssText from "data-text:./style.css"
import OpenAI from "openai"
import { zodResponseFormat } from "openai/helpers/zod";
import { z } from "zod";
import type { PlasmoCSConfig } from "plasmo"

export const config: PlasmoCSConfig = {
  matches: ["<all_urls>"],
  css: ["style.css"],
  all_frames: false,
}
export const getStyle = () => {
  const style = document.createElement("style")
  style.textContent = cssText
  return style
}

const storage = new Storage()

let isHighlighted = false
let keywords: string[] = []



async function summarizeText(text: string): Promise<string[]> {
  const apiKey = await storage.get("openaiApiKey")
  const systemPrompt = await storage.get("systemPrompt")

  const openai = new OpenAI({
    apiKey: apiKey as string,
    dangerouslyAllowBrowser: true,
  });
  const HighLightTexts = z.object({
    highlights: z.array(z.string()),
  });

  try {
    const completion = await openai.beta.chat.completions.parse({
      model: "gpt-4o-mini", // 使用最新的模型
      messages: [{
        role: "system",
        content: `
          ${systemPrompt}
          Return your response in this JSON format:
          {
            "highlights": ["highlight1", "highlight2", "highlight3", ...]
          }
        `
      }, {
        role: "user",
        content: text
      }],
      response_format: zodResponseFormat(HighLightTexts, 'context'),
    });

    const context = completion.choices[0].message.parsed;
    console.log("Highlights:", context);
    return context.highlights;
  } catch (error) {
    console.error("Error calling OpenAI API:", error);
    return [];
  }
}


function createHighlightButton() {
  const buttonContainer = document.createElement("div")
  buttonContainer.style.position = "relative"

  const button = document.createElement("button")
  button.id = "ai-highlight-button"
  button.setAttribute("aria-label", "Toggle AI Highlight")
  button.addEventListener("click", toggleHighlight)

  const tooltip = document.createElement("span")
  tooltip.id = "ai-highlight-button-tooltip"
  tooltip.textContent = "Start AI Highlight"

  buttonContainer.appendChild(button)
  buttonContainer.appendChild(tooltip)
  document.body.appendChild(buttonContainer)

  updateTooltip()
}

function updateTooltip() {
  const tooltip = document.getElementById("ai-highlight-button-tooltip")
  if (tooltip) {
    if (isHighlighted) {
      tooltip.textContent = "Remove Highlights"
    } else {
      tooltip.textContent = "Start AI Highlight"
    }
  }
}

function applyHighlight() {
  function processNode(node: Node) {
    if (node.nodeType === Node.TEXT_NODE && node.textContent) {
      const text = node.textContent;
      const fragment = document.createDocumentFragment();
      let currentIndex = 0;

      while (currentIndex < text.length) {
        let matchedKeyword: string | null = null;
        let matchIndex = text.length;

        // 找到最早出現的關鍵詞
        for (const keyword of keywords) {
          const index = text.toLowerCase().indexOf(keyword.toLowerCase(), currentIndex);
          if (index !== -1 && index < matchIndex) {
            matchIndex = index;
            matchedKeyword = keyword;
          }
        }

        if (matchedKeyword) {
          // 添加未匹配的文本
          if (matchIndex > currentIndex) {
            fragment.appendChild(document.createTextNode(text.slice(currentIndex, matchIndex)));
          }

          // 添加高亮的關鍵詞
          const span = document.createElement('span');
          span.textContent = text.slice(matchIndex, matchIndex + matchedKeyword.length);
          span.className = 'ai-highlight-keyword';
          fragment.appendChild(span);

          currentIndex = matchIndex + matchedKeyword.length;
        } else {
          // 添加剩餘的文本
          fragment.appendChild(document.createTextNode(text.slice(currentIndex)));
          break;
        }
      }

      if (fragment.childNodes.length > 0) {
        node.parentNode?.replaceChild(fragment, node);
      }
    } else if (node.nodeType === Node.ELEMENT_NODE && node instanceof HTMLElement) {
      if (node.tagName.toLowerCase() !== "script" && node.tagName.toLowerCase() !== "style") {
        Array.from(node.childNodes).forEach(processNode);
      }
    }
  }

  processNode(document.body);
  document.body.classList.add("ai-highlight-active");
}


function removeHighlight() {
  const highlightedKeywords = document.querySelectorAll(".ai-highlight-keyword")
  highlightedKeywords.forEach(span => {
    if (span.textContent) {
      const textNode = document.createTextNode(span.textContent)
      span.parentNode?.replaceChild(textNode, span)
    }
  })

  document.body.classList.remove("ai-highlight-active")
}

async function toggleHighlight() {
  const button = document.getElementById("ai-highlight-button")
  if (!button) return

  if (!isHighlighted) {
    button.classList.add("highlighting")
    updateTooltip()
    
    if (keywords.length === 0) {
      const text = document.body.innerText
      keywords = await summarizeText(text)
    }

    applyHighlight()
    isHighlighted = true
    button.classList.remove("highlighting")
    button.classList.add("highlighted")
  } else {
    removeHighlight()
    isHighlighted = false
    button.classList.remove("highlighted")
  }
  updateTooltip()
}

window.addEventListener("load", createHighlightButton)