document.addEventListener("DOMContentLoaded", () => {
  const folders = ['canvases/walls', 'canvases/cars'];
  const imageGrid = document.getElementById('image-grid');

  function createImageElement(src) {
    const img = document.createElement('img');
    img.src = src;
    img.alt = "Image";
    img.onerror = () => {
      console.error(`Failed to load image: ${src}`);
    };
    img.addEventListener('click', () => {
      window.location.href = `draw.html?image=${encodeURIComponent(src)}`;
    });
    return img;
  }

  function createFolderSection(folderName) {
    const section = document.createElement('div');
    section.className = 'folder-section';

    // Create and append the title container
    const titleContainer = document.createElement('div');
    titleContainer.className = 'title-container';

    const title = document.createElement('h1');
    title.textContent = folderName;
    titleContainer.appendChild(title);

    // Create and append the image container
    const imageContainer = document.createElement('div');
    imageContainer.className = 'image-container';

    // Add the title container and image container to the section
    section.appendChild(titleContainer);
    section.appendChild(imageContainer);

    return { titleContainer, imageContainer };
  }

  function getImageUrls(folder) {
    const images = {
      'canvases/walls': ['1.jpg', '2.avif', '3.jpg', '4.jpg', '5.jpg'],
      'canvases/cars': ['1.jpg', '2.jpg', '3.jpg']
    };

    return images[folder] || [];
  }

  function loadImages() {
    folders.forEach(folder => {
      const folderName = folder.split('/').pop(); // Extract folder name for title
      const imageUrls = getImageUrls(folder);

      console.log(`Processing folder: ${folderName}`);

      const { titleContainer, imageContainer } = createFolderSection(folderName);
      
      imageUrls.forEach(image => {
        const imageSrc = `${folder}/${image}`;
        console.log(`Adding image: ${imageSrc}`);
        imageContainer.appendChild(createImageElement(imageSrc));
      });

      imageGrid.appendChild(titleContainer.parentElement);
    });
  }

  loadImages();
});
