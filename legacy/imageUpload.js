function handleImageUpload(files) {
    const file = files[0];
    if (file.type.startsWith('image/')) {
        const prevImg = document.querySelector("img.background-map");
        if (prevImg) {
            prevImg.remove();
        }

        const img = document.createElementNS(svgns, 'image');
        img.setAttributeNS(null, "width", 1000);
        img.setAttributeNS(null, "height", 500);
        img.classList.add("background-map");
        const imgContainer = document.getElementById("canvas");
        imgContainer.appendChild(img);

        const reader = new FileReader();
        reader.onload = (function(image) {
            return function(e) {
                img.setAttributeNS(null, "href", e.target.result);
            }
        })(img);
        reader.readAsDataURL(file);
    } else {
        // TODO: change this to a pop up message
        console.err("File uploaded must be an image");
    }
}
