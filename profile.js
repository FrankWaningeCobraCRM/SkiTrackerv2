// ===========================
// PROFILE PAGE - STANDALONE
// ===========================

let currentUser = null;
let currentProfile = null;
let packingItems = [];
let tips = [];
let currentTipPhoto = null;
let friends = [];
let pendingRequests = [];
let sentRequests = [];

// ===========================
// LOADING OVERLAY
// ===========================

function showLoading() {
    document.getElementById('loading-overlay').style.display = 'flex';
}

function hideLoading() {
    document.getElementById('loading-overlay').style.display = 'none';
}

// ===========================
// AUTHENTICATION
// ===========================

// Listen for auth state changes
firebase.auth().onAuthStateChanged(async function(user) {
    hideLoading();
    
    if (user) {
        // User is signed in
        currentUser = user;
        
        // Show profile page
        document.getElementById('profile-page').style.display = 'block';
        document.getElementById('user-display-name').textContent = user.displayName || user.email;
        
        // Load profile data
        await loadProfile();
        await loadPackingItems();
        await loadTips();
        await loadFriends();
        await loadPendingRequests();
        await loadSentRequests();
        await updateProfileStats();
        await loadUserAvatar();
        
        // Setup event listeners
        setupEventListeners();
        
    } else {
        // User is not signed in, redirect to login
        window.location.href = 'index.html';
    }
});

// Handle logout
async function handleLogout() {
    if (confirm('Weet je zeker dat je wilt uitloggen?')) {
        showLoading();
        try {
            await firebase.auth().signOut();
            window.location.href = 'index.html';
        } catch (error) {
            hideLoading();
            alert('Fout bij uitloggen: ' + error.message);
        }
    }
}

// Load user avatar
async function loadUserAvatar() {
    if (!currentUser) return;
    
    try {
        const doc = await db.collection('users').doc(currentUser.uid).collection('profile').doc('data').get();
        
        if (doc.exists && doc.data().photoUrl) {
            const userAvatar = document.getElementById('user-avatar');
            userAvatar.src = doc.data().photoUrl;
            userAvatar.style.display = 'block';
        } else if (currentUser.photoURL) {
            const userAvatar = document.getElementById('user-avatar');
            userAvatar.src = currentUser.photoURL;
            userAvatar.style.display = 'block';
        }
    } catch (error) {
        console.error('Error loading user avatar:', error);
    }
}

// ===========================
// PROFILE TABS
// ===========================

function switchProfileTab(tabName) {
    // Update nav buttons
    document.querySelectorAll('.profile-nav-button').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.closest('.profile-nav-button').classList.add('active');
    
    // Update sections
    document.querySelectorAll('.profile-section').forEach(section => {
        section.classList.remove('active');
    });
    document.getElementById('profile-section-' + tabName).classList.add('active');
}

// ===========================
// PROFILE DATA
// ===========================

async function loadProfile() {
    if (!currentUser) return;
    
    try {
        const doc = await db.collection('users').doc(currentUser.uid).collection('profile').doc('data').get();
        
        if (doc.exists) {
            currentProfile = doc.data();
            populateProfileForm(currentProfile);
        } else {
            // Initialize with default values from auth
            currentProfile = {
                name: currentUser.displayName || '',
                username: '',
                email: currentUser.email || '',
                location: '',
                birthdate: '',
                skillLevel: '',
                favoriteResort: '',
                bio: '',
                photoUrl: currentUser.photoURL || ''
            };
            populateProfileForm(currentProfile);
        }
        
        updateProfilePhoto();
    } catch (error) {
        console.error('Error loading profile:', error);
    }
}

function populateProfileForm(profile) {
    document.getElementById('profile-name').value = profile.name || '';
    document.getElementById('profile-username').value = profile.username || '';
    document.getElementById('profile-email').value = currentUser.email || '';
    document.getElementById('profile-location').value = profile.location || '';
    document.getElementById('profile-birthdate').value = profile.birthdate || '';
    document.getElementById('profile-skill-level').value = profile.skillLevel || '';
    document.getElementById('profile-favorite-resort').value = profile.favoriteResort || '';
    document.getElementById('profile-bio').value = profile.bio || '';
}

function updateProfilePhoto() {
    const photoPreview = document.getElementById('profile-photo-preview');
    const photoPlaceholder = document.getElementById('profile-photo-placeholder');
    
    if (currentProfile && currentProfile.photoUrl) {
        photoPreview.src = currentProfile.photoUrl;
        photoPreview.style.display = 'block';
        photoPlaceholder.style.display = 'none';
    } else {
        photoPreview.style.display = 'none';
        photoPlaceholder.style.display = 'flex';
    }
}

function handleProfilePhotoChange(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    if (file.size > 5 * 1024 * 1024) {
        showProfileMessage('Foto is te groot. Maximum is 5MB.', 'error');
        return;
    }
    
    const reader = new FileReader();
    reader.onload = function(e) {
        resizeImage(e.target.result, 400, 400, function(resizedDataUrl) {
            currentProfile.photoUrl = resizedDataUrl;
            updateProfilePhoto();
        });
    };
    reader.readAsDataURL(file);
}

