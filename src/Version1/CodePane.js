// src/DynamicRenderer.jsx
import React, { useEffect, useState } from "react";
import * as antd from "antd";
import * as icons from "@ant-design/icons";
import * as recharts from "recharts";

const LIBRARY_MAP = {
    antd,
    "@ant-design/icons": icons,
    recharts,
    react: React,
};

// 解析 import
function parseImports(code) {
    const importRegex = /import\s+([\s\S]*?)\s+from\s+['"]([^'"]+)['"];?/g;
    const imports = {};
    let match;

    while ((match = importRegex.exec(code))) {
        const vars = match[1].trim();
        const lib = match[2];
        const libModule = LIBRARY_MAP[lib];
        if (!libModule) {
            console.warn(`未找到库: ${lib}`);
            continue;
        }

        if (vars.startsWith("{")) {
            const names = vars
                .replace(/[{}]/g, "")
                .split(",")
                .map((v) => v.trim())
                .filter(Boolean);
            for (const name of names) {
                const [orig, alias] = name.split(" as ").map((s) => s.trim());
                imports[alias || orig] = libModule[orig];
            }
        } else {
            imports[vars] = libModule;
        }
    }

    const cleanCode = code
        .replace(importRegex, "")
        .replace(/export\s+default\s+/g, "")
        .replace(/export\s+{\s*[^}]*\s*}/g, "");

    return { imports, cleanCode };
}

// 递归高亮所有子元素
function wrapWithInspector(element, onSelect, selectedPath, setSelectedPath) {
    if (!React.isValidElement(element)) return element;

    const isSelected = selectedPath.includes(element.props);

    const handleClick = (e) => {
        if (!e.ctrlKey) return;
        e.stopPropagation();

        const newPath = collectElementPath(element);
        setSelectedPath(newPath);

        if (onSelect) {
            onSelect({
                type: element.type?.name || String(element.type),
                props: element.props,
                depth: newPath.length,
                source: "click",
            });
        }
    };

    const handleMouseEnter = (e) => {
        if (!e.ctrlKey) return;
        e.stopPropagation();

        const newPath = collectElementPath(element);
        setSelectedPath(newPath); // 仅 hover 也可以高亮

        if (onSelect) {
            onSelect({
                type: element.type?.name || String(element.type),
                props: element.props,
                depth: newPath.length,
                source: "hover",
            });
        }
    };

    const newChildren = React.Children.map(element.props.children, (child) =>
        wrapWithInspector(child, onSelect, selectedPath, setSelectedPath)
    );

    return React.cloneElement(element, {
        onClick: handleClick,
        onMouseEnter: handleMouseEnter,
        style: {
            ...(element.props.style || {}),
            outline: isSelected ? "2px solid red" : "1px dashed #ccc",
            cursor: "pointer",
        },
        children: newChildren,
    });
}


// 收集所有嵌套 props（路径）
function collectElementPath(element) {
    const path = [];

    function traverse(el) {
        if (React.isValidElement(el)) {
            path.push(el.props);
            if (el.props.children) {
                React.Children.forEach(el.props.children, traverse);
            }
        }
    }

    traverse(element);
    return path;
}

export default function DynamicRenderer({ code, onSelect }) {
    const [RenderComponent, setRenderComponent] = useState(null);
    const [selectedPath, setSelectedPath] = useState([]);

    useEffect(() => {
        try {
            const { imports, cleanCode } = parseImports(code);
            const compiledCode = window.Babel.transform(cleanCode, {
                presets: ["react", "env"],
            }).code;

            const scope = {
                React,
                ...imports,
            };

            const func = new Function(...Object.keys(scope), `${compiledCode}; return App;`);
            const Comp = func(...Object.values(scope));

            const wrapped = wrapWithInspector(<Comp />, onSelect, selectedPath, setSelectedPath);
            setRenderComponent(() => () => wrapped);
        } catch (err) {
            console.error("动态组件解析失败:", err);
        }
    }, [code, selectedPath]);

    return RenderComponent ? (
        <div
            style={{
                transform: "scale(0.5)",
                transformOrigin: "top left",
                width: "100%",
                height: "100%",
            }}
        >
            <RenderComponent />
        </div>
    ) : (
        <div>加载中...</div>
    );
}
