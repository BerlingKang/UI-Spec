// SpecTreeWithDnD.js
import React, { useState, useEffect } from 'react';
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
import { useDrag, useDrop, DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import {generateCode as createCode} from './APIsolver';
import {code_1} from './Parameters';

const ITEM_TYPE = 'COMPONENT';

function assignIds(data) {
    if (!data || !Array.isArray(data.components)) return { components: [] };
    let idCounter = 1;
    const assign = (node) => {
        node.id = node.id || `comp-${idCounter++}`;
        if (node.children) node.children.forEach(assign);
    };
    data.components.forEach(assign);
    return data;
}

const RecursiveComponent = ({ component, index, level = 1, moveComponent }) => {
    const [open, setOpen] = useState(false);
    const hasChildren = Array.isArray(component.children) && component.children.length > 0;

    const [{ isDragging }, dragRef] = useDrag({
        type: ITEM_TYPE,
        item: { id: component.id },
        collect: monitor => ({ isDragging: monitor.isDragging() }),
    });

    const [, dropRef] = useDrop({
        accept: ITEM_TYPE,
        drop: item => {
            if (item.id !== component.id) moveComponent(item.id, component.id);
        },
    });

    const getComponentName = (component, index) => {
        if (component.type && component.content) {
            return `${component.type}: ${component.content}`;
        }
        const text = component.text || {};
        if (text.main && text.sub) return `${text.main}: ${text.sub}`;
        if (text.main) return text.main;
        if (text.activeItem) return `Active: ${text.activeItem}`;
        if (text.placeholder) return `Placeholder: ${text.placeholder}`;
        return `Component ${index + 1}`;
    };

    return (
        <>
            <ListItemButton
                ref={node => dragRef(dropRef(node))}
                sx={{ pl: 2 + level * 2, opacity: isDragging ? 0.5 : 1 }}
                onClick={() => setOpen(prev => !prev)}
            >
                <ListItemText primary={getComponentName(component, index)} />
                {hasChildren ? (open ? <ExpandLess /> : <ExpandMore />) : null}
            </ListItemButton>

            {hasChildren && (
                <Collapse in={open} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                        {component.children.map((child, idx) => (
                            <RecursiveComponent
                                key={child.id}
                                component={child}
                                index={idx}
                                level={level + 1}
                                moveComponent={moveComponent}
                            />
                        ))}
                    </List>
                </Collapse>
            )}
        </>
    );
};

const SpecTree = ({ data, generateCode, spec_console }) => {
    const [treeData, setTreeData] = useState(assignIds(JSON.parse(JSON.stringify(data))));
    const [open, setOpen] = useState(true);

    useEffect(() => {
        setTreeData(assignIds(JSON.parse(JSON.stringify(data))));
    }, [data]);

    const handleToggle = () => setOpen(prev => !prev);

    const generate_code = async (e) => {
        const payload = {
            save_name: "generate_code_1",
            spec: treeData,
        };
        try{
            const response = generateCode(JSON.stringify(payload));
            console.log('this is data',response.data)
        } catch (err) {
            console.log(err)
        }
    }

    const moveComponent = (fromId, toId) => {
        const newData = JSON.parse(JSON.stringify(treeData));
        let fromNode = null;

        // 1. Remove from root level if matching
        newData.components = newData.components.filter(child => {
            if (child.id === fromId) {
                fromNode = child;
                return false;
            }
            return true;
        });

        // 2. Remove from nested children
        const removeRecursively = node => {
            if (!node.children) return;
            node.children = node.children.filter(child => {
                if (child.id === fromId) {
                    fromNode = child;
                    return false;
                }
                removeRecursively(child);
                return true;
            });
        };
        newData.components.forEach(removeRecursively);

        // If still not found, abort
        if (!fromNode) return;

        // 3. Insert under target node
        const insertRecursively = node => {
            if (node.id === toId) {
                node.children = node.children || [];
                node.children.push(fromNode);
            } else if (node.children) {
                node.children.forEach(insertRecursively);
            }
        };
        newData.components.forEach(insertRecursively);

        setTreeData(newData);
    };

    const get_spec_console = async () => {
        const payload = {
            save_name: "generate_code_1",
            spec: treeData,
        };
        console.log("get_spec_console step1")
        spec_console(JSON.stringify(payload));
    }

    return (
        <DndProvider backend={HTML5Backend}>
            <Box sx={{ width: '100%', borderRight: '1px solid #ddd', p: 1, gap: 2, mt: 1 }}>
                <Typography sx={{ fontSize: '24px' }}>Layers</Typography>
                <Box sx={{ height: '5px', backgroundColor: '#c2c2c5', my: 2 }} />

                <Typography
                    variant="h6"
                    onClick={handleToggle}
                    sx={{ cursor: 'pointer', userSelect: 'none', mt: 3 }}
                >
                    {open ? <ExpandLess /> : <ExpandMore />} Page 1
                </Typography>

                <Collapse in={open} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                        {treeData.components?.map((comp, idx) => (
                            <RecursiveComponent
                                key={comp.id}
                                component={comp}
                                index={idx}
                                level={1}
                                moveComponent={moveComponent}
                            />
                        ))}
                    </List>
                </Collapse>

                <Box sx={{ mt: 2 }}>
                    <Button variant="contained" fullWidth onClick={generate_code} sx={{ p: 2 }}>
                        Use Spec to generate code
                    </Button>
                    <Button
                        variant="outlined"
                        fullWidth
                        onClick={get_spec_console}
                        sx={{ p: 2, mt: 1 }}
                    >
                        generate Preview
                    </Button>
                </Box>
            </Box>
        </DndProvider>
    );
};

export default SpecTree;
