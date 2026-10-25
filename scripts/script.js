let resources = [];

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

const addResourceForm = document.getElementById('add-resource');

addResourceForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const formData = new FormData(addResourceForm);

    const resource = Object.fromEntries(formData);

    resources.push(resource);

    addResourceForm.reset();
    console.log(resources); //TODO Remove later

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

        resourcesListElement.appendChild(listItemElement);
    })
}