# HTTP 接口说明（字段名保持英文）

网页和接口都在端口 **7860**。没有打开 API 密钥时，同一局域网里的客户端可以直接调用。打开密钥之后，请求要带下面之一：

- `Authorization: Bearer <密钥>`
- `X-API-Key: <密钥>`
- 网页登录后的 cookie `ps5sd_key`。这时 POST、PUT、DELETE 还要请求头 `X-PS5SD-Request: 1`

不要在路由器上转发 7860。主机说的是明文 HTTP。

错误体是一个形状：`{"error": {"code", "message"}}`。旧程序有时是 `{"error": "文字"}`。`code` 给程序判断，`message` 给人看。本页不改这些字段名。

## 和网页相关的路径

这些路径都在源码里。尖括号是你要换成实际名字的部分。

| 方法 | 路径 | 作用 |
|---|---|---|
| GET | `/ps5sd/v1/app/models` | 已安装的模型。`active` 是选用的 id |
| POST | `/ps5sd/v1/app/models/active` | 正文 `{"id": "<模型 id>"}`，切换模型 |
| DELETE | `/ps5sd/v1/app/models/<id>` | 删除预设及其点名的文件，或删除检查点 |
| PUT | `/ps5sd/v1/app/uploads/<种类>/<文件名>` | 上传。种类只能是 `models`、`loras`、`embeddings`、`presets`、`upscalers`、`tags` |
| GET、POST | `/ps5sd/v1/app/downloads` | 下载队列 |
| GET | `/ps5sd/v1/app/catalog` | 内置目录 |
| GET | `/ps5sd/v1/gallery` | 图库列表 |
| GET | `/ps5sd/v1/gallery/<文件>` | 一个图片或视频 |
| DELETE | `/ps5sd/v1/app/gallery/<文件>` | 删除图库文件 |
| GET、POST | `/ps5sd/v1/app/settings` | 电视开关、风扇、是否把参数写进图片 |
| GET | `/ps5sd/v1/auth` | 是否需要密钥、当前请求是否已登录 |
| POST | `/ps5sd/v1/auth/login` | 正文 `{"key": "..."}` |
| POST | `/sdcpp/v1/img_gen` | 出图。提示词字段仍叫 `prompt` |
| POST | `/sdapi/v1/txt2img` | A1111 兼容出图 |

生成请求里的 `prompt`、`negative_prompt`、`seed`、`steps`、`width`、`height`、`sampler` 不要改名。采样器的值仍是 `euler_a` 这种 id。

没有载入模型时，出图接口返回 503，网页仍可下载第一个模型。

完整英文说明是上游 `docs/API.md`。汉化安装包里，标题目录的 `docs/API.md` 被用作网页载体（文件头有 `PS5SD-UI-PAYLOAD`），英文原文在 `docs/API.upstream.md`。本帮助页的文字跟着网页走，不读那份被占用的文件。
