import React, { useEffect, useState } from "react";
import { imageToSpec } from "./APIsolver";
import { input_string } from "./Parameters";
import {
    List,
    ListItem,
    ListItemText,
    ListItemButton,
    Button,
    Box,
    Typography,
    Collapse,
    IconButton,
} from "@mui/material";
import { ExpandMore, ExpandLess } from "@mui/icons-material";

const SpecUploadPane = ({ onComponentClick }) => {
    const [items, setItems] = useState([]);
    const [imagePreview, setImagePreview] = useState(null);
    const [spec, setSpec] = useState(null);
    const [indication, setIndication] = useState("awaiting");
    const [expandedComponents, setExpandedComponents] = useState({});

    const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    const handleAddItem = () => {
        if (!spec) return;

        let parsedSpec;
        try {
            parsedSpec = typeof spec === "string" ? JSON.parse(spec) : spec;
        } catch (e) {
            console.error("解析 spec 失败", e);
            return;
        }

        const newItem = {
            id: Date.now(),
            text: `栏目 ${items.length + 1}`,
            image: imagePreview,
            spec: parsedSpec,
        };

        setItems([...items, newItem]);
        setImagePreview(null);
        setSpec(null);
        setIndication("awaiting");
    };

    const handleImageChange = (e) => {
        setIndication("fetching");
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();

        reader.onloadend = async () => {
            setImagePreview(reader.result);
            const base64String = reader.result.split(",")[1];

            const payload = {
                image: base64String,
                save_name: "my_image_spec",
            };
            try {
                // setIndication("sending");
                // const response = await imageToSpec(JSON.stringify(payload))
                //
                // const rawString = response.data.spec; // 是带有 ```json 的字符串
                // console.log(rawString);
                //
                // // 提取 ```json ... ``` 中的内容
                // const regex = /```json\s*([\s\S]*?)\s*```/;
                // const match = rawString.match(regex);
                //
                // if (!match || !match[1]) {
                //     throw new Error("未匹配到 JSON 数据块");
                // }
                //
                // const jsonString = match[1].trim(); // ⚠️ 去除开头结尾的空格与换行
                //
                // const dataObject = JSON.parse(jsonString); // ✅ 成功解析
                // console.log("最终 JSON 对象:", dataObject);
                //
                // setIndication("Success"); // ✅ 更新状态
                // setSpec(dataObject)


                setSpec(input_string)
                console.log(input_string)
            } catch (err) {
                console.error(err)
            }
        };
        reader.readAsDataURL(file);
    };

    const toggleComponent = (key) => {
        setExpandedComponents((prev) => ({
            ...prev,
            [key]: !prev[key],
        }));
    };

    const renderSpecStructure = (specObj, itemId) => {
        const regions = specObj?.页面构成?.区域划分 || [];

        const handleComponentClick = (comp, region) => {
            console.log("点击组件：", comp);
            if (onComponentClick) {
                onComponentClick(comp); // 关键点：通知父组件
            }
        };

        return (
            <Box sx={{ pl: 2, mt: 1 }}>
                {regions.map((region) => (
                    <Box
                        key={region.区域编号}
                        sx={{
                            mb: 2,
                            p: 2,
                            border: '2px dashed #90caf9', // 🔵 区域边界（蓝色虚线）
                            borderRadius: 2,
                            backgroundColor: '#f5faff',
                        }}
                    >
                        <Typography variant="subtitle1" sx={{ mb: 1 }}>
                            区域 {region.区域编号}：{region.区域名称}
                        </Typography>

                        <List dense>
                            {(region.包含组件 || []).map((comp) => {
                                const key = `${itemId}-${comp.组件编号}`;
                                return (
                                    <Box
                                        key={key}
                                        sx={{
                                            border: '1px solid #ddd', // 🔳 组件边界
                                            borderRadius: 1,
                                            mb: 1,
                                            backgroundColor: '#fff',
                                            boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                                        }}
                                    >
                                        <ListItemButton
                                            onClick={() => handleComponentClick(comp, region)}
                                            sx={{ pl: 2 }}
                                        >
                                            <ListItemText
                                                primary={`- 组件 ${comp.组件编号}: ${comp.组件类型}`}
                                            />
                                            <IconButton
                                                edge="end"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    toggleComponent(key);
                                                }}
                                            >
                                                {expandedComponents[key] ? (
                                                    <ExpandLess />
                                                ) : (
                                                    <ExpandMore />
                                                )}
                                            </IconButton>
                                        </ListItemButton>

                                        <Collapse
                                            in={expandedComponents[key]}
                                            timeout="auto"
                                            unmountOnExit
                                        >
                                            <Box sx={{ pl: 4, pb: 2 }}>
                                                <Typography variant="body2" color="text.secondary">
                                                <pre style={{ whiteSpace: "pre-wrap" }}>
                                                    {JSON.stringify(comp, null, 2)}
                                                </pre>
                                                </Typography>
                                            </Box>
                                        </Collapse>
                                    </Box>
                                );
                            })}
                        </List>
                    </Box>
                ))}
            </Box>
        );
    };



    return (
        <Box sx={{ p: 2, backgroundColor: "#f0f0f0" }}>
            <Box sx={{ display: "flex", gap: 2, mb: 2, alignItems: "center" }}>
                <Button variant="contained" component="label">
                    上传图片
                    <input
                        type="file"
                        accept="image/*"
                        hidden
                        onChange={handleImageChange}
                    />
                </Button>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleAddItem}
                    disabled={!spec}
                >
                    添加栏目
                </Button>
                <pre>{indication}</pre>
            </Box>

            {imagePreview && (
                <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle2">图片预览：</Typography>
                    <img
                        src={imagePreview}
                        alt="预览"
                        style={{ maxWidth: "100%", maxHeight: 200 }}
                    />
                </Box>
            )}

            <List>
                {items.map((item) => (
                    <ListItem key={item.id} alignItems="flex-start">
                        <Box
                            sx={{
                                display: "flex",
                                flexDirection: "row",
                                gap: 2, // 左右列之间间距
                                width: '100%', // 确保撑满 ListItem
                            }}
                        >
                            {/* 左列：图片列 */}
                            <Box sx={{ flex: '0 0 200px' }}>
                                <Typography variant="h6">{item.text}</Typography>
                                {item.image && (
                                    <img
                                        src={item.image}
                                        alt="栏目图片"
                                        style={{ maxWidth: "100%", height: "auto", borderRadius: 4 }}
                                    />
                                )}
                            </Box>

                            {/* 右列：Spec 树 */}
                            <Box sx={{ flex: 1 }}>
                                {renderSpecStructure(item.spec, item.id)}
                            </Box>
                        </Box>
                    </ListItem>
                ))}
            </List>
        </Box>
    );
};

export default SpecUploadPane;