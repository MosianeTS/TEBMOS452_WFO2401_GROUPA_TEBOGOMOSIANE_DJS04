class BookDetails extends HTMLElement {
    constructor() {
      super();
      
    }
  
   
  
    connectedCallback() {
      this.render();
    }
  
    render() {
     
    }
  }
  
  customElements.define('book-details', BookDetails);
  
 
  const bookDetailsStyles = `
    /* CSS styles for book-details component */
    .book-details {
      display: flex;
      align-items: center;
      padding: 1rem;
      border: 1px solid rgba(var(--color-dark), 0.15);
      border-radius: 8px;
      background-color: rgba(var(--color-light), 1);
    }
  
    .book-details__image {
      width: 80px;
      height: 120px;
      object-fit: cover;
      border-radius: 4px;
      margin-right: 1rem;
      border: 1px solid rgba(var(--color-dark), 0.15);
      box-shadow: 0px 2px 1px -1px rgba(0, 0, 0, 0.2),
        0px 1px 1px 0px rgba(0, 0, 0, 0.1), 0px 1px 3px 0px rgba(0, 0, 0, 0.1);
    }
  
    .book-details__info {
      flex: 1;
    }
  
    .book-details__title {
      margin-bottom: 0.5rem;
      font-weight: bold;
      color: rgba(var(--color-dark), 0.8);
      font-size: 1.1rem;
      line-height: 1.2;
    }
  
    .book-details__author {
      margin-bottom: 0.5rem;
      color: rgba(var(--color-dark), 0.4);
    }
  
    .book-details__description {
      color: rgba(var(--color-dark), 0.6);
      font-size: 0.9rem;
      line-height: 1.4;
    }
  `;
  
 
  const styleElement = document.createElement('style');
  styleElement.textContent = bookDetailsStyles;
  document.head.appendChild(styleElement);
  