// Code courtesy of cyberslash128 and KAS
const now = new Date().getTime();
const twoHours = 2 * 60 * 60 * 1000; // 2 hours in milliseconds

for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    const session = JSON.parse(localStorage.getItem(key));

    if (session && (now - session.expires) > twoHours) {
        localStorage.removeItem(key);
    }
}
function include(file) {

    let script = document.createElement('script');
    script.src = file;
    script.type = 'text/javascript';
    script.defer = true;

    document.getElementsByTagName('head').item(0).appendChild(script);

}
function addSession(id, novnc_port) {
    const uuid = uuidv4();
    const session = {
        id: id,
        novnc_port: novnc_port,
        expires: new Date().getTime()
    };
    localStorage.setItem(`UBSESSION-uuid`, JSON.stringify(session));
}
include("https://cdnjs.cloudflare.com/ajax/libs/uuid/8.3.2/uuid.min.js")
const prixmix_gateway = "http://localhost:8000"
const prixmix_api = "http://localhost:9000"
function submitForm() {
        const input = document.getElementById('search').value;
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
        localStorage.setItem("active", "1")
    }

    function validateInput(input) {
        const urlRegex = /^(https?:\/\/)?([\w-]+\.)+[\w-]{2,}(\.[\w-]{2,})?$/i;
        const googleSearchUrl = 'https://google.com/search?q=';
        if (input.includes(';') || input.includes('&') || input.includes('\\')) {
            alert("not slick (the semicolon, &, and \\ characters are blocked for security reasons)")
            return { isValidUrl: false }

        }

        if (urlRegex.test(input)) {
            const processedUrl = input.startsWith('http://') || input.startswith('https://') ? input : 'http://' + input;
            return { isValidUrl: true, processedUrl };
        } else {
            const processedUrl = googleSearchUrl + encodeURIComponent(input);
            return { isValidUrl: true, processedUrl };
        }
    }

    async function handleResponse(data) {
    await new Promise(r => setTimeout(r, 7000));
    const contentElement = document.querySelector('.content');
    localStorage.setItem("port", data.novnc_port)
    localStorage.setItem("id", data.id)
    addSession(data.id, data.novnc_port)


    contentElement.innerHTML = `<iframe src="${prixmix_gateway}/port/${data.novnc_port}/vnc.html?path=port/${data.novnc_port}/websockify&autoconnect=true&password=pxmxpwd0" style="position: absolute; top: 80px; left: 0; width: 100%; height: calc(100vh - 80px); border: none;"></iframe>`;

    const endSessionButton = document.createElement('button');
    endSessionButton.className = 'end-session-button';
    endSessionButton.textContent = 'End Session';

    endSessionButton.onclick = async function() {
        try {
            const response = await fetch(`${prixmix_api}/api/stop`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ id: data.id })
            });

            if (!response.ok) {
                throw new Error('Failed to stop session');
            }

            localStorage.removeItem('active')
            localStorage.removeItem('id')
            localStorage.removeItem('port')
            location.href = "/";
        } catch (error) {
            console.error('Error stopping session:', error);
        }
    };


    document.body.appendChild(endSessionButton);


    setTimeout(() => {
        endSessionButton.style.right = '20px';
    }, 100);
}
async function reopenSess() {
    closeSessionPanel()
    let port = localStorage.getItem("port")
    let id = localStorage.getItem("id")
    await new Promise(r => setTimeout(r, 7000));
    const contentElement = document.querySelector('.content');
    contentElement.innerHTML = `<iframe src="${prixmix_gateway}/port/${port}/vnc.html?path=port/${port}/websockify&autoconnect=true&password=pxmxpwd0" style="position: absolute; top: 80px; left: 0; width: 100%; height: calc(100vh - 80px); border: none;"></iframe>`;

    const endSessionButton = document.createElement('button');
    endSessionButton.className = 'end-session-button';
    endSessionButton.textContent = 'End Session';

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
            localStorage.removeItem('active')
            location.href = "/";
        } catch (error) {
            console.error('Error stopping session:', error);
        }
    };
    document.body.appendChild(endSessionButton);
    setTimeout(() => {
        endSessionButton.style.right = '20px';
    }, 100);
}
document.addEventListener('DOMContentLoaded', function() {
    const panel = document.querySelector('.session-panel');
    document.addEventListener('click', function(event) {
        if (!panel.contains(event.target)) {
            panel.style.left = "-250px";
        }
    });
});

async function endSess() {
    let id = localStorage.getItem("id")
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
            localStorage.removeItem('active')
        } catch (error) {
            console.error('Error stopping session:', error);
        }
        closeSessionPanel()
    };
