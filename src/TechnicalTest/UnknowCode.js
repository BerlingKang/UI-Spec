import React from "react";
import {
    Layout,
    Menu,
    Card,
    Input,
    Space,
    Avatar,
    Typography,
    Button,
    List,
    Statistic,
} from "antd";
import {
    DashboardOutlined,
    BookOutlined,
    TeamOutlined,
    ReadOutlined,
    MessageOutlined,
    SettingOutlined,
    MailOutlined,
    BellOutlined,
    UserOutlined,
    PlayCircleOutlined,
} from "@ant-design/icons";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const { Sider, Header, Content } = Layout;
const { Text, Title } = Typography;

// Color scheme
const COLORS = {
    white: "#FFFFFF",
    paleGrey: "#F6F8FA",
    paleGrey2: "#F4F6F8",
    lakeGreen: "#45BFA7",
    coralRed: "#F86A5A",
    mustard: "#FBC843",
    graphiteGrey: "#72777A",
    deepCharcoal: "#212A32",
    moonGrey: "#E5EAEF",
    pink: "#FADBE7",
};

const SIDEBAR_WIDTH = 280;
const TOPBAR_HEIGHT = 90;

function Logo() {
    return (
        <a
            href="#"
            style={{
                display: "flex",
                alignItems: "center",
                padding: "0 28px",
                height: 72,
                textDecoration: "none",
            }}
        >
      <span
          style={{
              display: "flex",
              alignItems: "center",
              marginRight: 16,
          }}
      >
        <svg width={42} height={42} style={{ display: 'block' }}>
          <circle cx="17" cy="22" r="15" fill={COLORS.coralRed} />
          <circle cx="26" cy="15" r="15" fill={COLORS.lakeGreen} fillOpacity={0.9} />
        </svg>
      </span>
            <span>
        <Text
            style={{
                fontWeight: 700,
                fontSize: 23,
                color: COLORS.deepCharcoal,
                letterSpacing: 1,
            }}
        >
          E-Learning
        </Text>
      </span>
        </a>
    );
}

function SidebarMenu() {
    // Menu Icon map strictly in order
    const menuData = [
        {
            key: "dashboard",
            icon: <DashboardOutlined style={{ fontSize: 20 }} />,
            label: "Dashboard",
        },
        {
            key: "myclass",
            icon: <BookOutlined style={{ fontSize: 20 }} />,
            label: "My Class",
        },
        {
            key: "instructors",
            icon: <TeamOutlined style={{ fontSize: 20 }} />,
            label: "Instructors",
        },
        {
            key: "courses",
            icon: <ReadOutlined style={{ fontSize: 20 }} />,
            label: "Courses",
        },
        {
            key: "groupchats",
            icon: <MessageOutlined style={{ fontSize: 20 }} />,
            label: "Group Chats",
        },
        {
            key: "settings",
            icon: <SettingOutlined style={{ fontSize: 20 }} />,
            label: "Settings",
        },
    ];

    return (
        <Menu
            mode="inline"
            selectedKeys={["dashboard"]}
            style={{
                border: "none",
                marginTop: 24,
                background: "transparent",
                flex: 1,
            }}
            itemStyle={{
                height: 54,
            }}
        >
            {menuData.map((item) => (
                <Menu.Item
                    key={item.key}
                    icon={<span style={{ color: COLORS.deepCharcoal }}>{item.icon}</span>}
                    style={{
                        display: "flex",
                        alignItems: "center",
                        fontWeight: 600,
                        fontSize: 18,
                        marginBottom: 6,
                        color:
                            item.key === "dashboard"
                                ? COLORS.deepCharcoal
                                : COLORS.graphiteGrey,
                        background:
                            item.key === "dashboard"
                                ? COLORS.moonGrey
                                : "transparent",
                        borderRadius: 20,
                        height: 50,
                        marginLeft: 16,
                        marginRight: 16,
                        paddingLeft: 12,
                    }}
                >
                    {item.label}
                </Menu.Item>
            ))}
        </Menu>
    );
}

