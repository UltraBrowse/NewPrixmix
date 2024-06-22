// Code courtesy of Caen Jones

function submitForm() {
    const input = document.getElementById('urlInput').value;
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


function handleResponse(data) {
    // const novncPort = data.novnc_port; // not needed right now
    // document.querySelector('.loading-animation').style.display = 'none';
    document.getElementById('input-div').innerHTML = `<iframe src="${data.zrok_url}/vnc_lite.html?password=pxmxpwd0"></iframe>`;
}
