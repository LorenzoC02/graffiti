document.addEventListener("DOMContentLoaded", () => {
    const canvas = new fabric.Canvas('drawing-canvas');
    const urlParams = new URLSearchParams(window.location.search);
    const imageUrl = urlParams.get('image');
    const useUploadedImage = localStorage.getItem('useUploadedImage') === 'true';
    let isEraserMode = false;

    function resizeCanvasAndImage(img) {
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        const maxWidth = viewportWidth * 0.8;
        const maxHeight = viewportHeight * 0.8;
        const minWidth = viewportWidth * 0.7;
        const minHeight = viewportHeight * 0.7;

        let width = img.width;
        let height = img.height;

        if (width > maxWidth || height > maxHeight) {
            const scale = Math.min(maxWidth / width, maxHeight / height);
            width *= scale;
            height *= scale;
        } else if (width < minWidth || height < minHeight) {
            const scale = Math.max(minWidth / width, minHeight / height);
            width *= scale;
            height *= scale;
        }

        canvas.setWidth(width);
        canvas.setHeight(height);
        img.scaleToWidth(width);
        img.scaleToHeight(height);
        canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas), {
            scaleX: width / img.width,
            scaleY: height / img.height
        });

        // Prevent the canvas from resizing when zoomed
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;
    }

    if (useUploadedImage) {
        const uploadedImage = localStorage.getItem('uploadedImage');
        if (uploadedImage) {
            fabric.Image.fromURL(uploadedImage, (img) => {
                resizeCanvasAndImage(img);
            });
        }
        // Reset the flag
        localStorage.removeItem('useUploadedImage');
    } else if (imageUrl) {
        fabric.Image.fromURL(imageUrl, (img) => {
            resizeCanvasAndImage(img);
        }, {
            crossOrigin: 'anonymous' // Ensure CORS is handled correctly for images from different origins
        });
    }

    // Enable drawing mode
    canvas.isDrawingMode = true;

    // Set the initial brush to pencil brush
    canvas.freeDrawingBrush = new fabric.PencilBrush(canvas);

    // Brush controls
    const brushColorInput = document.getElementById('brush-color');
    const brushWidthInput = document.getElementById('brush-width');
    const brushWidthValue = document.getElementById('brush-width-value');
    const brushOpacityInput = document.getElementById('brush-opacity');
    const eraserButton = document.getElementById('eraser-button');
    const saveButton = document.getElementById('save-button');
    const pencilBrushButton = document.getElementById('pencil-brush-button');
    const sprayBrushButton = document.getElementById('spray-brush-button');

    brushColorInput.addEventListener('change', (e) => {
        const opacity = parseInt(brushOpacityInput.value, 10) / 100;
        const color = e.target.value;
        const [r, g, b] = fabric.Color.fromHex(color).getSource();
        canvas.freeDrawingBrush.color = `rgba(${r},${g},${b},${opacity})`;
    });

    brushWidthInput.addEventListener('input', (e) => {
        const width = parseInt(e.target.value, 10);
        canvas.freeDrawingBrush.width = width;
        brushWidthValue.textContent = width;
    });

    brushOpacityInput.addEventListener('input', (e) => {
        const opacity = parseInt(e.target.value, 10) / 100;
        const color = brushColorInput.value;
        const [r, g, b] = fabric.Color.fromHex(color).getSource();
        canvas.freeDrawingBrush.color = `rgba(${r},${g},${b},${opacity})`;
    });

    pencilBrushButton.addEventListener('click', () => {
        canvas.freeDrawingBrush = new fabric.PencilBrush(canvas);
        setActiveBrushButton(pencilBrushButton);
        applyCurrentBrushSettings();
    });

    sprayBrushButton.addEventListener('click', () => {
        canvas.freeDrawingBrush = new fabric.SprayBrush(canvas);
        setActiveBrushButton(sprayBrushButton);
        applyCurrentBrushSettings();
    });

    function setActiveBrushButton(activeButton) {
        [pencilBrushButton, sprayBrushButton].forEach(button => {
            button.classList.remove('active');
        });
        activeButton.classList.add('active');
    }

    function applyCurrentBrushSettings() {
        const color = brushColorInput.value;
        const opacity = parseInt(brushOpacityInput.value, 10) / 100;
        const width = parseInt(brushWidthInput.value, 10);
        const [r, g, b] = fabric.Color.fromHex(color).getSource();
        canvas.freeDrawingBrush.color = `rgba(${r},${g},${b},${opacity})`;
        canvas.freeDrawingBrush.width = width;
    }

    eraserButton.addEventListener('click', () => {
        isEraserMode = !isEraserMode;
        if (isEraserMode) {
            eraserButton.classList.add('active');
            canvas.isDrawingMode = false;
            canvas.on('mouse:down', eraseObject);
        } else {
            eraserButton.classList.remove('active');
            canvas.isDrawingMode = true;
            canvas.off('mouse:down', eraseObject);
        }
    });

    function eraseObject(opt) {
        const pointer = canvas.getPointer(opt.e);
        const objects = canvas.getObjects();
        for (let i = objects.length - 1; i >= 0; i--) {
            if (objects[i] !== canvas.backgroundImage) {
                if (objects[i].containsPoint(pointer)) {
                    canvas.remove(objects[i]);
                    break;
                }
            }
        }
    }

    saveButton.addEventListener('click', () => {
        const dataURL = canvas.toDataURL({
            format: 'png',
            quality: 1.0
        });
        const link = document.createElement('a');
        link.href = dataURL;
        link.download = 'drawing.png';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    });

    // Set initial brush settings
    canvas.freeDrawingBrush.width = parseInt(brushWidthInput.value, 10);
    const initialOpacity = parseInt(brushOpacityInput.value, 10) / 100;
    const initialColor = brushColorInput.value;
    const [r, g, b] = fabric.Color.fromHex(initialColor).getSource();
    canvas.freeDrawingBrush.color = `rgba(${r},${g},${b},${initialOpacity})`;
});
