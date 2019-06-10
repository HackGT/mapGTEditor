function handleImageUpload(files) {
    const file = files[0];
    if (file.type.startsWith('image/')) {
        const prevImg = document.querySelector("img.background-map");
        if (prevImg) {
            prevImg.remove();
        }
        const img = document.createElement("img");
        const imgContainer = document.getElementById("canvas-container");
        img.classList.add("background-map");
        img.file = file;
        imgContainer.appendChild(img);

        const reader = new FileReader();
        reader.onload = (function(image) {
            return function(e) {
                image.src = e.target.result;
            }
        })(img);
        reader.readAsDataURL(file);
    } else {
        // TODO: change this to a pop up message
        console.err("File uploaded must be an image");
    }
}
