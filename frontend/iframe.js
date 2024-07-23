const prixmix_gateway = "http://localhost:8000";
const prixmix_api = "http://localhost:9000";


// defs
function validateInput(input) {
    const urlRegex = /^(https?:\/\/)?([\w-]+\.)+[\w-]{2,}(\.[\w-]{2,})?$/i;
    const googleSearchUrl = 'https://google.com/search?q=';
    if (input.includes(';') || input.includes('&') || input.includes('\\')) {
        alert("not slick (the semicolon, &, and \\ characters are blocked for security reasons)");
        return { isValidUrl: false };
    }

    if (urlRegex.test(input)) {
        const processedUrl = input.startsWith('http://') || input.startsWith('https://') ? input : 'http://' + input;
        return { isValidUrl: true, processedUrl };
    } else {
        const processedUrl = googleSearchUrl + encodeURIComponent(input);
        return { isValidUrl: true, processedUrl };
    }
}

async function handleResponse(data) {
    const endSessionButton = document.getElementById('endSessionButton');
    const contentElement = document.querySelector('.content');
    if (data.status === "fail") {
        document.getElementById('error').innerText = data.error;
        return false;
    }
    await new Promise(r => setTimeout(r, 7000));
    localStorage.setItem("port", data.novnc_port);
    localStorage.setItem("id", data.id);
    localStorage.setItem("active", "1");

    contentElement.innerHTML = `<iframe src="${prixmix_gateway}/port/${data.novnc_port}/vnc.html?path=port/${data.novnc_port}/websockify&autoconnect=true&password=pxmxpwd0" style="position: absolute; top: 60px; left: 0; width: 100%; height: calc(100vh - 60px); border: none;"></iframe>`;

    endSessionButton.onclick = async function() {
        try {
            const response = await fetch(`${prixmix_api}/api/stop`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ id: localStorage.getItem("id") })
            });

            if (!response.ok) {
                throw new Error('Failed to stop session');
            }
            localStorage.removeItem('active');
            localStorage.removeItem('port');
            localStorage.removeItem('id');
            location.href = "/";
        } catch (error) {
            console.error('Error stopping session:', error);
        }
    };
    setTimeout(() => {
        endSessionButton.classList.add('show');
        setTimeout(() => {
            endSessionButton.classList.add('fade-in');
        }, 10);
    }, 100);
}

async function reopenSess() {
    const endSessionButton = document.getElementById('endSessionButton');
    const contentElement = document.querySelector('.content');
    closeSessionPanel();
    const port = localStorage.getItem("port");
    const id = localStorage.getItem("id");
    await new Promise(r => setTimeout(r, 7000));

    contentElement.innerHTML = `<iframe src="${prixmix_gateway}/port/${port}/vnc.html?path=port/${port}/websockify&autoconnect=true&password=pxmxpwd0" style="position: absolute; top: 60px; left: 0; width: 100%; height: calc(100vh - 60px); border: none;"></iframe>`;

    endSessionButton.onclick = async function() {
        try {
            const response = await fetch(`${prixmix_api}/api/stop`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ id: id })
            });

            if (!response.ok) {
                throw new Error('Failed to stop session');
            }
            localStorage.removeItem('active');
            localStorage.removeItem('port');
            localStorage.removeItem('id');
            location.href = "/";
        } catch (error) {
            console.error('Error stopping session:', error);
        }
    };
    setTimeout(() => {
        endSessionButton.classList.add('show');
        setTimeout(() => {
            endSessionButton.classList.add('fade-in');
        }, 10);
    }, 100);
}

function setTheme(theme) {
    let themeName = theme;
    document.querySelector("html").setAttribute("data-theme",themeName);
    localStorage.setItem("theme",themeName);
}

