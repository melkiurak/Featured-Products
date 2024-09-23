//Receipt of goods
const query = `
       {
         products(first: 10) {
           edges {
             node {
               title
               description
               variants(first: 1) {
                 edges {
                   node {
                     price {
                       amount
                       currencyCode
                     }
                     compareAtPrice {
                       amount
                       currencyCode
                     }
                   }
                 }
               }
               images(first: 2) {
                 edges {
                   node {
                     url
                     altText
                   }
                 }
               }
             }
           }
         }
       }
    `;

//Fetch 
const fetchProducts = async () => {
    try {
        const response = await fetch('https://tsodykteststore.myshopify.com/api/2023-01/graphql.json', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Shopify-Storefront-Access-Token': '7e174585a317d187255660745da44cc7',
            },
            body: JSON.stringify({ query })
        });

        if (!response.ok) throw new Error('Мережева відповідь не була в порядку');
        
        const data = await response.json();
        displayProducts(data.data.products.edges);
    } catch (error) {
        console.error('Помилка при отриманні даних:', error);
    }
};


//Product display
const displayProducts = (products) => {
    const container = document.getElementById('products'); 
    container.innerHTML = ''; 

    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product__card';

        const image1 = document.createElement('img');
        image1.src = product.node.images.edges[0].node.url;
        image1.alt = product.node.images.edges[0].node.altText || 'Фото товару';

        const image2 = document.createElement('img');
        image2.src = product.node.images.edges[1].node.url;
        image2.alt = product.node.images.edges[1].node.altText || 'Фото при hover';
        image2.style.display = 'none'; 

        productCard.addEventListener('mouseenter', () => {
            image1.style.display = 'none';
            image2.style.display = 'block';
        });

        productCard.addEventListener('mouseleave', () => {
            image1.style.display = 'block';
            image2.style.display = 'none';
        });

        const infoProductContainer = document.createElement('div');
        infoProductContainer.className = 'product__info';

        const titleAndDescriptionProduct = document.createElement('div');
        titleAndDescriptionProduct.className = 'title-description';

        const title = document.createElement('h3');
        title.textContent = product.node.title;

        const description = document.createElement('p');
        description.textContent = product.node.description;

        titleAndDescriptionProduct.appendChild(title);
        titleAndDescriptionProduct.appendChild(description);

        const priceProducts = document.createElement('div');
        priceProducts.className = 'product__price';

        const price = document.createElement('p');
        price.textContent = `${product.node.variants.edges[0].node.price.amount} ${product.node.variants.edges[0].node.price.currencyCode}`;

        infoProductContainer.appendChild(titleAndDescriptionProduct);
        infoProductContainer.appendChild(priceProducts);

        priceProducts .appendChild(price);

        productCard.appendChild(image1);
        productCard.appendChild(image2);
        productCard.appendChild(infoProductContainer);

        container.appendChild(productCard);
    });
};
//Answer button
document.querySelectorAll('.support__button').forEach(button => {
    const infoButton = button.querySelector('button');
    const answer = button.querySelector('.support__answer');

    infoButton.addEventListener('click', () => {
        button.classList.toggle('active');
        if (answer.classList.contains('open')) {
            answer.classList.remove('open');
            answer.style.maxHeight = '0';
            infoButton.querySelector('span').textContent = '+'; 
        } else {
            answer.classList.add('open');
            answer.style.maxHeight = '100px'; 
            infoButton.querySelector('span').textContent = '-'; 
        }
    });
});

fetchProducts();