function resizeImage(dataUrl, maxWidth, maxHeight, callback) {
    const img = new Image();
    img.onload = function() {
        let width = img.width;
        let height = img.height;
        
        if (width > height) {
            if (width > maxWidth) {
                height *= maxWidth / width;
                width = maxWidth;
            }
        } else {
            if (height > maxHeight) {
                width *= maxHeight / height;
                height = maxHeight;
            }
        }
        
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        
        callback(canvas.toDataURL('image/jpeg', 0.8));
    };
    img.src = dataUrl;
}

async function saveProfile() {
    if (!currentUser) return;
    
    const username = document.getElementById('profile-username').value.trim().toLowerCase();
    
    // Validate username
    if (username && !/^[a-z0-9_]+$/.test(username)) {
        showProfileMessage('Gebruikersnaam mag alleen letters, cijfers en underscores bevatten.', 'error');
        return;
    }
    
    // Check if username is taken (if changed)
    if (username && username !== (currentProfile?.username || '')) {
        const usernameCheck = await db.collection('usernames').doc(username).get();
        if (usernameCheck.exists && usernameCheck.data().uid !== currentUser.uid) {
            showProfileMessage('Deze gebruikersnaam is al in gebruik.', 'error');
            return;
        }
    }
    
    const profileData = {
        name: document.getElementById('profile-name').value.trim(),
        username: username,
        email: currentUser.email,
        location: document.getElementById('profile-location').value.trim(),
        birthdate: document.getElementById('profile-birthdate').value,
        skillLevel: document.getElementById('profile-skill-level').value,
        favoriteResort: document.getElementById('profile-favorite-resort').value.trim(),
        bio: document.getElementById('profile-bio').value.trim(),
        photoUrl: currentProfile ? currentProfile.photoUrl : '',
        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
    };
    
    showLoading();
    
    try {
        // Save profile data
        await db.collection('users').doc(currentUser.uid).collection('profile').doc('data').set(profileData);
        
        // Update searchable user document (for friend search)
        const searchableUserData = {
            uid: currentUser.uid,
            username: username,
            name: profileData.name,
            photoUrl: profileData.photoUrl,
            skillLevel: profileData.skillLevel,
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        };
        await db.collection('users').doc(currentUser.uid).set(searchableUserData, { merge: true });
        
        // Reserve username
        if (username) {
            // Remove old username reservation if changed
            if (currentProfile?.username && currentProfile.username !== username) {
                await db.collection('usernames').doc(currentProfile.username).delete();
            }
            // Add new username reservation
            await db.collection('usernames').doc(username).set({ uid: currentUser.uid });
        }
        
        // Update display name in auth if changed
        if (profileData.name && profileData.name !== currentUser.displayName) {
            await currentUser.updateProfile({ displayName: profileData.name });
            document.getElementById('user-display-name').textContent = profileData.name;
        }
        
        currentProfile = profileData;
        updateProfilePhoto();
        
        // Update avatar in header
        if (profileData.photoUrl) {
            const userAvatar = document.getElementById('user-avatar');
            userAvatar.src = profileData.photoUrl;
            userAvatar.style.display = 'block';
        }
        
        hideLoading();
        showProfileMessage('Profiel succesvol opgeslagen!', 'success');
    } catch (error) {
        console.error('Error saving profile:', error);
        hideLoading();
        showProfileMessage('Fout bij opslaan. Probeer het opnieuw.', 'error');
    }
}

function showProfileMessage(message, type) {
    const messageEl = document.getElementById('profile-save-message');
    messageEl.textContent = message;
    messageEl.className = 'profile-save-message ' + type;
    
    setTimeout(() => {
        messageEl.textContent = '';
        messageEl.className = 'profile-save-message';
    }, 3000);
}

// ===========================
// PROFILE STATS
// ===========================

async function updateProfileStats() {
    if (!currentUser) return;
    
    try {
        // Get total visits
        const visitsSnapshot = await db.collection('users').doc(currentUser.uid).collection('visits').get();
        let totalVisits = 0;
        let uniqueResorts = new Set();
        
        visitsSnapshot.forEach(doc => {
            const data = doc.data();
            totalVisits += 1;
            if (data.resortId) {
                uniqueResorts.add(data.resortId);
            }
        });
        
        // Get packing items count
        const packingSnapshot = await db.collection('users').doc(currentUser.uid).collection('packingList').get();
        const packingCount = packingSnapshot.size;
        
        // Get member since date
        const memberSince = currentUser.metadata.creationTime;
        const memberDate = new Date(memberSince);
        const memberFormatted = memberDate.toLocaleDateString('nl-NL', { 
            month: 'short', 
            year: 'numeric' 
        });
        
        // Update UI
        document.getElementById('profile-total-visits').textContent = totalVisits;
        document.getElementById('profile-unique-resorts').textContent = uniqueResorts.size;
        document.getElementById('profile-packing-items').textContent = packingCount;
        document.getElementById('profile-member-since').textContent = memberFormatted;
        
    } catch (error) {
        console.error('Error updating profile stats:', error);
    }
}

// ===========================
// PACKING LIST FUNCTIONALITY
// ===========================

const PACKING_CATEGORIES = {
    vooraf: { name: 'Van tevoren regelen', icon: '📋' },
    ski: { name: 'Ski uitrusting', icon: '⛷️' },
    kleding: { name: 'Vrijetijdskleding', icon: '👕' },
    toiletartikelen: { name: 'Toiletartikelen', icon: '🧴' },
    documenten: { name: 'Belangrijke documenten', icon: '📄' },
    overige: { name: 'Overige', icon: '📦' }
};

