// Code courtesy of cyberslash128 and KAS
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


    contentElement.innerHTML = `<iframe src="${prixmix_gateway}/port/${data.novnc_port}/vnc.html?path=port/${data.novnc_port}/websockify&autoconnect=true&password=pxmxpwd0"></iframe>`;

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
    await new Promise(r => setTimeout(r, 3000));
    const contentElement = document.querySelector('.content');
    contentElement.innerHTML = `<iframe src="${prixmix_gateway}/port/${port}/vnc.html?path=port/${port}/websockify&autoconnect=true&password=pxmxpwd0"></iframe>`;

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

