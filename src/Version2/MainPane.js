import React, {useEffect, useState} from "react";
import {Box, Typography, Tab, Tabs} from "@mui/material";  // 推荐使用 MUI 布局组件，纯 CSS 也可
import { testString2 as input_text, response as input_response, code_response as input_code, code_1, code_2, spec_1} from "./Parameters";
import { combineSpec, generateCode as get_code_from_API, imageToSpec, editSpec, textToSpec, imageReference } from "./APIsolver";

import CodeBar from "./CodePane";
import UploadBar from "./UploadBar";
import SpecTree from "./SpecTree";
import DetailPane from "./DetailPane";
import ReferencePane from "./ReferencePane";
import TextToSpecBar from "./TextToSpecBar";


const MainPane = () => {
    const [codeList, setCodeList] = useState([]);
    const [value, setValue] = useState(0);
    const [generalSpecData, setGeneralSpecData] = useState(null); // 这个是整个项目中用于生成代码的spec树，对树的任何修改都应该更新在这里
    const [generatedImage, setGeneratedImage] = useState(null);


    const [selectedComponent, setSelectedComponent] = useState(null); //用于传递在spectree组件中被选中的spec属性
    const [selectedSpecData, setSelectedSpecData] = useState(null); //用于传递在upload组件中被选中的spec属性

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    useEffect(() => {
        /**
         * 用于检测两个内容是否都选择全了的方法，会输出内容到控制台
         * 仅用于debug，没有任何阻断功能
         */
        console.log('Selected Component:', selectedComponent);
        console.log('Selected Spec:', selectedSpecData);
    }, [selectedComponent, selectedSpecData]);

    /**
     * 通过Spec树生成代码的方法
     * @param body
     * @returns {Promise<void>}
     */
    let indicater = 1;
    const generateCode = async (body) => {
        try{
            console.log("start generating")
            // const response = await get_code_from_API(body);
            let response = null;
            if (indicater === 1) {
                response = code_1;
            }
            else if (indicater === 2) {
                response = code_2
            }
            console.log("Using the generating API:", response);
            setCodeList((prev) => [...prev, response.data.code]);
            indicater = indicater + 1 // TODO: 这个地方是例子，记得改回去用API的
            return response;
        } catch (err) {
            console.log(err)
        }
    }

    /**
     * 通过文本生成spec界面的方法
     * @param body
     * @returns {Promise<void>}
     */
    const text_to_spec = async (body) => {
        try{
            console.log("start generating");
            const response = await textToSpec(body);
            return response;
        } catch (err){
            console.log(err);
        }
    }

    /**
     * 通过上传局部图片来实现生成局部spec的方法
     * @param body
     * @returns {Promise<void>}
     */
    const image_reference = async (body) => {
        try {
            console.log("start posting");
            const response = await imageReference(body);
            console.log("Getting response:", response)
            return response;
        }catch (err){
            console.log(err)
        }
    }

    /**
     * 通过图片获取spec的方法
     * @param body
     * @returns {Promise<void>}
     */
    const image_to_spec = async (body) => {
        try {
            console.log("start posting");
            const response = await imageToSpec(body);
            console.log("Getting response:", response);
            return response;
        }catch (err){
            console.log("error occur when using image_to_spec", err);
        }
    }

    /**
     * 组合spec获取新的spec的方法
     * @param body
     * @returns {Promise<void>}
     */
    const combine_spec = async (body) => {
        try {
            console.log("start posting");
            const response = await combineSpec(body);
            console.log("Getting response:", response)
        }catch (err){
            console.log(err)
        }
    }

    /**
     * 编辑spec的方法
     * @param body
     * @returns {Promise<void>}
     */
    const edit_spec = async (body) =>{
        try {
            console.log("start posting");
            const response = await editSpec(body);
            console.log("Getting response:", response);
            // TODO 这个地方应该重新考虑怎么把对应的修改后的spec传回到spectree中。吃个饭再想jpg
            return response;
        }catch (err){
            console.log(err)
        }
    }

    const spec_console = async (body) =>{
        try {
            // const response = await get_code_from_API(body);
            const response = code_1;
            console.log(response.data.render_image);
            const base64 = response.data.render_image;
            setGeneratedImage(`data:image/png;base64,${base64}`);
        }catch (err){
            console.log(err);
        }
    }

    return (
        <Box sx={{ height: "100vh", display: "flex", flexDirection: "column" }}>
            <Box
                sx={{
                    display:"flex",
                    height: "50px",
                    backgroundColor: "#d2d2d3"
                }}
            >
                Logo Top bar
            </Box>

            {/*主体容器*/}
            <Box
                sx={{
                    display: "flex",
                    height: "100vh",   // 全屏高度
                    width: '100%'
                }}
            >

                {/* 左侧 */}
                <Box
                    sx={{
                        flex: '0 0 20%',
                        backgroundColor: "#fdfdfe",
                        p: 2,
                        minWidth: '180px'
                    }}
                >
                    <SpecTree data={generalSpecData} generateCode={generateCode} spec_console={spec_console} setSelectedComponent={setSelectedComponent}/>
                </Box>


                {/*右侧两个*/}
                <Box
                    sx={{
                        display:'flex',
                        flex:"1 1 80%",
                        backgroundColor:"#f1f2f7",
                        p:2,
                        flexDirection:'column',
                        maxWidth:'80%',
                    }}
                >
                    <Tabs
                        value={value}
                        onChange={handleChange}
                        indicatorColor="primary"
                        textColor="primary"
                        sx={{
                            '& .MuiTab-root': {
                                textTransform: 'none',
                                fontWeight: 500,
                                px: 3,
                                borderRadius: '6px 6px 0 0',
                                minHeight: '40px',
                            },
                            '& .Mui-selected': {
                                color: '#fff',
                            },
                        }}
                    >
                        <Tab label="Edit UI" />
                        <Tab label="Generate UI" />
                    </Tabs>
                    <Box sx={{
                        display:'flex',
                        flex:1,
                        backgroundColor:"#f1f2f7",
                        p:2,
                        flexDirection:'column',
                        maxWidth:'100%',
                        maxHeight:'90%',
                    }}>
                        {/**
                            第一个界面，用于提供更细节的界面编辑和修改的功能。
                         */}
                        <Box
                            sx={{
                                display: value === 0 ? 'flex' : 'none',
                                flex: 1,
                                backgroundColor: "#f1f2f7",
                                height:'90%',
                                width:'100%',
                                flexDirection: 'row'
                            }}
                        >
                            <Box
                                sx={{
                                    display: "flex",
                                    width: '75%',
                                    backgroundColor: "#f1f2f7",
                                    gap: 4,
                                    p: 2,
                                    height: '100%',
                                    flexDirection: 'column'
                                }}
                            >
                                <Box
                                    sx={{
                                        display: 'flex',
                                        flex: 1,
                                        flexDirection: 'column',
                                        height: '100%',
                                        width:'100%'
                                    }}
                                >

                                    <Typography sx={{fontSize: '24px'}}>
                                        Edit UI
                                    </Typography>

                                    <Box sx={{
                                        width:'100%',
                                        display: 'flex',
                                        flex: 1,
                                        overflowY: 'auto',
                                        flexDirection: 'column',
                                    }}>
                                        {codeList.map((code, index) => (
                                            <Box
                                                key={index}
                                                sx={{
                                                    display: "flex",
                                                    flex: "1 1 0%",        // → 按 0 基准、允许增长也允许收缩
                                                    maxWidth: "100%",       // ← 绝对不超出父容器 75%
                                                    gap: 2,
                                                    mb: 4,
                                                    border: "1px solid #ccc",
                                                    p: 2,
                                                    borderRadius: 1,
                                                    backgroundColor: "#fafafa",
                                                }}
                                            >
                                                <Box
                                                    sx={{
                                                        display: "flex",
                                                        flexDirection: "column",
                                                        width: "100%",
                                                        maxWidth: "100%",
                                                        overflowY: "auto",
                                                        border: "1px solid #ddd",
                                                        p: 1,
                                                    }}
                                                >
                                                    <h3>动态代码渲染 #{index + 1}</h3>
                                                    <Box
                                                        sx={{
                                                            flex: "1 1 auto",
                                                            minWidth: 0,             // 再次保证子元素可收缩
                                                            overflowX: "auto",       // 代码本身过长时水平滚动
                                                        }}
                                                    >
                                                        <CodeBar code={code} />
                                                    </Box>
                                                </Box>
                                            </Box>
                                        ))}

                                    </Box>

                                    <Box sx={{
                                        mt: "auto", maxWidth:'100%'
                                    }}>
                                        <UploadBar image_reference={image_reference} edit_spec={edit_spec}
                                                   data={generalSpecData} selectSpec={setSelectedSpecData}/>
                                    </Box>
                                </Box>
                            </Box>

                            <Box sx={{
                                display: "flex",
                                width: '25%',
                                backgroundColor: "#ffffff",
                                gap: 4,
                                p: 2,
                                height: '100%',
                                flexDirection: 'column'
                            }}>
                                <DetailPane selectedComponent={selectedComponent}
                                            selectedSpecData={selectedSpecData}
                                            edit_spec={edit_spec}
                                />
                            </Box>
                        </Box>

                        {/**
                            第二个界面，用于查看通过文本直接生成初始界面预览
                         */}
                        <Box
                            sx={{
                                display: value === 1 ? 'flex' : 'none',
                                flex: 1,
                                backgroundColor: "#f1f2f7",
                                height:'75%',
                                width:'100%',
                                flexDirection: 'row'
                            }}
                        >
                            <Box
                                sx={{
                                    display: "flex",
                                    width: '75%',
                                    backgroundColor: "#f1f2f7",
                                    gap: 4,
                                    p: 2,
                                    height: '100%',
                                    flexDirection: 'column'
                                }}
                            >
                                <Box
                                    sx={{
                                        display: 'flex',
                                        flex: 1,
                                        flexDirection: 'column',
                                        height: '100%',
                                        width:'100%'
                                    }}
                                >

                                    <Typography sx={{fontSize: '24px'}}>
                                        GenerateUI
                                    </Typography>

                                    <Box
                                        component="img"
                                        src={generatedImage || null}
                                        alt="Logo"
                                        sx={{ width: '100%', height: '55%' }}
                                    />

                                    <Box sx={{mt: "auto"}}>
                                        <TextToSpecBar text_to_spec={text_to_spec} setTextToSpec={setGeneralSpecData} />
                                    </Box>
                                </Box>
                            </Box>

                            <Box
                                sx={{
                                    display: "flex",
                                    width: '25%',
                                    backgroundColor: "#ffffff",
                                    gap: 4,
                                    p: 2,
                                    height: '100%',
                                    flexDirection: 'column',
                                    overflowY: 'auto'
                                }}
                            >
                                <ReferencePane getImageReference={image_to_spec}/>
                            </Box>

                        </Box>
                    </Box>

                </Box>

            </Box>
        </Box>
    );
};

export default MainPane;