// SVG Illustration: studying person
function LearnIllustration() {
    return (
        <svg
            width="92"
            height="78"
            viewBox="0 0 92 78"
            fill="none"
            style={{ margin: "0 auto", display: "block" }}
        >
            <ellipse cx="46" cy="74" rx="38" ry="4" fill="#45BFA7" opacity="0.25" />
            <circle cx="33" cy="29" r="15" fill="#FBC843" />
            <ellipse cx="61" cy="33.5" rx="13" ry="13.5" fill="#4695EF" />
            <rect x="30" y="43" width="33" height="17" rx="5" fill="#fff" />
            <rect x="36" y="49" width="21" height="5" rx="2" fill="#F86A5A" />
            <circle cx="48" cy="44" r="7" fill="#fff" />
            <ellipse cx="48" cy="39.5" rx="2.5" ry="2.5" fill="#4695EF" />
            <ellipse cx="50" cy="42" rx="1" ry="1" fill="#FBC843" />
            {/* "Person" (simplified, cartoon) */}
            <rect x="44" y="33" width="8" height="10" rx="4" fill="#F86A5A" />
            <ellipse cx="48" cy="32" rx="4" ry="4" fill="#fff" />
            <ellipse cx="48" cy="33" rx="1.1" ry="1.3" fill="#8D6E63" />
            {/* Arm */}
            <rect
                x="53"
                y="42"
                width="12"
                height="4"
                rx="2"
                fill="#FBC843"
                transform="rotate(13 53 42)"
            />
        </svg>
    );
}

function SidebarCard() {
    return (
        <Card
            style={{
                borderRadius: 32,
                margin: "0 18px 18px 18px",
                marginTop: 32,
                background: COLORS.coralRed,
                color: COLORS.white,
                overflow: "hidden",
                boxShadow: "0 4px 24px rgba(248,106,90,0.09)",
                border: "none",
                minHeight: 210,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
            }}
            bodyStyle={{
                padding: "24px 18px 16px 18px",
                minHeight: 170,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
            }}
        >
            <LearnIllustration />
            <div style={{ marginTop: 18, marginBottom: 6 }}>
                <Text
                    style={{
                        color: COLORS.white,
                        fontWeight: 700,
                        fontSize: 18,
                        textAlign: "center",
                    }}
                >
                    Keep Learning!
                </Text>
            </div>
            <Button
                style={{
                    marginTop: 8,
                    background: COLORS.white,
                    color: COLORS.coralRed,
                    fontWeight: 600,
                    fontSize: 16,
                    borderRadius: 20,
                    padding: "4px 18px",
                    border: "none",
                    boxShadow: "0 2px 8px rgba(248,106,90,0.12)",
                }}
                size="large"
                type="text"
            >
                Join Course
            </Button>
        </Card>
    );
}

function Sidebar() {
    return (
        <Sider
            width={SIDEBAR_WIDTH}
            style={{
                background: COLORS.white,
                minHeight: "100vh",
                boxShadow: "4px 0 35px rgba(49,60,82,0.03)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                borderTopRightRadius: 32,
                borderBottomRightRadius: 32,
                overflow: "hidden",
                padding: 0,
            }}
        >
            <div>
                <Logo />
                <SidebarMenu />
            </div>
            <SidebarCard />
        </Sider>
    );
}

// Topbar User information block
function TopbarUserInfo() {
    return (
        <Space
            size={22}
            style={{
                background: COLORS.white,
                border: `1.5px solid ${COLORS.moonGrey}`,
                borderRadius: 32,
                padding: "8px 16px 8px 16px",
                height: 56,
                boxShadow: "0 2px 8px rgba(49,60,82,0.04)",
                alignItems: "center",
            }}
        >
            <MailOutlined
                style={{ fontSize: 22, color: COLORS.deepCharcoal, opacity: 0.87 }}
            />
            <BellOutlined
                style={{ fontSize: 22, color: COLORS.deepCharcoal, opacity: 0.87 }}
            />
            <div style={{ display: "flex", alignItems: "center" }}>
                <Avatar
                    src="https://randomuser.me/api/portraits/women/44.jpg"
                    alt="Madhu's avatar"
                    size={48}
                    style={{ marginRight: 14 }}
                />
                <div>
                    <Text
                        style={{
                            display: "block",
                            fontWeight: 600,
                            fontSize: 17,
                            color: COLORS.deepCharcoal,
                        }}
                    >
                        Madhu
                    </Text>
                    <Text
                        style={{
                            display: "block",
                            color: COLORS.graphiteGrey,
                            fontSize: 13,
                        }}
                    >
                        @madhu_2k
                    </Text>
                </div>
            </div>
        </Space>
    );
}

