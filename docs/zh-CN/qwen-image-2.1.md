# Qwen-Image 2.1 实验预设（未在 PS5 上测过）

这是给已经在跑的 **PS5SD v1.7.0 英文原版** 用的。不要重装那个大约 50 MB 的汉化包。主机没有被连接。固件 12.20 没有实测。

截图里的三个名字是网页把文件名里的 `_` 和 `-` 换成空格之后的显示，量化记号保留。对应原文件名，并且都在 `/data/PS5SD/models/` 这一层（网页上传的模型不会进子目录）：

| 显示名 | 原文件名 | 官方文件大小 | 网页大约显示 |
|---|---|---|---|
| qwen image 2.1 Q4_K | `qwen_image_2.1-Q4_K.gguf` | 4197494816 字节 | 4.20 GB |
| qwen image 2.1 vae bf16 | `qwen_image_2.1_vae_bf16.safetensors` | 675509688 字节 | 676 MB |
| Qwen3VL 8B Instruct Q4_K_M | `Qwen3VL-8B-Instruct-Q4_K_M.gguf` | 5027784800 字节 | 5.03 GB |

体积用的是 2026-11-21 对官方文件做的 HEAD，没有下载权重。和截图一致。若你磁盘上的字节数不同，不要用这份预设。

## 引擎是否认得这三件

v1.7.0 带的 stable-diffusion.cpp 是 `32d516c`（2026-11-11）。它的 `docs/qwen_image_2.1.md` 写明文生图就是这三份：

- `--diffusion-model` 指向 `qwen_image_2.1-Q4_K.gguf`（也可以是别的量化，文档举的就是这个文件名）
- `--vae` 必须是 `qwen_image_2.1_vae_bf16.safetensors`。旧的 Qwen-Image VAE 和 Wan 2.2 VAE 不能换
- `--llm` 指向 `Qwen3VL-8B-Instruct-Q4_K_M.gguf`
- 采样：`--cfg-scale 6.0`，`--sampling-method euler`
- 边长要能被 32 整除。分辨率相关的 flow 由程序自己选，**不要**再写 `--flow-shift`（那是上一代 Qwen-Image 的参数）

纯文生图**不要** `mmproj`，也**不要** `--llm_vision`。同一份文档写明：只有做图像编辑、而且文本编码器是 GGUF 时，才另加 `mmproj-Qwen3VL-8B-Instruct-F16.gguf` 并用 `--llm_vision`。这份预设只做文生图。网页上请用 Image，不要用 Edit。

PS5SD 自己的 `sd_plan.cpp` 在权重里看到 `txt_in.text_norm.weight` 时，会把网络标成 Qwen-Image 2.1，并要求同时有 VAE 和 llm。默认步数 20、CFG 6，和上面的文档一致。这是源码里的默认，不是这台主机跑通过。

## 为什么现在停在 Loading

4.20 GB 那一行没有 “Part of a model”，所以网页允许对它按 Use。程序会把它当成单个检查点，只用 `-m` 去载入，**不会**带上旁边的 VAE 和 Qwen3VL。那两行有 “Part of a model”，是因为文件头被认成 VAE 和文本编码器，单独不能跑，Use 会被拒绝。

顶上的 “No model loaded” 表示还没有一个模型载入完成。4.20 GB 上的 Loading 表示当前选中的就是这个单独文件，载入还没结束。十 GB 左右的读取可以很久。若很久仍不变，看 `/data/PS5SD/app.log`，不要删这三个文件。

## 怎么装这份预设

1. 若 Loading 一直不结束：用 FTP（端口 2121，匿名）在 `/data/PS5SD/quit` 放一个空文件，让标题自己退出。这是程序认的退出方式。不要删 `/data/PS5SD/models/` 里的任何文件，不要改固件。
2. 标题退出之后，看 `/data/PS5SD/model.txt`。如果里面只有 `qwen_image_2.1-Q4_K.gguf`，下次打开还会单独载入那个文件。把这一行改成 `qwen-image-2.1-q4`，或先改成空，等预设放好再在网页里按 Use。只改这一行，不要动权重。
3. 把 `qwen-image-2.1-q4.txt` 放到 `/data/PS5SD/presets/qwen-image-2.1-q4.txt`。网页上是 Models → Upload from this computer → 种类选 Preset (.txt)。FTP 则直接传到上面的路径。
4. 再打开 PS5SD。Models → Refresh。对名字是 **Qwen-Image 2.1 Q4_K (experiment)** 的那一项按 Use。不要对 676 MB 或 5.03 GB 那两行按 Use。
5. Create 里用你自己的英文或中文提示词。预设把第一次尝试设成 512×512、20 步、CFG 6、采样器 `euler`。512 能被 32 整除。官方示例没有写死尺寸；512 只是为了少占内存，不是测过的最佳尺寸。

## 内存

三份文件合计 9900789304 字节，约 9.22 GiB。上游在固件 13.00 上量到的显存池大约 11.44 GiB。扣掉权重后剩下大约 2 GiB，还要放计算和 VAE。同一份 2.1 文档说，默认的 prefix cache 在一种大前缀上可以到每条条件 2 GiB（f16）或 4 GiB（f32）。所以预设里加了文档里的关闭开关：

`--model-args qwen_image_2_1_prefix_cache=false`

这只减少文档写明的那块缓存。**不能**据此认为 12.20 上一定出得了图。若 `app.log` 写内存不够，就停，不要加大到 1664（那是规划器里的上限，不是这台机器的测量）。官方示例里的 `--offload-to-cpu` 没有写进预设：这台程序的 CPU 堆很小，别的模型把 VAE 放到 CPU 上是放不下的。

## 预设解析

已用 v1.7.0 的 `ModelLibrary::parse_preset` 在电脑上解析过这份文件（三个空文件只用来占名，没有权重）。三条路径都落到 models 目录，`--model-args` 没有被当成文件路径，没有 `--llm_vision`、没有 `-m`、没有 `--flow-shift`。这不是 PS5 上的加载测试。
