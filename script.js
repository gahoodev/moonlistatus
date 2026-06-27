document.addEventListener('DOMContentLoaded', function() {
    // Java Edition要素
    const jeServerStatus = document.getElementById('je-server-status');
    const jeServerVersion = document.getElementById('je-server-version');
    const jeServerAddress = document.getElementById('je-server-address');
    const jeServerPort = document.getElementById('je-server-port');

    // Bedrock Edition要素
    const beServerStatus = document.getElementById('be-server-status');
    const beServerVersion = document.getElementById('be-server-version');
    const beServerAddress = document.getElementById('be-server-address');
    const beServerPort = document.getElementById('be-server-port');

    // 共通要素
    const playerCount = document.getElementById('player-count');
    const lastUpdated = document.getElementById('last-updated');
    const refreshButton = document.getElementById('refresh-button');

    // サーバー情報を取得する関数
    async function getServerStatus() {
        // Java Edition用のAPI呼び出し
        const jeResponse = await fetch('https://api.mcsrvstat.us/2/tokaitown.minekeep.gg');
        const jeData = await jeResponse.json();

        // Bedrock Edition用のAPI呼び出し
        const beResponse = await fetch('https://api.mcsrvstat.us/bedrock/2/tokaitown.bedrock.minekeep.gg');
        const beData = await beResponse.json();

        // 現在の日時を取得
        const currentDate = new Date();
        const options = {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        };
        const formattedTime = new Intl.DateTimeFormat('en-US', options).format(currentDate);

        // Java Editionの情報を更新
        updateServerInfo(jeData, {
            status: jeServerStatus,
            version: jeServerVersion,
            address: jeServerAddress,
            port: jeServerPort
        }, 'JE');

        // Bedrock Editionの情報を更新
        updateServerInfo(beData, {
            status: beServerStatus,
            version: beServerVersion,
            address: beServerAddress,
            port: beServerPort
        }, 'BE');

        // プレイヤー数を更新（Geyserサーバー対応 - Java Editionのみカウント）
        const onlinePlayers = jeData.online ? jeData.players.online : 0;
        const maxPlayers = jeData.online ? jeData.players.max : 0;
        playerCount.textContent = `${onlinePlayers} / ${maxPlayers}`;
        
        // 最終更新時刻を更新
        lastUpdated.textContent = `Updated: ${formattedTime}`;
    }

    // サーバー情報更新用のヘルパー関数
    function updateServerInfo(data, elements, type) {
        if (data.online) {
            elements.status.textContent = '🟢Online';
            elements.version.textContent = data.version || 'No Data';
            elements.address.textContent = data.hostname || 'No Data';
            elements.port.textContent = type === 'BE' ? '19132' : data.port || 'No Data';
        } else {
            elements.status.textContent = '🔴Offline';
            elements.version.textContent = 'N/A';
            elements.address.textContent = 'N/A';
            elements.port.textContent = 'N/A';
        }
    }

    // ページロード時にサーバー情報を取得
    getServerStatus();

    // 定期的にサーバー情報を更新（1分ごとに再取得）
    setInterval(getServerStatus, 60000);

    // 更新ボタンのクリックイベント
    refreshButton.addEventListener('click', getServerStatus);
});