const DEFAULT_PACKING_ITEMS = {
    vooraf: [
        'Skipas reserveren/kopen',
        'Skiën/snowboarden boeken (indien nodig)',
        'Accommodatie bevestigen',
        'Reisverzekering afsluiten',
        'Auto wintercheck (banden, ruitenvloeistof)',
        'Skischoenen laten controleren',
        'Sneeuwkettingen regelen'
    ],
    ski: [
        'Ski\'s of snowboard',
        'Skischoenen',
        'Skistokken',
        'Skihelm',
        'Skibril/goggles',
        'Skihandschoenen',
        'Skipak (jas + broek)',
        'Thermisch ondergoed',
        'Skisokken (meerdere paar)',
        'Nekwarmer/buff',
        'Fleece tussenlaag',
        'Rugprotector (optioneel)'
    ],
    kleding: [
        'Après-ski schoenen',
        'Joggingbroek/comfortabele broek',
        'Truien/sweaters',
        'T-shirts',
        'Ondergoed',
        'Normale sokken',
        'Pyjama',
        'Badjas (indien accommodatie geen heeft)',
        'Zwemkleding (voor wellness/zwembad)',
        'Muts voor buiten'
    ],
    toiletartikelen: [
        'Tandenborstel + tandpasta',
        'Deodorant',
        'Shampoo + douchegel',
        'Zonnebrandcrème (hoge factor)',
        'Lippenbalsem met SPF',
        'Gezichtscrème',
        'Medicijnen (pijnstillers, persoonlijke medicatie)',
        'Pleisterig',
        'Scheerspullen',
        'Haarborstel/kam'
    ],
    documenten: [
        'Paspoort/ID-kaart',
        'Rijbewijs',
        'Zorgpas/verzekeringspapieren',
        'Skipas bevestiging',
        'Accommodatie bevestiging',
        'Reisverzekering documenten',
        'ANWB-pas/pechhulp',
        'Creditcard/pinpas',
        'Contant geld'
    ],
    overige: [
        'Telefoon + oplader',
        'Powerbank',
        'Koptelefoon/oordopjes',
        'Camera',
        'Boek/e-reader',
        'Zonnebril',
        'Rugzak voor op de piste',
        'Snacks voor onderweg',
        'Herbruikbare waterfles',
        'Skikaarthouder'
    ]
};

async function loadPackingItems() {
    if (!currentUser) return;
    
    try {
        const snapshot = await db.collection('users').doc(currentUser.uid)
            .collection('packingList')
            .orderBy('createdAt', 'asc')
            .get();
        
        packingItems = [];
        snapshot.forEach(doc => {
            packingItems.push({ id: doc.id, ...doc.data() });
        });
        
        // If no items exist, create default items
        if (packingItems.length === 0) {
            await createDefaultPackingItems();
        } else {
            renderPackingList();
        }
    } catch (error) {
        console.error('Error loading packing items:', error);
    }
}

async function createDefaultPackingItems() {
    if (!currentUser) return;
    
    showLoading();
    
    try {
        const batch = db.batch();
        const categoryOrder = ['vooraf', 'ski', 'kleding', 'toiletartikelen', 'documenten', 'overige'];
        
        let orderIndex = 0;
        for (const category of categoryOrder) {
            const items = DEFAULT_PACKING_ITEMS[category];
            for (const itemName of items) {
                const ref = db.collection('users').doc(currentUser.uid)
                    .collection('packingList').doc();
                batch.set(ref, {
                    name: itemName,
                    category: category,
                    checked: false,
                    order: orderIndex,
                    createdAt: firebase.firestore.FieldValue.serverTimestamp()
                });
                orderIndex++;
            }
        }
        
        await batch.commit();
        hideLoading();
        await loadPackingItems();
        await updateProfileStats();
        
    } catch (error) {
        console.error('Error creating default packing items:', error);
        hideLoading();
    }
}

function renderPackingList() {
    const container = document.getElementById('packing-list-categories');
    const actionsContainer = document.getElementById('packing-list-actions');
    
    if (packingItems.length === 0) {
        container.innerHTML = '<p class="no-packing-items">Je paklijst is nog leeg. Voeg items toe om te beginnen!</p>';
        actionsContainer.style.display = 'none';
        updatePackingProgress();
        return;
    }
    
    actionsContainer.style.display = 'flex';
    
    // Group items by category
    const itemsByCategory = {};
    const categoryOrder = ['vooraf', 'ski', 'kleding', 'toiletartikelen', 'documenten', 'overige'];
    
    categoryOrder.forEach(cat => {
        itemsByCategory[cat] = [];
    });
    
    packingItems.forEach(item => {
        const cat = item.category || 'overige';
        if (!itemsByCategory[cat]) {
            itemsByCategory[cat] = [];
        }
        itemsByCategory[cat].push(item);
    });
    
    // Render categories
    let html = '';
    categoryOrder.forEach(categoryKey => {
        const items = itemsByCategory[categoryKey];
        if (items.length === 0) return;
        
        const category = PACKING_CATEGORIES[categoryKey];
        const checkedCount = items.filter(i => i.checked).length;
        const totalCount = items.length;
        const allChecked = checkedCount === totalCount;
        
        html += `
            <div class="packing-category collapsed ${allChecked ? 'all-checked' : ''}" data-category="${categoryKey}">
                <div class="packing-category-header" onclick="toggleCategoryCollapse('${categoryKey}')">
                    <div class="category-title">
                        <span class="category-icon">${category.icon}</span>
                        <span class="category-name">${category.name}</span>
                        <span class="category-count">${checkedCount}/${totalCount}</span>
                    </div>
                    <span class="category-toggle">▼</span>
                </div>
                <div class="packing-category-items" id="category-items-${categoryKey}">
                    ${items.map(item => `
                        <div class="packing-item ${item.checked ? 'checked' : ''}" data-id="${item.id}">
                            <label class="packing-checkbox">
                                <input type="checkbox" ${item.checked ? 'checked' : ''} onchange="togglePackingItem('${item.id}')" />
                                <span class="checkmark"></span>
                            </label>
                            <span class="packing-item-text">${escapeHtml(item.name)}</span>
                            <button class="packing-delete-btn" onclick="deletePackingItem('${item.id}')" title="Verwijderen">×</button>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    });
    
    container.innerHTML = html;
    updatePackingProgress();
}

