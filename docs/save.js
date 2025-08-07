function useSave(x) {
    stopMainLoop();
    if (x != undefined) {
        var isError = false;
        try {
            var prepareGame = JSON.parse(atob(x));
        }
        catch (error) {
            isError = true;
        }
        finally {
            startMainLoop();
            if (!isError && prepareGame?.name == "100000-Lumens") {
                game = prepareGame;
                changeLayer(0);
                changeLevel(1);
            }
            refreshStyle();
        }
    }
    else {
        startMainLoop();
        changeLayer(0);
        changeLevel(1);
        refreshStyle();
    }
    $("load_screen").style.display = "none";
}

function autoLocalSave() {
    const localSave = btoa(JSON.stringify(game));
    localStorage.setItem("100000-Lumens",localSave);
}

function loadLocalSave() {
    $("select_file").addEventListener("change",(x) => {
        const reader = new FileReader();
        reader.readAsText(x.target.files[0],"utf-8");
        reader.onload = function(x) {
            useSave(x.target.result);
            const file = $("select_file");
            file.value = "";
        };
    },false);
    useSave(localStorage["100000-Lumens"]);
}

function exportSave() {
    const localSave = btoa(JSON.stringify(game));
    const x = document.createElement("a");
    x.href = `data:text/plain;charset=utf-8,${localSave}`;
    x.download = `100000-Lumens-Save-${showTime(new Date())}.txt`;
    document.body.appendChild(x);
    x.click();
    document.body.removeChild(x);
}

function importSave() {
    $("select_file").click();
}

function resetSave() {
    if (!game.isReset) {
        game.isReset = true;
    }
    else {
        stopMainLoop();
        localStorage.removeItem("100000-Lumens");
        load();
    }
}

function showTime(x) {
    const year = x.getFullYear();
    const month = x.getMonth() + 1;
    const day = x.getDate();
    const hour = x.getHours();
    const minute = x.getMinutes();
    const second = x.getSeconds();
    return `${pad(year,4)}${pad(month)}${pad(day)}-${pad(hour)}${pad(minute)}${pad(second)}`;
}

function pad(x,length = 2) {
    return x.toString().padStart(length,"0");
}