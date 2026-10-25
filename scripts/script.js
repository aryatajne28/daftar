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

function renderResources() {

    const resourcesListElement = document.getElementById('resources-list');
    resourcesListElement.innerHTML = '';

    resources.forEach((resource) => {

        const listItemElement = document.createElement('li');
        listItemElement.textContent = `${resource.resource_name} - ${resource.topic} - `

        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', resource.resource_url);
        linkElement.setAttribute('target', '_blank');
        linkElement.textContent = 'Open link';
        listItemElement.appendChild(linkElement);

        const deleteButtonElement = document.createElement('button');
        deleteButtonElement.textContent = 'Delete';
        deleteButtonElement.dataset.id = resource.id;
        deleteButtonElement.addEventListener('click', deleteResource);
        listItemElement.appendChild(deleteButtonElement);

        const editButtonElement = document.createElement('button');
        editButtonElement.textContent = 'Edit';
        editButtonElement.dataset.id = resource.id;
        editButtonElement.addEventListener('click', editResource);
        listItemElement.appendChild(editButtonElement);

        resourcesListElement.appendChild(listItemElement);
    })
}

renderResources();