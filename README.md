# 银龄守护 · 家属端 Web 系统 —— 项目总体分析

> 智慧养老 · 家属端（Web）。面向家属用户，用于远程守护多位老人的健康、用药、紧急求助与通知状态。
> 本文档为项目整体技术分析，覆盖架构、目录规范、数据模型、状态管理、路由、功能模块与数据流。

---

## 1. 项目概述

「银龄守护」是一个 **纯前端 mock 演示项目**：不依赖真实后端接口，通过 `public/mock/*.json` + Axios 读取静态数据，注册账号等写操作降级到 `localStorage`。核心业务围绕「**一位家属账号可绑定并管理多位老人**」展开。

### 核心能力

| 模块 | 说明 |
| --- | --- |
| 登录 / 注册 | 家属账号登录；注册写入本地（无后端） |
| 首页看板 | 老人概览、统计卡片、今日用药计划、最新动态、近 7 天用药统计 |
| 用药管理 | 用药计划的增删改、启用停用、**图片上传** |
| 通知中心 | 第三方渠道（App / 微信 / 邮箱）通知，分类 Tab + 已读/处理 |
| 老人存档 | 多老人切换、健康打卡记录、求助记录 |
| 远程协助 | 老人设备投影（占位演示） |
| 异常页 | 404 / 403（移动端访问拦截） |

---

## 2. 技术栈

| 类别 | 技术 | 版本 | 说明 |
| --- | --- | --- | --- |
| 框架 | Vue 3 | ^3.5.13 | `<script setup lang="ts">` 组合式 API |
| 语言 | TypeScript | ~5.7.3 | `strict` + `noUnusedLocals` + `noUnusedParameters` |
| 构建 | Vite | ^6.2.0 | `@vitejs/plugin-vue`，`@` 别名 → `src` |
| UI | Element Plus | ^2.9.3 | 中文 locale，图标全局注册 |
| 状态 | Pinia | ^3.0.1 | setup 风格 store |
| 路由 | Vue Router | ^4.5.0 | `createWebHistory` |
| HTTP | Axios | ^1.7.9 | 统一实例，读取本地 mock |
| 样式 | Less | devDep | CSS 变量 + 青蓝主题 |

`package.json` 脚本：

```jsonc
{
  "dev": "vite",
  "build": "vue-tsc -b && vite build",
  "type-check": "vue-tsc --noEmit",
  "preview": "vite preview"
}
```

---

## 3. 目录结构

```
web-test/
├── public/
│   ├── favicon.svg
│   └── mock/                    # 前端 mock 数据（Axios 读取）
│       ├── users.json           #   家属账号
│       ├── elders.json          #   老人档案
│       ├── bindings.json        #   家属-老人绑定关系
│       ├── healthRecords.json   #   健康打卡记录
│       ├── medications.json     #   用药计划
│       ├── medicationRecords.json # 用药打卡记录
│       ├── notifications.json   #   通知（含渠道 channel）
│       └── sosRecords.json      #   紧急求助记录
├── src/
│   ├── api/                     # 数据访问层（axios 实例 + 各域模块）
│   ├── assets/less/             # 全局样式（variables.less / index.less）
│   ├── components/common/       # 通用组件（RiskTag / StatCard）
│   ├── hooks/                   # 组合式函数（useRiskLevel）
│   ├── layout/                  # 布局（Layout / menu / navigate / conent）
│   ├── pages/                   # 页面（按业务功能组织）
│   ├── router/                  # 路由（routes / guards / index）
│   ├── store/                   # Pinia 状态（auth / elder / health / medication / notification / sos）
│   ├── types/                   # 类型（type / vo / dto / enum）
│   ├── utils/                   # 工具（format / risk）
│   ├── App.vue
│   ├── env.d.ts
│   └── main.ts
├── md/                          # 项目文档（本文档）
├── index.html
├── package.json
├── tsconfig*.json
└── vite.config.ts
```

> 目录命名遵循「按职责分层 + 按业务分包」：`pages`（视图）、`store`（状态）、`hooks`（逻辑复用）、`types`（类型）、`api`（请求）、`components/common`（通用组件）、`assets/less`（样式）。

---

## 4. 分层架构

