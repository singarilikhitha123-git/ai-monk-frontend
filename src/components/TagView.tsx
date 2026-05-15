import React, { useState, useEffect } from "react";
import type { TagNode } from "../types";
import "./TagView.css";

interface Props {
  node: TagNode;
  onChange: (updated: TagNode) => void;
  depth?: number;
}

const TagView: React.FC<Props> = ({ node, onChange, depth = 0 }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [editingName, setEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(node.name);

  useEffect(() => {
    if (!editingName) setNameInput(node.name);
  }, [node.name, editingName]);

  const handleAddChild = () => {
    const newChild: TagNode = { name: "New Child", data: "Data" };
    if (node.children) {
      onChange({ name: node.name, children: [...node.children, newChild] });
    } else {
      onChange({ name: node.name, children: [newChild] });
    }
  };

  const handleChildChange = (index: number, updated: TagNode) => {
    const newChildren = [...(node.children || [])];
    newChildren[index] = updated;
    onChange({ ...node, children: newChildren });
  };

  const handleNameKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      onChange({ ...node, name: nameInput });
      setEditingName(false);
    } else if (e.key === "Escape") {
      setEditingName(false);
    }
  };

  return (
    <div className="tag-wrapper" style={{ marginLeft: depth > 0 ? 20 : 0 }}>
      <div className="tag-header">
        <button className="collapse-btn" onClick={() => setCollapsed(!collapsed)}>
          {collapsed ? ">" : "v"}
        </button>
        {editingName ? (
          <input
            className="name-input"
            value={nameInput}
            autoFocus
            onChange={(e) => setNameInput(e.target.value)}
            onKeyDown={handleNameKeyDown}
            onBlur={() => { onChange({ ...node, name: nameInput }); setEditingName(false); }}
          />
        ) : (
          <span className="tag-name" onClick={() => { setEditingName(true); setNameInput(node.name); }}>
            {node.name}
          </span>
        )}
        <button className="add-child-btn" onClick={handleAddChild}>
          Add Child
        </button>
      </div>

      {!collapsed && (
        <div className="tag-body">
          {node.children &&
            node.children.map((child, i) => (
              <TagView
                key={i}
                node={child}
                onChange={(updated) => handleChildChange(i, updated)}
                depth={depth + 1}
              />
            ))}
          {node.data !== undefined && (
            <div className="tag-data">
              <span className="data-label">Data</span>
              <input
                className="data-input"
                value={node.data}
                onChange={(e) => onChange({ ...node, data: e.target.value })}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TagView;