function toggleCategoryCollapse(categoryKey) {
    const categoryEl = document.querySelector(`.packing-category[data-category="${categoryKey}"]`);
    if (categoryEl) {
        categoryEl.classList.toggle('collapsed');
    }
}

function updatePackingProgress() {
    const total = packingItems.length;
    const checked = packingItems.filter(item => item.checked).length;
    const percentage = total > 0 ? Math.round((checked / total) * 100) : 0;
    
    document.getElementById('packing-progress-text').textContent = `${checked} / ${total} ingepakt`;
    document.getElementById('packing-progress-bar').style.width = `${percentage}%`;
}

function handlePackingItemKeypress(event) {
    if (event.key === 'Enter') {
        addPackingItem();
    }
}

async function addPackingItem() {
    if (!currentUser) return;
    
    const input = document.getElementById('new-packing-item');
    const categorySelect = document.getElementById('new-packing-category');
    const itemName = input.value.trim();
    const category = categorySelect.value;
    
    if (!itemName) {
        return;
    }
    
    const itemData = {
        name: itemName,
        category: category,
        checked: false,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
    };
    
    try {
        await db.collection('users').doc(currentUser.uid)
            .collection('packingList').add(itemData);
        
        input.value = '';
        await loadPackingItems();
        await updateProfileStats();
        
    } catch (error) {
        console.error('Error adding packing item:', error);
        alert('Fout bij toevoegen. Probeer het opnieuw.');
    }
}

async function togglePackingItem(itemId) {
    if (!currentUser) return;
    
    const item = packingItems.find(i => i.id === itemId);
    if (!item) return;
    
    try {
        await db.collection('users').doc(currentUser.uid)
            .collection('packingList').doc(itemId).update({
                checked: !item.checked
            });
        
        // Update local state
        item.checked = !item.checked;
        renderPackingList();
        
    } catch (error) {
        console.error('Error toggling packing item:', error);
    }
}

async function deletePackingItem(itemId) {
    if (!currentUser) return;
    
    try {
        await db.collection('users').doc(currentUser.uid)
            .collection('packingList').doc(itemId).delete();
        
        await loadPackingItems();
        await updateProfileStats();
        
    } catch (error) {
        console.error('Error deleting packing item:', error);
        alert('Fout bij verwijderen. Probeer het opnieuw.');
    }
}

async function uncheckAllItems() {
    if (!currentUser || packingItems.length === 0) return;
    
    showLoading();
    
    try {
        const batch = db.batch();
        
        packingItems.forEach(item => {
            const ref = db.collection('users').doc(currentUser.uid)
                .collection('packingList').doc(item.id);
            batch.update(ref, { checked: false });
        });
        
        await batch.commit();
        
        hideLoading();
        await loadPackingItems();
        
    } catch (error) {
        console.error('Error unchecking all items:', error);
        hideLoading();
        alert('Fout bij uitvinken. Probeer het opnieuw.');
    }
}

async function deleteCheckedItems() {
    if (!currentUser) return;
    
    const checkedItems = packingItems.filter(item => item.checked);
    
    if (checkedItems.length === 0) {
        alert('Geen aangevinkte items om te verwijderen.');
        return;
    }
    
    if (!confirm(`Weet je zeker dat je ${checkedItems.length} aangevinkte item(s) wilt verwijderen?`)) {
        return;
    }
    
    showLoading();
    
    try {
        const batch = db.batch();
        
        checkedItems.forEach(item => {
            const ref = db.collection('users').doc(currentUser.uid)
                .collection('packingList').doc(item.id);
            batch.delete(ref);
        });
        
        await batch.commit();
        
        hideLoading();
        await loadPackingItems();
        await updateProfileStats();
        
    } catch (error) {
        console.error('Error deleting checked items:', error);
        hideLoading();
        alert('Fout bij verwijderen. Probeer het opnieuw.');
    }
}

