import React, { useState } from "react";
import SpecUploadPane from "./SpecView";
import { testString2 as input_text, response as input_response} from "./Parameters";
import Comp2Menu from './Listview';
import DynamicRenderer from "./CodePane";
import SideBar from "./SideBar";
import { combineSpec, editSpec, generateCode, imageToSpec } from "./APIsolver";


const Layout = () => {
    const [post, setPost] = useState([]);
    const [code, setCode] = useState("");
    const [selectedComponent, setSelectedComponent] = useState(null);

    const testString2 = input_text;

    const apiSpec = async (body) => {

        try {
            // const response = await combineSpec(body);
            // const rawString = response.data.spec; // 是带有 ```json 的字符串

            // 提取 ```json ... ``` 中的内容
            const regex = /```json\s*([\s\S]*?)\s*```/;
            // const match = rawString.match(regex);
            const match = testString2.match(regex);

            if (!match || !match[1]) {
                throw new Error("未匹配到 JSON 数据块");
            }

            const jsonString = match[1].trim(); // ⚠️ 去除开头结尾的空格与换行

            const dataObject = JSON.parse(jsonString); // ✅ 成功解析
            console.log("最终 JSON 对象:", dataObject);

            setPost(dataObject); // ✅ 更新状态
        } catch (err) {
            console.error("解析出错:", err);
        }

    }

    const edit = async (body) => {
        try{
            const editResponse = await editSpec(body);

            const editRawString = editResponse;

            console.log("getting from the service\n", editResponse)

            // const regex = /```json\s*([\s\S]*?)\s*```/;
            // const match = editRawString.match(regex);
            // // const match = testString2.match(regex);
            //
            // if (!match || !match[1]) {
            //     throw new Error("未匹配到 JSON 数据块");
            // }
            //
            // const jsonString = match[1].trim(); // ⚠️ 去除开头结尾的空格与换行
            //
            // const dataObject = JSON.parse(jsonString); // ✅ 成功解析
            console.log("最终 JSON 对象:", editRawString.data.spec);

            return editRawString.data.spec;
        } catch (err) {
            console.warn(err)
        }
    };

    const [renderImage, setRenderImage] = useState(null);
    const generate = async (body) => {
        try{
            console.log("start generating")
            const response = await generateCode(body);
            // const response = input_response;
            console.log("Using the generating API:", response)
            setRenderImage(response.data.render_image);
            setCode(response.data.code)
        } catch (err) {
            console.log(err)
        }
    }

    return (
        <div style={{ display: "flex", height: "100vh" }}>
            {/* Sidebar with menu */}
            <div style={{ width: '350px', minWidth: "350px",
                maxWidth: "350px", backgroundColor: '#f0f0f0' }}>
                <SideBar spec={post} generate={generate} editSpec={edit} onItemClick={(data) => {
                    console.log("点击内容：", data);
                }}/>
            </div>

            {/* Main content area */}
            <div style={{ flex: 1, padding: "16px", display: "flex", flexDirection: "column", overflow: "auto" }}>
                <div style={{ display: "flex", marginBottom: "16px", gap: "16px" }}>
                    <div style={{ flex: 1, backgroundColor: "#cce5ff", padding: "12px" }}>
                        <SpecUploadPane onComponentClick={setSelectedComponent}/>
                        {/*<ImageToSpecUploader />*/}
                    </div>
                    <div style={{ flex: 1, backgroundColor: "#d4edda", padding: "12px" }}>
                        <Comp2Menu selectedComponent={selectedComponent} onSearch={apiSpec} />
                    </div>
                </div>
                <div style={{ flex: 1, backgroundColor: "#fff3cd", padding: "12px" }}>
                    {renderImage && (
                        <img
                            src={
                                renderImage.startsWith("data:")
                                    ? renderImage
                                    : `data:image/png;base64,${renderImage}`
                            }
                            alt="生成结果"
                            style={{ marginTop: 16, border: "1px solid #ccc", maxWidth: "100%" }}
                        />
                    )}

                </div>
                <div style={{ flex: 1, backgroundColor: "#ffb0b3", padding: 20 }}>
                    <h2>动态代码渲染：</h2>
                    {code ? <DynamicRenderer code={code} /> : <div>正在加载...</div>}
                </div>
            </div>
        </div>
    );
};

export default Layout;
