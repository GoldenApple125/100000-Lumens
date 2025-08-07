var game,mainLoop;

function $(x) {
    return document.getElementById(x);
}

function load() {
    game = {
        name: "100000-Lumens",
        version: "0.1.0",
        debug: false,
        unlockLevel: 1,
        currentLight: 0,
        tryList: [],
        tryLight: 0,
        currentLayer: 0,
        currentOption: 1,
        isReset: false
    };
    game.allLevel = level.length;
    game.level = Array(game.allLevel).fill(0);
    game.maxItemLayer = 0;
    for (let i = 0;i < item.length;i++) {
        if (item[i].layer > game.maxItemLayer) {
            game.maxItemLayer = item[i].layer;
        }
    }
    loadLocalSave();
}

function startMainLoop() {
    mainLoop = setInterval(() => {
        checkLight();
        refreshStyle();
        autoLocalSave();
    },10);
}

function stopMainLoop() {
    clearInterval(mainLoop);
}

function changeLayer(x) {
    game.currentLayer = x;
    for (let i = 0;i < layerList.length;i++) {
        $(layerList[i]).style.display = "none";
    }
    $(layerList[x]).style.display = "flex";
    if (x >= 1 && x <= 3) {
        game.currentOption = x;
        $("option_screen").style.display = "block";
    }
    else {
        $("option_screen").style.display = "none";
    }
    if (x != 2) {
        game.isReset = false;
    }
}

function checkLight() {
    //判定物品
    game.currentLight = 0;
    rewardLight = 0;
    for (let checkLayer = 0;checkLayer <= game.maxItemLayer;checkLayer++) {
        for (let i = 0;i < game.map.length;i++) {
            for (let j = 0;j < game.map[i].length;j++) {
                const mapItem = game.map[i][j] - 1;
                const nearWood = nearItem(i,j,-1,0) == 0 || nearItem(i,j,1,0) == 0 || nearItem(i,j,0,-1) == 0 || nearItem(i,j,0,1) == 0;
                const nearCharcoal = nearItem(i,j,-1,0) == 3 || nearItem(i,j,1,0) == 3 || nearItem(i,j,0,-1) == 3 || nearItem(i,j,0,1) == 3;
                if (mapItem != -1 && item[mapItem]?.layer == checkLayer) {
                    game.isMapUseful[i][j] = false;
                    switch (mapItem) {
                        case 0:
                            game.isMapUseful[i][j] = true;
                            break;
                        case 1:
                            if (nearWood) {
                                game.isMapUseful[i][j] = true;
                            }
                            break;
                        case 2:
                            game.isMapUseful[i][j] = true;
                            if (nearItem(i,j,-1,0) == 5) {
                                rewardLight += 50;
                            }
                            if (nearItem(i,j,1,0) == 5) {
                                rewardLight += 50;
                            }
                            if (nearItem(i,j,0,-1) == 5) {
                                rewardLight += 50;
                            }
                            if (nearItem(i,j,0,1) == 5) {
                                rewardLight += 50;
                            }
                            break;
                        case 3:
                            if (nearWood) {
                                game.isMapUseful[i][j] = true;
                            }
                            break;
                        case 4:
                            if (nearWood && nearCharcoal) {
                                game.isMapUseful[i][j] = true;
                            }
                            break;
                        case 5:
                            if (nearWood) {
                                game.isMapUseful[i][j] = true;
                            }
                            break;
                    }
                    if (item[mapItem].isLightSource && game.isMapUseful[i][j]) {
                        game.currentLight += item[mapItem].basicLight;
                    }
                }
            }
        }
    }
    game.currentLight += rewardLight;
    //判定过关
    if (game.currentLight >= game.currentBasicGoal && game.level[game.currentLevel - 1] < 1) {
        game.level[game.currentLevel - 1] = 1;
    }
    if (game.currentLight >= game.currentBestGoal && game.level[game.currentLevel - 1] < 2) {
        game.level[game.currentLevel - 1] = 2;
    }
    //解锁关卡
    var stars = 0;
    for (let i = 0;i < game.level.length;i++) {
        stars += game.level[i];
    }
    if (stars > game.unlockLevel - 1) {
        game.unlockLevel = stars + 1;
    }
    if (game.unlockLevel > game.allLevel) {
        game.unlockLevel = game.allLevel;
    }
}

