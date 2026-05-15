import { useState, useEffect } from "react";
import TagView from "./components/TagView";
import type { TagNode, SavedTree } from "./types";
import "./App.css";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";

const DEFAULT_TREE: TagNode = {
  name: "root",
  children: [
    {
      name: "child1",
      children: [
        { name: "child1-child1", data: "c1-c1 Hello" },
        { name: "child1-child2", data: "c1-c2 JS" },
      ],
    },
    { name: "child2", data: "c2 World" },
  ],
};

function serializeTree(node: TagNode): TagNode {
  if (node.children) {
    return { name: node.name, children: node.children.map(serializeTree) };
  }
  return { name: node.name, data: node.data ?? "" };
}

export default function App() {
  const [tree, setTree] = useState<TagNode>(DEFAULT_TREE);
  const [savedTrees, setSavedTrees] = useState<SavedTree[]>([]);
  const [currentId, setCurrentId] = useState<number | null>(null);
  const [exportOutput, setExportOutput] = useState<string>("");

  useEffect(() => {
    fetch(`${API_BASE}/trees`)
      .then((r) => r.json())
      .then((data: SavedTree[]) => setSavedTrees(data))
      .catch(() => {});
  }, []);

  const handleExport = async () => {
    const payload = serializeTree(tree);
    setExportOutput(JSON.stringify(payload));

    try {
      if (currentId !== null) {
        const res = await fetch(`${API_BASE}/trees/${currentId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ tree: payload }),
        });
        const updated: SavedTree = await res.json();
        setSavedTrees((prev) =>
          prev.map((t) => (t.id === updated.id ? updated : t))
        );
      } else {
        const res = await fetch(`${API_BASE}/trees`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ tree: payload }),
        });
        const created: SavedTree = await res.json();
        setCurrentId(created.id);
        setSavedTrees((prev) => [...prev, created]);
      }
    } catch {
      alert("Failed to save to server. Check backend is running.");
    }
  };

  const loadSavedTree = (saved: SavedTree) => {
    setTree(saved.tree);
    setCurrentId(saved.id);
    setExportOutput("");
  };

  return (
    <div className="app">
      <h2 className="section-title">Editor</h2>
      <div className="tree-container">
        <TagView node={tree} onChange={setTree} />
      </div>
      <div className="export-row">
        <button className="export-btn" onClick={handleExport}>
          Export
        </button>
      </div>
      {exportOutput && <div className="export-output">{exportOutput}</div>}

      {savedTrees.length > 0 && (
        <div className="saved-section">
          <h2 className="section-title">Saved Trees</h2>
          {savedTrees.map((saved) => (
            <div key={saved.id} className="saved-tree">
              <div className="saved-tree-header">
                <span>Tree #{saved.id}</span>
                <button onClick={() => loadSavedTree(saved)}>Load into Editor</button>
              </div>
              <div className="tree-container">
                <TagView
                  node={saved.tree}
                  onChange={(updated) => {
                    setSavedTrees((prev) =>
                      prev.map((t) =>
                        t.id === saved.id ? { ...t, tree: updated } : t
                      )
                    );
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