function TopbarSearch() {
    return (
        <Input
            allowClear={false}
            prefix={
                <svg
                    width="20"
                    height="20"
                    style={{ marginRight: 7 }}
                    fill="none"
                    viewBox="0 0 20 20"
                >
                    <circle
                        cx="9"
                        cy="9"
                        r="7"
                        stroke={COLORS.deepCharcoal}
                        strokeWidth="1.8"
                    />
                    <rect
                        width="2.2"
                        height="6.2"
                        rx="1.1"
                        transform="matrix(0.71 0.71 -0.71 0.71 14 14)"
                        fill={COLORS.deepCharcoal}
                    />
                </svg>
            }
            placeholder="Search for query"
            style={{
                background: COLORS.paleGrey2,
                border: "none",
                borderRadius: 24,
                fontSize: 17,
                color: COLORS.graphiteGrey,
                height: 48,
                width: 330,
                paddingLeft: 16,
                boxShadow: "0 2px 8px rgba(49,60,82,0.04)",
            }}
            bordered={false}
        />
    );
}

function Topbar() {
    return (
        <Header
            style={{
                height: TOPBAR_HEIGHT,
                padding: "0 36px 0 18px",
                background: COLORS.paleGrey,
                borderTopLeftRadius: 32,
                borderTopRightRadius: 32,
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                boxShadow: "0 2px 14px rgba(49,60,82,0.03)",
                zIndex: 1,
                position: "sticky",
                top: 0,
            }}
        >
            <TopbarSearch />
            <TopbarUserInfo />
        </Header>
    );
}

// Analytics overview illustration (two people celebrating)
function AnalyticsIllustration() {
    return (
        <svg
            width="198"
            height="168"
            viewBox="0 0 198 168"
            fill="none"
            style={{display: "block", marginLeft: "auto"}}
        >
            {/* background elements */}
            <ellipse cx="116" cy="158" rx="60" ry="9" fill="#FBC843" fillOpacity="0.15" />
            {/* person one */}
            <ellipse cx="60" cy="68" rx="24" ry="26" fill="#FBC843" />
            {/* body */}
            <rect x="52" y="94" width="17" height="38" rx="7" fill="#F86A5A" />
            <rect x="54" y="102" width="13" height="12" rx="6" fill="#fff" />
            {/* head */}
            <ellipse cx="61" cy="90" rx="9" ry="9" fill="#fff" />
            <ellipse cx="61" cy="93" rx="2" ry="2" fill="#8D6E63" />
            {/* left arm holding certificate */}
            <rect x="32" y="106" width="26" height="6" rx="3" fill="#4695EF" transform="rotate(-15 32 106)" />
            <rect x="29" y="102" width="10" height="12" rx="2" fill="#FBC843" />
            {/* person two */}
            <ellipse cx="133" cy="81" rx="24" ry="21" fill="#fff" />
            <rect x="124" y="108" width="17" height="30" rx="7" fill="#45BFA7" />
            <rect x="126" y="113" width="13" height="10" rx="5" fill="#fff" />
            <ellipse cx="133" cy="105" rx="9" ry="9" fill="#fff" />
            <ellipse cx="133" cy="109" rx="2" ry="2.5" fill="#212A32" />
            {/* grad cap */}
            <rect x="126" y="98" width="13" height="4" rx="2" fill="#F86A5A" />
            <polygon
                points="127,97 132.5,90 138,97"
                fill="#F86A5A"
            />
            {/* celebratory confetti */}
            <circle cx="106" cy="70" r="3" fill="#F86A5A" />
            <circle cx="150" cy="60" r="3" fill="#FBC843" />
            <circle cx="170" cy="87" r="5" fill="#45BFA7" />
            <rect x="145" y="130" width="4" height="15" rx="2" fill="#4695EF" />
            <rect x="110" y="125" width="4" height="15" rx="2" fill="#FBC843" transform="rotate(-20 110 125)" />
            <rect x="120" y="30" width="2.5" height="14" rx="1.25" fill="#45BFA7" />
            {/* secondary backgrounds */}
            <ellipse cx="100" cy="155" rx="50" ry="7" fill="#45BFA7" fillOpacity="0.08" />
        </svg>
    );
}