function bmBuilderUpd() {
    let title = document.querySelector(".bmBuilderTitle").value;
    let url = document.querySelector(".bmBuilderUrl").value;
    let t = document.querySelector(".bmBuilderTemplate");
    t.querySelector("span").innerText = title;
try {new URL(url)} catch {return}
    t.querySelector("img").src = `https://t1.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://${new URL(url).host}&size=64`
}
function createBox(name, link, imageUrl) {
    const box = document.createElement('div');
    box.style.border = '1.75px solid #000';
    box.style.padding = '10px';
    box.classList.add("card")
    box.style.margin = '10px';
    box.style.textAlign = 'center';
    box.style.cursor = 'pointer';
    box.style.width = '200px';
    box.style.color = "white"
    box.style.marginBottom = "10px"
    const nameElement = document.createElement('h2');
    nameElement.innerText = name;
    const imageElement = document.createElement('img');
    imageElement.src = imageUrl;
    imageElement.alt = name;
    imageElement.style.width = '100%';
    imageElement.style.height = 'auto';
    box.appendChild(nameElement);
    box.appendChild(imageElement);
    box.addEventListener('click', () => {
      window.location.href = link;
    });
    var games = document.getElementsByClassName("gamecontainer")
    games[0].appendChild(box);
}
function submitForm() {
    const searchInput = document.getElementById('search');
    const input = searchInput.value;
    const { isValidUrl, processedUrl } = validateInput(input);

    if (!isValidUrl) return;

    fetch(`${prixmix_api}/api/provision`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ url: processedUrl })
    })
    .then(response => response.json())
    .then(data => handleResponse(data))
    .catch(error => console.error('Error:', error));
}
function updBookmarks() {
    let template = document.querySelector("a.bookmark-btn.template").cloneNode(true);
    let bm = document.querySelectorAll("a.bookmark-btn");
    for (let btn of bm) {
    btn.remove();
    }
    let bookmarks = JSON.parse(localStorage["bookmarks"] || "[]");
    for (let i = 0; i < bookmarks.length; i++) {
    let t = template.cloneNode(true);
    let e = bookmarks[i].split(",")
    t.classList.remove("template");
    t.href = atob(e[0])
    t.querySelector("img").src = atob(e[1])
    t.querySelector("span").innerText = e[2]
    document.querySelector(".bmSection").appendChild(t)
    t.addEventListener("click",async (e) => {
        e.preventDefault();
        handleResponse()
    })
    t.addEventListener("contextmenu", (e) => {
        e.preventDefault();
        let c = confirm("Delete this bookmark?");
        if (!c) return
        let bookmarks = JSON.parse(localStorage["bookmarks"] || "[]");
        for (let x = 0; x < bookmarks.length; x++) {
        if (bookmarks[x].includes(t.querySelector("span").innerText)) {
            bookmarks.splice(x,1);
            t.remove();break;
        }
        }
        localStorage["bookmarks"] = JSON.stringify(bookmarks)
    });
    }
    document.querySelector(".bmSection").appendChild(template)
}

// everything other than defs for some reason
document.addEventListener('DOMContentLoaded', (e) => {

    if (localStorage.getItem("theme")) {
        setTheme(localStorage.getItem("theme"));
    }
    document.querySelector(".inlineBookmarkBtn").addEventListener("click",()=>{
        bookmarkMaker.showModal();
        print("clicked")
        bmBuilderUpd() 
    })

    document.querySelector(".bmMakerAdd").addEventListener("click",(e)=>{
    e.preventDefault(); 
        let url = document.querySelector(".bmBuilderUrl").value
        try {new URL(url)} catch {
        alert("Invalid URL!");return;
        }
        let title = document.querySelector(".bmBuilderTitle").value
        if (typeof title != "string") {
        alert("Invalid bookmark title!");return;
        }
        let u = new URL(url);
        let img = btoa(`https://t1.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://${u.host}&size=64`)
        let bookmarks = localStorage["bookmarks"] || "[]";
        bookmarks = JSON.parse(bookmarks);
        bookmarks.push(`${btoa(url)},${img},${title}`);
        localStorage["bookmarks"] = JSON.stringify(bookmarks)
        updBookmarks()
        bookmarkMaker.close(); 
    })

    document.querySelector("button.bookmark-btn.add").addEventListener("click",()=>{
        bookmarkMaker.showModal();
    })
    updBookmarks()
});