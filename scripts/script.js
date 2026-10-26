'use strict';


const savedResources = localStorage.getItem('resources');
const parsedSavedResources = JSON.parse(savedResources);


let resources = parsedSavedResources ?? [];

let resourceIdToEdit = null;
const submitButton = document.getElementById('submit-button');

// Using hardcoded topics options for now
// TODO: Add feature to customize topics
const topics = ['Literature', 'Frontend', 'AI', 'Productivity'];

const topicsDropdownElement = document.getElementById('topics');
topics.forEach((topic) => {

    const optionElement = document.createElement('option');
    optionElement.value = topic;
    optionElement.textContent = topic;
    topicsDropdownElement.appendChild(optionElement);
})

// Using hardcoded types options for now
// TODO: Add feature to customize types
const types = ['Article', 'Video', 'Podcast', 'Playlist', 'Website', 'Book', 'Tutorial'];

const resourceTypeDropdownElement = document.getElementById('resource-type');
types.forEach((type) => {

    const optionElement = document.createElement('option');
    optionElement.value = type;
    optionElement.textContent = type;
    resourceTypeDropdownElement.appendChild(optionElement);
})

let currentView = 'library';

const sideNavElement = document.getElementById('resource-sidenav');

function updateNavState() {
    sideNavElement.querySelectorAll('button').forEach((button) => {

        const isActive = button.dataset.view === currentView;
        button.classList.toggle('active', isActive);

    })
};

sideNavElement.addEventListener('click', (event) => {
    const clickedButton = event.target.closest('button');
    if (!clickedButton) return;

    currentView = clickedButton.dataset.view;
    updateNavState();
    renderResources();
    updateViewHeader();
});

updateNavState();

function getVisibleResources() {
    switch (currentView) {
        case 'favourites':
            return resources.filter((resource) => resource.favourite && !resource.archived);
        case 'archive':
            return resources.filter((resource) => resource.archived);
        case 'library':
        default:
            return resources.filter((resource) => !resource.archived);
    }
}

function saveResources() {
    let resourcesString = JSON.stringify(resources);
    localStorage.setItem('resources', resourcesString);
};

function deleteResource(event) {
    const resourceIdToDelete = event.currentTarget.dataset.id;
    if (resourceIdToDelete === resourceIdToEdit) exitEditMode();
    resources = resources.filter((resource) => resource.id !== resourceIdToDelete);

    saveResources();
    renderResources();
}

const addResourceForm = document.getElementById('add-resource');

function addResource(resource) {
    resources.push({ ...resource, id: crypto.randomUUID(), favourite: false, archived: false });
}

function editResource(event) {
    resourceIdToEdit = event.currentTarget.dataset.id;
    const resourceToEdit = resources.find(resource => resource.id === resourceIdToEdit);
    submitButton.textContent = 'Save changes';

    Object.entries(resourceToEdit).forEach(([key, value]) => {
        if (addResourceForm.elements[key]) {
            addResourceForm.elements[key].value = value;
        };
    })

    resourceFormDialog.showModal();
}

function exitEditMode() {
    resourceIdToEdit = null;
    addResourceForm.reset();
    submitButton.textContent = 'Add resource';
}

const resourceFormDialog = document.getElementById('resource-form-dialog');
const addResourceButton = document.getElementById('add-resource-button')
const cancelFormButton = document.getElementById('cancel-button');
const closeFormButton = document.getElementById('close-dialog-button');


addResourceButton.addEventListener('click', () => resourceFormDialog.showModal());
cancelFormButton.addEventListener('click', () => resourceFormDialog.close());
closeFormButton.addEventListener('click', () => resourceFormDialog.close());

addResourceForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const formData = new FormData(addResourceForm);

    const resource = Object.fromEntries(formData);

    if (resourceIdToEdit) {
        const resourceToEdit = resources.find((res) => res.id === resourceIdToEdit);
        Object.assign(resourceToEdit, resource);
    }
    else {
        addResource(resource);
        addResourceForm.reset();
    };
    saveResources();
    renderResources();
    resourceFormDialog.close();
})

resourceFormDialog.addEventListener('close', exitEditMode);

