document.addEventListener("DOMContentLoaded", () => {
    const importImageButton = document.getElementById('import-image-button');
    const imageInput = document.getElementById('image-input');

    importImageButton.addEventListener('click', () => {
        imageInput.click();
    });

    imageInput.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const imageUrl = e.target.result;
                localStorage.setItem('imageToDraw', imageUrl);
                window.location.href = 'draw.html';
            };
            reader.readAsDataURL(file);
        }
    });
});
