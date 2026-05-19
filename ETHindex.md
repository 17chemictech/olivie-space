<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>olivie.base.eth | 数字生存家园</title>
    <style>
        :root {
            --bg: #0d1117;
            --text: #c9d1d9;
            --accent: #0052ff; /* Base Blue */
            --border: #30363d;
        }
        body {
            background-color: var(--bg);
            color: var(--text);
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            margin: 0;
            line-height: 1.6;
        }
        .container {
            width: 90%;
            max-width: 500px;
            padding: 2rem;
            border: 1px solid var(--border);
            border-radius: 12px;
            text-align: center;
            background: rgba(255, 255, 255, 0.02);
        }
        .avatar {
            width: 80px;
            height: 80px;
            border-radius: 50%;
            background: linear-gradient(45deg, #0052ff, #7cfeb5);
            margin: 0 auto 1rem;
        }
        h1 { color: #fff; margin-bottom: 0.5rem; font-size: 1.5rem; }
        .ens-name { color: var(--accent); font-weight: bold; margin-bottom: 1.5rem; display: block; }
        p { font-size: 0.95rem; margin-bottom: 2rem; color: #8b949e; }
        
        /* x402 支付按钮模拟样式 */
        .x402-btn {
            background-color: #fff;
            color: #000;
            border: none;
            padding: 12px 24px;
            border-radius: 30px;
            font-weight: 600;
            cursor: pointer;
            text-decoration: none;
            display: inline-flex;
            align-items: center;
            gap: 8px;
            transition: transform 0.2s;
        }
        .x402-btn:hover { transform: scale(1.05); }
        .x402-tag {
            font-size: 10px;
            background: #eee;
            padding: 2px 6px;
            border-radius: 4px;
            margin-left: 5px;
        }
        
        .footer { margin-top: 3rem; font-size: 0.8rem; opacity: 0.5; }
    </style>
</head>
<body>

<div class="container">
    <div class="avatar"></div>
    <h1>Olivie</h1>
    <span class="ens-name">olivie.base.eth</span>
    
    <p>
        这里是我的数字避难所。基于 Base 链和 IPFS 构建。<br>
        资产已解耦，注意力已主权。
    </p>

    <div style="border-top: 1px solid var(--border); padding-top: 1.5rem;">
        <h3 style="font-size: 0.9rem; margin-bottom: 1rem;">与我的 AI Agent 通讯</h3>
        <button class="x402-btn" onclick="alert('即将调用 x402 支付网关：需支付 $0.01 USDC 以发送私信')">
            📬 发送私信
            <span class="x402-tag">x402 Enabled</span>
        </button>
        <div style="font-size: 0.7rem; margin-top: 0.8rem; color: #58a6ff;">
            * 支付微额 USDC 可有效过滤骚扰，费用直接进入前哨钱包。
        </div>
    </div>

    <div class="footer">
        Powered by Arweave/IPFS • No Tracking • No Ads
    </div>
</div>

</body>
</html>