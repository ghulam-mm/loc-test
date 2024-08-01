
let map;
let userMarker;
const geoFenceCenter = [28.569018, 77.317953]; // New coordinates
const geoFenceRadius = 82; // Radius in meters
let timerInterval;

document.getElementById('start-btn').addEventListener('click', () => {
    const loader = document.getElementById('loader');
    const button = document.getElementById('start-btn');
    loader.style.display = 'flex';
    if (navigator.geolocation) {
        button.style.display = 'none';
        navigator.geolocation.getCurrentPosition(initializeMap, handleLocationError);

    } else {
        alert("Geolocation is not supported by this browser.");
    }
});

function initializeMap(position) {
    const userLat = position.coords.latitude;
    const userLng = position.coords.longitude;
    // update your-locatio label
    yourLocation = document.getElementById('your-location');
    yourLocation.innerHTML = `Your Location: ${userLat}, ${userLng}`;
    map = L.map('map').setView([userLat, userLng], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    userMarker = L.marker([userLat, userLng]).addTo(map)
        .bindPopup('You are here').openPopup();

    L.circle(geoFenceCenter, {
        color: 'red',
        fillColor: '#f03',
        fillOpacity: 0.5,
        radius: geoFenceRadius
    }).addTo(map);

    document.getElementById('loader').style.display = 'none'; // Hide loader

    const distance = calculateDistance(userLat, userLng, geoFenceCenter[0], geoFenceCenter[1]);
    if (distance >= geoFenceRadius) {
        alert("You are not within the geo-fence.");
    }
    else{
        // startTimer(userLat, userLng);
        startTimer();

    }


}

function handleLocationError(error) {
    document.getElementById('loader').style.display = 'none'; // Hide loader
    alert(`Error: ${error.message}`);
}

// function startTimer(userLat, userLng) {
function startTimer() {

    const timerElement = document.getElementById('timer');
    const timeElement = document.getElementById('time');
    timerElement.classList.remove('hidden');

    let timeRemaining = 10; // convert minutes in seconds


    timerInterval = setInterval(() => {
        timeRemaining--;

        const minutes = Math.floor(timeRemaining / 60);
        const seconds = timeRemaining % 60;
        timeElement.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;


        if (timeRemaining <= 0) {
            clearInterval(timerInterval);
            navigator.geolocation.getCurrentPosition((position) => {
                const userLat = position.coords.latitude;
                const userLng = position.coords.longitude;
            const distance = calculateDistance(userLat, userLng, geoFenceCenter[0], geoFenceCenter[1]);
            console.log(distance);
            if (distance <= geoFenceRadius) {
                console.log(distance);
                if (timeRemaining <= 0) {
                document.getElementById('coupon').classList.remove('hidden');}
            } else {
                alert("You are not within the geo-fence.");
            }});
        }
    }, 1000);
}

// function startTimer(userLat, userLng) {

//         const timerElement = document.getElementById('timer');
//         const timeElement = document.getElementById('time');
//         timerElement.classList.remove('hidden');
    
//         let timeRemaining = 10; // convert minutes in seconds
    
//         timerInterval = setInterval(() => {
//             timeRemaining--;
    
//             const minutes = Math.floor(timeRemaining / 60);
//             const seconds = timeRemaining % 60;
//             timeElement.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    
//             if (timeRemaining <= 0) {
//                 clearInterval(timerInterval);
//                 const distance = calculateDistance(userLat, userLng, geoFenceCenter[0], geoFenceCenter[1]);
//                 if (distance <= geoFenceRadius) {
//                     document.getElementById('coupon').classList.remove('hidden');
//                 } else {
//                     alert("You are not within the geo-fence.");
//                 }
//             }
//         }, 1000);
// }

function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371e3; // Radius of the Earth in meters
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lon2 - lon1) * Math.PI / 180;

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
                Math.cos(φ1) * Math.cos(φ2) *
                Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const distance = R * c; // in meters
    return distance;
}