const HEART_ICON = `<svg class="favourite-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><path d="M442.9 144C415.6 144 389.9 157.1 373.9 179.2L339.5 226.8C335 233 327.8 236.7 320.1 236.7C312.4 236.7 305.2 233 300.7 226.8L266.3 179.2C250.3 157.1 224.6 144 197.3 144C150.3 144 112.2 182.1 112.2 229.1C112.2 279 144.2 327.5 180.3 371.4C221.4 421.4 271.7 465.4 306.2 491.7C309.4 494.1 314.1 495.9 320.2 495.9C326.3 495.9 331 494.1 334.2 491.7C368.7 465.4 419 421.3 460.1 371.4C496.3 327.5 528.2 279 528.2 229.1C528.2 182.1 490.1 144 443.1 144zM335 151.1C360 116.5 400.2 96 442.9 96C516.4 96 576 155.6 576 229.1C576 297.7 533.1 358 496.9 401.9C452.8 455.5 399.6 502 363.1 529.8C350.8 539.2 335.6 543.9 320 543.9C304.4 543.9 289.2 539.2 276.9 529.8C240.4 502 187.2 455.5 143.1 402C106.9 358.1 64 297.7 64 229.1C64 155.6 123.6 96 197.1 96C239.8 96 280 116.5 305 151.1L320 171.8L335 151.1z"/></svg>`;
const HEART_FILLED_ICON = '<svg class="favourite-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><!--!Font Awesome Free v7.3.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--><path d="M305 151.1L320 171.8L335 151.1C360 116.5 400.2 96 442.9 96C516.4 96 576 155.6 576 229.1L576 231.7C576 343.9 436.1 474.2 363.1 529.9C350.7 539.3 335.5 544 320 544C304.5 544 289.2 539.4 276.9 529.9C203.9 474.2 64 343.9 64 231.7L64 229.1C64 155.6 123.6 96 197.1 96C239.8 96 280 116.5 305 151.1z"/></svg>'
const LINK_ICON = `<svg class="link-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><path d="M384 64C366.3 64 352 78.3 352 96C352 113.7 366.3 128 384 128L466.7 128L265.3 329.4C252.8 341.9 252.8 362.2 265.3 374.7C277.8 387.2 298.1 387.2 310.6 374.7L512 173.3L512 256C512 273.7 526.3 288 544 288C561.7 288 576 273.7 576 256L576 96C576 78.3 561.7 64 544 64L384 64zM144 160C99.8 160 64 195.8 64 240L64 496C64 540.2 99.8 576 144 576L400 576C444.2 576 480 540.2 480 496L480 416C480 398.3 465.7 384 448 384C430.3 384 416 398.3 416 416L416 496C416 504.8 408.8 512 400 512L144 512C135.2 512 128 504.8 128 496L128 240C128 231.2 135.2 224 144 224L224 224C241.7 224 256 209.7 256 192C256 174.3 241.7 160 224 160L144 160z"/></svg>`;

const MENU_ICON = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><path d="M320 208C289.1 208 264 182.9 264 152C264 121.1 289.1 96 320 96C350.9 96 376 121.1 376 152C376 182.9 350.9 208 320 208zM320 432C350.9 432 376 457.1 376 488C376 518.9 350.9 544 320 544C289.1 544 264 518.9 264 488C264 457.1 289.1 432 320 432zM376 320C376 350.9 350.9 376 320 376C289.1 376 264 350.9 264 320C264 289.1 289.1 264 320 264C350.9 264 376 289.1 376 320z"/></svg>`;

const EDIT_ICON = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><path d="M505 122.9L517.1 135C526.5 144.4 526.5 159.6 517.1 168.9L488 198.1L441.9 152L471 122.9C480.4 113.5 495.6 113.5 504.9 122.9zM273.8 320.2L408 185.9L454.1 232L319.8 366.2C316.9 369.1 313.3 371.2 309.4 372.3L250.9 389L267.6 330.5C268.7 326.6 270.8 323 273.7 320.1zM437.1 89L239.8 286.2C231.1 294.9 224.8 305.6 221.5 317.3L192.9 417.3C190.5 425.7 192.8 434.7 199 440.9C205.2 447.1 214.2 449.4 222.6 447L322.6 418.4C334.4 415 345.1 408.7 353.7 400.1L551 202.9C579.1 174.8 579.1 129.2 551 101.1L538.9 89C510.8 60.9 465.2 60.9 437.1 89zM152 128C103.4 128 64 167.4 64 216L64 488C64 536.6 103.4 576 152 576L424 576C472.6 576 512 536.6 512 488L512 376C512 362.7 501.3 352 488 352C474.7 352 464 362.7 464 376L464 488C464 510.1 446.1 528 424 528L152 528C129.9 528 112 510.1 112 488L112 216C112 193.9 129.9 176 152 176L264 176C277.3 176 288 165.3 288 152C288 138.7 277.3 128 264 128L152 128z"/></svg>`;

