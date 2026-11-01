const LOCALSTORAGE_KEYS = {
    resources: 'resources',
    resource_topics: 'resources_topics',
    resource_types: 'resources_types',
    author_name: 'author_name',
    user_exists: 'user_exists',
}

const DEFAULT_RESOURCE_TOPICS = ['Literature', 'Frontend', 'AI', 'Productivity'];
const DEFAULT_RESOURCE_TYPES = ['Article', 'Video', 'Podcast', 'Playlist', 'Website', 'Book', 'Tutorial'];
const FALLBACK_TOPIC = 'Other';

function loadFromLocalstorage(key, fallback_value) {
    try {
        const saved = localStorage.getItem(key);
        return saved === null ? fallback_value : JSON.parse(saved);
    } catch (error) {
        console.error(`Could not read ${key} value from localStorage`, error);
        return fallback_value;
    }
}

function saveToLocalstorage(key, value) {
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
        console.error(`Failed to save ${value} in ${key}`, error);
    }
}

function withFallbackTopic(list) {
    return list.includes(FALLBACK_TOPIC) ? list : [...list, FALLBACK_TOPIC];
};

let resources = loadFromLocalstorage(LOCALSTORAGE_KEYS.resources, []);
let topics = withFallbackTopic(loadFromLocalstorage(LOCALSTORAGE_KEYS.resource_topics, DEFAULT_RESOURCE_TOPICS));
let types = loadFromLocalstorage(LOCALSTORAGE_KEYS.resource_types, DEFAULT_RESOURCE_TYPES);
let userName = loadFromLocalstorage(LOCALSTORAGE_KEYS.author_name, '');
let doesUserExists = loadFromLocalstorage(LOCALSTORAGE_KEYS.user_exists, false);

// Save data to localstorage
function saveResources() {
    saveToLocalstorage(LOCALSTORAGE_KEYS.resources, resources)
};
function saveTopics() {
    saveToLocalstorage(LOCALSTORAGE_KEYS.resource_topics, topics);
};
function saveTypes() {
    saveToLocalstorage(LOCALSTORAGE_KEYS.resource_types, types);
};
function saveUserName() {
    saveToLocalstorage(LOCALSTORAGE_KEYS.author_name, userName);
};
function saveUserExists() {
    doesUserExists = true;
    saveToLocalstorage(LOCALSTORAGE_KEYS.user_exists, true);
};

function addTopic(name) {
    const cleanedName = name.trim();
    if (!cleanedName) return false;

    const alreadyExists = topics.some((topic) => topic.toLowerCase() === cleanedName.toLowerCase());
    if (alreadyExists) return false;

    topics.push(name);
    saveTopics();
    return true;
};

// Deleting a topic which already has some resources will move those resources to 'Other' topic.
function deleteTopic(name) {
    if (name === FALLBACK_TOPIC) return;

    resources.forEach((resource) => {
        if (resource.topic === name) {
            resource.topic = FALLBACK_TOPIC;
        };
    });
    saveResources();

    topics.filter((topic) => topic !== name);
    saveTopics();
};

const topicsDropdownElement = document.getElementById('topics');
const resourceTypeDropdownElement = document.getElementById('resource-type');

function fillDropdown(selectDOMElement, options) {
    selectDOMElement.innerHTML = '';
    options.forEach((optionText) => {
        const optionElement = document.createElement('option');
        optionElement.value = optionText;
        optionElement.textContent = optionText;
        selectDOMElement.appendChild(optionElement);
    });
};

fillDropdown(topicsDropdownElement, topics);
fillDropdown(resourceTypeDropdownElement, types);
