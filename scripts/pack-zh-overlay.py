#!/usr/bin/env python3
"""Build an installable PPSA99576 folder from the published v1.7.0 zip.

The web UI is compiled into eboot.bin. This does not relink the engine. It
replaces the embedded page with a short loader of the same byte length, and
stores the localized page in docs/API.md (the only markdown name the title
serves, besides MODELS.md). The original API text is kept as
docs/API.upstream.md, which the title does not serve.

    python3 scripts/pack-zh-overlay.py <official.zip> <output.zip>
"""
import hashlib
import pathlib
import shutil
import subprocess
import sys
import zipfile

ROOT = pathlib.Path(__file__).resolve().parents[1]
HTML_LEN = 482965
MARKER = b"PS5SD-UI-PAYLOAD"
NEEDLE = b"<!doctype html>"


def bundle():
    out = pathlib.Path("/tmp/ps5sd-zh-index.html")
    subprocess.check_call(["bash", str(ROOT / "scripts/bundle-webui.sh"), str(out)])
    data = out.read_bytes()
    if not data.startswith(b"<!doctype html>"):
        sys.exit("bundle does not start with the doctype")
    # The loader only accepts a payload that carries this marker.
    if b"PS5SD-UI-PAYLOAD" not in data[:800]:
        data = b"<!-- PS5SD-UI-PAYLOAD -->\n" + data
    return data


def loader(length):
    # ES5 only: the PS5 browser has no fetch, let, const or arrow functions.
    body = """<!doctype html>
<html lang="zh-CN"><head><meta charset="utf-8"><title>PS5SD</title></head>
<body><p id="m">正在载入 PS5SD 界面…</p>
<script>
function ps5sdShow(t){var n=document.getElementById('m'); if(n) n.textContent=t;}
function ps5sdKey(){
  var h=window.location.hash||'';
  var m=/(^#|&)key=([a-z2-7]+)/i.exec(h);
  return m?m[2].toLowerCase():'';
}
function ps5sdLogin(key, done){
  var x=new XMLHttpRequest();
  x.open('POST','/ps5sd/v1/auth/login',true);
  x.setRequestHeader('Content-Type','application/json');
  x.onreadystatechange=function(){ if(x.readyState===4) done(x.status); };
  x.send('{"key":"'+key.replace(/\\\\/g,'\\\\\\\\').replace(/"/g,'\\\\"')+'"}');
}
function ps5sdPayload(){
  var x=new XMLHttpRequest();
  x.open('GET','/ps5sd/v1/app/docs/API.md',true);
  x.onreadystatechange=function(){
    if(x.readyState!==4) return;
    var t=x.responseText||'';
    if(x.status===200 && t.indexOf('PS5SD-UI-PAYLOAD')>=0){
      document.open(); document.write(t); document.close();
      return;
    }
    if(x.status===401){ ps5sdAsk(); return; }
    ps5sdShow('没有找到汉化界面。请确认标题目录里的 docs/API.md 以 PS5SD-UI-PAYLOAD 开头，或按说明回滚 eboot.bin。');
  };
  x.send();
}
function ps5sdAsk(){
  ps5sdShow('');
  var box=document.createElement('div');
  box.innerHTML='<p>这台 PS5SD 需要 API 密钥。密钥在电视上，地址的下面。</p>';
  var input=document.createElement('input');
  input.type='text';
  var go=document.createElement('button');
  go.type='button';
  go.textContent='登录';
  go.onclick=function(){
    ps5sdLogin(input.value, function(code){
      if(code===200) ps5sdPayload();
      else ps5sdShow('密钥不对。');
    });
  };
  box.appendChild(input); box.appendChild(go);
  document.body.appendChild(box);
}
var early=ps5sdKey();
if(early){ ps5sdLogin(early, function(){ ps5sdPayload(); }); }
else { ps5sdPayload(); }
</script>
"""
    raw = body.encode("utf-8")
    # Pad inside an HTML comment so the embedded length stays the official one.
    # The comment must not contain "--".
    pad = length - len(raw) - len("<!--") - len("-->")
    if pad < 0:
        sys.exit("loader is longer than the embedded page: %d" % len(raw))
    raw = raw.encode() if False else raw
    out = raw + b"<!--" + (b" " * pad) + b"-->"
    if len(out) != length:
        sys.exit("loader length %d != %d" % (len(out), length))
    return out


def main():
    if len(sys.argv) != 3:
        sys.exit("usage: pack-zh-overlay.py <official.zip> <output.zip>")
    src, dst = sys.argv[1], sys.argv[2]
    payload = bundle()
    page = loader(HTML_LEN)
    work = pathlib.Path("/tmp/ps5sd-zh-title")
    if work.exists():
        shutil.rmtree(work)
    work.mkdir(parents=True)
    with zipfile.ZipFile(src) as z:
        z.extractall(work)
    title = work / "PPSA99576"
    eboot_path = title / "eboot.bin"
    eboot = bytearray(eboot_path.read_bytes())
    at = eboot.find(NEEDLE)
    if at < 0 or eboot.find(NEEDLE, at + 1) >= 0:
        sys.exit("expected exactly one embedded page")
    if bytes(eboot[at:at + HTML_LEN])[-20:] != b"</body>\n</html>\n"[-20:] and eboot[at + HTML_LEN] != 0:
        # Still require the official length and the terminating NUL.
        pass
    if eboot[at + HTML_LEN] != 0:
        sys.exit("embedded page is not followed by a NUL at %d" % (at + HTML_LEN))
    eboot[at:at + HTML_LEN] = page
    eboot_path.write_bytes(eboot)
    api = title / "docs/API.md"
    (title / "docs/API.upstream.md").write_bytes(api.read_bytes())
    api.write_bytes(payload)
    icon_src = ROOT / "ps5/app/sce_sys"
    for name in ("icon0.png", "icon0.dds"):
        shutil.copyfile(icon_src / name, title / "sce_sys" / name)
    # param.json and the engine stay the published bytes, apart from the page splice.
    out = pathlib.Path(dst)
    out.parent.mkdir(parents=True, exist_ok=True)
    if out.exists():
        out.unlink()
    with zipfile.ZipFile(out, "w", compression=zipfile.ZIP_DEFLATED, compresslevel=9) as z:
        for path in sorted(title.rglob("*")):
            if path.is_file():
                z.write(path, "PPSA99576/" + path.relative_to(title).as_posix())
    digest = hashlib.sha256(out.read_bytes()).hexdigest()
    print("zip", out, out.stat().st_size)
    print("sha256", digest)
    print("payload", len(payload), "loader", len(page), "eboot_at", at)


if __name__ == "__main__":
    main()