async function resetToDefaults() {
    if (!currentUser) return;
    
    if (!confirm('Weet je zeker dat je de paklijst wilt herstellen naar de standaard items? Alle huidige items worden verwijderd.')) {
        return;
    }
    
    showLoading();
    
    try {
        // Delete all current items
        const batch = db.batch();
        packingItems.forEach(item => {
            const ref = db.collection('users').doc(currentUser.uid)
                .collection('packingList').doc(item.id);
            batch.delete(ref);
        });
        await batch.commit();
        
        // Reset packingItems and create defaults
        packingItems = [];
        hideLoading();
        await createDefaultPackingItems();
        
    } catch (error) {
        console.error('Error resetting to defaults:', error);
        hideLoading();
        alert('Fout bij herstellen. Probeer het opnieuw.');
    }
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// ===========================
// LIGHTBOX
// ===========================

function openLightbox(imageUrl) {
    document.getElementById('lightbox-image').src = imageUrl;
    document.getElementById('photo-lightbox').style.display = 'flex';
}

function closeLightbox() {
    document.getElementById('photo-lightbox').style.display = 'none';
}

// ===========================
// EVENT LISTENERS
// ===========================

function setupEventListeners() {
    // Lightbox close on click outside
    document.getElementById('photo-lightbox').addEventListener('click', function(e) {
        if (e.target.id === 'photo-lightbox') {
            closeLightbox();
        }
    });
    
    // Keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeLightbox();
        }
    });
    
    // Setup drag and drop for tip photos
    setupTipPhotoDragDrop();
}

// ===========================
// TIPS & ERVARINGEN
// ===========================

async function loadTips() {
    if (!currentUser) return;
    
    try {
        const snapshot = await db.collection('users').doc(currentUser.uid)
            .collection('tips')
            .orderBy('createdAt', 'desc')
            .get();
        
        tips = [];
        snapshot.forEach(doc => {
            tips.push({
                id: doc.id,
                ...doc.data()
            });
        });
        
        renderTips();
    } catch (error) {
        console.error('Error loading tips:', error);
    }
}

function renderTips() {
    const container = document.getElementById('tips-list');
    const noTipsEl = document.getElementById('no-tips');
    
    if (tips.length === 0) {
        noTipsEl.style.display = 'block';
        container.innerHTML = '<p class="no-tips" id="no-tips">Je hebt nog geen tips of ervaringen toegevoegd.</p>';
        return;
    }
    
    let html = '';
    
    tips.forEach(tip => {
        const createdAt = tip.createdAt ? tip.createdAt.toDate().toLocaleDateString('nl-NL', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        }) : '';
        
        html += `
            <div class="tip-card" data-id="${tip.id}">
                <div class="tip-card-header">
                    <h4 class="tip-subject">${escapeHtml(tip.subject)}</h4>
                    <button class="tip-delete-btn" onclick="deleteTip('${tip.id}')" title="Verwijderen">🗑️</button>
                </div>
                <p class="tip-description">${escapeHtml(tip.description).replace(/\n/g, '<br>')}</p>
                ${tip.photoUrl ? `
                    <div class="tip-photo-container" onclick="openLightbox('${tip.photoUrl}')">
                        <img src="${tip.photoUrl}" alt="Tip foto" class="tip-photo" />
                    </div>
                ` : ''}
                <div class="tip-footer">
                    <span class="tip-date">📅 ${createdAt}</span>
                </div>
            </div>
        `;
    });
    
    container.innerHTML = html;
}

function handleTipPhotoChange(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    if (file.size > 5 * 1024 * 1024) {
        alert('Foto is te groot. Maximum is 5MB.');
        return;
    }
    
    const reader = new FileReader();
    reader.onload = function(e) {
        resizeImage(e.target.result, 800, 600, function(resizedDataUrl) {
            currentTipPhoto = resizedDataUrl;
            showTipPhotoPreview(resizedDataUrl);
        });
    };
    reader.readAsDataURL(file);
}

function showTipPhotoPreview(dataUrl) {
    const previewContainer = document.getElementById('tip-photo-preview-container');
    const preview = document.getElementById('tip-photo-preview');
    const dropzone = document.getElementById('tip-photo-dropzone');
    
    preview.src = dataUrl;
    previewContainer.style.display = 'block';
    dropzone.style.display = 'none';
}

function removeTipPhoto() {
    currentTipPhoto = null;
    
    const previewContainer = document.getElementById('tip-photo-preview-container');
    const dropzone = document.getElementById('tip-photo-dropzone');
    const input = document.getElementById('tip-photo-input');
    
    previewContainer.style.display = 'none';
    dropzone.style.display = 'flex';
    input.value = '';
}

function setupTipPhotoDragDrop() {
    const dropzone = document.getElementById('tip-photo-dropzone');
    if (!dropzone) return;
    
    dropzone.addEventListener('dragover', function(e) {
        e.preventDefault();
        dropzone.classList.add('dragover');
    });
    
    dropzone.addEventListener('dragleave', function(e) {
        e.preventDefault();
        dropzone.classList.remove('dragover');
    });
    
    dropzone.addEventListener('drop', function(e) {
        e.preventDefault();
        dropzone.classList.remove('dragover');
        
        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith('image/')) {
            const input = document.getElementById('tip-photo-input');
            const dataTransfer = new DataTransfer();
            dataTransfer.items.add(file);
            input.files = dataTransfer.files;
            handleTipPhotoChange({ target: input });
        }
    });
}

