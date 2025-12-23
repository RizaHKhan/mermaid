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
        <head>
          <title>${req.params.name}</title>
          <style>
            body {
              margin: 0;
              padding: 20px;
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            }
            .mermaid {
              cursor: grab;
              transition: transform 0.1s ease-out;
            }
            .mermaid:active {
              cursor: grabbing;
            }
            .zoom-controls {
              position: fixed;
              top: 20px;
              right: 20px;
              display: flex;
              gap: 10px;
              z-index: 1000;
            }
            .zoom-btn {
              padding: 10px 15px;
              background: #0066cc;
              color: white;
              border: none;
              border-radius: 4px;
              cursor: pointer;
              font-size: 16px;
            }
            .zoom-btn:hover {
              background: #0052a3;
            }
          </style>
        </head>
        <body>
          <div class="zoom-controls">
            <button class="zoom-btn" onclick="zoomIn()">+</button>
            <button class="zoom-btn" onclick="zoomOut()">−</button>
            <button class="zoom-btn" onclick="resetZoom()">Reset</button>
          </div>
          ${html}
          <script type="module">
            import mermaid from 'https://cdn.jsdelivr.net/npm/mermaid@11.12.1/dist/mermaid.esm.min.mjs';
            mermaid.initialize({ startOnLoad: true });
            mermaid.registerIconPacks([
              {
                name: 'logos',
                loader: () =>
                  fetch('https://unpkg.com/@iconify-json/logos@1/icons.json').then((res) => res.json()),
              },
            ]);

            // Pan and Zoom functionality
            let scale = 1;
            let panning = false;
            let pointX = 0;
            let pointY = 0;
            let start = { x: 0, y: 0 };

            window.zoomIn = () => {
              scale *= 1.2;
              updateTransform();
            };

            window.zoomOut = () => {
              scale /= 1.2;
              updateTransform();
            };

            window.resetZoom = () => {
              scale = 1;
              pointX = 0;
              pointY = 0;
              updateTransform();
            };

            function updateTransform() {
              document.querySelectorAll('.mermaid').forEach(el => {
                el.style.transform = \`translate(\${pointX}px, \${pointY}px) scale(\${scale})\`;
                el.style.transformOrigin = '0 0';
              });
            }

            // Mouse wheel zoom
            document.addEventListener('wheel', (e) => {
              if (e.target.closest('.mermaid')) {
                e.preventDefault();
                const delta = e.deltaY > 0 ? 0.9 : 1.1;
                scale *= delta;
                updateTransform();
              }
            }, { passive: false });

            // Pan functionality
            document.addEventListener('mousedown', (e) => {
              if (e.target.closest('.mermaid')) {
                panning = true;
                start = { x: e.clientX - pointX, y: e.clientY - pointY };
              }
            });

            document.addEventListener('mousemove', (e) => {
              if (panning) {
                pointX = e.clientX - start.x;
                pointY = e.clientY - start.y;
                updateTransform();
              }
            });

            document.addEventListener('mouseup', () => {
              panning = false;
            });
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
