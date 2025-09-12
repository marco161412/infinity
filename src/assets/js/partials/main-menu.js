class NavigationMenu extends HTMLElement {
    connectedCallback() {
        salla.onReady()
            .then(() => salla.lang.onLoaded())
            .then(() => {
                this.menus = [];
                this.displayAllText = salla.lang.get('blocks.home.display_all');
                this.brands = salla.lang.get('blocks.home.brands');
                salla.lang.messages["ar.trans"].blocks.home["show_all"] = "عرض كل";
                salla.lang.messages["en.trans"].blocks.home["show_all"] = "show all";
                salla.lang.messages["ar.trans"].blocks.home["brands"] = "الماركات التجارية";
                salla.lang.messages["en.trans"].blocks.home["brands"] = "brands";
                
        
                this.displayAllTextCustom = salla.lang.get('blocks.home.show_all');
                this.displayBrands = salla.lang.get('blocks.home.brands');               
                return salla.api.component.getMenus()
                .then(({ data }) => {
                    this.menus = data;
                    this.render()
                    this.updateBigMenu();
                    this.updateSmallMenu();
                }).catch((error) => salla.logger.error('salla-menu::Error fetching menus', error));
            });
           
          
    }
   
    updateBigMenu() {
        // Make sure bigMenu exists and set its innerHTML
        const bigMenuElement = document.getElementById('bigMenu');
        if (bigMenuElement) {
            bigMenuElement.innerHTML = this.getBigMenus();
        }
    }
    updateSmallMenu() {
        // Make sure bigMenu exists and set its innerHTML
        const smallMenuElement = document.getElementById('smallMenu');
        if (smallMenuElement) {
            smallMenuElement.innerHTML = this.getSmallMenus();
        }
    }
    /** 
    * Check if the menu has children
    * @param {Object} menu
    * @returns {Boolean}
    */
    hasChildren(menu) {
        return menu?.children?.length > 0;
    }

    /**
    * Check if the menu has products
    * @param {Object} menu
    * @returns {Boolean}
    */
    hasProducts(menu) {
        return menu?.products?.length > 0;
    }

    /**
    * Get the classes for desktop menu
    * @param {Object} menu
    * @param {Boolean} isRootMenu
    * @returns {String}
    */
    getDesktopClasses(menu, isRootMenu) {
        return `!hidden lg:!block ${isRootMenu ? 'root-level lg:!inline-block' : 'relative'} ${menu.products ? ' mega-menu' : ''}
        ${this.hasChildren(menu) ? ' has-children' : ''}`
    }

    /**
    * Get the mobile menu
    * @param {Object} menu
    * @param {String} displayAllText
    * @param {String} displayBrands
    * @returns {String}
    */
    getMobileMenu(menu, displayAllText, displayBrands) {
        const menuImage = menu.image ? `<img src="${menu.image}" class="rounded-full" width="48" height="48" alt="${menu.title}" />` : '';

        return `
        <li class="lg:hidden text-sm font-bold" ${menu.attrs}>
            ${!this.hasChildren(menu) ? `
                <a href="${menu.url}" aria-label="${menu.title || 'category'}" class="text-gray-500 ${menu.image ? '!py-3' : ''}" ${menu.link_attrs}>
                    ${menuImage}
                    <span>${menu.title ? menu.title:displayBrands}</span>
                </a>` :
                `
                <span class="${menu.image ? '!py-3' : ''}">
                    ${menuImage}
                    ${menu.title}
                </span>
                <ul>
                    <li class="text-sm font-bold">
                        <a href="${menu.url}" class="text-gray-500">${displayAllText}</a>
                    </li>
                    ${menu.children.map((subMenu) => this.getMobileMenu(subMenu, displayAllText,displayBrands)).join('')}
                </ul>
            `}
        </li>`;
    }

    /**
    * Get the desktop menu
    * @param {Object} menu
    * @param {Boolean} isRootMenu
    * @returns {String}
    */
    getDesktopMenu(menu, isRootMenu) {
        return `
        <li class="${this.getDesktopClasses(menu, isRootMenu)}" ${menu.attrs}>
            <a href="${menu.url}" aria-label="${menu.title || 'category'}" ${menu.link_attrs}>
                <span>${menu.title}</span>
            </a>
            ${this.hasChildren(menu) ? `
                <div class="sub-menu ${this.hasProducts(menu) ? 'w-full left-0 flex' : 'w-56'}">
                    <ul class="${this.hasProducts(menu) ? 'w-56 shrink-0 m-8 rtl:ml-0 ltr:mr-0' : ''}">
                        ${menu.children.map((subMenu) => this.getDesktopMenu(subMenu, false)).join('\n')}
                    </ul>
                    ${this.hasProducts(menu) ? `
                    <salla-products-list
                    source="selected"
                    shadow-on-hover
                    source-value="[${menu.products}]" />` : ''}
                </div>` : ''}
        </li>`;
    }
    /**
    * Get the classes for desktop menu
    * @param {Object} menu
    * @param {Boolean} isRootMenu
    * @returns {String}
    */
    customGetDesktopClasses(menu, isRootMenu) {
        return ` ${isRootMenu ? 'root-level lg:!inline-block' : 'relative'} ${menu.products ? ' mega-menu' : ''}
        ${this.hasChildren(menu) ? ' has-children' : ''}`
    }
    /**
    * Get the mobile menu
    * @param {Object} menu
    * @param {String} displayAllTextCustom 
    * @param {String} displayBrands
    * @returns {String}
    */
    customGetMobileMenu(menu, displayAllTextCustom,displayBrands) {
        const menuImage = menu.image ? `<img src="${menu.image}" class="rounded-full" width="48" height="48" alt="${menu.title}" />` : '';

        return `
        <li class=" text-sm font-bold ${this.hasChildren(menu) ? `has-children`:`` }" ${menu.attrs}>
            ${!this.hasChildren(menu) ? `
                <a href="${menu.url}" aria-label="${menu.title}" class="text-gray-500 ${menu.image ? '!py-3 tts' : ''}" ${menu.link_attrs}>
                    ${menuImage}
                    <span>${menu.title ? menu.title:displayBrands}
            </span>
                </a>` :
                `
                <span class="${menu.image ? '!py-3 tts' : ''}">
                    ${menuImage}
                    ${menu.title}
                </span>
                <ul class="sub-ul">
                    
                    ${menu.children.map((subMenu) => this.customGetMobileMenu(subMenu, displayAllTextCustom,displayBrands)).join('')}
                    <li class="text-sm font-bold show-all">
                        <a href="${menu.url}" class="">${displayAllTextCustom} <strong> ${menu.title} </strong></a>
                    </li>
                </ul>
            `}
        </li>`;
    }

    /**
    * Get the desktop menu
    * @param {Object} menu
    * @param {Boolean} isRootMenu
    * @param {String} displayBrands
    * @returns {String}
    */
    customGetDesktopMenu(menu, isRootMenu,displayBrands) {
        console.log(menu);
        
        return `
        <li class="${this.customGetDesktopClasses(menu, isRootMenu)}" ${menu.attrs}>
            <a href="${menu.url}" aria-label="${menu.title || 'category'}" ${menu.link_attrs}>
                <span>${menu.title ? menu.title:displayBrands}</span>
            </a>
            ${this.hasChildren(menu) ? `
                <div class="sub-menu ${this.hasProducts(menu) ? 'w-full left-0 flex' : 'w-56'}">
                    <ul class="${this.hasProducts(menu) ? 'w-56 shrink-0 m-8 rtl:ml-0 ltr:mr-0' : ''}">
                        ${menu.children.map((subMenu) => this.customGetDesktopMenu(subMenu, false)).join('\n')}
                    </ul>
                    ${this.hasProducts(menu) ? `
                    <salla-products-list
                    source="selected"
                    shadow-on-hover
                    source-value="[${menu.products}]" />` : ''}
                </div>` : ''}
        </li>`;
    }
/**
 * Get main categories with name, image, and URL
 * @returns {Array}
 */
getMainCategories() {
    return this.menus.map(menu => ({
        name: menu.title || '',
        image: menu.image || '',
        url: menu.url || '#'
    }));
}
    /**
    * Get the menus
    * @returns {String}
    */
    getMenus() {
        return this.menus.map((menu) => `
            ${this.getMobileMenu(menu, this.displayAllText, this.displayBrands)}
            ${this.getDesktopMenu(menu, true)}
        `).join('\n');
    }
    getBigMenus() {
        return this.menus.map((menu) => this.customGetDesktopMenu(menu, true,this.displayBrands)).join('\n');
    }
    
    getSmallMenus() {
        return this.menus.map((menu) => this.customGetMobileMenu(menu, this.displayAllTextCustom,this.displayBrands)).join('\n');
    }

    /**
    * Render the header menu
    */
    render() {
        this.innerHTML =  `
        <nav id="mobile-menu" class="mobile-menu">
            <ul class="main-menu">${this.getMenus()}</ul>
        
            <button class="btn--close close-mobile-menu sicon-cancel lg:hidden"></button>
        </nav>
        <button class="btn--close-sm close-mobile-menu sicon-cancel hidden"></button>`;
    }
}

customElements.define('custom-main-menu', NavigationMenu);

