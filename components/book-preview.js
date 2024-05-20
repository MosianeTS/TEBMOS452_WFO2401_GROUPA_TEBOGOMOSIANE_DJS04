class BookPreview extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = `
            <style>
                .preview {
                    display: flex;
                    align-items: center;
                    padding: 10px;
                    border: 1px solid #ccc;
                    margin: 10px;
                    cursor: pointer;
                }
                .preview__image {
                    width: 50px;
                    height: 75px;
                    margin-right: 10px;
                }
                .preview__info {
                    display: flex;
                    flex-direction: column;
                }
                .preview__title {
                    font-size: 16px;
                    margin: 0;
                }
                .preview__author {
                    font-size: 14px;
                    color: #555;
                }
            </style>
            <div class="preview">
                <img class="preview__image" />
                <div class="preview__info">
                    <h3 class="preview__title"></h3>
                    <div class="preview__author"></div>
                </div>
            </div>
        `;
    }

    connectedCallback() {
        this.shadowRoot.querySelector('.preview__image').src = this.getAttribute('image');
        this.shadowRoot.querySelector('.preview__title').innerText = this.getAttribute('title');
        this.shadowRoot.querySelector('.preview__author').innerText = this.getAttribute('author');
    }
}

customElements.define('book-preview', BookPreview);
