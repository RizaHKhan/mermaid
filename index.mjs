import express from "express";
import os from "os";
import { readFile, readdir } from "fs/promises";
import { marked } from "marked";
import path from "path";

const app = express();
app.use(express.json());
const PORT = 8003;
const DIAGRAMS_DIR = "./diagrams";

const renderer = new marked.Renderer();
renderer.code = function ({ text, lang }) {
  if (lang === "mermaid") {
    return `<pre class="mermaid">\n${text}\n</pre>`;
  }
  return `<pre>${text}</pre>`;
};

app.get("/:name", async (req, res) => {
  const filename = path.join(DIAGRAMS_DIR, req.params.name + ".md");
  try {
    const md = await readFile(filename, "utf-8");
    const html = marked(md, { renderer });

    res.status(200).send(`
      <!DOCTYPE html>
      <html>
        <head><title>${req.params.name}</title></head>
        <body>
          ${html}
          <script type="module">
            import mermaid from 'https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.esm.min.mjs';
            mermaid.initialize({ startOnLoad: true });
          </script>
        </body>
      </html>
    `);
  } catch (err) {
    res.status(404).send("Diagram not found");
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`Hostname: ${os.hostname()}`);
  console.log(
    `IP Address: ${
      Object.values(os.networkInterfaces())
        .flat()
        .find((iface) => iface.family === "IPv4" && !iface.internal).address
    }`,
  );
});
