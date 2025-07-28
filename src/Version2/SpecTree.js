import React, { useState, useEffect } from 'react';
import {
    Box,
    List,
    Button,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Collapse,
    Typography,
    Divider,
} from '@mui/material';
import { ExpandLess, ExpandMore } from '@mui/icons-material';
import { useDrag, useDrop, DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

// SVG 图标导入
import { ReactComponent as IconRoot } from './icon/Vector.svg';
import { ReactComponent as IconRegion } from './icon/layout-list.svg';
import { ReactComponent as IconFeature } from './icon/ordered-list.svg';

const ITEM_TYPE = 'COMPONENT';

/**
 * 转换原始 JSON 为树结构，附带原始数据 raw
 */
function transformData(rawData) {
    const regions = rawData?.['页面构成']?.['区域划分'];
    if (!Array.isArray(regions)) return { components: [], raw: rawData };

    const components = regions.map(region => {
        const regionName = region['区域名称'] || 'Unnamed Region';
        const children = Array.isArray(region['包含组件'])
            ? region['包含组件'].map(item => ({
                text: { main: item['承担的功能'] || 'Unnamed Function' },
                raw: item,
            }))
            : [];
        return {
            text: { main: regionName },
            children,
            raw: region,
        };
    });

    return { components, raw: rawData };
}

const RecursiveComponent = ({ component, index, level = 1, moveComponent, selectedId, onSelect }) => {
    const [open, setOpen] = useState(false);
    const hasChildren = Array.isArray(component.children) && component.children.length > 0;
    const [{ isDragging }, dragRef] = useDrag({
        type: ITEM_TYPE,
        item: { id: component.id },
        collect: monitor => ({ isDragging: monitor.isDragging() }),
    });
    const [, dropRef] = useDrop({ accept: ITEM_TYPE, drop: item => item.id !== component.id && moveComponent(item.id, component.id) });

    const getComponentName = () => component.text?.main || `Component ${index + 1}`;
    const renderIcon = () => (level === 1 ? <IconRegion width={20} height={20} /> : <IconFeature width={16} height={16} />);

    return (
        <>
            <ListItemButton
                ref={node => dragRef(dropRef(node))}
                selected={component.id === selectedId}
                sx={{ pl: 2 + level * 2, opacity: isDragging ? 0.5 : 1 }}
                onClick={() => {
                    setOpen(prev => !prev);
                    onSelect(component);
                }}
            >
                <ListItemIcon>{renderIcon()}</ListItemIcon>
                <ListItemText primary={getComponentName()} />
                {hasChildren && (open ? <ExpandLess /> : <ExpandMore />)}
            </ListItemButton>
            {hasChildren && (
                <Collapse in={open} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                        {component.children.map((child, idx) => (
                            <RecursiveComponent
                                key={child.id || idx}
                                component={child}
                                index={idx}
                                level={level + 1}
                                moveComponent={moveComponent}
                                selectedId={selectedId}
                                onSelect={onSelect}
                            />
                        ))}
                    </List>
                </Collapse>
            )}
        </>
    );
};

const SpecTree = ({ data = {}, generateCode, spec_console, setSelectedComponent, updateSpecData }) => {
    const [selectedId, setSelectedId] = useState(null);
    const [selectedNode, setSelectedNode] = useState(null);
    const [treeData, setTreeData] = useState({ components: [], raw: null });

    // 赋予节点唯一 ID
    const assignIds = raw => {
        if (!raw?.components) return { components: [], raw: raw.raw };
        let idCounter = 1;
        const assign = node => {
            node.id = node.id || `comp-${idCounter++}`;
            if (node.children) node.children.forEach(assign);
        };
        raw.components.forEach(assign);
        return raw;
    };

    useEffect(() => {
        if (!data || Object.keys(data).length === 0) {
            setTreeData({ components: [], raw: null });
            return;
        }
        const transformed = transformData(data);
        setTreeData(assignIds(transformed));
    }, [data]);

    // 在 SpecTree 组件内部，紧跟现有的 useEffect([data]) 之后
    useEffect(() => {
        if (!updateSpecData || !selectedId) return;

        setTreeData(oldTree => {
            // 1. 深拷贝
            const newTree = JSON.parse(JSON.stringify(oldTree));

            // 2. 如果选中的是根节点
            if (selectedId === 'root') {
                // 把整个 raw 换掉，然后重新生成 components
                const transformed = transformData(updateSpecData);
                const withIds = assignIds(transformed);
                return withIds;
            }

            // 3. 否则递归查找并更新
            const recursiveUpdate = nodes => {
                return nodes.map(node => {
                    if (node.id === selectedId) {
                        // 更新 raw
                        node.raw = updateSpecData;
                        // 同步 text.main，比如根节点是“区域划分”节点
                        const mainText =
                            updateSpecData['承担的功能'] ||
                            updateSpecData['区域名称'] ||
                            node.text.main;
                        node.text = { main: mainText };
                    }
                    if (node.children) {
                        node.children = recursiveUpdate(node.children);
                    }
                    return node;
                });
            };

            newTree.components = recursiveUpdate(newTree.components);
            return newTree;
        });
    }, [updateSpecData]);


    // 点击节点
    const handleSelect = component => {
        setSelectedId(component.id);
        setSelectedNode(component.raw || component);
        setSelectedComponent?.(component.raw || component);
    };

    // 点击根节点
    const handleRootSelect = () => {
        setSelectedId('root');
        setSelectedNode(treeData.raw);
        setSelectedComponent?.(treeData.raw);
    };

    const [open, setOpen] = useState(true);
    const handleToggle = () => setOpen(prev => !prev);

    // 根节点 Header
    const RootHeader = () => (
        <ListItemButton
            selected={selectedId === 'root'}
            onClick={() => {
                handleToggle();
                handleRootSelect();
            }}
            sx={{ cursor: 'pointer', userSelect: 'none' }}
        >
            <ListItemIcon><IconRoot width={24} height={24} /></ListItemIcon>
            <ListItemText primary="页面构成" />
            {open ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
    );

    const generate_code = async () => {
        try {
            const payload = { save_name: 'generate_code_1', spec: treeData };
            console.log(payload);
            const res = await generateCode(JSON.stringify(payload));
            console.log(res.data);
        } catch (e) {
            console.error(e);
        }
    };
    const preview = () => spec_console(JSON.stringify({ save_name: 'generate_code_1', spec: treeData }));

    const moveComponent = (fromId, toId) => {
        const newData = JSON.parse(JSON.stringify(treeData));
        let dragged = null;
        const filterOut = nodes => nodes.filter(n => {
            if (n.id === fromId) { dragged = n; return false; }
            if (n.children) n.children = filterOut(n.children);
            return true;
        });
        newData.components = filterOut(newData.components);
        if (!dragged) return;
        const insertInto = nodes => nodes.map(n => {
            if (n.id === toId) n.children = [...(n.children||[]), dragged];
            else if (n.children) insertInto(n.children);
            return n;
        });
        newData.components = insertInto(newData.components);
        setTreeData(newData);
    };

    return (
        <DndProvider backend={HTML5Backend}>
            <Box sx={{ display: 'flex', width: '100%', mt: 1, height:'100%'}}>
                {/* 左侧树状列表 */}
                <Box sx={{ width: '60%', borderRight: '1px solid #ddd', p: 1, overflowY:'auto' }}>
                    <Typography sx={{ fontSize: '24px' }}>Layers</Typography>
                    <Box sx={{ height: '5px', backgroundColor: '#c2c2c5', my: 2 }} />
                    <RootHeader />
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <List disablePadding>
                            {treeData.components.map((comp, i) => (
                                <RecursiveComponent
                                    key={comp.id}
                                    component={comp}
                                    index={i}
                                    level={1}
                                    moveComponent={moveComponent}
                                    selectedId={selectedId}
                                    onSelect={handleSelect}
                                />
                            ))}
                        </List>
                    </Collapse>
                    <Box sx={{ mt: 2 }}>
                        <Button fullWidth variant="contained" onClick={generate_code} sx={{ p: 2 }}>Use Spec to generate code</Button>
                        <Button fullWidth variant="outlined" onClick={preview} sx={{ p: 2, mt: 1 }}>Generate Preview</Button>
                    </Box>
                </Box>

                {/* 右侧详情展示 */}
                <Box sx={{ width: '40%', p: 2 }}>
                    <Typography sx={{ fontSize: '20px', mb: 1 }}>Selected Data</Typography>
                    <Divider sx={{ mb: 2 }} />
                    <Box component="pre" sx={{ whiteSpace: 'pre-wrap', wordBreak: 'break-all', maxHeight: 600, overflow: 'auto', bgcolor: '#f5f5f5', p: 2, borderRadius: 1 }}>
                        {selectedNode ? JSON.stringify(selectedNode, null, 2) : 'Click a node to see details'}
                    </Box>
                </Box>
            </Box>
        </DndProvider>
    );
};

export default SpecTree;
