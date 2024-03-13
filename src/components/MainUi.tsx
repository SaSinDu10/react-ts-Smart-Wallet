import React, { ReactNode, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Layout, Menu, MenuProps,Image } from "antd";
import {
    HomeOutlined,
    //UserAddOutlined,
    TeamOutlined,
    UserOutlined,
    BookOutlined,
    SnippetsOutlined,
    //DiffOutlined,
} from "@ant-design/icons";

const { Content, Sider } = Layout;
type MenuItem = Required<MenuProps>["items"][number];
function getItem(
    label: React.ReactNode,
    key: React.Key,
    icon?: React.ReactNode,
    children?: MenuItem[]
): MenuItem {
    return { key, icon, children, label } as MenuItem;
}

const items = [
    getItem("Home", "1", <HomeOutlined />),
    getItem("Students", "sub1", <UserOutlined />, [
        getItem("View Students", "2", <TeamOutlined />),
        //getItem("Add Student", "3", <UserAddOutlined />),
    ]),
    getItem("Courses", "sub2", <BookOutlined />, [
        getItem("View Courses", "4", <SnippetsOutlined />),
        //getItem("Add Course", "5", <DiffOutlined />),
    ]),
];

const MainUi = ({ children }: { children: ReactNode }) => {
    const [collapsed, setCollapsed] = useState(false);
    const navigate = useNavigate();

    return (
        <Layout style={{ minHeight: "100vh" }}>
            <Sider
                collapsible
                collapsed={collapsed}
                onCollapse={(value) => setCollapsed(value)}
            >
                <Image src="/logo192.png" width="100%" preview={false} style={{
                    margin: "10px 0",
                    objectFit: "scale-down"
                }} />
                <div className="demo-logo-vertical" />
                <Menu
                    theme="dark"
                    defaultSelectedKeys={["1"]}
                    mode="inline"
                    style={{padding: "0 8px",gap: 30}}
                    items={items}
                    onClick={({ key }) => {
                        switch (key) {
                            case "1":
                                navigate("/dashboard");
                                break;
                            case "2":
                                navigate("/students");
                                break;
                            case "3":
                                navigate("/addStudent");
                                break;
                            case "4":
                                navigate("/courses");
                                break;
                            case "5":
                                navigate("/addCourse");
                                break;
                            default:
                                break;
                        }
                    }}
                />
            </Sider>
            <Layout>

                <Content>{children}</Content>

            </Layout>
        </Layout>
    );
};

export default MainUi;
