const game = {
    name: "100000-Lumens",
    version: "0.2.1",
    page: "load_page",
    isShowBorder: true,
    isPrepareReset: false,
    isShowStar: false
}

class Item {
    constructor(name,information,layer,isLightSource,basicDemand,basicLight,rewardDemand,rewardLight) {
        this.name = name;
        this.information = information;
        this.layer = layer;
        this.isLightSource = isLightSource;
        this.basicDemand = basicDemand;
        this.basicLight = basicLight;
        this.rewardDemand = rewardDemand;
        this.rewardLight = rewardLight;
    }
}

const item = {
    air: new Item("空气","可任意放置",0,false,null,0,null,0),
    branch: new Item("树枝","可任意放置",0,false,null,0,null,0),
    flame: new Item("火焰","需要与树枝相邻",1,true,["branch"],50,null,0),
    wood: new Item("木材","可任意放置",0,false,null,0,null,0),
    resin: new Item("树脂","需要与木材相邻",1,false,["wood"],0,null,0),
    torch: new Item("火把","需要与木材和树脂相邻",2,true,["wood","resin"],100,null,0),
    woodpile: new Item("柴堆","需要与木材相邻",1,false,["wood"],0,null,0),
    campfire: new Item("篝火","可任意放置，每与一个柴堆相邻，额外提供50流明",2,true,null,25,["woodpile"],50),
    copper: new Item("铜","可任意放置",0,false,null,0,null,0),
    hemp_thread: new Item("麻线","需要与铜相邻",1,false,["copper"],0,null,0),
    oil: new Item("油料","需要与麻线相邻",2,false,["hemp_thread"],0,null,0),
    oil_lamp: new Item("油灯","需要与油料相邻，每与一个麻线相邻，额外提供75流明",3,true,["oil"],150,["hemp_thread"],75),
    wax: new Item("蜡质","需要与铜相邻",1,false,["copper"],0,null,0),
    candle: new Item("蜡烛","需要与麻线相邻，每与一个蜡质相邻，额外提供100流明",2,true,["hemp_thread"],75,["wax"],100)
}

class Level {
    constructor(levelWidth,levelHeight,itemList,goalList,information) {
        this.levelWidth = levelWidth;
        this.levelHeight = levelHeight;
        this.itemList = itemList;
        this.goalList = goalList;
        this.information = information;
    }
}

const level = {
    level1: new Level(3,3,["branch","flame"],[200,250,300],"将物品放入网格并提高流明数"),
    level2: new Level(4,4,["branch","flame"],[400,500,600],"四星代表你超过了已知最优解"),
    level3: new Level(3,3,["wood","resin","torch"],[200,300,400],null),
    level4: new Level(4,4,["wood","resin","torch"],[500,600,800],null),
    level5: new Level(3,3,["wood","woodpile","campfire"],[325,350,500],null),
    level6: new Level(4,4,["wood","woodpile","campfire"],[650,800,925],null),
    level7: new Level(4,4,["copper","hemp_thread","oil","oil_lamp"],[950,1200,1350],null),
    level8: new Level(5,5,["copper","hemp_thread","oil","oil_lamp"],[1800,2000,2250],null),
    level9: new Level(4,4,["copper","hemp_thread","wax","candle"],[1000,1300,1475],null),
    level10: new Level(5,5,["copper","hemp_thread","wax","candle"],[1900,2200,2600],null),
}

function $(x) {
    return document.getElementById(x);
}

function addClickEvent(x,y) {
    $(x).addEventListener("mousedown",(e) => {
        if (e.button === 0) {
            y(e);
        }
    });
}

function changePage(x) {
    game.isShowStar = false;
    changeBlock();
    $(game.page).classList.add("hidden");
    $(game.page).classList.remove("visible");
    $(x).classList.add("visible");
    $(x).classList.remove("hidden");
    game.page = x;
}

function refreshBorder() {
    const rootStyle = document.documentElement.style;
    if (game.isShowBorder) {
        rootStyle.setProperty("--border-color","#a19267");
        $("show_border").innerText = "开启";
    }
    else {
        rootStyle.setProperty("--border-color","#00000000");
        $("show_border").innerText = "关闭";
    }
}

function checkItem(x,y) {
    const newItem = item[game.currentTable[x][y]];
    const leftItem = game.currentTable[x]?.[y - 1];
    const rightItem = game.currentTable[x]?.[y + 1];
    const topItem = game.currentTable[x - 1]?.[y];
    const bottomItem = game.currentTable[x + 1]?.[y];
    const leftCheck = game.currentCheck[x]?.[y - 1];
    const rightCheck = game.currentCheck[x]?.[y + 1];
    const topCheck = game.currentCheck[x - 1]?.[y];
    const bottomCheck = game.currentCheck[x + 1]?.[y];
    let demand = true;
    const demandList = newItem.basicDemand;
    if (demandList !== null) {
        demandList.forEach((n) => {
            if (!((leftItem === n && leftCheck) || (rightItem === n && rightCheck) || (topItem === n && topCheck) || (bottomItem === n && bottomCheck))) {
                demand = false;
            }
        });
    }
    let reward = 0;
    const rewardDemandList = newItem.rewardDemand;
    if (rewardDemandList !== null) {
        rewardDemandList.forEach((n) => {
            reward += newItem.rewardLight * ((leftItem === n && leftCheck) + (rightItem === n && rightCheck) + (topItem === n && topCheck) + (bottomItem === n && bottomCheck));
        });
    }
    if (demand) {
        return newItem.basicLight + reward;
    }
    else {
        return -1;
    }
}