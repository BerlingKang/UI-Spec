import React, { useContext , useEffect, useState } from "react";
import conbineSpec, {combineSpec} from './APIsolver';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import {
    Button,
    List,
    ListItemButton,
    ListItemText,
    Collapse,
    Typography,
    Box,
} from "@mui/material";
import { ExpandLess, ExpandMore } from "@mui/icons-material";

const Comp2Menu = ({ selectedComponent, onSearch }) => {
    const [menuData, setMenuData] = useState([]);
    const [openMenus, setOpenMenus] = useState({});
    const [selectedItem, setSelectedItem] = useState(null);
    const [indication, setIndication] = useState(null);

    const handleDeleteMenu = (id) => {
        setMenuData(prev => prev.filter(menu => menu.id !== id));
    };


    // 监听来自外部传入的组件信息
    useEffect(() => {
        setIndication("awaiting")
        if (selectedComponent) {
            const id = `menu-${Date.now()}`;
            const newMenu = {
                id,
                title: `组件 ${selectedComponent.组件编号}：${selectedComponent.组件类型}`,
                children: [
                    {
                        id: `${id}-full`,
                        title: JSON.stringify(selectedComponent, null, 2)  // 美化后的 JSON 字符串
                    }
                ]
            };
            setMenuData(prev => [...prev, newMenu]);
        }
    }, [selectedComponent]);

    // 添加一个新的菜单组
    const handleAddMenu = () => {
        const id = `menu-${Date.now()}`;
        const newMenu = {
            id,
            title: `栏目 ${menuData.length + 1}`,
            children: [
                { id: `${id}-sub1`, title: "子栏目 1" },
                { id: `${id}-sub2`, title: "子栏目 2" },
            ],
        };
        setMenuData([...menuData, newMenu]);
    };

    const handleToggle = (id) => {
        setOpenMenus((prev) => ({
            ...prev,
            [id]: !prev[id],
        }));
    };

    const handleItemClick = (item) => {
        setSelectedItem(item.title);
    };

    const sendCombinedSpecWithFetch = async (e) => {
        const specList = menuData.flatMap(item =>
            item.children.map(child => child.title)
        );

        const payload = {
            spec: "Combined Spec",
            save_name: "combined_spec_001",
            spec_list: specList
        };

        try {
            setIndication("sending")
            await onSearch(JSON.stringify(payload))
            setIndication("success")
        } catch (error) {
            setIndication("awaiting")
            console.error("发送失败:", error);
            alert("发送失败，请检查控制台日志");
        }
    };

    return (
        <Box sx={{ p: 2, backgroundColor: "#f0f0f0" }}>
            <Box sx={{display: "flex", flexDirection: "row", gap: 2}}>
                <Button variant="contained" onClick={handleAddMenu} sx={{ display: "flex", mb:2, gap: 2, alignItems: "center" }}>
                    添加栏目
                </Button>
                <Button variant="contained" onClick={sendCombinedSpecWithFetch} sx={{ display: "flex", mb:2, gap: 2, alignItems: "center"  }}>
                    合并上传
                </Button>
                <pre>{indication}</pre>
            </Box>


            <List>
                {menuData.map((item) => (
                    <React.Fragment key={item.id}>
                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                pr: 1,
                                backgroundColor: '#fff',
                            }}
                        >
                            <ListItemButton
                                onClick={() => handleToggle(item.id)}
                                sx={{ flex: 1 }}
                            >
                                <ListItemText primary={item.title} />
                                {item.children ? (
                                    openMenus[item.id] ? <ExpandLess /> : <ExpandMore />
                                ) : null}
                            </ListItemButton>

                            <IconButton
                                edge="end"
                                aria-label="delete"
                                onClick={() => handleDeleteMenu(item.id)}
                                size="small"
                                sx={{ ml: 1 }}
                            >
                                <DeleteIcon fontSize="small" />
                            </IconButton>
                        </Box>
                        {item.children && (
                            <Collapse in={openMenus[item.id]} timeout="auto" unmountOnExit>
                                <List component="div" disablePadding>
                                    {item.children.map((child) => (
                                        <ListItemButton
                                            key={child.id}
                                            sx={{ pl: 4 }}
                                            onClick={() => handleItemClick(child)}
                                        >
                                            <ListItemText primary={child.title} />
                                        </ListItemButton>
                                    ))}
                                </List>
                            </Collapse>
                        )}
                    </React.Fragment>
                ))}
            </List>

            {selectedItem && (
                <Typography variant="subtitle1" sx={{ mt: 2 }}>
                    当前点击栏目：{selectedItem}
                </Typography>
            )}
        </Box>
    );
};

export default Comp2Menu;
