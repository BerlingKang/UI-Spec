import React, { useState } from "react";
import {
    Box,
    Button,
    Collapse,
    List,
    ListItemButton,
    ListItemText,
    Typography,
    IconButton,
    Paper,
    TextField,
} from "@mui/material";
import { ExpandMore, ExpandLess } from "@mui/icons-material";

const SideBar = ({ spec, generate, editSpec }) => {
    const [items, setItems] = useState([]);
    const [openItems, setOpenItems] = useState({});
    const [selectedContent, setSelectedContent] = useState(null);
    const [inputText, setInputText] = useState("");


    const handleConfirm = async (input_text, select_text) =>{
        console.log(select_text);
        console.log(input_text);
        const body = {
            spec: items,
            save_name: "save_name_1",
            text: "请只将该部分内容：" + select_text + "做出如下修改：\n" +input_text + "并返回完整的spec"
        };
        const output = await editSpec(body);
        setItems(output);
    };

    const payload = {
        spec: spec,
        save_name: "generate_code_001",
    };

    const show = () => {
        setItems(spec.components || []);
    };

    const generateCode = async () => {
        console.log("发送的spec为：")
        console.log(payload.spec)
        await generate(JSON.stringify(payload));
    };

    const handleToggle = (id) => {
        setOpenItems((prev) => ({
            ...prev,
            [id]: !prev[id],
        }));
    };

    const renderKeyValueList = (obj, parentKey = "") => {
        if (typeof obj !== "object" || obj === null) {
            return (
                <ListItemButton>
                    <ListItemText primary={String(obj)} />
                </ListItemButton>
            );
        }

        if (Array.isArray(obj)) {
            return (
                <List disablePadding>
                    {obj.map((item, index) => {
                        const key = `${parentKey}-${index}`;
                        const isOpen = openItems[key];
                        return (
                            <Box key={key}>
                                <ListItemButton>
                                    <ListItemText primary={`数组项 ${index + 1}`} />
                                    <IconButton
                                        size="small"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleToggle(key);
                                        }}
                                    >
                                        {isOpen ? <ExpandLess /> : <ExpandMore />}
                                    </IconButton>
                                </ListItemButton>
                                <Collapse in={isOpen} timeout="auto" unmountOnExit>
                                    {renderKeyValueList(item, key)}
                                </Collapse>
                            </Box>
                        );
                    })}
                </List>
            );
        }

        return (
            <List disablePadding>
                {Object.entries(obj).map(([key, value], index) => {
                    const itemKey = `${parentKey}-${key}-${index}`;
                    const isNested = typeof value === "object" && value !== null;
                    const isOpen = openItems[itemKey];

                    return (
                        <Box key={itemKey}>
                            <ListItemButton>
                                <ListItemText
                                    primary={key}
                                    secondary={!isNested ? String(value) : undefined}
                                />
                                {isNested && (
                                    <IconButton
                                        size="small"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleToggle(itemKey);
                                        }}
                                    >
                                        {isOpen ? <ExpandLess /> : <ExpandMore />}
                                    </IconButton>
                                )}
                            </ListItemButton>
                            {isNested && (
                                <Collapse in={isOpen} timeout="auto" unmountOnExit>
                                    {renderKeyValueList(value, itemKey)}
                                </Collapse>
                            )}
                        </Box>
                    );
                })}
            </List>
        );
    };

    return (
        <Box sx={{  mt: 1, height: "100%", width:'100%', display: "flex", flexDirection: "column" }}>
            <Box sx={{ display: "flex", gap: 2, mb: 2, alignItems: "center" }}>
                <Button variant="contained" onClick={generateCode}>
                    开始生成
                </Button>
                <Button variant="contained" onClick={show}>
                    合成
                </Button>
            </Box>

            {/* ✅ 内容区域可滚动 */}
            <Box
                sx={{
                    flex: 1,
                    overflowY: "auto",
                    pr: 1,
                    height: "75%",
                }}
            >
                {items.map((content, index) => (
                    <Box
                        key={content.componentId || index}
                        onClick={() => setSelectedContent(content)}
                        sx={{
                            mb: 2,
                            p: 2,
                            border: "2px dashed #90caf9",
                            borderRadius: 2,
                            backgroundColor: "#f5faff",
                            cursor: "pointer",
                            "&:hover": { backgroundColor: "#e3f2fd" },
                        }}
                    >
                        <Typography variant="subtitle1" sx={{ mb: 1 }}>
                            第 {index + 1} 个组件（componentId: {content.componentId || "无"}）
                        </Typography>
                        {renderKeyValueList(content, `component-${index}`)}
                    </Box>
                ))}
            </Box>

            {/* ✅ 面板固定在下方，不遮挡 */}
            <Paper
                elevation={3}
                sx={{
                    height: "25%",
                    mt: 2,
                    p: 2,
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                    backgroundColor: "#ffffff",
                    borderRadius: 2,
                }}
            >
                <Typography variant="subtitle1">点击的内容：</Typography>
                <Typography
                    sx={{
                        p: 1,
                        border: "1px solid #ccc",
                        borderRadius: 1,
                        maxHeight: 150,
                        overflow: "auto",
                        backgroundColor: "#f5f5f5",
                        whiteSpace: "pre-wrap",
                        fontSize: "0.85rem",
                    }}
                >
                    {selectedContent ? JSON.stringify(selectedContent, null, 2) : "暂无内容"}
                </Typography>

                <TextField
                    label="请输入内容"
                    variant="outlined"
                    size="small"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                />

                <Button
                    variant="contained"
                    onClick={(e) => {handleConfirm(inputText, selectedContent)}}
                >
                    确认
                </Button>
            </Paper>
        </Box>
    );
};

export default SideBar;
