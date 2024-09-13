/*
 *
 * Quick View Functionality (Native JS)
 * by Mohamed Salah (salahineo.personal@gmail.com)
 *
 * Plugins List (Resources):
 *	=> LightGallery JS: https://cdnjs.cloudflare.com/ajax/libs/lightgallery/2.7.2/lightgallery.min.js
 *	=> LightGallery JS Thumbnail Plugin: https://cdnjs.cloudflare.com/ajax/libs/lightgallery/2.7.2/plugins/thumbnail/lg-thumbnail.min.js
 *
 *
 */

// Create Quick View
function createQuickView(product) {
  // Create quick view button with the needed properties
  const quickViewBtn = document.createElement('button');
  quickViewBtn.innerText = 'Quick View';
  quickViewBtn.classList.add('custom-btn__quickView');
  // Append button to each respective product
  product.appendChild(quickViewBtn);

  // Create loader Spinner
  const customSpinner = document.createElement('span');
  customSpinner.classList.add('custom__spinner');
  // Append Spinner to each respective product
  product.appendChild(customSpinner);

  // Register Quick View Button Event
  quickViewBtn.addEventListener('click', (e) => {
    // Get Product Link
    let productLink = e.target.previousElementSibling.getAttribute('href');

    // Check productLink
    if (productLink) {
      // Start Loader
      e.target.nextElementSibling.classList.add('show');
      e.target.classList.add('hide');

      // Fetch Product Images
      fetch(productLink)
        .then((response) => response.text())
        .then((data) => {
          // Initial state for images
          let imagesLinks = [];

          // Initialize the DOM parser
          const parser = new DOMParser();

          // Parse the text
          const doc = parser.parseFromString(data, 'text/html');

          // Get Images
          let productImages = doc.querySelectorAll(
            '.product-details form.layout-module ul.images li'
          );

          // Loop through image links
          for (let image of productImages) {
            // Push links to state
            imagesLinks.push(image.getAttribute('data-gallery'));
          }

          // Return links
          return imagesLinks;
        })
        .then((imagesLinks) => {
          // Set Images for gallery option
          let lightGalleryObject = [];

          // Create gallery options
          for (let image of imagesLinks) {
            lightGalleryObject.push({
              src: image,
              thumb: image,
            });
          }

          // Trigger the gallery
          const dynamicGallery = lightGallery(e.target, {
            dynamic: true,
            plugins: [lgThumbnail],
            dynamicEl: lightGalleryObject,
          });

          dynamicGallery.openGallery(0);

          // End Loader
          e.target.nextElementSibling.classList.remove('show');
          e.target.classList.remove('hide');
        })
        .catch((e) => console.log(e));
    }
  });
}

// Register Events
function quickView() {
  // Get product items
  let products = document.querySelectorAll('.products .product-card');

  // Check if products are exist
  if (products.length > 0) {
    // Loop through products
    for (let product of products) {
      // Add event listener on Mouse Over
      product.addEventListener('mouseover', createQuickView(product));
    }
  }
}

// Execute the function
quickView();
