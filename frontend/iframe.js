const prixmix_gateway = "http://localhost:8000";
const prixmix_api = "http://localhost:9000";
const searchInput = document.getElementById('search');
const contentElement = document.querySelector('.content');
const endSessionButton = document.getElementById('endSessionButton');

function submitForm() {
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

