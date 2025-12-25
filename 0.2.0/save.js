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
            if (save?.name === game.name) {
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