async function addTip() {
    if (!currentUser) return;
    
    const subject = document.getElementById('new-tip-subject').value.trim();
    const description = document.getElementById('new-tip-description').value.trim();
    
    if (!subject) {
        alert('Vul een onderwerp in.');
        return;
    }
    
    if (!description) {
        alert('Vul een beschrijving in.');
        return;
    }
    
    const tipData = {
        subject: subject,
        description: description,
        photoUrl: currentTipPhoto || '',
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
    };
    
    showLoading();
    
    try {
        await db.collection('users').doc(currentUser.uid)
            .collection('tips').add(tipData);
        
        // Clear form
        document.getElementById('new-tip-subject').value = '';
        document.getElementById('new-tip-description').value = '';
        removeTipPhoto();
        
        hideLoading();
        await loadTips();
        
    } catch (error) {
        console.error('Error adding tip:', error);
        hideLoading();
        alert('Fout bij opslaan. Probeer het opnieuw.');
    }
}

async function deleteTip(tipId) {
    if (!currentUser) return;
    
    if (!confirm('Weet je zeker dat je deze tip wilt verwijderen?')) {
        return;
    }
    
    showLoading();
    
    try {
        await db.collection('users').doc(currentUser.uid)
            .collection('tips').doc(tipId).delete();
        
        hideLoading();
        await loadTips();
        
    } catch (error) {
        console.error('Error deleting tip:', error);
        hideLoading();
        alert('Fout bij verwijderen. Probeer het opnieuw.');
    }
}

// ===========================
// FRIENDS / FRIEND REQUESTS
// ===========================

async function loadFriends() {
    if (!currentUser) return;
    
    try {
        const snapshot = await db.collection('users').doc(currentUser.uid)
            .collection('friends')
            .orderBy('friendsSince', 'desc')
            .get();
        
        friends = [];
        snapshot.forEach(doc => {
            friends.push({
                id: doc.id,
                ...doc.data()
            });
        });
        
        renderFriends();
    } catch (error) {
        console.error('Error loading friends:', error);
    }
}

async function loadPendingRequests() {
    if (!currentUser) return;
    
    try {
        const snapshot = await db.collection('users').doc(currentUser.uid)
            .collection('friendRequests')
            .orderBy('sentAt', 'desc')
            .get();
        
        pendingRequests = [];
        snapshot.forEach(doc => {
            pendingRequests.push({
                id: doc.id,
                ...doc.data()
            });
        });
        
        renderPendingRequests();
    } catch (error) {
        console.error('Error loading pending requests:', error);
    }
}

async function loadSentRequests() {
    if (!currentUser) return;
    
    try {
        const snapshot = await db.collection('users').doc(currentUser.uid)
            .collection('sentRequests')
            .orderBy('sentAt', 'desc')
            .get();
        
        sentRequests = [];
        snapshot.forEach(doc => {
            sentRequests.push({
                id: doc.id,
                ...doc.data()
            });
        });
        
        renderSentRequests();
    } catch (error) {
        console.error('Error loading sent requests:', error);
    }
}

function renderFriends() {
    const container = document.getElementById('friends-list');
    const countEl = document.getElementById('friends-count');
    
    countEl.textContent = `(${friends.length})`;
    
    if (friends.length === 0) {
        container.innerHTML = '<p class="no-friends">Je hebt nog geen vrienden. Zoek hierboven naar gebruikers!</p>';
        return;
    }
    
    let html = '';
    friends.forEach(user => {
        html += `
            <div class="friend-card" data-uid="${user.uid}">
                <div class="friend-avatar">
                    ${user.photoUrl ? `<img src="${user.photoUrl}" alt="${escapeHtml(user.name)}" />` : '<span>👤</span>'}
                </div>
                <div class="friend-info">
                    <span class="friend-name">${escapeHtml(user.name || 'Onbekend')}</span>
                    <span class="friend-username">@${escapeHtml(user.username || 'geen-gebruikersnaam')}</span>
                    ${user.skillLevel ? `<span class="friend-skill">⛷️ ${capitalizeFirst(user.skillLevel)}</span>` : ''}
                </div>
                <button class="remove-friend-button" onclick="removeFriend('${user.uid}')">Verwijderen</button>
            </div>
        `;
    });
    
    container.innerHTML = html;
}

function renderPendingRequests() {
    const section = document.getElementById('pending-requests-section');
    const container = document.getElementById('pending-requests-list');
    const countEl = document.getElementById('pending-count');
    
    countEl.textContent = pendingRequests.length;
    
    if (pendingRequests.length === 0) {
        section.style.display = 'none';
        return;
    }
    
    section.style.display = 'block';
    
    let html = '';
    pendingRequests.forEach(request => {
        html += `
            <div class="request-card" data-uid="${request.fromUid}">
                <div class="friend-avatar">
                    ${request.photoUrl ? `<img src="${request.photoUrl}" alt="${escapeHtml(request.name)}" />` : '<span>👤</span>'}
                </div>
                <div class="friend-info">
                    <span class="friend-name">${escapeHtml(request.name || 'Onbekend')}</span>
                    <span class="friend-username">@${escapeHtml(request.username || 'geen-gebruikersnaam')}</span>
                    ${request.skillLevel ? `<span class="friend-skill">⛷️ ${capitalizeFirst(request.skillLevel)}</span>` : ''}
                </div>
                <div class="request-actions">
                    <button class="accept-button" onclick="acceptFriendRequest('${request.fromUid}')">✓ Accepteren</button>
                    <button class="decline-button" onclick="declineFriendRequest('${request.fromUid}')">✕ Weigeren</button>
                </div>
            </div>
        `;
    });
    
    container.innerHTML = html;
}

