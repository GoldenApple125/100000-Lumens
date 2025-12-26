function startGame() {
    game.maxLevel = Object.keys(level).length;
    //初始化元素
    const maxLevel = game.maxLevel;
    const levelTable = document.createDocumentFragment();
    for (n in level) {
        const levelBlock = document.createElement("div");
        levelBlock.className = "level_block";
        levelBlock.id = n;
        levelTable.appendChild(levelBlock);
    }
    $("level_table").appendChild(levelTable);
    $("about_version").innerText = game.version;
    //添加点击事件
    addClickEvent("level_table",(e) => {
        const target = e.target;
        if (target.classList[0] === "level_block") {
            changePage("game_page");
            loadLevel(target.id);
        }
        else if (target.classList[0] === "level_star") {
            if (!game.isShowStar) {
                game.isShowStar = true;
            }
            else {
                game.isShowStar = false;
            }
            changeBlock();
        }
    });
    addClickEvent("level_setting",() => {
        changePage("setting_page");
    });
    addClickEvent("level_about",() => {
        changePage("about_page");
    });
    addClickEvent("game_back",() => {
        changePage("level_page");
    });
    addClickEvent("game_up",() => {
        const levelNumber = Number(game.currentLevel.slice(5));
        if (levelNumber >= 2) {
            loadLevel(`level${levelNumber - 1}`);
        }
    });
    addClickEvent("game_down",() => {
        const levelNumber = Number(game.currentLevel.slice(5));
        if (levelNumber <= game.maxLevel - 1) {
            loadLevel(`level${levelNumber + 1}`);
        }
    });
    addClickEvent("game_clear",() => {
        const newLevel = level[game.currentLevel];
        const width = newLevel.levelWidth;
        const height = newLevel.levelHeight;
        for (let i = 0;i < height;i++) {
            for (let j = 0;j < width;j++) {
                $(`block${i}_${j}`).innerText = "";
                game.currentTable[i][j] = "air";
            }
        }
        refreshScore();
    });
    addClickEvent("game_table",(e) => {
        const target = e.target;
        if (target.classList[0] === "game_block") {
            const position = target.id.slice(5).split("_");
            placeItem(position[0],position[1]);
        }
    });
    addClickEvent("game_item",(e) => {
        const target = e.target;
        if (target.classList[0] === "item_block") {
            chooseItem(target.id,false);
        }
    });
    addClickEvent("setting_back",() => {
        changePage("level_page");
        $("save_reset").classList.remove("item_wrong");
        $("save_reset").innerText = "重置";
        game.isPrepareReset = false;
    });
    addClickEvent("show_border",() => {
        if (!game.isShowBorder) {
            game.isShowBorder = true;
        }
        else {
            game.isShowBorder = false;
        }
        refreshBorder();
        localSave();
    });
    addClickEvent("save_import",() => {
        importSave();
    });
    addClickEvent("save_export",() => {
        exportSave();
    });
    addClickEvent("save_reset",() => {
        if (!game.isPrepareReset) {
            $("save_reset").classList.add("item_wrong");
            $("save_reset").innerText = "确认";
            game.isPrepareReset = true;
        }
        else {
            resetSave();
            $("save_reset").classList.remove("item_wrong");
            $("save_reset").innerText = "重置";
            game.isPrepareReset = false;
        }
    });
    addClickEvent("about_back",() => {
        changePage("level_page");
    });
    //添加悬浮窗事件
    $("game_item").addEventListener("mouseover",(e) => {
        const target = e.target;
        if (target.classList[0] === "item_block") {
            $("item_information").classList.add("visible");
            $("item_information").classList.remove("hidden");
            const levelItem = level[game.currentLevel].itemList;
            const hoverItem = item[levelItem[target.id.slice(4)]];
            $("item_title").innerText = hoverItem.name;
            if (hoverItem.isLightSource) {
                $("item_light").innerText = `${hoverItem.basicLight}流明`;
            }
            else {
                $("item_light").innerText = "";
            }
            $("item_text").innerText = hoverItem.information;
            const pointer = Number(getComputedStyle(document.documentElement).getPropertyValue("--pointer"));
            if (pointer === 1) {
                $("item_information").style.left = `${target.offsetParent.offsetLeft - ($("item_information").offsetWidth - target.offsetWidth + levelItem.length % 2 + window.innerWidth % 2) / 2 + target.offsetLeft}px`;
                $("item_information").style.marginLeft = "0px";
            }
            else {
                $("item_information").style.left = `50%`;
                $("item_information").style.marginLeft = `-${$("item_information").offsetWidth / 2}px`;
            }
            $("item_information").style.top = `${target.offsetParent.offsetTop - $("item_information").offsetHeight + 2}px`;
        }
    });
    $("game_item").addEventListener("mouseout",(e) => {
        const target = e.target;
        if (target.classList[0] === "item_block") {
            $("item_information").classList.add("hidden");
            $("item_information").classList.remove("visible");
        }
    });
    //初始化数据
    $("save_file").addEventListener("change",(e) => {
        const reader = new FileReader();
        reader.readAsText(e.target.files[0],"utf-8");
        reader.onload = (n) => {
            loadSave(n.target.result);
            $("save_file").value = "";
        };
    });
    game.score = {};
    for (let i = 0;i < maxLevel;i++) {
        game.score[`level${i + 1}`] = 0;
    }
    game.star = Object.assign({},game.score);
    for (n in level) {
        const goal = level[n].goalList;
        goal.push(goal.at(-1) + 1);
    }
    loadSave(localStorage[game.name]);
}

