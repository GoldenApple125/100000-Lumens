const game = {
    name: "100000-Lumens",
    version: "0.3.0",
    page: "load_page",
    isShowBorder: true,
    isShowStar: false
}

class Item {
    constructor(name,information,layer,isShowLight,basicDemand,basicLight,rewardDemand,rewardLight) {
        this.name = name;
        this.information = information;
        this.layer = layer;
        this.isShowLight = isShowLight;
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
    candle: new Item("蜡烛","需要与麻线相邻，每与一个蜡质相邻，额外提供100流明",2,true,["hemp_thread"],75,["wax"],100),
    iron: new Item("铁","可任意放置",0,false,null,0,null,0),
    coal: new Item("煤炭","可任意放置",0,false,null,0,null,0),
    pipeline: new Item("管道","需要与煤炭相邻",1,false,["coal"],0,null,0),
    gaslight: new Item("煤气灯","需要与铁和管道相邻，每与一个煤炭相邻，额外提供25流明",2,true,["iron","pipeline"],300,["coal"],25),
    kerosene: new Item("煤油","需要与煤炭相邻",1,false,["coal"],0,null,0),
    kerosene_lamp: new Item("煤油灯","需要与铁相邻，每与一个煤油相邻，额外提供125流明",2,true,["iron"],125,["kerosene"],125),
    alloy: new Item("合金","可任意放置",0,false,null,0,null,0),
    electricity: new Item("电力","需要与合金相邻",1,false,["alloy"],0,null,0),
    tungsten_filament: new Item("钨丝","可任意放置",0,false,null,0,null,0),
    nitrogen: new Item("氮气","可任意放置",0,false,null,0,null,0),
    incandescent_lamp: new Item("白炽灯","需要与钨丝和氮气相邻，每与一个电力相邻，额外提供300流明",2,true,["tungsten_filament","nitrogen"],100,["electricity"],300),
    phosphor: new Item("荧光粉","需要与合金相邻",1,false,["alloy"],0,null,0),
    mercury: new Item("汞","需要与荧光粉相邻",2,false,["phosphor"],0,null,0),
    fluorescent_lamp: new Item("荧光灯","需要与汞相邻，每与一个电力相邻，额外提供400流明",3,true,["mercury"],200,["electricity"],400),
    semiconductor_wafer: new Item("半导体晶片","需要与合金相邻",1,false,["alloy"],0,null,0),
    LED_lamp: new Item("LED灯","需要与荧光粉和半导体晶片相邻，每与一个电力相邻，额外提供500流明",2,true,["phosphor","semiconductor_wafer"],300,["electricity"],500)
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
    level8: new Level(5,5,["copper","hemp_thread","oil","oil_lamp"],[1800,2000,2400],"最优解提供：不想再做工具人"),
    level9: new Level(4,4,["copper","hemp_thread","wax","candle"],[1000,1300,1475],null),
    level10: new Level(5,5,["copper","hemp_thread","wax","candle"],[1900,2200,2600],null),
    level11: new Level(4,4,["iron","coal","pipeline","gaslight"],[1550,1800,1950],null),
    level12: new Level(5,5,["iron","coal","pipeline","gaslight"],[2600,2900,3250],null),
    level13: new Level(4,4,["iron","coal","kerosene","kerosene_lamp"],[1750,2000,2250],null),
    level14: new Level(5,5,["iron","coal","kerosene","kerosene_lamp"],[3000,3300,3625],null),
    level15: new Level(5,5,["alloy","electricity","tungsten_filament","nitrogen","incandescent_lamp"],[3700,4400,4800],null),
    level16: new Level(6,6,["alloy","electricity","tungsten_filament","nitrogen","incandescent_lamp"],[6000,6800,7400],null),
    level17: new Level(5,5,["alloy","electricity","phosphor","mercury","fluorescent_lamp"],[5600,6400,6800],null),
    level18: new Level(6,6,["alloy","electricity","phosphor","mercury","fluorescent_lamp"],[9000,10000,11000],null),
    level19: new Level(5,5,["alloy","electricity","phosphor","semiconductor_wafer","LED_lamp"],[6400,7400,8400],null),
    level20: new Level(6,6,["alloy","electricity","phosphor","semiconductor_wafer","LED_lamp"],[10000,11300,12600],null)
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