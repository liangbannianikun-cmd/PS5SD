# PS5SD 简体中文说明（第三方个人汉化）

这是 [Darkatek7/PS5SD](https://github.com/Darkatek7/PS5SD) **v1.7.0**（提交 `fd7dbce13671eb825bb5a92cfd3cd91fea2e0cf0`，标签 `v1.7.0`）的个人汉化，做在 fork `liangbannianikun-cmd/PS5SD` 上。

它仍叫 **PS5SD**。许可证仍是 **GNU GPL-3.0**（仓库根目录 `LICENSE`）。作者与致谢仍是上游 README 的 Credits：Darkatek7，以及 stable-diffusion.cpp、ggml、PS5_Vulkan、PS5_Mesa、ps5-homebrew-ui、ftpsrv 等。本汉化没有改推理、没有改破解或加载器逻辑，也没有换产品名。

主画面图标换成 DeepSeek 公开仓库里的官方鲸鱼标记（`ICON.svg`，路径数据未改），只为了放进 PS5 要求的 512×512 正方形。**这不是 DeepSeek 官方产品，也不是 DeepSeek 与 PS5SD 的合作版本。** 不要把它当成 DeepSeek App。

## 这台主机上没有测过

上游测量写的是 **固件 13.00**（见 `docs/CONSOLE.md`）。本文没有在任何 PS5 上运行过这个包。

**PS5 Slim、固件 12.20、已安装 etaHEN，兼容性未实测。** 不要把下面任何耗时、速度或“能出图”当成这台机器上的结果。上游只写过：能跑 ShadowMountPlus 的其他固件也许可以，他们测的是 13.00。本包不升级固件，也不操作主机。

## 你拿到的是什么

网页界面被编译进 `eboot.bin`，这台构建机没有 PS5 工具链，不能合法地重新链接出一版新引擎。交付的安装包是：

- 上游已发布的 **v1.7.0** 标题目录（`PPSA99576`）
- 换成汉化网页的加载方式：`eboot.bin` 里原来的英文页面被换成一个很短的加载器，真正的简体页面放在标题里的 `docs/API.md`（文件头有 `PS5SD-UI-PAYLOAD`）。程序只按这个固定文件名读它。所以这份 `docs/API.md` **不再是英文 API 文档**。英文原文在同一目录的 `docs/API.upstream.md`，程序不会显示这个文件名。
- 主画面图标：`sce_sys/icon0.png` 与 `sce_sys/icon0.dds`
- 引擎、模型推理、下载和上传代码都是上游那一份，没有重编译

这是资源替换，不是重新编译的新版本。`param.json` 的 `contentVersion` 仍是 `02.007.000`，程序自报版本仍是 `1.7.0`。

如果加载器找不到带 `PS5SD-UI-PAYLOAD` 的 `docs/API.md`，网页会停在“正在载入”，请按下面的回滚把 `eboot.bin` 和 `docs/API.md` 换回备份。

## 安装前先备份

在主机上先复制整个标题目录，例如用 FTP（下面有端口）把这些拷到电脑：

- `/data/homebrew/PPSA99576/`（整个目录）
- 若已经注册过：`/user/appmeta/PPSA99576/` 里的 `icon0.png`、`icon0.dds`

模型、图库和设置在另一个目录，安装标题**不会**清掉它们，但备份时仍建议复制：

- `/data/PS5SD/`

至少保留 `model.txt`、`presets/`、`models/`、`outputs/`、`app.log`。

## 安装或覆盖

标题 ID 以源码 `ps5/app/sce_sys/param.json` 为准，是 **`PPSA99576`**。压缩包顶层就是这个文件夹。

1. 主机已能跑 etaHEN 与 ShadowMountPlus。本说明不写如何越狱，也不升级固件。
2. 把交付的 `PPSA99576` 文件夹放到 `/data/homebrew/PPSA99576/`，覆盖同名文件。压缩包里没有模型。
3. 让 ShadowMountPlus 重新扫描 homebrew。主画面图标还要从 `/user/appmeta/PPSA99576/` 读。只改 `/data/homebrew` 里的 png，主画面可能仍是旧图标。请把新的 `icon0.png` 和 `icon0.dds` 也拷到 `/user/appmeta/PPSA99576/`（该目录要已经有 `param.json`，也就是这套标题曾经被注册过）。`pic0.dds`、`pic1.dds` 是背景，本包没有换。
4. 从主画面打开 PS5SD。电视上的仪表盘**仍是英文**。这一版没有重编电视界面，字库也没有中文字形（Inter、Montserrat、DejaVu Sans Mono）。
5. 电视上会显示地址。用同一网络里的手机或电脑打开 `http://<主机IP>:7860`。网页默认简体中文。设置 →「此浏览器」→ Language，可以改回 English。这个选择只存在这只浏览器里。

## 回滚

用备份覆盖回去即可：

1. 用备份里的 `eboot.bin` 覆盖 `/data/homebrew/PPSA99576/eboot.bin`
2. 用备份里的 `docs/API.md` 覆盖 `/data/homebrew/PPSA99576/docs/API.md`  
   若备份里没有、而汉化目录里有 `docs/API.upstream.md`，把它复制成 `docs/API.md`
3. 用备份的 `sce_sys/icon0.png`、`icon0.dds` 覆盖标题目录，并同样覆盖 `/user/appmeta/PPSA99576/` 里的这两个文件
4. 重新打开标题

不要删 `/data/PS5SD/`，那里是模型和图库。

上游以后若发布更高版本，设置里的更新提示仍指向 Darkatek7 的 GitHub。安装上游新包会换掉这份汉化。

## 端口（按源码与脚本，不是猜测）

| 用途 | 端口 | 依据 |
|---|---|---|
| 网页、A1111、OpenAI、PS5SD 自己的接口 | **7860** | `ps5/app/main.cpp` 的 `kPort` |
| 你用的 FTP（ftpsrv，匿名，普通 FTP，不是 SFTP） | **2121** | `scripts/ps5sd-app.sh`，`docs/MODELS.md` |
| 程序自带的 ftpsrv，只听 `127.0.0.1` | **2122** | `ps5/app/ftp_writer.hpp` 的 `kOwnFtpsrvPort`。局域网连不上，也不要去连 |
| elfldr（风扇模式和部署脚本要它） | **9021** | `scripts/ps5sd-app.sh` 的 `PS5_PORT` |
| klogsrv（看内核日志，装模型不需要） | **3232** | `scripts/ps5sd-app.sh` 的 `PS5_KLOG_PORT` |

2121 上若没有可用的 ftpsrv，或试写失败，程序会通过 elfldr 启动自己带的那份，改走本机 2122。网页上传因此仍可用，但你从电脑 FTP 导入仍然要 2121。

## 文件放在哪里

都在主机的 `/data/PS5SD/`。程序第一次启动会建目录。依据 `docs/MODELS.md` 与 `ps5/app/main.cpp`。

| 路径 | 内容 |
|---|---|
| `/data/PS5SD/models` | 单文件模型。直接放在这一层的 `.gguf`、`.safetensors`、`.ckpt`、`.sft` 会自己出现在模型列表里 |
| `/data/PS5SD/models/diffusion_models` | 多文件模型的扩散网络（DiT / UNet 那一份）。目录名是目录里用的，别的子目录也可以，只要预设写对路径 |
| `/data/PS5SD/models/text_encoders` | 文本编码器（CLIP、T5、Qwen 等） |
| `/data/PS5SD/models/vae` | VAE，或视频用的小解码器 |
| `/data/PS5SD/models/controlnet` | ControlNet |
| `/data/PS5SD/presets` | 预设，一个模型一个 `<id>.txt` |
| `/data/PS5SD/loras` | LoRA |
| `/data/PS5SD/embeddings` | 文本嵌入（embedding） |
| `/data/PS5SD/upscalers` | 放大器，`.pth`，不要子目录 |
| `/data/PS5SD/tags` | 提示词标签表，`.csv` 或 `.txt` |
| `/data/PS5SD/outputs` | 图库。图片是 PNG，视频是 `sd_<日期>_<时间>_<序号>.webm` |
| `/data/PS5SD/hf-token.txt` | Hugging Face 令牌，一行。门禁仓库才需要 |
| `/data/PS5SD/civitai-token.txt` | Civitai 令牌，一行。要登录的模型才需要 |
| `/data/PS5SD/model.txt` | 当前选用的模型 id |
| `/data/PS5SD/app.log` | 程序日志 |

相对路径相对于 `/data/PS5SD/models`。预设里写 `vae/flux2-vae.safetensors`，文件就在 `/data/PS5SD/models/vae/flux2-vae.safetensors`。

## 三种把模型放进去的办法

### 1. 网页里的目录下载

打开 `http://<主机IP>:7860`，到「模型」→「获取更多」。目录条目会自己下文件并写好预设。进度在「下载」。电脑可以关掉。

空间不够时（文件大小再加 1 GB），下载会立刻失败。这是上游的规则，不是这次汉化改的。

### 2. 网页上传

「模型」→「从这台电脑上传」。先选种类，再选文件。种类对应的目录：

| 网页上的种类 | 值（不要改） | 落到 |
|---|---|---|
| 模型 | 空 | `/data/PS5SD/models/` 这一层，不进子目录 |
| LoRA | `loras` | `/data/PS5SD/loras` |
| 嵌入 | `embeddings` | `/data/PS5SD/embeddings` |
| 预设 | `presets` | `/data/PS5SD/presets` |
| 放大器 | `upscalers` | `/data/PS5SD/upscalers` |
| 标签 | `tags` | `/data/PS5SD/tags` |

接口是 `PUT /ps5sd/v1/app/uploads/<种类>/<文件名>`，端口仍是 7860。文件名保持原样。已有同名文件不会覆盖，要换掉先删掉。多文件模型要最后再传预设。上传时不要关页面。

命令行示例（种类名是接口字段，保持英文）：

```sh
curl -T myModel.safetensors http://<主机IP>:7860/ps5sd/v1/app/uploads/models/myModel.safetensors
```

### 3. FTP 导入

1. 连 `<主机IP>`，端口 **2121**，匿名，普通 FTP，不要用 SFTP。
2. 进入上表里的目录。没有就先建。单文件模型放到 `/data/PS5SD/models/`。
3. 网页里「模型」→「刷新」，再按「使用」。

```sh
curl -T myModel.safetensors ftp://<主机IP>:2121/data/PS5SD/models/
curl --ftp-create-dirs -T ae.safetensors ftp://<主机IP>:2121/data/PS5SD/models/vae/
```

U 盘上的文件也可以写在预设里，路径类似 `/mnt/usb0/models/某文件.safetensors`（`docs/MODELS.md`）。图库复制到 U 盘时，目标是 `/mnt/<盘>/PS5SD/`。

## 多文件模型里的三块

很多新模型不是一个文件。预设把它们拼起来。三块都要在，缺一块就加载不了：

- **扩散网络（DiT，或旧模型的 UNet）**  
  真正画图的那一份。FLUX、Z-Image、Wan 在目录里放在 `diffusion_models/`。预设里是 `--diffusion-model`。SDXL 这种单文件检查点把网络和一部分编码器包在一起，预设用 `-m`，文件直接在 `models/` 下。
- **文本编码器**  
  把提示词变成模型能读的向量。SD 1.5 / SDXL 多用 CLIP（有的已经在检查点里）。FLUX.2 / FLUX.3 Klein、Z-Image 用的是 Qwen3 系列 GGUF，放在 `text_encoders/`，预设里是 `--llm`。Wan 用的是 T5，预设里是 `--t5xxl`。这是编码器，不是“再跑一个聊天模型”。
- **VAE**  
  把网络的潜空间变回像素，视频则负责解码帧。放在 `vae/`。预设里是 `--vae`，小而快的视频解码器是 `--taesd`。

预设是 `/data/PS5SD/presets/<id>.txt`。`# name:` 是显示名，`# defaults:` 是步数、CFG、尺寸、采样器。不要翻译采样器的 id（`euler_a`、`dpm++2m` 这类）。文件名不要改。

## 第一次用小模型出图

目录里最小的一条是 **SDXS-512 (Q8_0)**，id `sdxs-512`。一个文件，约 683 MB，没有单独的 VAE 或文本编码器：

- 下载后的路径：`/data/PS5SD/models/sdxs-512-tinySDdistilled_Q8_0.gguf`
- 预设：`/data/PS5SD/presets/sdxs-512.txt`
- 预设默认：512×512，**1 步**，CFG **1**，采样器 `euler_a`

网页「获取更多」里安装它，或自己把这个文件放到上面的路径再刷新、使用。提示词可以用你自己的句子。页面上的「换一个提示」示例句仍是英文，这是生成用的默认提示，汉化没有改它们。

上游在 **固件 13.00** 上记过：同类小模型 512×512、1 步，大约零点几秒到几秒（`docs/CONSOLE.md`、目录文案）。**12.20 上没有这条记录。** 若失败，看 `/data/PS5SD/app.log`，不要据此推断大模型也能跑。

建议第一次就用这一条，不要用 FLUX 或 Qwen-Image。

## Qwen-Image 2.1 与 “引擎认识” 不是一回事

源码 `ps5/app/sd_plan.cpp` 会把带 `txt_in.text_norm.weight` 的权重认成 **Qwen-Image 2.1**（家族 `QwenImage`，默认 20 步、CFG 6、最大边 1664）。目录和 `docs/CONSOLE.md` 里**没有**在这台 PS5 上跑通 Qwen-Image 2.1 或 “Qwen2.1” 的日志。

CONSOLE 里出现的 Qwen，是别的模型的**文本编码器**，例如：

- `text_encoders/Qwen3VL-4B-Instruct-Q4_K_M.gguf`（FLUX.3 Klein、Krea 2）
- `text_encoders/Qwen3-4B-Instruct-2507-Q4_K_M.gguf`（Z-Image Turbo、FLUX.2 Klein 4B）
- `text_encoders/Qwen3-8B-Q4_K_M.gguf`（FLUX.2 Klein 9B）

那些记录的机器是固件 13.00，不是 12.20，也不是 Qwen-Image 2.1 本体。

**引擎能认出一种模型，不等于这台 Slim、12.20 上能出图。** 没有这台机器的 Qwen 日志，这里不保证、也不建议把 Qwen-Image 2.1 当作已经能跑的方案。要试只能当实验，失败就停，先用 SDXS-512。

## 网页上仍保持英文的东西

- 模型文件名、预设 id、采样器与调度器的 id
- API 的字段名（`prompt`、`seed`、`steps` 等）
- 默认生成提示，包括「换一个提示」里的英文例句
- 电视仪表盘和幻灯片（没有中文字库，也没有重编译）

## 字体

网页使用系统字体，并写上了苹方、思源黑体、Noto Sans SC、微软雅黑。手机和电脑上的浏览器一般能显示简体字。PS5 自带浏览器是否带中文字形，**没有在真机上确认**。看不清时，用手机或电脑打开 7860。

## 许可证

程序与本汉化都按 GPL-3.0 提供。分发修改版时要能提供对应源码。本 fork 的源码就是这份汉化。图标来自 DeepSeek 公开素材，只作说明性使用，不授予 DeepSeek 商标许可。
