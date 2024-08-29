// options.tsx
import { useState, useEffect } from "react"
import { Storage } from "@plasmohq/storage"

const storage = new Storage()

function IndexOptions() {
  const [apiKey, setApiKey] = useState("")
  const [systemPrompt, setSystemPrompt] = useState("")
  const [status, setStatus] = useState("")

  useEffect(() => {
    // 載入保存的設置
    storage.get("openaiApiKey").then((savedApiKey) => {
      if (savedApiKey) {
        setApiKey(savedApiKey as string)
      }
    })
    storage.get("systemPrompt").then((savedPrompt) => {
      if (savedPrompt) {
        setSystemPrompt(savedPrompt as string)
      } else {
        // 設置默認的系統提示
        setSystemPrompt(`You are an AI assistant tasked with identifying the most crucial words, phrases, or sentences in a given text.
Your goal is to highlight the essence of the content, allowing readers to grasp the main points by reading only the highlighted parts.

Instructions:
1. Analyze the input text thoroughly.
2. Identify key words, phrases, or sentences that are essential for understanding the main ideas.
3. Return these highlights as an array of strings.
4. Maintain the exact order of appearance in the original text.
5. Include both short (single words or phrases) and longer (full sentences) highlights as appropriate.
6. It's okay to repeat highlights if a concept is reinforced or particularly important.
7. Ensure that reading only the highlighted parts provides a coherent summary of the text.
8. The highlights should cover all major points and subtopics in the text.
9. Do not alter or paraphrase the original text; use exact quotes.`)
      }
    })
  }, [])

  const saveSettings = async () => {
    await storage.set("openaiApiKey", apiKey)
    await storage.set("systemPrompt", systemPrompt)
    setStatus("Settings saved successfully!")
    setTimeout(() => setStatus(""), 3000)
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>AI Highlight Extension Settings</h1>
      <div style={styles.setting}>
        <label htmlFor="apiKey" style={styles.label}>OpenAI API Key:</label>
        <input
          type="password"
          id="apiKey"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          style={styles.input}
        />
      </div>
      <div style={styles.setting}>
        <label htmlFor="systemPrompt" style={styles.label}>System Prompt:</label>
        <textarea
          id="systemPrompt"
          value={systemPrompt}
          onChange={(e) => setSystemPrompt(e.target.value)}
          style={{ ...styles.input, height: '200px' }}
        />
      </div>
      <button onClick={saveSettings} style={styles.button}>
        Save Settings
      </button>
      {status && <div style={styles.status}>{status}</div>}
    </div>
  )
}

const styles = {
  container: {
    fontFamily: "Arial, sans-serif",
    maxWidth: "600px",
    margin: "20px auto",
    padding: "20px",
    backgroundColor: "white",
    borderRadius: "8px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
  },
  heading: {
    color: "#333"
  },
  setting: {
    marginBottom: "20px"
  },
  label: {
    display: "block",
    marginBottom: "5px",
    color: "#666"
  },
  input: {
    width: "100%",
    padding: "8px",
    border: "1px solid #ddd",
    borderRadius: "4px",
    fontSize: "14px"
  },
  button: {
    backgroundColor: "#4CAF50",
    color: "white",
    padding: "10px 15px",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "16px"
  },
  status: {
    marginTop: "20px",
    padding: "10px",
    backgroundColor: "#d4edda",
    color: "#155724",
    borderRadius: "4px"
  }
}

export default IndexOptions