function renderSentRequests() {
    const section = document.getElementById('sent-requests-section');
    const container = document.getElementById('sent-requests-list');
    const countEl = document.getElementById('sent-requests-count');
    
    countEl.textContent = `(${sentRequests.length})`;
    
    if (sentRequests.length === 0) {
        section.style.display = 'none';
        return;
    }
    
    section.style.display = 'block';
    
    let html = '';
    sentRequests.forEach(request => {
        html += `
            <div class="sent-request-card" data-uid="${request.toUid}">
                <div class="friend-avatar">
                    ${request.photoUrl ? `<img src="${request.photoUrl}" alt="${escapeHtml(request.name)}" />` : '<span>👤</span>'}
                </div>
                <div class="friend-info">
                    <span class="friend-name">${escapeHtml(request.name || 'Onbekend')}</span>
                    <span class="friend-username">@${escapeHtml(request.username || 'geen-gebruikersnaam')}</span>
                </div>
                <button class="cancel-request-button" onclick="cancelFriendRequest('${request.toUid}')">Annuleren</button>
            </div>
        `;
    });
    
    container.innerHTML = html;
}

function handleFriendSearchKeypress(event) {
    if (event.key === 'Enter') {
        searchUsers();
    }
}

async function searchUsers() {
    const searchInput = document.getElementById('friend-search-input');
    const searchTerm = searchInput.value.trim().toLowerCase();
    const resultsContainer = document.getElementById('search-results');
    
    if (!searchTerm) {
        resultsContainer.innerHTML = '';
        return;
    }
    
    if (searchTerm.length < 2) {
        resultsContainer.innerHTML = '<p class="search-hint">Voer minimaal 2 tekens in om te zoeken.</p>';
        return;
    }
    
    resultsContainer.innerHTML = '<p class="searching">🔍 Zoeken...</p>';
    
    try {
        // Search by username (starts with)
        const snapshot = await db.collection('users')
            .where('username', '>=', searchTerm)
            .where('username', '<=', searchTerm + '\uf8ff')
            .limit(10)
            .get();
        
        const results = [];
        snapshot.forEach(doc => {
            const data = doc.data();
            // Don't show current user in results
            if (data.uid !== currentUser.uid) {
                results.push({
                    uid: data.uid,
                    username: data.username,
                    name: data.name,
                    photoUrl: data.photoUrl,
                    skillLevel: data.skillLevel
                });
            }
        });
        
        renderSearchResults(results);
    } catch (error) {
        console.error('Error searching users:', error);
        resultsContainer.innerHTML = '<p class="search-error">Er ging iets mis bij het zoeken. Probeer het opnieuw.</p>';
    }
}

function renderSearchResults(results) {
    const container = document.getElementById('search-results');
    
    if (results.length === 0) {
        container.innerHTML = '<p class="no-results">Geen gebruikers gevonden met deze gebruikersnaam.</p>';
        return;
    }
    
    let html = '<div class="search-results-list">';
    results.forEach(user => {
        const isFriend = friends.some(f => f.uid === user.uid);
        const hasSentRequest = sentRequests.some(r => r.toUid === user.uid);
        const hasReceivedRequest = pendingRequests.some(r => r.fromUid === user.uid);
        
        let buttonHtml = '';
        if (isFriend) {
            buttonHtml = `<button class="friend-badge" disabled>👥 Vrienden</button>`;
        } else if (hasSentRequest) {
            buttonHtml = `<button class="pending-button" disabled>⏳ Wacht op reactie</button>`;
        } else if (hasReceivedRequest) {
            buttonHtml = `<button class="accept-button" onclick="acceptFriendRequest('${user.uid}')">✓ Accepteren</button>`;
        } else {
            buttonHtml = `<button class="follow-button" onclick="sendFriendRequest('${user.uid}', '${escapeHtml(user.username)}', '${escapeHtml(user.name)}', '${user.photoUrl || ''}', '${user.skillLevel || ''}')">+ Toevoegen</button>`;
        }
        
        html += `
            <div class="search-result-card" data-uid="${user.uid}">
                <div class="friend-avatar">
                    ${user.photoUrl ? `<img src="${user.photoUrl}" alt="${escapeHtml(user.name)}" />` : '<span>👤</span>'}
                </div>
                <div class="friend-info">
                    <span class="friend-name">${escapeHtml(user.name || 'Onbekend')}</span>
                    <span class="friend-username">@${escapeHtml(user.username)}</span>
                    ${user.skillLevel ? `<span class="friend-skill">⛷️ ${capitalizeFirst(user.skillLevel)}</span>` : ''}
                </div>
                ${buttonHtml}
            </div>
        `;
    });
    html += '</div>';
    
    container.innerHTML = html;
}