function AnalyticsOverview() {
    return (
        <Card
            style={{
                borderRadius: 38,
                background: COLORS.lakeGreen,
                color: COLORS.white,
                border: "none",
                padding: 0,
                boxShadow: "0 4px 24px rgba(69,191,167,0.13)",
            }}
            bodyStyle={{
                padding: "0",
            }}
        >
            <div
                style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "stretch",
                    width: "100%",
                }}
            >
                {/* Left Content */}
                <div
                    style={{
                        flex: 1.28,
                        minWidth: 0,
                        padding: "48px 48px 48px 44px",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                    }}
                >
                    <Text
                        style={{
                            color: COLORS.deepCharcoal,
                            fontWeight: 700,
                            fontSize: 21,
                            marginBottom: 22,
                            letterSpacing: 1,
                            opacity: 0.78,
                        }}
                    >
                        Analytics Overview
                    </Text>
                    <Title
                        level={2}
                        style={{
                            color: COLORS.white,
                            margin: 0,
                            fontSize: 34,
                            fontWeight: 700,
                            lineHeight: 1.18,
                        }}
                    >
                        Learn With <br /> Effectively With Us!
                    </Title>
                    <Text
                        style={{
                            color: COLORS.white,
                            fontSize: 17,
                            margin: "17px 0 28px 0",
                            display: "block",
                            opacity: 0.88,
                            fontWeight: 500,
                        }}
                    >
                        Get 30% OFF every course on January
                    </Text>
                    <Space size={36} style={{ marginTop: 20 }}>
                        <div style={{ display: "flex", alignItems: "center" }}>
              <span
                  style={{
                      background: COLORS.coralRed,
                      borderRadius: 13,
                      display: "flex",
                      width: 42,
                      height: 42,
                      justifyContent: "center",
                      alignItems: "center",
                      marginRight: 13,
                  }}
              >
                <UserOutlined style={{ color: COLORS.white, fontSize: 21 }} />
              </span>
                            <div>
                                <Text
                                    style={{
                                        color: COLORS.white,
                                        fontWeight: 700,
                                        fontSize: 19,
                                    }}
                                >
                                    40,000+
                                </Text>
                                <br />
                                <Text
                                    style={{
                                        color: COLORS.white,
                                        fontSize: 14,
                                        opacity: 0.9,
                                    }}
                                >
                                    Students
                                </Text>
                            </div>
                        </div>
                        <div style={{ display: "flex", alignItems: "center" }}>
              <span
                  style={{
                      background: COLORS.mustard,
                      borderRadius: 13,
                      display: "flex",
                      width: 42,
                      height: 42,
                      justifyContent: "center",
                      alignItems: "center",
                      marginRight: 13,
                  }}
              >
                <TeamOutlined style={{ color: COLORS.white, fontSize: 21 }} />
              </span>
                            <div>
                                <Text
                                    style={{
                                        color: COLORS.white,
                                        fontWeight: 700,
                                        fontSize: 19,
                                    }}
                                >
                                    200+
                                </Text>
                                <br />
                                <Text
                                    style={{
                                        color: COLORS.white,
                                        fontSize: 14,
                                        opacity: 0.9,
                                    }}
                                >
                                    Expert Mentors
                                </Text>
                            </div>
                        </div>
                    </Space>
                </div>
                {/* Right Illustration */}
                <div
                    style={{
                        flex: 1,
                        minWidth: 0,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        paddingRight: 28,
                    }}
                >
                    <AnalyticsIllustration />
                </div>
            </div>
        </Card>
    );
}

