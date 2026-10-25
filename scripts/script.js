'use strict';


const savedResources = localStorage.getItem('resources');
const parsedSavedResources = JSON.parse(savedResources);


let resources = parsedSavedResources ?? [];

let resourceIdToEdit = null;
let cancelButton = null;
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

function saveResources() {
    let resourcesString = JSON.stringify(resources);
    localStorage.setItem('resources', resourcesString);
};

function deleteResource(event) {
    const resourceIdToDelete = event.target.dataset.id;
    if (resourceIdToDelete === resourceIdToEdit) exitEditMode();
    resources = resources.filter((resource) => resource.id !== resourceIdToDelete);

    saveResources();
    renderResources();
}

const addResourceForm = document.getElementById('add-resource');

function addResource(resource) {
    resources.push({ ...resource, id: crypto.randomUUID() });
}

function editResource(event) {
    resourceIdToEdit = event.target.dataset.id;
    const resourceToEdit = resources.find(resource => resource.id === resourceIdToEdit);
    addCancelButton();
    submitButton.textContent = 'Save changes';

    Object.entries(resourceToEdit).forEach(([key, value]) => {
        if (addResourceForm.elements[key]) {
            addResourceForm.elements[key].value = value;
        };
    })
}

function exitEditMode() {
    resourceIdToEdit = null;
    addResourceForm.reset();
    removeCancelButton();
    submitButton.textContent = 'Add resource';
}

function addCancelButton() {
    if (cancelButton) return;
    cancelButton = document.createElement('button');
    cancelButton.type = 'button';
    cancelButton.textContent = 'Cancel';
    cancelButton.addEventListener('click', exitEditMode);
    addResourceForm.appendChild(cancelButton);
}

function removeCancelButton() {
    if (cancelButton) {
        cancelButton.remove();
        cancelButton = null;
    }
}


addResourceForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const formData = new FormData(addResourceForm);

    const resource = Object.fromEntries(formData);

    if (resourceIdToEdit) {
        const resourceToEdit = resources.find((res) => res.id === resourceIdToEdit);
        Object.assign(resourceToEdit, resource);
        exitEditMode();
    }
    else {
        addResource(resource);
        addResourceForm.reset();
    };
    saveResources();
    renderResources();
})


const HEART_ICON = `<svg class="favourite-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><path d="M442.9 144C415.6 144 389.9 157.1 373.9 179.2L339.5 226.8C335 233 327.8 236.7 320.1 236.7C312.4 236.7 305.2 233 300.7 226.8L266.3 179.2C250.3 157.1 224.6 144 197.3 144C150.3 144 112.2 182.1 112.2 229.1C112.2 279 144.2 327.5 180.3 371.4C221.4 421.4 271.7 465.4 306.2 491.7C309.4 494.1 314.1 495.9 320.2 495.9C326.3 495.9 331 494.1 334.2 491.7C368.7 465.4 419 421.3 460.1 371.4C496.3 327.5 528.2 279 528.2 229.1C528.2 182.1 490.1 144 443.1 144zM335 151.1C360 116.5 400.2 96 442.9 96C516.4 96 576 155.6 576 229.1C576 297.7 533.1 358 496.9 401.9C452.8 455.5 399.6 502 363.1 529.8C350.8 539.2 335.6 543.9 320 543.9C304.4 543.9 289.2 539.2 276.9 529.8C240.4 502 187.2 455.5 143.1 402C106.9 358.1 64 297.7 64 229.1C64 155.6 123.6 96 197.1 96C239.8 96 280 116.5 305 151.1L320 171.8L335 151.1z"/></svg>`;

const LINK_ICON = `<svg class="link-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><path d="M384 64C366.3 64 352 78.3 352 96C352 113.7 366.3 128 384 128L466.7 128L265.3 329.4C252.8 341.9 252.8 362.2 265.3 374.7C277.8 387.2 298.1 387.2 310.6 374.7L512 173.3L512 256C512 273.7 526.3 288 544 288C561.7 288 576 273.7 576 256L576 96C576 78.3 561.7 64 544 64L384 64zM144 160C99.8 160 64 195.8 64 240L64 496C64 540.2 99.8 576 144 576L400 576C444.2 576 480 540.2 480 496L480 416C480 398.3 465.7 384 448 384C430.3 384 416 398.3 416 416L416 496C416 504.8 408.8 512 400 512L144 512C135.2 512 128 504.8 128 496L128 240C128 231.2 135.2 224 144 224L224 224C241.7 224 256 209.7 256 192C256 174.3 241.7 160 224 160L144 160z"/></svg>`;

const MENU_ICON = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><path d="M320 208C289.1 208 264 182.9 264 152C264 121.1 289.1 96 320 96C350.9 96 376 121.1 376 152C376 182.9 350.9 208 320 208zM320 432C350.9 432 376 457.1 376 488C376 518.9 350.9 544 320 544C289.1 544 264 518.9 264 488C264 457.1 289.1 432 320 432zM376 320C376 350.9 350.9 376 320 376C289.1 376 264 350.9 264 320C264 289.1 289.1 264 320 264C350.9 264 376 289.1 376 320z"/></svg>`;


function renderResources() {

    const resourcesListElement = document.getElementById('resources-list-container');
    resourcesListElement.innerHTML = '';

    resources.forEach((resource) => {

        const resourceCardElement = document.createElement('article');
        resourceCardElement.className = 'resource-card';

        // 1. Image
        // TODO add image validation later
        const imageElement = document.createElement('img');
        // hardcoded link for now
        imageElement.src = 'https://developer.mozilla.org/pimg/aHR0cHM6Ly9zdGF0aWM0LmJ1eXNlbGxhZHMubmV0L3V1LzIvMTc2NDc2LzE3ODE3OTE1MjItTW96aWxsYS1TZWxmaG9zdGluZy1Db250ZW50XzUwMHg1MDAuanBn.4FNLhsBsDeUNm8oN0c4osLwwersene8YFmykzCCX7zA%3D'
        imageElement.alt = '';
        resourceCardElement.appendChild(imageElement);

        // 2. Fav button
        const favouriteButton = document.createElement('button');
        favouriteButton.className = 'favourite-button';
        favouriteButton.type = 'button';
        favouriteButton.dataset.id = resource.id;
        favouriteButton.innerHTML = HEART_ICON;
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

        //apend evertyhing;

        contentContainerElement.append(headerElement, typeChipElement, notesElement, footerElement);
        resourceCardElement.appendChild(contentContainerElement);
        resourcesListElement.appendChild(resourceCardElement);

    })
}

renderResources();