function loadLevel(x) {
    game.currentLevel = x;
    $("game_level").innerText = `第${Number(x.slice(5))}关`;
    const newLevel = level[x];
    const width = newLevel.levelWidth;
    const height = newLevel.levelHeight;
    $("game_information").innerText = "";
    if (newLevel.information !== null) {
        $("game_information").innerText = newLevel.information;
    }
    //重置关卡网格
    $("game_table").innerText = "";
    const gameTable = document.createDocumentFragment();
    for (let i = 0;i < height;i++) {
        const gameBar = document.createElement("div");
        gameBar.className = "game_bar";
        for (let j = 0;j < width;j++) {
            const gameBlock = document.createElement("div");
            gameBlock.className = "game_block";
            gameBlock.id = `block${i}_${j}`;
            gameBar.appendChild(gameBlock);
        }
        gameTable.appendChild(gameBar);
    }
    $("game_table").appendChild(gameTable);
    game.currentTable = Array(height).fill().map(() => Array(width).fill("air"));
    refreshScore();
    //重置关卡物品
    $("game_item").innerText = "";
    const levelItem = newLevel.itemList;
    const maxItem = levelItem.length;
    const itemBar = document.createDocumentFragment();
    for (let i = 0;i < maxItem;i++) {
        const itemBlock = document.createElement("div");
        itemBlock.className = "item_block";
        itemBlock.id = `item${i}`;
        const itemImage = document.createElement("img");
        itemImage.src = `./image/${levelItem[i]}.png`;
        itemImage.alt = levelItem[i];
        itemImage.className = "item_image";
        itemBlock.appendChild(itemImage);
        itemBar.appendChild(itemBlock);
    }
    $("game_item").appendChild(itemBar);
    chooseItem("item0",true);
}

function chooseItem(x,y) {
    const levelItem = level[game.currentLevel].itemList;
    const newItem = levelItem[Number(x.slice(4))];
    if (game.currentItem !== newItem || y) {
        for (let i = 0;i < levelItem.length;i++) {
            $(`item${i}`).classList.remove("item_focus");
        }
        $(x).classList.add("item_focus");
        game.currentItem = newItem;
    }
}

function placeItem(x,y) {
    const newItem = game.currentItem;
    $(`block${x}_${y}`).innerText = "";
    if (game.currentTable[x][y] !== newItem) {
        const itemImage = document.createElement("img");
        itemImage.src = `./image/${newItem}.png`;
        itemImage.alt = newItem;
        itemImage.className = "item_image";
        $(`block${x}_${y}`).appendChild(itemImage);
        game.currentTable[x][y] = newItem;
    }
    else {
        game.currentTable[x][y] = "air";
    }
    refreshScore();
}

function refreshScore() {
    //计算流明数
    game.currentLight = 0;
    const newLevel = level[game.currentLevel];
    const width = newLevel.levelWidth;
    const height = newLevel.levelHeight;
    game.currentCheck = Array(height).fill().map(() => Array(width).fill(false));
    let maxLayer = 0;
    newLevel.itemList.forEach((n) => {
        const itemLayer = item[n].layer;
        if (itemLayer > maxLayer) {
            maxLayer = itemLayer;
        }
    });
    maxLayer++;
    for (let l = 0;l < maxLayer;l++) {
        for (let i = 0;i < height;i++) {
            for (let j = 0;j < width;j++) {
                if (item[game.currentTable[i][j]].layer === l) {
                    const itemLight = checkItem(i,j);
                    if (itemLight === -1) {
                        $(`block${i}_${j}`).classList.add("item_wrong");
                        game.currentCheck[i][j] = false;
                    }
                    else {
                        $(`block${i}_${j}`).classList.remove("item_wrong");
                        game.currentCheck[i][j] = true;
                        game.currentLight += itemLight;
                    }
                }
            }
        }
    }
    $("game_light").innerText = game.currentLight;
    //计算星星数
    $("game_star").innerText = "";
    newLevel.goalList.forEach((n) => {
        if (game.currentLight >= n) {
            $("game_star").innerText += "★";
        }
    });
    if (game.currentLight > game.score[game.currentLevel]) {
        game.score[game.currentLevel] = game.currentLight;
        refreshStar(game.currentLevel);
        localSave();
    }
}

function refreshStar(x) {
    if (x !== null) {
        const newLevel = level[x];
        const newScore = game.score[x];
        let newStar = 0;
        newLevel.goalList.forEach((n) => {
            if (newScore >= n) {
                newStar++;
            }
        });
        game.star[x] = newStar;
    }
    let allStar = 0;
    for (n in game.star) {
        allStar += game.star[n];
    }
    let maxStar = 0;
    for (n in level) {
        maxStar += level[n].goalList.length - 1;
    }
    $("level_star").innerText = `★ ${allStar} / ${maxStar}`;
}

function changeBlock() {
    if (!game.isShowStar) {
        for (n in level) {
            $(n).classList.remove("star_light");
            $(n).innerText = n.slice(5);
        }
    }
    else {
        for (n in level) {
            if (game.star[n] === 0) {
                $(n).classList.add("star_light");
            }
            else {
                $(n).classList.remove("star_light");
            }
            $(n).innerText = `★${game.star[n]}`;
        }
    }
}