const DELETE_ICON = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><path d="M232.7 69.9L224 96L128 96C110.3 96 96 110.3 96 128C96 145.7 110.3 160 128 160L512 160C529.7 160 544 145.7 544 128C544 110.3 529.7 96 512 96L416 96L407.3 69.9C402.9 56.8 390.7 48 376.9 48L263.1 48C249.3 48 237.1 56.8 232.7 69.9zM512 208L128 208L149.1 531.1C150.7 556.4 171.7 576 197 576L443 576C468.3 576 489.3 556.4 490.9 531.1L512 208z"/></svg>`;

const ARCHIVE_ICON = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><path d="M64 128C64 110.3 78.3 96 96 96L544 96C561.7 96 576 110.3 576 128L576 160C576 177.7 561.7 192 544 192L96 192C78.3 192 64 177.7 64 160L64 128zM96 240L544 240L544 480C544 515.3 515.3 544 480 544L160 544C124.7 544 96 515.3 96 480L96 240zM248 304C234.7 304 224 314.7 224 328C224 341.3 234.7 352 248 352L392 352C405.3 352 416 341.3 416 328C416 314.7 405.3 304 392 304L248 304z"/></svg>`;

const EMPTY_MESSAGES = {
    library: 'Nothing in your daftar yet. Add a resource to start',
    favourites: 'No favourites yet. Tap the heart on any resources to add them to favourites',
    archive: 'Nothing in archives'
};

const VIEW_HEADERS = {
    library: {
        title: 'Your library',
        subtitle: "Save what's worth coming back to",
    },
    favourites: {
        title: 'Favourites',
        subtitle: "All your favourite resources at one place",
    },
    archive: {
        title: 'Archive',
        subtitle: "See your set aside collection",
    }
}

const mainViewTitleELement = document.getElementById('main-view-title');
const mainViewSubtitleElement = document.getElementById('main-view-subtitle');

function updateViewHeader() {

    const headerObject = VIEW_HEADERS[currentView] ?? VIEW_HEADERS.library;

    mainViewTitleELement.textContent = headerObject.title;
    mainViewSubtitleElement.textContent = headerObject.subtitle;

    addResourceButton.hidden = currentView === 'archive';
}


function createActionsMenu(resource) {
    const containerElement = document.createElement('div');
    containerElement.className = 'actions-menu-container';

    const menuButtonElement = document.createElement('button');
    menuButtonElement.type = 'button';
    menuButtonElement.className = 'menu-button';
    menuButtonElement.innerHTML = MENU_ICON;

    const menuListElement = document.createElement('ul');
    menuListElement.className = 'actions-menu';

    const actions = [
        { label: 'Edit', icon: EDIT_ICON, handler: editResource },
        { label: 'Delete', icon: DELETE_ICON, handler: deleteResource },
        { label: resource.archived ? 'Unarchive' : 'Archive', icon: ARCHIVE_ICON, handler: toggleArchive },
    ];

    actions.forEach(({ label, icon, handler }) => {
        const listItemElement = document.createElement('li');

        const actionButtonElement = document.createElement('button');
        actionButtonElement.type = 'button';
        actionButtonElement.dataset.id = resource.id;
        actionButtonElement.innerHTML = icon;
        actionButtonElement.append(label);
        actionButtonElement.addEventListener('click', handler);

        listItemElement.appendChild(actionButtonElement);
        menuListElement.appendChild(listItemElement);
    });

    menuButtonElement.addEventListener('click', () => {
        const isOpen = menuListElement.classList.toggle('open');
        menuButtonElement.setAttribute('aria-expanded', String(isOpen));
    });

    containerElement.append(menuButtonElement, menuListElement);
    return containerElement;
};

