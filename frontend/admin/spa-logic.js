
// Navigation handling
document.querySelectorAll('.nav-item a').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        
        // Update active state
        document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
        e.target.closest('.nav-item').classList.add('active');
        
        // Show/Hide sections
        const targetId = e.target.closest('a').getAttribute('href').substring(1);
        showSection(targetId);
    });
});

function showSection(sectionId) {
    // Hide all sections
    ['doctors', 'patients', 'appointments', 'reports'].forEach(id => {
        const el = document.getElementById(id + 'Section');
        if (el) el.style.display = 'none';
    });
    
    // Show target section
    const targetEl = document.getElementById(sectionId + 'Section');
    if (targetEl) {
        targetEl.style.display = 'block';
        
        // Load data if needed
        if (sectionId === 'patients') loadPatients();
        if (sectionId === 'appointments') loadAllAppointments();
    }
}

async function loadPatients() {
    const listDiv = document.getElementById('patientsList');
    listDiv.innerHTML = '<p>Loading patients...</p>';
    
    try {
        const response = await fetch(`${API_BASE_URL}/patients`);
        const patients = await response.json();
        
        if (patients.length === 0) {
            listDiv.innerHTML = '<p>No patients found</p>';
            return;
        }
        
        listDiv.innerHTML = `
            <table class="table" style="width:100%">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Phone</th>
                    </tr>
                </thead>
                <tbody>
                    ${patients.map(p => `
                        <tr>
                            <td>${p.name}</td>
                            <td>${p.email}</td>
                            <td>${p.phone}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    } catch (error) {
        listDiv.innerHTML = '<p>Error loading patients</p>';
    }
}

async function loadAllAppointments() {
    const listDiv = document.getElementById('appointmentsList');
    listDiv.innerHTML = '<p>Loading appointments...</p>';
    
    // Note: Assuming there is an endpoint to get ALL appointments for admin.
    // If not, we might need to fetch by doctor or patient, which is inefficient.
    // Checking AppointmentController... it doesn't seem to have a "get all" endpoint.
    // I'll try to fetch without params if supported or handle error.
    // Actually, AppointmentController doesn't have a generic GET /api/appointments.
    // It has POST /api/appointments (book), GET /doctor/{id}, GET /patient/{id}, GET /{id}.
    // So Admin cannot see all appointments easily with current backend.
    // I will display a message for now.
    
    listDiv.innerHTML = '<p>Feature not available: Backend endpoint for all appointments missing.</p>';
}
