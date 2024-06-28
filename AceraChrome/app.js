docudocument.addEventListener('DOMContentLoaded', function () {
    document.getElementById('activateGestureControl').addEventListener('click', function () {
        fetch('http://localhost:5000/activate-gesture-control', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({})  // Modify body as needed
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log('Gesture Control activated:', data.message);
            document.getElementById('responseBox').textContent = 'Gesture Control activated: ' + data.message;
        })
        .catch(error => {
            console.error('Error activating Gesture Control:', error);
            document.getElementById('responseBox').textContent = 'Error activating Gesture Control.';
        });
    });

    document.getElementById('activateAceraAI').addEventListener('click', function () {
        fetch('http://localhost:5000/activate-acera-ai', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({})  // Modify body as needed
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log('Acera AI activated:', data.message);
            document.getElementById('responseBox').textContent = 'Acera AI activated: ' + data.message;
        })
        .catch(error => {
            console.error('Error activating Acera AI:', error);
            document.getElementById('responseBox').textContent = 'Error activating Acera AI.';
        });
    });
});

