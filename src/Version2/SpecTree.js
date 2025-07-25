import React, { useState } from 'react';
import {
    Box,
    List,
    Button,
    ListItemButton,
    ListItemText,
    Collapse,
    Typography,
} from '@mui/material';
import { ExpandLess, ExpandMore } from '@mui/icons-material';

/**
 * 根据组件结构提取主名称
 */
const getComponentName = (component, index) => {
    if (component.text?.main) return component.text.main;
    if (Array.isArray(component.text?.menuItems)) return 'Navigation Tabs';
    if (component.text?.placeholder) return 'Search Box';
    return `Component ${index + 1}`;
};

/**
 * 提取子组件的名字（例如 icon、button 等）
 */
const getChildName = (child, index) => {
    if (child.type === 'icon' && child.content) {
        return `Icon: ${child.content}`;
    }
    return `${child.type || 'Child'} ${index + 1}`;
};

const RecursiveComponent = ({ component, index, level = 1 }) => {
    const [open, setOpen] = useState(false);

    const name = getComponentName(component, index);

    const hasChildren = Array.isArray(component.children) && component.children.length > 0;

    return (
        <>
            <ListItemButton
                sx={{ pl: 2 + level * 2 }}
                onClick={() => setOpen((prev) => !prev)}
            >
                <ListItemText primary={name} />
                {hasChildren ? (open ? <ExpandLess /> : <ExpandMore />) : null}
            </ListItemButton>

            {hasChildren && (
                <Collapse in={open} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                        {component.children.map((child, idx) => (
                            <ListItemButton key={idx} sx={{ pl: 2 + (level + 1) * 2 }}>
                                <ListItemText primary={getChildName(child, idx)} />
                            </ListItemButton>
                        ))}
                    </List>
                </Collapse>
            )}
        </>
    );
};

const SpecTree = ({ data, generateCode }) => {
    const [open, setOpen] = useState(true);

    const handleToggle = () => {
        setOpen(!open);
    };

    return (
        <Box sx={{ width: "100%", borderRight: '1px solid #ddd', p: 1, gap:2, mt:1 }}>
            <Typography sx={{fontSize: '24px'}}>
                Layers
            </Typography>
            <Box sx={{ height: "5px", backgroundColor: "#c2c2c5", my: 2 }} />
            <Typography
                variant="h6"
                onClick={handleToggle}
                sx={{ cursor: 'pointer', userSelect: 'none', mt:3 }}
            >
                {open ? <ExpandLess /> : <ExpandMore />} Page 1
            </Typography>

            <Collapse in={open} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                    {data.components?.map((comp, index) => (
                        <RecursiveComponent key={index} component={comp} index={index} level={1} />
                    ))}
                </List>
            </Collapse>

            <Box>
                <Button variant="contained" component="label" sx={{width: "100%", p:2}} onClick={generateCode}>
                    Generate
                </Button>
            </Box>
        </Box>
    );
};

export default SpecTree;
