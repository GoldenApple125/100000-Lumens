function localSave() {
    const save = btoa(JSON.stringify(game));
    localStorage.setItem(game.name,save);
}

function importSave() {
    $("save_file").click();
}

function exportSave() {
    const save = btoa(JSON.stringify(game));
    const file = document.createElement("a");
    file.href = `data:text/plain;charset=utf-8,${save}`;
    file.download = `${game.name}-${game.version}-${saveTime(new Date())}.txt`;
    file.className = "setting_file";
    $("save_bar").appendChild(file);
    file.click();
    $("save_bar").removeChild(file);
}

function resetSave() {
    localStorage.removeItem(game.name);
    for (n in game.score) {
        game.score[n] = 0;
    }
    game.star = Object.assign({},game.score);
    refreshStar(null);
    changePage("level_page");
    localSave();
}

function loadSave(x) {
    let isError = false;
    try {
        JSON.parse(atob(x));
    }
    catch (error) {
        isError = true;
    }
    finally {
        if (!isError) {
            const save = JSON.parse(atob(x));
            if (save?.name === game.name && compareVersion(save?.version,"0.2.0") >= 0) {
                game.score = Object.assign({},save.score);
                for (n in level) {
                    refreshStar(n);
                }
                $("save_reset").classList.remove("item_wrong");
                $("save_reset").innerText = "重置";
                game.isPrepareReset = false;
            }
        }
        refreshStar(null);
        changePage("level_page");
        localSave();
    }
}

function saveTime(x) {
    const year = x.getFullYear();
    const month = x.getMonth() + 1;
    const day = x.getDate();
    const hour = x.getHours();
    const minute = x.getMinutes();
    const second = x.getSeconds();
    return `${pad(year,4)}.${pad(month,2)}.${pad(day,2)}-${pad(hour,2)}.${pad(minute,2)}.${pad(second,2)}`;
}

function pad(x,y) {
    return x.toString().padStart(y,"0");
}

function compareVersion(x,y) {
    if (x === undefined || y === undefined) {
        return undefined;
    }
    else {
        const x0 = x.split("-");
        const x1 = x0[0];
        const x2 = x0[1];
        const y0 = y.split("-");
        const y1 = y0[0];
        const y2 = y0[1];
        for (let i = 0;i < 3;i++) {
            if (x1.split(".")[i] > y1.split(".")[i]) {
                return 1;
            }
            if (x1.split(".")[i] < y1.split(".")[i]) {
                return -1;
            }
        }
        if (x2 === undefined && y2 === undefined) {
            return 0;
        }
        if (x2 === undefined && y2 !== undefined) {
            return 1;
        }
        if (x2 !== undefined && y2 === undefined) {
            return -1;
        }
        const x3 = x2.split(".");
        const y3 = y2.split(".");
        if (x3[0] > y3[0]) {
            return 1;
        }
        if (x3[0] < y3[0]) {
            return -1;
        }
        if (x3[1] === undefined && y3[1] === undefined) {
            return 0;
        }
        if (x3[1] !== undefined && y3[1] === undefined) {
            return 1;
        }
        if (x3[1] === undefined && y3[1] !== undefined) {
            return -1;
        }
        if (x3[1] > y3[1]) {
            return 1;
        }
        if (x3[1] < y3[1]) {
            return -1;
        }
        return 0;
    }
}