# 把模型放上 PS5

下面的路径和端口来自本仓库 `docs/MODELS.md`、`ps5/app/main.cpp`、`ps5/app/catalog.hpp` 和 `ps5/app/ftp_writer.hpp`。耗时来自上游在固件 13.00 上的记录。**PS5 Slim 固件 12.20 未实测。**

程序读取 `.safetensors`、`.gguf`、`.ckpt`、`.sft`。文件都在 `/data/PS5SD`：

| 目录 | 放什么 |
|---|---|
| `/data/PS5SD/models` | 单文件检查点。直接放在这一层才会单独出现在列表里 |
| `/data/PS5SD/models/diffusion_models` | 扩散网络（DiT 或 UNet） |
| `/data/PS5SD/models/text_encoders` | 文本编码器 |
| `/data/PS5SD/models/vae` | VAE |
| `/data/PS5SD/models/controlnet` | ControlNet |
| `/data/PS5SD/presets` | 预设，`<id>.txt` |
| `/data/PS5SD/loras` | LoRA |
| `/data/PS5SD/embeddings` | 文本嵌入 |
| `/data/PS5SD/upscalers` | 放大器 `.pth`，不要子目录 |
| `/data/PS5SD/tags` | 标签表 `.csv` 或 `.txt` |
| `/data/PS5SD/outputs` | 图库 |

## 三块分别是什么

多文件模型要三块都在，预设负责点名：

- **扩散网络**是画图的权重。FLUX、Z-Image、Wan 用 `--diffusion-model`，文件多在 `diffusion_models/`。SDXL 单文件用 `-m`，文件直接在 `models/` 下。
- **文本编码器**把提示词变成向量。Klein 与 Z-Image 用 `--llm` 指向 `text_encoders/` 里的 Qwen3 GGUF。Wan 用 `--t5xxl`。它不是拿来聊天的。
- **VAE** 把潜空间变回图像。预设里是 `--vae` 或更快的 `--taesd`，文件在 `vae/`。

预设路径相对于 `/data/PS5SD/models`，除非以 `/` 开头。

## 目录下载

网页「模型」→「获取更多」。主机会自己下载。门禁仓库把令牌写成一行：`/data/PS5SD/hf-token.txt` 或 `/data/PS5SD/civitai-token.txt`。

第一次请装 **SDXS-512 (Q8_0)**，id `sdxs-512`。只有一个文件：

`/data/PS5SD/models/sdxs-512-tinySDdistilled_Q8_0.gguf`

预设 `/data/PS5SD/presets/sdxs-512.txt` 的默认是 512×512、1 步、CFG 1、采样器 `euler_a`。装好后按「使用」，在「创作」里写提示词再「生成」。上游在固件 13.00 上把这类一步小模型记为大约一秒以内。**12.20 没有记录。**

## 网页上传

「从这台电脑上传」。种类不要改接口里的值：模型到 `models/` 这一层，LoRA 到 `loras`，嵌入到 `embeddings`，预设到 `presets`，放大器到 `upscalers`，标签到 `tags`。同名文件不会覆盖。多文件模型最后再传预设。

```sh
curl -T myModel.safetensors http://<主机IP>:7860/ps5sd/v1/app/uploads/models/myModel.safetensors
```

## FTP

端口 **2121**，匿名，普通 FTP，不是 SFTP。

```sh
curl -T myModel.safetensors ftp://<主机IP>:2121/data/PS5SD/models/
curl --ftp-create-dirs -T ae.safetensors ftp://<主机IP>:2121/data/PS5SD/models/vae/
```

然后在网页里刷新，再按使用。程序自带的 FTP 只听 `127.0.0.1:2122`，电脑不要连这个端口。

## Qwen-Image 2.1

`sd_plan.cpp` 能根据权重名认出 Qwen-Image 2.1。`docs/CONSOLE.md` 没有这台主机跑通它的日志。那里的 Qwen3 文件是别的模型的文本编码器，而且记在固件 13.00 上。**认得出不等于这台 12.20 能出图。** 不要把它当成已经验证的方案。先用 SDXS-512。

更长的英文模型表仍在上游 `docs/MODELS.md`。采样器 id、文件名不要翻译。