// Course List Card
const courseList = [
    {
        icon: "U",
        name: "UI/UX Design",
        count: "35+ Courses",
        color: COLORS.mustard,
    },
    {
        icon: "M",
        name: "Marketing",
        count: "25+ Courses",
        color: COLORS.coralRed,
    },
    {
        icon: "W",
        name: "Web Development",
        count: "45+ Courses",
        color: COLORS.lakeGreen,
    },
    {
        icon: "M",
        name: "Mathematics",
        count: "40+ Courses",
        color: COLORS.pink,
    },
];
function PopularCoursesCard() {
    return (
        <Card
            bordered={false}
            style={{
                borderRadius: 32,
                background: COLORS.white,
                boxShadow: "0 6px 30px 0 rgba(49,60,82,0.04)",
                height: "100%",
                minHeight: 358,
                display: "flex",
                flexDirection: "column",
                justifyContent: "stretch",
            }}
            bodyStyle={{ padding: "32px 28px 22px 28px", flex: 1, display: "flex", flexDirection: "column", }}
        >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Text
                    style={{
                        color: COLORS.deepCharcoal,
                        fontWeight: 700,
                        fontSize: 21,
                        letterSpacing: 1,
                    }}
                >
                    Popular Courses
                </Text>
                <a href="#" style={{ color: COLORS.lakeGreen, fontWeight: 700, fontSize: 16 }}>All Courses</a>
            </div>
            <List
                style={{ marginTop: 22 }}
                dataSource={courseList}
                split={false}
                renderItem={(item, index) => (
                    <List.Item
                        style={{
                            padding: "0 0 0 0",
                            marginBottom: index < 3 ? 18 : 0,
                            border: "none",
                            borderRadius: 18,
                            background: "transparent",
                        }}
                    >
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                width: "100%",
                            }}
                        >
              <span
                  style={{
                      background: item.color,
                      width: 45,
                      height: 45,
                      borderRadius: 15,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 22,
                      fontWeight: 700,
                      color: COLORS.white,
                      marginRight: 18,
                      flexShrink: 0,
                  }}
              >
                {item.icon}
              </span>
                            <div style={{ flexGrow: 1 }}>
                                <Text style={{ color: COLORS.deepCharcoal, fontWeight: 600, fontSize: 17 }}>{item.name}</Text>
                                <br />
                                <Text style={{ color: COLORS.graphiteGrey, fontSize: 14 }}>{item.count}</Text>
                            </div>
                            <Button
                                type="text"
                                style={{
                                    background:
                                        item.name === "Marketing"
                                            ? COLORS.coralRed
                                            : COLORS.white,
                                    color:
                                        item.name === "Marketing"
                                            ? COLORS.white
                                            : COLORS.graphiteGrey,
                                    border:
                                        item.name === "Marketing"
                                            ? "none"
                                            : `1.5px solid ${COLORS.moonGrey}`,
                                    fontWeight: 600,
                                    fontSize: 15,
                                    borderRadius: 18,
                                    padding: "4px 18px",
                                    marginLeft: "auto",
                                    boxShadow:
                                        item.name === "Marketing"
                                            ? "0 2px 8px rgba(248,106,90,0.09)"
                                            : undefined,
                                    transition: "all 0.15s",
                                }}
                            >
                                View Course
                            </Button>
                        </div>
                    </List.Item>
                )}
            />
        </Card>
    );
}

// Progress Chart Data
const progressData = [
    { name: "Jan", uv: 15 },
    { name: "Feb", uv: 23 },
    { name: "Mar", uv: 36 },
    { name: "Apr", uv: 40 },
    { name: "May", uv: 48 },
    { name: "Jun", uv: 41 },
    { name: "Jul", uv: 44 },
    { name: "Aug", uv: 58 },
];

