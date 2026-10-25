const savedResources = localStorage.getItem('resources');
const parsedSavedResources = JSON.parse(savedResources);


let resources = parsedSavedResources ? parsedSavedResources : [];


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
const types = ['Article', 'Video', 'Podcast', 'Playlist', 'Website', 'Book'];

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

    resources = resources.filter((resource) => resource.id != resourceIdToDelete);

    saveResources();
    renderResources();
}

const addResourceForm = document.getElementById('add-resource');

addResourceForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const formData = new FormData(addResourceForm);

    const resource = Object.fromEntries(formData);

    resources.push({ ...resource, id: crypto.randomUUID() });

    addResourceForm.reset();
    console.log(resources); //TODO Remove later
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

        resourcesListElement.appendChild(listItemElement);
    })
}

renderResources();