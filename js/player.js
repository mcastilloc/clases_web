const params = new URLSearchParams(window.location.search);

const m = params.get("m");
const c = params.get("c");
const p = params.get("p");

const pantalla = document.getElementById("pantalla");
const webcam = document.getElementById("webcam");

const seek = document.getElementById("seek");

let clase = c;

let base =
    "videos/modulo" + m + "/" + clase;

let key =
    "m" + m + "c" + c + "p" + p;

if (p == 1) {

    webcam.src = base + "a.mkv";
    pantalla.src = base + "b.mkv";

}

if (p == 2) {

    webcam.src = base + "c.mkv";
    pantalla.src = base + "d.mkv";

}

pantalla.onloadedmetadata = () => {

    let t = localStorage.getItem(key);

    if (t) {

        pantalla.currentTime = t;
        webcam.currentTime = t;

    }

};

function play() {

    webcam.currentTime =
        pantalla.currentTime;

    pantalla.play();
    webcam.play();

}

function pause() {

    pantalla.pause();
    webcam.pause();

}

pantalla.ontimeupdate = () => {

    let diff =
        Math.abs(
            pantalla.currentTime -
            webcam.currentTime
        );

    // solo corregir si se desincroniza mucho
    if (diff > 0.3) {

        webcam.currentTime =
            pantalla.currentTime;

    }

    seek.value =
        (pantalla.currentTime /
            pantalla.duration) * 100;

    localStorage.setItem(
        key,
        pantalla.currentTime
    );

};


function seekVideo() {

    let t =
        pantalla.duration *
        (seek.value / 100);

    pantalla.currentTime = t;
    webcam.currentTime = t;

}

const titulo = document.getElementById("titulo");

if (titulo) {

    let claseTexto = c;

    // quitar "Clase" si ya viene en el nombre
    claseTexto = claseTexto.replace("Clase", "");

    titulo.innerText =
        "Modulo " + m +
        " — Clase " + claseTexto +
        " — Parte " + p;

}

const sidebar = document.getElementById("sidebar");

if (sidebar && data[m]) {

    data[m].clases.forEach(cl => {

        let div = document.createElement("div");

        div.className = "sidebar-item";

        if (String(cl) === String(c)) {

            div.classList.add("active");

        }

        if (
            localStorage.getItem(
                "seen_" + m + "_" + cl
            )
        ) {

            div.classList.add("seen");

        }

        div.innerText = "Clase " + cl;

        div.onclick = () => {

            window.location =
                "player.html?m=" + m +
                "&c=" + cl +
                "&p=1";

        };

        sidebar.appendChild(div);

    });

}



pantalla.onended = () => {

    if (p == 1) {

        window.location =
            "player.html?m=" + m +
            "&c=" + c +
            "&p=2";

        return;

    }

    if (p == 2) {

        let clases = data[m].clases;

        let i = clases.indexOf(
            parseInt(c)
        );

        if (i >= 0 &&
            i < clases.length - 1) {

            let next = clases[i + 1];

            window.location =
                "player.html?m=" + m +
                "&c=" + next +
                "&p=1";

        }

    }
};

function next() {

    let clases = data[m].clases;

    let i = clases.indexOf(parseInt(c));

    if (p == 1) {

        window.location =
            "player.html?m=" + m +
            "&c=" + c +
            "&p=2";

        return;

    }

    if (i < clases.length - 1) {

        let next = clases[i + 1];

        window.location =
            "player.html?m=" + m +
            "&c=" + next +
            "&p=1";

    }

}

function prev() {

    let clases = data[m].clases;

    let i = clases.indexOf(parseInt(c));

    if (p == 2) {

        window.location =
            "player.html?m=" + m +
            "&c=" + c +
            "&p=1";

        return;

    }

    if (i > 0) {

        let prev = clases[i - 1];

        window.location =
            "player.html?m=" + m +
            "&c=" + prev +
            "&p=2";

    }

}


document.addEventListener("keydown", (e) => {

    if (!pantalla) return;

    let step = 10;

    if (e.key === "ArrowRight") {

        pantalla.currentTime =
            Math.min(
                pantalla.duration,
                pantalla.currentTime + step
            );

        webcam.currentTime =
            pantalla.currentTime;

    }

    if (e.key === "ArrowLeft") {

        pantalla.currentTime =
            Math.max(
                0,
                pantalla.currentTime - step
            );

        webcam.currentTime =
            pantalla.currentTime;

    }

    if (e.key === " ") {

        e.preventDefault();

        if (pantalla.paused) {

            play();

        } else {

            pause();

        }

    }

});

function goHome() {

window.location =
"index.html";

}