function ProgressAreaCard() {
    return (
        <Card
            style={{
                borderRadius: 34,
                background: "linear-gradient(118deg,#42c3ab 60%,#45bfa7 100%)",
                color: COLORS.white,
                boxShadow: "0 4px 24px rgba(69,191,167,0.10)",
                minHeight: 224,
                border: "none",
                display: "flex",
                flexDirection: "column",
            }}
            bodyStyle={{
                padding: "32px 34px 20px 30px",
                display: "flex",
                flexDirection: "column",
                alignItems: "stretch",
                minHeight: 180,
            }}
        >
            <Text style={{ fontSize: 18, fontWeight: 700, color: COLORS.white }}>Monthly Progress</Text>
            <Text style={{ color: COLORS.white, opacity: 0.81, marginBottom: 12, fontSize: 15 }}>
                This is the recent improvement
            </Text>
            <div style={{ width: "100%", flex: "1 1 0px", minHeight: 86 }}>
                <ResponsiveContainer width="100%" height={86}>
                    <AreaChart data={progressData}>
                        <defs>
                            <linearGradient id="progress-gradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="10%" stopColor="#fff" stopOpacity={0.5} />
                                <stop offset="100%" stopColor="#fff" stopOpacity={0.1} />
                            </linearGradient>
                        </defs>
                        <XAxis dataKey="name" axisLine={false} tickLine={false} stroke="#E6E8EB" fontSize={12} />
                        <YAxis hide domain={[10, 65]} />
                        <Tooltip
                            wrapperStyle={{ borderRadius: 12, boxShadow: "0 2px 14px rgba(49,60,82,0.14)", padding: 8 }}
                            contentStyle={{ borderRadius: 12, background: "#fff", color: COLORS.deepCharcoal, fontWeight: 600, fontSize: 15, border: "none" }}
                            labelStyle={{ color: COLORS.lakeGreen, fontWeight: 700 }}
                            cursor={{ stroke: COLORS.coralRed, strokeWidth: 2, fill: "#F86A5A22" }}
                        />
                        <Area
                            type="monotone"
                            dataKey="uv"
                            stroke="#fff"
                            strokeWidth={3}
                            fill="url(#progress-gradient)"
                            dot={{ r: 4, fill: "#fff", stroke: COLORS.coralRed, strokeWidth: 2 }}
                            activeDot={{ r: 6, fill: COLORS.coralRed, stroke: "#fff", strokeWidth: 2 }}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </Card>
    );
}

function StatisticSmallCard({ value, label, bgColor, icon }) {
    return (
        <Card
            style={{
                flex: 1,
                marginRight: 18,
                borderRadius: 24,
                background: bgColor,
                color: COLORS.white,
                minHeight: 100,
                border: "none",
                boxShadow: "0 2px 14px 0 rgba(49,60,82,.08)",
                display: "flex",
                alignItems: "center",
                justifyContent: "start",
            }}
            bodyStyle={{ padding: "23px 20px 18px 20px", display: "flex", alignItems: "center" }}
        >
      <span
          style={{
              background: "#fff4",
              borderRadius: 16,
              marginRight: 16,
              width: 44,
              height: 44,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
          }}
      >
        {icon}
      </span>
            <div>
                <Text
                    style={{
                        display: "block",
                        fontSize: 19,
                        fontWeight: 700,
                        color: COLORS.white,
                        marginBottom: 3,
                    }}
                >
                    {value}
                </Text>
                <Text
                    style={{
                        display: "block",
                        fontSize: 14,
                        color: COLORS.white,
                    }}
                >
                    {label}
                </Text>
            </div>
        </Card>
    );
}

function ProgressAreaWithStatistics() {
    return (
        <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
            <ProgressAreaCard />
            <div style={{ display: "flex", marginTop: 18 }}>
                <StatisticSmallCard
                    value="45K+"
                    label="Completed Course"
                    bgColor={COLORS.mustard}
                    icon={
                        <ReadOutlined style={{ color: COLORS.white, fontSize: 22 }} />
                    }
                />
                <StatisticSmallCard
                    value="20K+"
                    label="Video Courses"
                    bgColor={COLORS.coralRed}
                    icon={
                        <PlayCircleOutlined style={{ color: COLORS.white, fontSize: 22 }} />
                    }
                />
            </div>
        </div>
    );
}