```
┌─────────────────────────────────────────────┐
│  pages（视图层，只负责展示与交互）              │
│  login / register / dashboard / medication    │
│  notification / archive / assist / error      │
└───────────────┬─────────────────────────────┘
                │ 读写
┌───────────────▼─────────────────────────────┐
│  store（Pinia 状态层，业务数据 + 派生计算）     │
│  auth / elder / health / medication /         │
│  notification / sos                          │
└───────────────┬─────────────────────────────┘
                │ 调用
┌───────────────▼─────────────────────────────┐
│  api（数据访问层，axios 封装）                 │
│  request.ts + auth/elder/health/medication/   │
│  notification/sos                            │
└───────────────┬─────────────────────────────┘
                │ 读取
┌───────────────▼─────────────────────────────┐
│  public/mock/*.json（静态数据源）             │
└─────────────────────────────────────────────┘
```

- **hooks**（`useRiskLevel`）与 **utils**（`risk.ts`/`format.ts`）为横切逻辑，被 pages/store 复用。
- **types** 统一为纯 `interface` / `type` 定义，无运行时代码，供全项目类型约束。

---

## 5. 数据模型（types）

### 5.1 基础联合类型 `type.ts`

| 类型 | 取值 |
| --- | --- |
| `RiskLevel` | `normal` / `watch` / `alert` |
| `NotificationType` | `medication`（未按时服药）/ `inactive`（长时间未活跃）/ `sos`（紧急求助） |
| `NotificationChannel` | `app`（App 推送）/ `wechat`（微信）/ `email`（邮箱） |
| `MedicationRecordStatus` | `pending` / `taken` / `missed` |
| `SosStatus` | `pending` / `handled` |

### 5.2 视图对象 `vo/`（View Object）

| 接口 | 关键字段 |
| --- | --- |
| `UserVO` | id / username / password / name / phone / avatar |
| `ElderVO` | id / name / age / gender / address / emergencyContact / emergencyPhone / riskLevel / lastActiveAt |
| `BindingVO` | id / userId / elderId |
| `HealthRecordVO` | id / elderId / date / mood / remark / createdAt |
| `MedicationVO` | id / elderId / name / dosage / frequency / time / note / image / enabled |
| `MedicationRecordVO` | id / elderId / medicationId / medicationName / dosage / scheduledTime / takenAt / status / date |
| `NotificationVO` | id / elderId / type / channel / title / content / createdAt / read / handled |
| `SosRecordVO` | id / elderId / triggeredAt / status / handledAt / note |

### 5.3 输入对象 `dto/`（Data Transfer Object）

| 接口 | 用途 | 关键字段 |
| --- | --- | --- |
| `LoginDTO` | 登录表单 | username / password |
| `RegisterDTO` | 注册表单 | name / phone / username / password / confirmPassword |
| `MedicationDTO` | 用药计划表单 | elderId / name / dosage / frequency / time / note / image / enabled |

### 5.4 枚举与常量 `enum/`

| 常量 | 说明 |
| --- | --- |
| `RISK_LEVEL_META` | 风险等级 → 标签 / 颜色 / 背景 / tagType |
| `NOTIFICATION_TYPE_META` | 通知类型 → 标签 / 颜色 / 图标 |
| `CHANNEL_META` | 通知渠道 → 标签 / 颜色 / 图标 |
| `MOOD_OPTIONS` | 健康打卡心情选项 |
| `FREQUENCY_OPTIONS` | 用药频率选项 |
| `MOCK_BASE_URL` | `'/mock'` |
| `TODAY` | 演示场景「今天」=`'2026-10-12'`（与 mock 日期对齐） |

> `src/types/index.ts` 统一 re-export `./type`、`./enum`、`./vo`、`./dto`，业务层统一 `import ... from '@/types'`。

---

## 6. 状态管理（Pinia）

全部采用 **setup 风格** store，返回 `ref` / `computed` / 方法。

| Store | 状态 | 派生 / 方法 |
| --- | --- | --- |
| `auth` | token / user | `isAuthenticated` / `displayName`；`login` / `logout`（token、user 持久化到 `localStorage`） |
| `elder` | elders / currentElderId | `currentElder`；`loadElders`（按绑定关系过滤）/ `setCurrentElder` |
| `medication` | medications / records | `medicationsOf(elderId)` / `recordsOf(elderId)`；`addMedication` / `updateMedication` / `removeMedication` / `toggleEnabled` / `init` |
| `health` | healthRecords | `recordsOf(elderId)`；`init` |
| `notification` | notifications | `listOf(elderId)` / `unreadCount(elderId)`；`markRead` / `markAllRead` / `markHandled` / `init` |
| `sos` | sosRecords | `recordsOf(elderId)` / `hasPending(elderId)`；`handleSos` / `init` |

### 关键设计：多老人数据隔离

