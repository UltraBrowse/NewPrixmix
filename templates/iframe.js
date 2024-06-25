// Code courtesy of Caen Jones

const prixmix_gateway = "YOUR-NGINX-GATEWAY-URL-HERE:8000"
function submitForm() {
    const input = document.getElementById('search').value;
    const { isValidUrl, processedUrl } = validateInput(input);

    if (!isValidUrl) return;

    fetch(`/api/provision`, {
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

    if (urlRegex.test(input)) {
        const processedUrl = input.startsWith('http://') || input.startsWith('https://') ? input : 'http://' + input;
        return { isValidUrl: true, processedUrl };
    } else {
        const processedUrl = googleSearchUrl + encodeURIComponent(input);
        return { isValidUrl: true, processedUrl };
    }
}


async function handleResponse(data) {
    // const novncPort = data.novnc_port; // not needed right now
    // document.querySelector('.loading-animation').style.display = 'none';
    await new Promise(r => setTimeout(r, 3000));
    document.getElementById('.content').innerHTML = `<iframe src="${prixmix_gateway}/port/${data.novnc_port}/vnc.html"></iframe>`;
}