// Instructors Card
const instructors = [
    {
        avatar: "https://randomuser.me/api/portraits/men/15.jpg",
        name: "Abdullah",
        field: "5 Design Course",
    },
    {
        avatar: "https://randomuser.me/api/portraits/men/23.jpg",
        name: "Ashik",
        field: "8 Design Course",
    },
    {
        avatar: "https://randomuser.me/api/portraits/women/25.jpg",
        name: "Tasnim Nahar",
        field: "6 Design Course",
    },
    {
        avatar: "https://randomuser.me/api/portraits/men/24.jpg",
        name: "Iqbal Hossen",
        field: "9 Design Course",
    },
];
function BestInstructorsCard() {
    return (
        <Card
            style={{
                borderRadius: 32,
                background: COLORS.white,
                boxShadow: "0 6px 30px 0 rgba(49,60,82,0.03)",
                minHeight: 358,
                height: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "stretch",
            }}
            bodyStyle={{
                padding: "32px 28px 22px 28px",
                minHeight: 320,
                flex: 1,
                display: "flex",
                flexDirection: "column",
            }}
            bordered={false}
        >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Text
                    style={{
                        color: COLORS.deepCharcoal,
                        fontWeight: 700,
                        fontSize: 21,
                        letterSpacing: 1,
                    }}
                >
                    Best Instructors
                </Text>
                <a href="#" style={{ color: COLORS.lakeGreen, fontWeight: 700, fontSize: 16 }}>See All</a>
            </div>
            <List
                style={{ marginTop: 22 }}
                dataSource={instructors}
                split={false}
                renderItem={(item, idx) => (
                    <List.Item
                        style={{
                            padding: "0 0 0 0",
                            marginBottom: idx < 3 ? 18 : 0,
                            border: "none",
                            borderRadius: 18,
                            background: "transparent",
                            alignItems: "center",
                        }}
                    >
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                width: "100%",
                            }}
                        >
                            <Avatar
                                src={item.avatar}
                                alt={item.name}
                                size={46}
                                style={{
                                    marginRight: 18,
                                    boxShadow: "0 2px 14px rgba(49,60,82,0.10)",
                                }}
                            />
                            <div style={{ flexGrow: 1 }}>
                                <Text style={{ color: COLORS.deepCharcoal, fontWeight: 600, fontSize: 17 }}>{item.name}</Text>
                                <br />
                                <Text style={{ color: COLORS.graphiteGrey, fontSize: 14 }}>{item.field}</Text>
                            </div>
                            <Button
                                type="text"
                                style={{
                                    background:
                                        item.name === "Ashik"
                                            ? COLORS.coralRed
                                            : COLORS.white,
                                    color:
                                        item.name === "Ashik"
                                            ? COLORS.white
                                            : COLORS.graphiteGrey,
                                    border:
                                        item.name === "Ashik"
                                            ? "none"
                                            : `1.5px solid ${COLORS.moonGrey}`,
                                    fontWeight: 600,
                                    fontSize: 15,
                                    borderRadius: 18,
                                    padding: "4px 18px",
                                    marginLeft: "auto",
                                    boxShadow:
                                        item.name === "Ashik"
                                            ? "0 2px 8px rgba(248,106,90,0.09)"
                                            : undefined,
                                    transition: "all 0.15s",
                                }}
                            >
                                Course
                            </Button>
                        </div>
                    </List.Item>
                )}
            />
        </Card>
    );
}

function MainContent() {
    return (
        <Layout
            style={{
                background: COLORS.paleGrey,
                minHeight: "100vh",
                borderTopLeftRadius: 32,
                borderBottomLeftRadius: 32,
                overflow: "hidden",
                padding: "36px 36px 36px 0",
                boxSizing: "border-box",
            }}
        >
            <Topbar />
            <Content style={{ marginTop: 28, flex: 1, }}>
                {/* Analytics Overview */}
                <div
                    style={{
                        marginBottom: 32,
                        minHeight: 290,
                    }}
                >
                    <AnalyticsOverview />
                </div>
                {/* 3-Column Main content grid */}
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr 1fr",
                        gap: 34,
                        width: "100%",
                        minHeight: 340,
                    }}
                >
                    <div>
                        <PopularCoursesCard />
                    </div>
                    <div>
                        <ProgressAreaWithStatistics />
                    </div>
                    <div>
                        <BestInstructorsCard />
                    </div>
                </div>
            </Content>
        </Layout>
    );
}

function App() {
    // Ensure page is 1920x1080 (simulated)
    return (
        <div
            style={{
                width: 1920,
                height: 1080,
                minWidth: 1920,
                minHeight: 1080,
                background: COLORS.paleGrey2,
                overflow: "hidden",
                display: "flex",
            }}
        >
            <Sidebar />
            <div
                style={{
                    width: 1920 - SIDEBAR_WIDTH,
                    minHeight: 1080,
                    background: COLORS.paleGrey2,
                    borderTopRightRadius: 36,
                    borderBottomRightRadius: 36,
                    overflow: "hidden",
                }}
            >
                <MainContent />
            </div>
        </div>
    );
}

export default App;