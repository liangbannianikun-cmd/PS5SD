  // Simplified Chinese is the default. English is the source text; choose English in
  // Settings, This browser. The choice is ps5sd.lang in this browser ("zh" or "en").
  // Model file names, API fields, sampler ids and the prompt itself are not translated:
  // tr() only replaces a whole string that is in ZH, or one anchored pattern in ZH_RE.
  // The surprise prompts in 00-start.js are never passed through tr().
  var ZH = {};
  var ZH_RE = [
    [/^Could not delete (.+)$/, '无法删除 $1'],
    [/^Deleted (.+)\.$/, '已删除 $1。'],
    [/^Cannot reach the server\.$/, '无法连接服务器。'],
    [/^The server refused the request\.?$/, '服务器拒绝了这个请求。'],
    [/^Lost the connection to the server\.$/, '与服务器的连接中断了。'],
    [/^Connection lost, retrying…$/, '连接中断，正在重试…'],
    [/^Generation failed\.?$/, '生成失败。'],
    [/^Type a prompt first\.$/, '请先填写提示词。'],
    [/^No model is loaded\. Pick or download one first\.$/, '还没有载入模型。请先选择一个，或先下载。'],
    [/^The model is switching\. Try again in a moment\.$/, '正在切换模型，请稍后再试。'],
    [/^No model is loaded yet\. Download one here, or press Use on one you have\.$/, '还没有载入模型。可以在这里下载，或对已有的模型按「使用」。'],
    [/^server not reachable$/, '连不上服务器'],
    [/^The browser did not give the clipboard\.$/, '浏览器没有提供剪贴板。'],
    [/^Could not copy (.+)\.$/, '无法复制 $1。'],
    [/^(.+) copied\.$/, '已复制 $1。'],
    [/^Could not make a key$/, '无法生成密钥'],
    [/^Could not turn it off$/, '无法关闭'],
    [/^Could not sign in$/, '无法登录'],
    [/^Could not change it$/, '无法更改'],
    [/^Could not keep it$/, '无法保留'],
    [/^API key needed$/, '需要 API 密钥'],
    [/^That is not the key\. It is on the TV, under the address\.$/, '密钥不对。密钥在电视上，地址的下面。'],
    [/^Too many tries\. Wait a moment\.$/, '尝试次数太多，请稍等。'],
    [/^The API key is off\.$/, 'API 密钥已关闭。'],
    [/^The API key is on\. Apps need it as "Authorization: Bearer <key>"\.$/, 'API 密钥已打开。应用需要把它放在 "Authorization: Bearer <key>" 里。'],
    [/^New key\. The old one does not work any more; browsers that used it must sign in again\.$/, '已换新密钥。旧密钥不再有效，用过它的浏览器需要重新登录。'],
    [/^Starting ps5sd-fan…$/, '正在启动 ps5sd-fan…'],
    [/^The fan modes need an ELF loader on port 9021; none answered\.$/, '风扇模式需要 9021 端口上的 ELF 加载器，没有程序应答。'],
    [/^ps5sd-fan was sent to the ELF loader three times and does not answer on port 9075\.$/, 'ps5sd-fan 已向 ELF 加载器发送三次，9075 端口仍无应答。'],
    [/^The console's own fan control: the fan speeds up when the chip nears (\d+) °C\.$/, '使用主机自己的风扇控制：芯片接近 $1 °C 时风扇才会加快。'],
    [/^Target (\d+) °C \(the console's own: (\d+) °C\)\.$/, '目标 $1 °C（主机自己的目标是 $2 °C）。'],
    [/^Target (\d+) °C\.$/, '目标 $1 °C。'],
    [/^(\d+) step$/, '$1 步'],
    [/^(\d+) steps · CFG ([0-9.]+)(.*)$/, '$1 步 · CFG $2$3'],
    [/^(\d+) step · CFG ([0-9.]+)(.*)$/, '$1 步 · CFG $2$3'],
    [/^(\d+) frames · (\d+) fps(.*)$/, '$1 帧 · $2 帧/秒$3'],
    [/^Generation failed \((\d+)\)\.$/, '生成失败（$1）。'],
    [/^Generation failed: (.+)$/, '生成失败：$1'],
    [/^(\d+) steps$/, '$1 步'],
    [/^(\d+) of (\d+)$/, '$1 / $2'],
    [/ ahead of you…$/, ' 项在你前面…'],
    [/^Switching model…$/, '正在切换模型…'],
    [/^Putting the image together…$/, '正在合成图像…'],
    [/^Keep this page open: each image is put back into the picture here\.$/, '请保持本页打开：每张图都会回到这里的画面上。'],
    [/^Downloads are off$/, '下载功能不可用'],
    [/^not reported$/, '未报告'],
    [/^not available$/, '不可用'],
    [/^(.+) is on the console and in the list\.$/, '$1 已在主机上，并出现在列表里。'],
    [/^(.+) is on the console; the prompt fields suggest its tags\.$/, '$1 已在主机上；提示词框会提示它的标签。'],
    [/^(.+) is on the console\.$/, '$1 已在主机上。'],
    [/^Upscaled to (\d+)×(\d+) in (.+); it is in the gallery\.$/, '已放大到 $1×$2，用时 $3，已在图库里。'],
    [/^Upscaled to (\d+)×(\d+) in (.+)\.$/, '已放大到 $1×$2，用时 $3。'],
    [/^Paste a link first\.$/, '请先粘贴链接。'],
    [/^Downloading (.+) \(see Downloads\)\.$/, '正在下载 $1（见「下载」）。'],
    [/^Preset: (.+)$/, '预设：$1']
  ];

  function uiLang() {
    var v = null;
    try { v = localStorage.getItem('ps5sd.lang'); } catch (e) {}
    return v === 'en' ? 'en' : 'zh';
  }

  function tr(s) {
    if (s === null || s === undefined) return s;
    s = String(s);
    if (uiLang() !== 'zh') return s;
    if (Object.prototype.hasOwnProperty.call(ZH, s)) return ZH[s];
    var i, out;
    for (i = 0; i < ZH_RE.length; i++) {
      if (ZH_RE[i][0].test(s)) {
        out = s.replace(ZH_RE[i][0], ZH_RE[i][1]);
        if (out !== s) return out;
      }
    }
    return s;
  }

  function i18nSkip(el) {
    while (el && el.nodeType === 1) {
      var tag = el.tagName;
      if (tag === 'SCRIPT' || tag === 'STYLE' || tag === 'CODE' || tag === 'PRE') return true;
      // Prompt fields keep the user's text. Their placeholder is still translated (i18nAttrs).
      if (el.id === 'ph-list' || el.id === 'pe-text' || el.id === 'ps-text') return true;
      if (el.getAttribute && el.getAttribute('data-i18n-skip') === '1') return true;
      el = el.parentNode;
    }
    return false;
  }

  function i18nLookup(key) {
    if (!key || uiLang() !== 'zh') return null;
    if (Object.prototype.hasOwnProperty.call(ZH, key)) return ZH[key];
    var i;
    for (i = 0; i < ZH_RE.length; i++) {
      if (ZH_RE[i][0].test(key)) {
        var out = key.replace(ZH_RE[i][0], ZH_RE[i][1]);
        if (out !== key) return out;
      }
    }
    return null;
  }

  function i18nTextNode(n) {
    if (!n || n.nodeType !== 3 || i18nSkip(n.parentNode)) return;
    var raw = n.nodeValue;
    if (!raw || !/[A-Za-z]/.test(raw)) return;
    var key = raw.replace(/\s+/g, ' ').replace(/^\s|\s$/g, '');
    var zh = i18nLookup(key);
    if (!zh || zh === key) return;
    var lead = (raw.match(/^\s*/) || [''])[0];
    var trail = (raw.match(/\s*$/) || [''])[0];
    var next = lead + zh + trail;
    if (next !== raw) n.nodeValue = next;
  }

  function i18nAttrs(el) {
    if (!el || el.nodeType !== 1 || i18nSkip(el)) return;
    var names = ['placeholder', 'title', 'aria-label'];
    var i;
    for (i = 0; i < names.length; i++) {
      var raw = el.getAttribute(names[i]);
      if (!raw) continue;
      var zh = i18nLookup(raw);
      if (zh && zh !== raw) el.setAttribute(names[i], zh);
    }
  }

  function i18nWalk(node) {
    if (!node) return;
    if (node.nodeType === 3) {
      if (!i18nSkip(node.parentNode)) i18nTextNode(node);
      return;
    }
    if (node.nodeType !== 1) return;
    if (node.tagName === 'SCRIPT' || node.tagName === 'STYLE') return;
    i18nAttrs(node);
    if (node.tagName === 'TEXTAREA' || i18nSkip(node)) return;
    var c = node.firstChild;
    while (c) {
      var next = c.nextSibling;
      i18nWalk(c);
      c = next;
    }
  }

  var i18nObserver = null;
  function i18nWatch() {
    if (uiLang() !== 'zh' || !window.MutationObserver || i18nObserver) return;
    i18nObserver = new MutationObserver(function (recs) {
      var i, j;
      for (i = 0; i < recs.length; i++) {
        var rec = recs[i];
        if (rec.type === 'characterData') i18nTextNode(rec.target);
        else if (rec.type === 'attributes') i18nAttrs(rec.target);
        else if (rec.addedNodes) {
          for (j = 0; j < rec.addedNodes.length; j++) i18nWalk(rec.addedNodes[j]);
        }
      }
    });
    i18nObserver.observe(document.body, {
      subtree: true,
      childList: true,
      characterData: true,
      attributes: true,
      attributeFilter: ['placeholder', 'title', 'aria-label']
    });
  }

  function applyI18n() {
    var lang = uiLang();
    document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en';
    if (lang === 'zh') i18nWalk(document.body);
    i18nWatch();
    var root = document.documentElement;
    if (root.className.indexOf('i18n-ready') < 0) root.className += ' i18n-ready';
  }

  function setLang(lang) {
    try { localStorage.setItem('ps5sd.lang', lang === 'en' ? 'en' : 'zh'); } catch (e) {}
    window.location.reload();
  }

  function drawLang() {
    var box = $('lang');
    if (!box) return;
    var cur = uiLang();
    var bs = box.getElementsByTagName('button');
    var i;
    for (i = 0; i < bs.length; i++) {
      var on = bs[i].getAttribute('data-lang') === cur;
      bs[i].className = on ? 'on' : '';
      bs[i].setAttribute('aria-pressed', on ? 'true' : 'false');
    }
  }
