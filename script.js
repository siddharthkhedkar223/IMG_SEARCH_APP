document.addEventListener("DOMContentLoaded", function () {
    const accessKey = "WhkldmwQJyxPgeRXNOt10O3q5JpGrcz0SbcUeAdcEm8";
    const audioaccesskey="f90f7586f3bec58d15a9c2b8adb24512";
    const formE1 = document.querySelector("form");
    const inputE1 = document.getElementById("search-input"); // Fixed typo "serach-input" to "search-input"
    const searchResults = document.querySelector(".search-results");
    const showMore = document.getElementById("show-more-button");
    const audioButton=document.querySelector(".audio-button");
    defaultVoiceId="21m00Tcm4TlvDq8ikWAM";

    let inputData = "";
    let page = 1;

    async function searchImages() {
        inputData = inputE1.value;
        const url = `https://api.unsplash.com/search/photos?page=${page}&query=${inputData}&client_id=${accessKey}`;
        const response = await fetch(url);
        const data = await response.json();

        const results = data.results;

        if (page === 1) {
            searchResults.innerHTML = "";
        }
        results.forEach(result => { // Using forEach instead of map
            const imageWrapper = document.createElement('div');
            imageWrapper.classList.add("search-result");
            const image = document.createElement('img');
            image.src = result.urls.small;
            image.alt = result.alt_description;
            const imageLink = document.createElement('a');
            imageLink.href = result.links.html;
            imageLink.target = "_blank";
            imageLink.textContent = result.alt_description;
            const audioButton = document.createElement('div');
            audioButton.classList.add("audio-button");
            audioButton.style.backgroundImage = `url(https://img.icons8.com/?size=512&id=12798&format=png)`;
            audioButton.style.backgroundSize = "cover";
            audioButton.addEventListener("click", () => {
                readDescription(result.alt_description);
            });


            imageWrapper.appendChild(image);
            imageWrapper.appendChild(imageLink);
            imageWrapper.appendChild(audioButton);
            searchResults.appendChild(imageWrapper);
        }); 
        page++;
        if (page > 1) {
            showMore.style.display = "block";
        }
    }

   async function readDescription(description) {

    const url = `https://api.elevenlabs.io/v1/text-to-speech/${defaultVoiceId}`;
    const headers = {
        "xi-api-key": audioaccesskey,
        "Content-Type": "application/json"
    };
    const requestBody = {
        text: description
    };

    const response = await fetch(url, {
        method: "POST",
        headers: headers,
        body: JSON.stringify(requestBody)
    });

    if (response.ok) {
        const audioData = await response.blob();
        const audioUrl = URL.createObjectURL(audioData);
        const audio = new Audio(audioUrl);
        audio.play();
    }
        
       
    }


   

    formE1.addEventListener("submit", (event) => {
        event.preventDefault();
        page = 1;
        searchImages();
    });

    showMore.addEventListener("click", () => {
        searchImages();
    });
});
