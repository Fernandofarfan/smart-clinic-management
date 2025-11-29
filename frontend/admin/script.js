const API_BASE_URL = 'http://localhost:8080/api';

// Login functionality
if (document.getElementById('loginForm')) {
    document.getElementById('loginForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const errorMessage = document.getElementById('errorMessage');
        const loginText = document.getElementById('loginText');
        const loadingSpinner = document.getElementById('loadingSpinner');
        
        // Show loading state
        loginText.style.display = 'none';
        loadingSpinner.style.display = 'inline-block';
        errorMessage.classList.remove('show');
        
        try {
            const response = await fetch(`${API_BASE_URL}/admin/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });
            
            const data = await response.json();
            
            if (data.success) {
                // Store token and user data
                localStorage.setItem('token', data.token);
                localStorage.setItem('adminData', JSON.stringify(data.admin));
                
                // Redirect to dashboard
                window.location.href = 'dashboard.html';
            } else {
                errorMessage.textContent = data.message || 'Login failed';
                errorMessage.classList.add('show');
            }
        } catch (error) {
            console.error('Login error:', error);
            errorMessage.textContent = 'Unable to connect to server. Please try again.';
            errorMessage.classList.add('show');
        } finally {
            loginText.style.display = 'inline';
            loadingSpinner.style.display = 'none';
        }
    });
}

// Dashboard functionality
if (document.getElementById('addDoctorForm')) {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    const adminData = JSON.parse(localStorage.getItem('adminData') || '{}');
    
    if (!token) {
        window.location.href = 'login.html';
    }
    
    // Display admin name
    if (adminData.username) {
        document.getElementById('adminName').textContent = adminData.username;
    }
    
    // Load doctors on page load
    loadDoctors();
    
    // Add doctor form submission
    document.getElementById('addDoctorForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formMessage = document.getElementById('formMessage');
        formMessage.classList.remove('show', 'success', 'error');
        
        const doctorData = {
            name: document.getElementById('doctorName').value,
            email: document.getElementById('doctorEmail').value,
            password: document.getElementById('doctorPassword').value,
            specialty: document.getElementById('doctorSpecialty').value,
            phone: document.getElementById('doctorPhone').value,
            availableTimes: document.getElementById('availableTimes').value || '[]',
            bio: document.getElementById('doctorBio').value,
            consultationFee: parseFloat(document.getElementById('consultationFee').value) || 0,
            isActive: true
        };
        
        try {
            const response = await fetch(`${API_BASE_URL}/doctors`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(doctorData)
            });
            
            if (response.ok) {
                formMessage.textContent = 'Doctor added successfully!';
                formMessage.classList.add('show', 'success');
                
                // Reset form
                document.getElementById('addDoctorForm').reset();
                
                // Reload doctors list
                loadDoctors();
            } else {
                const error = await response.json();
                formMessage.textContent = error.message || 'Failed to add doctor';
                formMessage.classList.add('show', 'error');
            }
        } catch (error) {
            console.error('Error adding doctor:', error);
            formMessage.textContent = 'Unable to connect to server';
            formMessage.classList.add('show', 'error');
        }
    });
}

// Load doctors function
async function loadDoctors() {
    const doctorsList = document.getElementById('doctorsList');
    if (!doctorsList) return;
    
    doctorsList.innerHTML = '<p>Loading doctors...</p>';
    
    try {
        const response = await fetch(`${API_BASE_URL}/doctors`);
        const doctors = await response.json();
        
        if (doctors.length === 0) {
            doctorsList.innerHTML = '<p>No doctors found</p>';
            return;
        }
        
        doctorsList.innerHTML = doctors.map(doctor => `
            <div class="doctor-card">
                <h3>${doctor.name}</h3>
                <div class="specialty">${doctor.specialty}</div>
                <div class="info">📧 ${doctor.email}</div>
                <div class="info">📞 ${doctor.phone}</div>
                <div class="info">💰 $${doctor.consultationFee || 'N/A'}</div>
                <span class="badge">${doctor.isActive ? 'Active' : 'Inactive'}</span>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error loading doctors:', error);
        doctorsList.innerHTML = '<p>Error loading doctors</p>';
    }
}

// Logout function
function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('adminData');
    window.location.href = 'login.html';
}