function refreshStyle() {
    //选择物品按钮
    const currentUsedItem = game.currentUsedItem;
    for (let i = 0;i < game.currentMaxItem;i++) {
        $("item" + String(i + 1)).style.borderColor = "#707070";
    }
    if (currentUsedItem != 0) {
        $("item" + String(currentUsedItem)).style.borderColor = "#e0c514";
    }
    //切换关卡按钮
    const currentLevel = game.currentLevel;
    const unlockLevel = game.unlockLevel - 1;
    if (currentLevel >= 2) {
        $("level_up").style.color = "#ffffff";
        $("level_up").style.borderColor = "#707070";
    }
    else {
        $("level_up").style.color = "#707070";
        $("level_up").style.borderColor = "#525252";
    }
    if (currentLevel <= game.allLevel - 1 && (currentLevel <= unlockLevel || game.debug)) {
        $("level_down").style.color = "#ffffff";
        $("level_down").style.borderColor = "#707070";
    }
    else {
        $("level_down").style.color = "#707070";
        $("level_down").style.borderColor = "#525252";
    }
    //当前关卡进度
    const basicLight = game.currentBasicGoal;
    const maxLight = game.currentBestGoal;
    $("current_Light").innerText = game.currentLight;
    $("basic_goal").innerText = basicLight;
    $("level_goal").style.left = String(250 * basicLight / maxLight) + "px";
    $("light_bar").style.width = String(250 * game.currentLight / maxLight) + "px";
    if (game.currentLight >= game.currentBasicGoal) {
        $("level_goal").style.color = "#e0c514";
    }
    else {
        $("level_goal").style.color = "#707070";
    }
    switch (game.level[game.currentLevel - 1]) {
        case 0:
            $("level_title").innerHTML = `第<div class="number" id="level_number">${String(game.currentLevel)}</div>关`;
            break;
        case 1:
            $("level_title").innerHTML = `☆第<div class="number" id="level_number">${String(game.currentLevel)}</div>关`;
            break;
        case 2:
            $("level_title").innerHTML = `★第<div class="number" id="level_number">${String(game.currentLevel)}</div>关`;
            break;
    }
    //当前网格物品
    for (let i = 0;i < game.map.length;i++) {
        for (let j = 0;j < game.map[i].length;j++) {
            const mapId = "map" + String(i + 1) + "_" + String(j + 1);
            if (game.map[i][j] == 0) {
                $(mapId).innerHTML = "";
            }
            else {
                const itemName = item[game.map[i][j] - 1].name;
                $(mapId).innerHTML = `<img src="./image/${itemName}.png" alt="${itemName}" class="map_image">`;
            }
            if (game.isMapUseful[i][j] || game.map[i][j] == 0) {
                $(mapId).style.borderColor = "#707070";
            }
            else {
                $(mapId).style.borderColor = "#d23838";
            }
        }
    }
    //物品悬浮信息
    if (game.currentLayer == 0) {
        for (let i = 0;i < game.currentMaxItem;i++) {
            const itemSpace = String(i + 1);
            $("information" + itemSpace).style.left = String($("item" + itemSpace).offsetParent.offsetLeft + $("item" + itemSpace).offsetLeft - $("information" + itemSpace).offsetWidth / 2 + $("item" + itemSpace).offsetWidth / 2) + "px";
            $("information" + itemSpace).style.top = String($("item" + itemSpace).offsetParent.offsetTop + $("item" + itemSpace).offsetTop - $("information" + itemSpace).offsetHeight - 5) + "px";
        }
    }
    //版本号与调试
    $("version_text").innerText = game.version;
    if (game.debug) {
        $("version_text").innerText += "(debug)";
    }
    //选项界面样式
    var buttonWidth = "95px";
    $("button_bar").style.width = "330px";
    $("button_bar").style.margin = "0px -165px";
    if (window.screen.width < 500) {
        buttonWidth = "65px";
        $("button_bar").style.width = "240px";
        $("button_bar").style.margin = "0px -120px";
    }
    for (let i = 1;i < layerList.length;i++) {
        $("button" + String(i)).style.width = buttonWidth;
    }
    var normalStar = 0;
    var bestStar = 0;
    for (let i = 0;i < game.allLevel;i++) {
        if (game.level[i] == 2) {
            normalStar++;
            bestStar++;
        }
        else if (game.level[i] == 1) {
            normalStar++;
        }
    }
    $("level_text1").innerText = `${normalStar}/${game.allLevel}☆`;
    $("level_text2").innerText = `${bestStar}/${game.allLevel}★`;
    for (let i = 0;i < game.allLevel;i++) {
        const level = "level_button" + String(i + 1);
        if (i + 1 <= game.unlockLevel || game.debug) {
            $(level).style.display = "block";
        }
        else {
            $(level).style.display = "none";
        }
        switch (game.level[i]) {
            case 0:
                $(level).style.border = "#707070 solid 2px";
                $(level).style.color = "#ffffff";
                $(level).style.fontWeight = "normal";
                break;
            case 1:
                $(level).style.border = "#707070 solid 2px";
                $(level).style.color = "#f4d616";
                $(level).style.fontWeight = "bold";
                break;
            case 2:
                $(level).style.border = "#e0c514 solid 2px";
                $(level).style.color = "#f4d616";
                $(level).style.fontWeight = "bold";
                break;
        }
    }
    if (!game.isReset) {
        $("reset_button").innerText = "重置";
    }
    else {
        $("reset_button").innerText = "确认重置";
    }
}