function closeMenu(menuList) {
    menuList.classList.remove('open');
    menuList.previousElementSibling.setAttribute('aria-expanded', 'false');
}

document.addEventListener('click', (event) => {
    const clickedMenuButton = event.target.closest('.menu-button');

    document.querySelectorAll('.actions-menu.open').forEach((menuList) => {
        if (menuList.previousElementSibling !== clickedMenuButton) closeMenu(menuList);
    });
});

document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
        document.querySelectorAll('.actions-menu.open').forEach(closeMenu);
    }
});

function toggleFavourite(event) {
    const resourceIdToToggle = event.currentTarget.dataset.id;
    const resourceToToggle = resources.find((resource) => resource.id === resourceIdToToggle);

    resourceToToggle.favourite = !resourceToToggle.favourite;
    saveResources();
    renderResources();
}

function toggleArchive(event) {
    const resourceIdToToggle = event.currentTarget.dataset.id;
    const resourceToToggle = resources.find((resource) => resource.id === resourceIdToToggle);

    resourceToToggle.archived = !resourceToToggle.archived;
    saveResources();
    renderResources();
}

function renderResources() {

    const resourcesListElement = document.getElementById('resources-list-container');
    resourcesListElement.innerHTML = '';

    const visibleResources = getVisibleResources();

    if (visibleResources.length === 0) {
        const emptyMessageElement = document.createElement('p');
        emptyMessageElement.className = 'empty-state';
        emptyMessageElement.textContent = EMPTY_MESSAGES[currentView] ?? EMPTY_MESSAGES.library;
        resourcesListElement.appendChild(emptyMessageElement);
        return;
    }

    visibleResources.forEach((resource) => {

        const resourceCardElement = document.createElement('article');
        resourceCardElement.className = 'resource-card';

        // 1. Image
        // TODO add image validation later
        const imageElement = document.createElement('img');
        // hardcoded link for now
        imageElement.src = '../assets/TextLogo.png'
        imageElement.alt = '';
        resourceCardElement.appendChild(imageElement);

        // 2. Fav button
        const isFavourite = resource.favourite === true;
        const favouriteButton = document.createElement('button');
        favouriteButton.className = 'favourite-button';
        favouriteButton.type = 'button';
        favouriteButton.dataset.id = resource.id;
        favouriteButton.innerHTML = isFavourite ? HEART_FILLED_ICON : HEART_ICON;
        favouriteButton.classList.toggle('is-favourite', isFavourite);
        favouriteButton.addEventListener('click', toggleFavourite);
        resourceCardElement.appendChild(favouriteButton);

        //3.Content container
        const contentContainerElement = document.createElement('div');
        contentContainerElement.className = 'resource-content';

        // 4. Header inside content 
        const headerElement = document.createElement('header');
        headerElement.className = 'resource-header';

        const titleElement = document.createElement('h3');
        titleElement.textContent = resource.resource_name;

        const linkElement = document.createElement('a');
        linkElement.href = resource.resource_url;
        linkElement.target = '_blank';
        linkElement.innerHTML = LINK_ICON;
        headerElement.append(titleElement, linkElement);

        //5. chip
        const typeChipElement = document.createElement('span');
        typeChipElement.className = 'type-chip';
        typeChipElement.textContent = resource.resource_type;
        typeChipElement.dataset.type = resource.resource_type;

        //6. notes
        const notesElement = document.createElement('p');
        notesElement.className = 'resource-notes';
        notesElement.textContent = resource.notes;

        // 7. Footer
        const footerElement = document.createElement('footer');
        footerElement.className = 'resource-footer';

        const topicElement = document.createElement('p');
        topicElement.textContent = resource.topic;

        footerElement.append(topicElement, createActionsMenu(resource));
        //apend evertyhing;

        contentContainerElement.append(headerElement, typeChipElement, notesElement, footerElement);
        resourceCardElement.appendChild(contentContainerElement);
        resourcesListElement.appendChild(resourceCardElement);

    })
}

updateViewHeader();
renderResources();