所有业务数据（健康、用药、通知、求助）在 store 中 **全量持有**，通过 `recordsOf(elderId)` / `listOf(elderId)` 等 **按 `elderId` 过滤** 返回派生数据：

```ts
// store/medication.ts
const recordsOf = computed(() => (elderId: string) =>
  records.value
    .filter((r) => r.elderId === elderId)
    .sort((a, b) => (a.scheduledTime < b.scheduledTime ? 1 : -1)),
)
```

页面统一通过 `elderStore.currentElder`（当前选中老人）取数，**切换老人后所有页面自动跟随刷新**。

---

## 7. 路由与守卫

### 7.1 路由表 `router/routes.ts`

| 路径 | name | 说明 |
| --- | --- | --- |
| `/login` | login | 登录（public） |
| `/register` | register | 注册（public） |
| `/`（Layout） | — | 主布局，`redirect: /dashboard` |
| `/dashboard` | dashboard | 首页看板 |
| `/medication` | medication | 用药管理 |
| `/notification` | notification | 通知中心 |
| `/archive` | archive | 老人存档（含老人切换） |
| `/assist` | assist | 远程协助 |
| `/error` | error | 异常页（404/403） |
| `/:pathMatch(.*)*` | — | 兜底 → `/error?code=404` |

### 7.2 守卫 `router/guards.ts`

```ts
router.beforeEach((to) => {
  // 1. 错误页直接放行
  if (to.name === 'error') return true
  // 2. 移动端 UA 拦截 → 403（家属端仅支持 PC）
  if (isMobileDevice()) return { name: 'error', query: { code: '403' } }
  // 3. 未登录访问受保护页 → 跳登录（携带 redirect）
  if (!isPublic && !authStore.isAuthenticated) return { name: 'login', query: { redirect: to.fullPath } }
  // 4. 已登录访问登录/注册页 → 跳看板
  if (isPublic && authStore.isAuthenticated) return { name: 'dashboard' }
  return true
})
```

`afterEach` 负责设置文档标题：`{title} · 银龄守护`。

---

## 8. 功能模块

### 8.1 登录 / 注册

- `LoginView.vue`：账号密码登录，默认演示账号 `family01 / 123456`。
- `RegisterView.vue`：姓名 + 手机号 + 账号 + 密码 + 确认密码，校验后调用 `apiRegister`。
- `api/auth.ts`：注册账号写入 `localStorage`（`eldercare_registered_users`），登录时合并 mock 用户与本地注册用户做匹配；无后端接口。

### 8.2 首页看板 `DashboardView.vue`

- **老人概览**：头像、姓名、年龄、性别、风险等级 `RiskTag`、最后活跃、紧急联系人。
- **4 张统计卡**：今日用药（已服/计划）、今日健康打卡、未处理求助、未读通知。
- **今日用药计划**：按当前老人启用计划 + 今日打卡状态（已服用/待服用/漏服）。
- **最新动态**：前 5 条通知。
- **近 7 天用药统计**：纯 CSS 柱状图（已服用 vs 漏服），按 `medicationStore.records` 聚合。
- 风险等级由 `useRiskLevel` 动态计算（见 9.2）。

### 8.3 用药管理 `MedicationView.vue`

- 表格：药品名称（含缩略图）、剂量、频率、时间、备注、状态、操作。
- 添加/编辑弹窗：药品名、剂量、频率、时间、备注、**药品图片上传**、启用状态。
- **图片上传**：`el-upload`（`auto-upload=false`）+ `FileReader` 转 base64 存入 `form.image`；单张 ≤ 2MB，预览 + 移除。
- `MedicationDTO` / `MedicationVO` 增加 `image?: string` 字段。

### 8.4 通知中心 `NotificationView.vue`

- 分类 Tab：全部 / 紧急求助 / 未按时服药 / 长时间未活跃。
- 卡片展示：类型图标、标题、内容、**渠道徽标**（`CHANNEL_META`：App / 微信 / 邮箱）、时间、已读/处理状态。
- 操作：点击标记已读、标记处理、全部已读；SOS 通知联动处理求助记录。

### 8.5 老人存档 `ArchiveView.vue`

- 顶部**老人切换导航**（`elders.length > 1` 时显示 `el-select`，绑定 `currentElderId`）。
- 基本信息 `el-descriptions` + 风险等级。
- 健康打卡记录表 + 求助记录表（均按当前老人过滤）。

### 8.6 远程协助 `AssistView.vue`

- 占位页：协助对象选择、设备连接状态、模拟手机屏投影（连接后展示老人设备状态网格）。