async function sendFriendRequest(toUid, username, name, photoUrl, skillLevel) {
    if (!currentUser) return;
    
    try {
        const requestData = {
            fromUid: currentUser.uid,
            username: currentProfile?.username || '',
            name: currentProfile?.name || currentUser.displayName || '',
            photoUrl: currentProfile?.photoUrl || '',
            skillLevel: currentProfile?.skillLevel || '',
            sentAt: firebase.firestore.FieldValue.serverTimestamp()
        };
        
        // Add to their incoming requests
        await db.collection('users').doc(toUid)
            .collection('friendRequests').doc(currentUser.uid).set(requestData);
        
        // Add to my sent requests
        const sentData = {
            toUid: toUid,
            username: username,
            name: name,
            photoUrl: photoUrl,
            skillLevel: skillLevel,
            sentAt: firebase.firestore.FieldValue.serverTimestamp()
        };
        await db.collection('users').doc(currentUser.uid)
            .collection('sentRequests').doc(toUid).set(sentData);
        
        // Reload data
        await loadSentRequests();
        
        // Re-render search results to update button
        searchUsers();
        
        alert('Vriendschapsverzoek verzonden!');
        
    } catch (error) {
        console.error('Error sending friend request:', error);
        alert('Er ging iets mis bij het verzenden. Probeer het opnieuw.');
    }
}

async function acceptFriendRequest(fromUid) {
    if (!currentUser) return;
    
    try {
        // Get the request data
        const requestDoc = await db.collection('users').doc(currentUser.uid)
            .collection('friendRequests').doc(fromUid).get();
        
        if (!requestDoc.exists) {
            alert('Verzoek niet gevonden.');
            return;
        }
        
        const requestData = requestDoc.data();
        
        // Add them to my friends
        const friendData = {
            uid: fromUid,
            username: requestData.username,
            name: requestData.name,
            photoUrl: requestData.photoUrl,
            skillLevel: requestData.skillLevel,
            friendsSince: firebase.firestore.FieldValue.serverTimestamp()
        };
        await db.collection('users').doc(currentUser.uid)
            .collection('friends').doc(fromUid).set(friendData);
        
        // Add me to their friends
        const myFriendData = {
            uid: currentUser.uid,
            username: currentProfile?.username || '',
            name: currentProfile?.name || currentUser.displayName || '',
            photoUrl: currentProfile?.photoUrl || '',
            skillLevel: currentProfile?.skillLevel || '',
            friendsSince: firebase.firestore.FieldValue.serverTimestamp()
        };
        await db.collection('users').doc(fromUid)
            .collection('friends').doc(currentUser.uid).set(myFriendData);
        
        // Delete the friend request from my incoming requests
        await db.collection('users').doc(currentUser.uid)
            .collection('friendRequests').doc(fromUid).delete();
        
        // Delete from their sent requests
        await db.collection('users').doc(fromUid)
            .collection('sentRequests').doc(currentUser.uid).delete();
        
        // Reload data
        await loadFriends();
        await loadPendingRequests();
        
        // Re-render search results if visible
        const searchInput = document.getElementById('friend-search-input');
        if (searchInput.value.trim()) {
            searchUsers();
        }
        
    } catch (error) {
        console.error('Error accepting friend request:', error);
        alert('Er ging iets mis bij het accepteren. Probeer het opnieuw.');
    }
}

async function declineFriendRequest(fromUid) {
    if (!currentUser) return;
    
    try {
        // Delete the friend request from my incoming requests
        await db.collection('users').doc(currentUser.uid)
            .collection('friendRequests').doc(fromUid).delete();
        
        // Delete from their sent requests
        await db.collection('users').doc(fromUid)
            .collection('sentRequests').doc(currentUser.uid).delete();
        
        // Reload data
        await loadPendingRequests();
        
        // Re-render search results if visible
        const searchInput = document.getElementById('friend-search-input');
        if (searchInput.value.trim()) {
            searchUsers();
        }
        
    } catch (error) {
        console.error('Error declining friend request:', error);
        alert('Er ging iets mis bij het weigeren. Probeer het opnieuw.');
    }
}

async function cancelFriendRequest(toUid) {
    if (!currentUser) return;
    
    if (!confirm('Weet je zeker dat je dit verzoek wilt annuleren?')) {
        return;
    }
    
    try {
        // Delete from my sent requests
        await db.collection('users').doc(currentUser.uid)
            .collection('sentRequests').doc(toUid).delete();
        
        // Delete from their incoming requests
        await db.collection('users').doc(toUid)
            .collection('friendRequests').doc(currentUser.uid).delete();
        
        // Reload data
        await loadSentRequests();
        
        // Re-render search results if visible
        const searchInput = document.getElementById('friend-search-input');
        if (searchInput.value.trim()) {
            searchUsers();
        }
        
    } catch (error) {
        console.error('Error canceling friend request:', error);
        alert('Er ging iets mis bij het annuleren. Probeer het opnieuw.');
    }
}

async function removeFriend(friendUid) {
    if (!currentUser) return;
    
    if (!confirm('Weet je zeker dat je deze vriend wilt verwijderen?')) {
        return;
    }
    
    try {
        // Remove from my friends
        await db.collection('users').doc(currentUser.uid)
            .collection('friends').doc(friendUid).delete();
        
        // Remove me from their friends
        await db.collection('users').doc(friendUid)
            .collection('friends').doc(currentUser.uid).delete();
        
        // Reload data
        await loadFriends();
        
        // Re-render search results if visible
        const searchInput = document.getElementById('friend-search-input');
        if (searchInput.value.trim()) {
            searchUsers();
        }
        
    } catch (error) {
        console.error('Error removing friend:', error);
        alert('Er ging iets mis bij het verwijderen. Probeer het opnieuw.');
    }
}

function capitalizeFirst(str) {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
}
