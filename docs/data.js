var item = [
    {
        name: "wood",
        layer: 0,
        isLightSource: false,
        title: "木材",
        information: `可任意放置`
    },
    {
        name: "torch",
        layer: 1,
        isLightSource: true,
        basicLight: 50,
        title: "火把",
        information: `需要放在木材旁边`
    },
    {
        name: "campfire",
        layer: 2,
        isLightSource: true,
        basicLight: 25,
        title: "篝火",
        information: `可任意放置，旁边每多一个木柴堆，额外提供50<div class="light">流明</div>`
    },
    {
        name: "charcoal",
        layer: 1,
        isLightSource: false,
        title: "木炭",
        information: `需要放在木材旁边`
    },
    {
        name: "better_torch",
        layer: 2,
        isLightSource: true,
        basicLight: 100,
        title: "改进火把",
        information: `需要放在木材和木炭旁边`
    },
    {
        name: "woodpile",
        layer: 1,
        isLightSource: false,
        title: "木柴堆",
        information: `需要放在木材旁边`
    }
];

var level = [
    {
        mapWidth: 3,
        mapHeight: 3,
        item: [1,2],
        basicGoal: 200,
        bestGoal: 300
    },
    {
        mapWidth: 4,
        mapHeight: 4,
        item: [1,2],
        basicGoal: 500,
        bestGoal: 600
    },
    {
        mapWidth: 3,
        mapHeight: 3,
        item: [1,4,5],
        basicGoal: 300,
        bestGoal: 400
    },
    {
        mapWidth: 4,
        mapHeight: 4,
        item: [1,4,5],
        basicGoal: 600,
        bestGoal: 800
    },
    {
        mapWidth: 3,
        mapHeight: 3,
        item: [1,6,3],
        basicGoal: 350,
        bestGoal: 500
    },
    {
        mapWidth: 4,
        mapHeight: 4,
        item: [1,6,3],
        basicGoal: 800,
        bestGoal: 925
    }
];

const layerList = ["main_screen","option_screen1","option_screen2","option_screen3"];

function nearItem(i,j,y,x) {
    if (game.isMapUseful?.[i + y]?.[j + x]) {
        return game.map[i + y][j + x] - 1;
    }
}

function startTry() {
    if (game.debug) {
        stopMainLoop();
        const tryLevel = level[game.currentLevel - 1];
        game.tryList = Array(tryLevel.mapWidth * tryLevel.mapHeight + 1).fill(0);
        game.tryLight = 0;
        mainLoop = setInterval(() => {
            for (let i = 0;i < 3000;i++) {
                tryItem();
                checkLight();
                refreshResult();
            }
            $("version_text").innerText = game.tryList;
        },10);
    }
}

function tryItem() {
    const allItem = game.currentItem.length;
    const tryLevel = level[game.currentLevel - 1];
    game.tryList[0]++;
    for (let i = 0;i < game.tryList.length - 1;i++) {
        if (game.tryList[i] == allItem) {
            game.tryList[i] = 0;
            game.tryList[i + 1]++;
        }
        else {
            break;
        }
    }
    var tryItemList = Array(game.tryList.length - 1);
    for (let i = 0;i < game.tryList.length - 1;i++) {
        tryItemList[i] = game.currentItem[game.tryList[i]];
    }
    var mapList = [];
    for (let i = 0;i < tryItemList.length;i += tryLevel.mapWidth) {
        mapList.push(tryItemList.slice(i,i + tryLevel.mapWidth));
    }
    game.map = mapList;
}

function refreshResult() {
    if (game.currentLight > game.tryLight) {
        game.tryLight = game.currentLight;
        refreshStyle();
    }
    if (game.tryList[game.tryList.length - 1] == 1) {
        stopMainLoop();
    }
}