### 8.7 异常页 `ErrorView.vue`

- 依据 `route.query.code` 渲染 404（页面不存在）或 403（请使用电脑端访问）。

---

## 9. 关键逻辑

### 9.1 数据流

```text
main.ts（挂载 Pinia / Router / Element Plus / 图标）
  → router/guards.ts（鉴权、移动端拦截）
  → layout/Layout.vue onMounted bootstrap()
      → elderStore.loadElders()
      → medicationStore.init() / healthStore.init() / sosStore.init() / notificationStore.init()
          → api/*.ts（axios GET /mock/*.json）
  → pages 读取 store 派生数据渲染
```

### 9.2 风险评估模型 `utils/risk.ts` + `hooks/useRiskLevel.ts`

```ts
evaluateRiskLevel({ missedMedicationCount, hasUnhandledSos, missedHealthDays, inactiveDays })
// alert：存在未处理 SOS，或 inactiveDays >= 2，或 missedHealthDays >= 3
// watch：漏服 >= 1 或当日未打卡
// normal：其余
```

`useRiskLevel` 组合当前老人数据，动态输出 `riskLevel`，供看板/存档页复用。

### 9.3 多老人切换机制

- `elderStore.loadElders()` 读取 `elders.json` + `bindings.json`，按当前登录 `userId` 过滤出绑定老人，默认选中第一位。
- 切换仅在 `ArchiveView` 顶部完成；`dashboard / medication / notification` 只读 `currentElder`，**不提供切换入口**（按需求将切换收敛到存档页）。

### 9.4 通知第三方渠道

- `NotificationVO.channel: NotificationChannel`（`app` / `wechat` / `email`）。
- `CHANNEL_META` 提供标签、颜色、图标，通知卡片与看板动态渲染。

---

## 10. 样式与主题

- **主题色：青蓝 `#14939E`**（深青 `#0e6b72`、浅青 `#55b8c2`），点缀暖橙 `#e07a3f`。
- CSS 变量定义于 `src/assets/less/variables.less`，并覆盖 Element Plus 主题变量（`--el-color-primary*`）。
- 全局基础样式、通用卡片（`.app-card`）、工具类（`.flex-between` 等）在 `src/assets/less/index.less`。
- `main.ts` 引入 `@/assets/less/index.less`（`@import './variables.less'`）。

---

## 11. 关键设计决策

1. **纯前端 mock**：无后端，读 `public/mock/*.json`；写操作（注册、图片）降级 `localStorage` / 内存。
2. **vo / dto / enum 分层**：展示对象（`*VO`）、表单输入（`*DTO`）、常量元数据（`enum`）职责分离，类型命名统一。
3. **多老人按 `elderId` 隔离**：store 全量持有 + 派生过滤，切换老人零成本联动。
4. **老人切换收敛到存档页**：看板等页面只展示、不切换，交互职责清晰。
5. **风险自动评估**：基于漏服 / 求助 / 打卡 / 活跃间隔的静态规则，集中到 `utils/risk.ts`。
6. **图片上传走 base64**：避免后端上传接口，演示场景内存态。

---

## 12. 运行与构建

```bash
npm install          # 安装依赖（含 less devDep）
npm run dev          # 启动开发服务 http://localhost:5173
npm run type-check   # 类型校验（vue-tsc --noEmit）
npm run build        # 生产构建（vue-tsc -b && vite build）
npm run preview      # 预览构建产物
```

> `vite.config.ts`：`@` → `src`，`server.host: 0.0.0.0`、`port: 5173`，`allowedHosts` 配置了 cpolar 内网穿透域名。

---

## 13. 已知限制与待办

| 项 | 现状 | 待办 |
| --- | --- | --- |
| 后端接口 | 无，仅静态 mock | 可接入真实 REST/GraphQL 接口 |
| 注册 / 登录 | `localStorage` 本地匹配 | 接后端鉴权（JWT 等） |
| 图片上传 | base64 内存态，刷新即失 | 接对象存储 / 上传接口 |
| 「模型设置」 | 下拉项 + 占位弹窗 | 填充真实配置项并持久化 |
| 风险模型 | 静态规则 + mock「今天」(`TODAY`) | 改为服务端计算或可配置阈值 |
| 远程协助 | 纯占位 UI | 接 WebRTC / 设备投影 |
| 移动端 | 直接 403 拦截 | 视需求开发移动端适配 |
| 用药打卡记录 | mock 静态数据 | 增加打卡交互与当日动态生成 |
