// src/DynamicRenderer.jsx
import React, { useEffect, useState, useRef } from "react";
import * as antd from "antd";
import * as icons from "@ant-design/icons";
import * as recharts from "recharts";

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
        if (vars.startsWith("{")) {
            const names = vars.replace(/[{}]/g, "").split(",").map((v) => v.trim());
            names.forEach((name) => {
                const [orig, alias] = name.split(" as ").map((s) => s.trim());
                imports[alias || orig] = libModule[orig];
            });
        } else {
            imports[vars] = libModule;
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
    const code = "import React from \"react\";\nimport { Layout, Menu, Input, Typography, Space } from \"antd\";\nimport {\n  DashboardOutlined,\n  BarChartOutlined,\n  ThunderboltOutlined,\n  AppstoreOutlined,\n  SearchOutlined,\n} from \"@ant-design/icons\";\n\nconst { Header } = Layout;\nconst { Text } = Typography;\n\n// Custom SVG Logo Icon: Abstract bird in purple & orange\nconst BirdLogo = () => (\n  <svg width=\"48\" height=\"48\" viewBox=\"0 0 48 48\">\n    <defs>\n      <linearGradient id=\"bird_purple_orange\" x1=\"0\" y1=\"0\" x2=\"1\" y2=\"1\">\n        <stop offset=\"0%\" stopColor=\"#7C3AED\" />\n        <stop offset=\"100%\" stopColor=\"#FF9800\" />\n      </linearGradient>\n    </defs>\n    <g>\n      <path\n        d=\"M8 30 Q12 18 30 10 Q44 8 35 26 Q39 37 25 36 Q15 38 8 30 Z\"\n        fill=\"url(#bird_purple_orange)\"\n      />\n      <circle cx=\"31\" cy=\"22\" r=\"2\" fill=\"#fff\" opacity={0.8} />\n      <ellipse cx=\"32\" cy=\"10\" rx=\"3\" ry=\"1.4\" fill=\"#7C3AED\" opacity={0.16} />\n    </g>\n  </svg>\n);\n\n// Logo Section\nconst BrandLogo = () => (\n  <Space align=\"center\" size={16} style={{ height: 64 }}>\n    <BirdLogo />\n    <div style={{ display: \"flex\", flexDirection: \"column\", justifyContent: \"center\" }}>\n      <Text\n        style={{\n          fontSize: 24,\n          color: \"#23272e\",\n          fontWeight: 600,\n          lineHeight: 1,\n          marginBottom: 4,\n        }}\n      >\n        Bresendy Agency\n      </Text>\n      <Text style={{ fontSize: 15, color: \"#b0b2b7\" }}>Marketing team</Text>\n    </div>\n  </Space>\n);\n\n// Menu Data\nconst menuItems = [\n  {\n    key: \"dashboard\",\n    icon: <DashboardOutlined />,\n    label: \"Dashboard\",\n    status: \"active\",\n  },\n  {\n    key: \"report\",\n    icon: <BarChartOutlined />,\n    label: \"Report\",\n    status: \"inactive\",\n  },\n  {\n    key: \"campaign\",\n    icon: <ThunderboltOutlined />,\n    label: \"Campaign\",\n    status: \"inactive\",\n  },\n  {\n    key: \"products\",\n    icon: <AppstoreOutlined />,\n    label: \"Products\",\n    status: \"inactive\",\n  },\n];\n\n// Navigation Menu\nconst NavigationMenu = () => (\n  <Menu\n    mode=\"horizontal\"\n    selectable={false}\n    style={{\n      background: \"transparent\",\n      border: \"none\",\n      display: \"flex\",\n      alignItems: \"center\",\n      gap: 6,\n      marginLeft: 36,\n      marginTop: 4,\n    }}\n    disabledOverflow\n  >\n    {menuItems.map((item) => (\n      <Menu.Item\n        key={item.key}\n        style={{\n          background: item.status === \"active\" ? \"#f5f6fa\" : \"transparent\",\n          borderRadius: 8,\n          marginRight: 4,\n          padding: \"0 24px\",\n          height: 48,\n          display: \"flex\",\n          alignItems: \"center\",\n          transition: \"background 0.15s\",\n        }}\n      >\n        <span\n          style={{\n            color: item.status === \"active\" ? \"#2A3140\" : \"#b0b2b7\",\n            display: \"flex\",\n            alignItems: \"center\",\n            fontSize: 20,\n            marginRight: 10,\n          }}\n        >\n          {item.icon}\n        </span>\n        <span\n          style={{\n            color: item.status === \"active\" ? \"#2A3140\" : \"#b0b2b7\",\n            fontSize: 17,\n            fontWeight: item.status === \"active\" ? 600 : 400,\n            letterSpacing: 0.1,\n          }}\n        >\n          {item.label}\n        </span>\n      </Menu.Item>\n    ))}\n  </Menu>\n);\n\n// Search Box with AntD Input\nconst SearchBox = () => (\n  <Input\n    size=\"large\"\n    allowClear={false}\n    placeholder=\"Search information\"\n    prefix={\n      <SearchOutlined\n        style={{\n          color: \"#b0b2b7\",\n          fontSize: 18,\n          marginRight: 2,\n        }}\n      />\n    }\n    style={{\n      width: 340,\n      height: 48,\n      background: \"rgba(255,255,255,0.87)\",\n      border: \"none\",\n      borderRadius: 10,\n      boxShadow: \"0 1px 4px 0 rgba(32,38,76,0.03)\",\n      fontSize: 16,\n      paddingLeft: 14,\n      color: \"#919191\",\n      marginLeft: 48,\n      verticalAlign: \"middle\",\n    }}\n    bordered={false}\n    inputMode=\"search\"\n  />\n);\n\n// Complete Page Layout (width 1920px, height 1080px)\nconst App = () => (\n  <Layout\n    style={{\n      minHeight: \"100vh\",\n      height: 1080,\n      width: 1920,\n      background: \"linear-gradient(90deg, #f7f8fa 0%, #fcfbff 65%)\",\n      overflow: \"hidden\",\n    }}\n  >\n    <Header\n      style={{\n        height: 96,\n        background: \"transparent\",\n        display: \"flex\",\n        padding: \"0 80px\",\n        alignItems: \"center\",\n        boxShadow: \"0 3px 16px 0 rgba(99,114,255,.04)\",\n        position: \"relative\",\n        zIndex: 10,\n      }}\n    >\n      <div\n        style={{\n          display: \"flex\",\n          alignItems: \"center\",\n          width: \"100%\",\n          minWidth: 0,\n          flex: 1,\n        }}\n      >\n        <BrandLogo />\n        <NavigationMenu />\n        <div\n          style={{\n            display: \"flex\",\n            flex: 1,\n            justifyContent: \"flex-start\",\n            alignItems: \"center\",\n            marginLeft: 44,\n            minWidth: 360,\n          }}\n        >\n          <SearchBox />\n        </div>\n      </div>\n    </Header>\n    {/* Page content filler */}\n    <div\n      style={{\n        flex: 1,\n        width: \"100%\",\n        height: \"100%\",\n        minHeight: 984,\n        minWidth: 0,\n        background:\n          \"url('data:image/svg+xml;utf8,<svg width=\\\"960\\\" height=\\\"580\\\" viewBox=\\\"0 0 960 680\\\" fill=\\\"none\\\" xmlns=\\\"http://www.w3.org/2000/svg\\\"><circle cx=\\\"480\\\" cy=\\\"240\\\" r=\\\"180\\\" fill=\\\"%23fff\\\" fill-opacity=\\\"0.36\\\"/></svg>') no-repeat 74% 60px\",\n        backgroundSize: \"600px auto\",\n      }}\n    ></div>\n  </Layout>\n);\n\nexport default App;"
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
