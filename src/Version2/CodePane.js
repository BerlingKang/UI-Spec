// src/DynamicRenderer.jsx
import React, { useEffect, useState, useRef } from "react";
import * as antd from "antd";
import * as icons from "@ant-design/icons";
import * as recharts from "recharts";
import {code_1} from './Parameters';

const { Form, Input, Typography } = antd;
const { TextArea } = Input;

const LIBRARY_MAP = {
    antd,
    "@ant-design/icons": icons,
    recharts,
    react: React,
};

/**
 * Parse and remove import/export statements,
 * returning a map of imported modules and the clean code string.
 */
function parseImports(code) {
    const importRegex = /import\s+([\s\S]*?)\s+from\s+['"]([^'"]+)['"];?/g;
    const imports = {};
    let match;

    while ((match = importRegex.exec(code))) {
        const vars = match[1].trim();
        const lib = match[2];
        const libModule = LIBRARY_MAP[lib];
        if (!libModule) {
            console.warn(`Library not found: ${lib}`);
            continue;
        }
        let defaultName = null;
        let namedList  = null;

        if (vars.includes("{")) {
            // 有大括号，可能是 "React, { A, B }" 或者 "{ A, B }"
            // 拆分 default 和 named
            const [beforeBrace, afterBrace] = vars.split("{", 2);
            const before = beforeBrace.replace(/,$/, "").trim();   // "React" or ""
            if (before) defaultName = before;
            namedList = "{" + afterBrace;                        // "{ useEffect, useState }"
        } else {
        // 只有默认导入
          defaultName = vars;
        }

        // 注册默认导入
        if (defaultName) {
            imports[defaultName] = libModule;
        }
        // 注册命名导入
        if (namedList) {
            const names = namedList
                .replace(/[{}]/g, "")
                .split(",")
                .map((v) => v.trim())
                .filter(Boolean);
            names.forEach((name) => {
                const [orig, alias] = name.split(" as ").map((s) => s.trim());
                imports[alias || orig] = libModule[orig];
            });
        }
    }
    const cleanCode = code
        .replace(importRegex, "")
        .replace(/export\s+default\s+/, "")
        .replace(/export\s+{[^}]*}/, "");
    return { imports, cleanCode };
}

/**
 * CodeBar renders dynamic React code (from external file) and displays/edit attributes of clicked elements
 */
export default function CodeBar({ code: propCode }) {
    const code = propCode;
    const [RenderComponent, setRenderComponent] = useState(null);
    const [selectedInfo, setSelectedInfo] = useState(null);
    const selectedElRef = useRef(null);

    useEffect(() => {
        try {
            const { imports, cleanCode } = parseImports(code);
            const compiled = window.Babel.transform(cleanCode, {
                presets: ["react", "env"],
            }).code;

            const scope = { React, ...imports };
            const func = new Function(...Object.keys(scope), `${compiled}; return App;`);
            const Comp = func(...Object.values(scope));
            setRenderComponent(() => Comp);
        } catch (err) {
            console.error("Failed to render dynamic component:", err);
        }
    }, [code]);

    // 捕获点击事件，读取并锁定元素
    const handleCaptureClick = (e) => {
        e.stopPropagation();
        const el = e.target;
        selectedElRef.current = el;
        const attrs = Array.from(el.attributes).reduce((acc, attr) => {
            acc[attr.name] = attr.value;
            return acc;
        }, {});
        setSelectedInfo({
            tagName: el.tagName.toLowerCase(),
            attributes: attrs,
            text: el.innerText,
        });
    };

    // 实时修改属性
    const handleAttrChange = (name, value) => {
        const el = selectedElRef.current;
        if (!el) return;
        el.setAttribute(name, value);
        setSelectedInfo(prev => ({
            ...prev,
            attributes: { ...prev.attributes, [name]: value }
        }));
    };
    const handleTextChange = (value) => {
        const el = selectedElRef.current;
        if (!el) return;
        el.innerText = value;
        setSelectedInfo(prev => ({ ...prev, text: value }));
    };

    return (
        <div style={{ display: 'flex', width: '100%', height: '100%' }}>
            <div
                style={{ flex: 1, overflow: 'auto', backgroundColor: '#fff' }}
                onClick={handleCaptureClick}
            >
                {RenderComponent ? <RenderComponent /> : <div>Loading...</div>}
            </div>
            <div
                style={{ width: 320, borderLeft: '1px solid #ddd', padding: 16, backgroundColor: '#f7f7f7', overflowY: 'auto' }}
            >
                <Typography.Title level={4}>Element Inspector</Typography.Title>
                {selectedInfo ? (
                    <Form layout="vertical">
                        <Form.Item label="Tag Name">
                            <Input value={selectedInfo.tagName} disabled />
                        </Form.Item>
                        {Object.entries(selectedInfo.attributes).map(([name, val]) => (
                            <Form.Item label={name} key={name}>
                                <Input
                                    value={val}
                                    onChange={e => handleAttrChange(name, e.target.value)}
                                />
                            </Form.Item>
                        ))}
                        <Form.Item label="Text Content">
                            <TextArea
                                value={selectedInfo.text}
                                onChange={e => handleTextChange(e.target.value)}
                                rows={3}
                            />
                        </Form.Item>
                    </Form>
                ) : (
                    <Typography.Text type="secondary">Click any element to inspect/edit</Typography.Text>
                )}
            </div>
        </div>
    );
}