function changeLevel(x) {
    if (x >= 1 && x <= game.allLevel && (x <= game.unlockLevel || game.debug)) {
        game.currentLevel = x;
        $("level_number").innerText = x;
        const n = x - 1;
        game.currentItem = level[n].item;
        game.currentMaxItem = game.currentItem.length;
        game.currentBasicGoal = level[n].basicGoal;
        game.currentBestGoal = level[n].bestGoal;
        game.currentUsedItem = 0;
        game.currentLight = 0;
        //当前关卡网格
        const levelWidth = level[n].mapWidth;
        const levelHeight = level[n].mapHeight;
        game.map = Array(levelHeight).fill().map(() => Array(levelWidth).fill(0));
        game.isMapUseful = Array(levelHeight).fill().map(() => Array(levelWidth).fill(true));
        $("map_table").innerHTML = "";
        for (let i = 0;i < levelHeight;i++) {
            $("map_table").innerHTML += `<div class="map_bar" id="map_bar${String(i + 1)}"></div>`;
            for (let j = 0;j < levelWidth;j++) {
                $("map_bar" + String(i + 1)).innerHTML += `<div class="map" id="map${String(i + 1)}_${String(j + 1)}" onclick="useItem(${String(j)},${String(i)})"></div>`;
            }
        }
        //当前关卡物品
        $("item_bar").innerHTML = "";
        for (let i = 0;i < game.currentMaxItem;i++) {
            const itemSpace = String(i + 1);
            const itemInformtion = item[game.currentItem[i] - 1];
            const itemName = String(item[game.currentItem[i] - 1].name);
            var div = document.createElement("div");
            div.className = "map";
            div.id = "item" + itemSpace;
            div.addEventListener("click",() => {chooseItem(itemSpace);});
            $("item_bar").appendChild(div);
            $("item" + itemSpace).innerHTML += `<img src="./image/${itemName}.png" alt="${itemName}" class="map_image"></img>`;
            $("item" + itemSpace).innerHTML += `<div class="information" id="information${itemSpace}"><div class="information_title" id="information_title${itemSpace}"></div><div class="information_basic" id="information_basic${itemSpace}"><div class="light_number" id="information_light${itemSpace}"></div><div class="light">流明</div></div><div id="information_text${itemSpace}"></div></div>`;
            $("information_title" + itemSpace).innerText = itemInformtion.title;
            if (itemInformtion.isLightSource) {
                $("information_basic" + itemSpace).style.display = "block";
                $("information_light" + itemSpace).innerText = itemInformtion.basicLight;
            }
            else {
                $("information_basic" + itemSpace).style.display = "none";
            }
            $("information_text" + itemSpace).innerHTML = itemInformtion.information;
        }
        //网格大小放缩
        var zoom = 1;
        if (levelWidth >= levelHeight) {
            zoom = levelWidth;
        }
        else {
            zoom = levelHeight;
        }
        zoom = 1 / (zoom / 3) ** 0.5;
        for (let i = 0;i < levelHeight;i++) {
            $("map_bar" + String(i + 1)).style.zoom = zoom;
        }
    }
}

function levelUp() {
    const x = game.currentLevel - 1;
    changeLevel(x);
}

function levelDown() {
    const x = game.currentLevel + 1;
    changeLevel(x);
}

function chooseLevel(x) {
    changeLayer(0);
    changeLevel(x);
}

function chooseItem(x) {
    if (game.currentUsedItem != x) {
        game.currentUsedItem = x;
    }
    else {
        game.currentUsedItem = 0;
    }
}

function useItem(x,y) {
    if (game.currentUsedItem != 0) {
        const usedItem = game.currentItem[game.currentUsedItem - 1];
        if (game.map[y][x] != usedItem) {
            game.map[y][x] = usedItem;
        }
    }
    else {
        game.map[y][x] = 0;
    }
}